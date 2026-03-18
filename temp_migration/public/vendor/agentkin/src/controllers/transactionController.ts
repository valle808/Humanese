import { Request, Response } from 'express';
import { PrismaClient } from '../generated/client/client';
import { stripeService } from '../services/stripeService';

// @ts-ignore
const prisma = new PrismaClient({});

export const authorizePayment = async (req: Request, res: Response): Promise<void> => {
    const { taskId, agentApiKey } = req.body;

    try {
        // 1. Validate Agent
        const agent = await prisma.agentProfile.findUnique({
            where: { API_Key: agentApiKey },
        });

        if (!agent) {
            res.status(401).json({ error: 'Invalid Agent API Key' });
            return;
        }

        // 2. Validate Task
        const task = await prisma.kinTask.findUnique({
            where: { id: taskId },
            include: { kin: true },
        });

        if (!task) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }

        if (task.agentId !== agent.id) {
            res.status(403).json({ error: 'Agent not authorized for this task' });
            return;
        }

        if (task.status !== 'IN_REVIEW' && task.status !== 'COMPLETED') {
            res.status(400).json({ error: 'Task must be IN_REVIEW or COMPLETED to authorize payment' });
            return;
        }

        // Check if transaction already exists/processed
        const existingTx = await prisma.transaction.findFirst({
            where: {
                kinTaskId: taskId,
                status: 'PROCESSED'
            }
        });

        if (existingTx) {
            res.status(409).json({ error: 'Payment already processed for this task' });
            return;
        }

        // 3. Initiate Stripe Transfer (ACP)
        if (!task.kin?.stripeConnectAccountId) {
            res.status(400).json({ error: 'Kin user has no connected Stripe account' });
            return;
        }

        // Calculate amount (ensure budget is compatible with currency, assuming USD/cents for now)
        // Budget is Decimal in Prisma, convert to cents
        const amountInCents = Math.round(Number(task.budget) * 100);

        const transfer = await stripeService.createTransfer({
            amount: amountInCents,
            currency: 'usd',
            destinationAccountId: task.kin.stripeConnectAccountId,
            transferGroup: task.id // Group transfer by Task ID
        }, {
            agentId: agent.id,
            taskId: task.id,
            agentApprove: 'true'
        });

        // 4. Record Transaction
        const transaction = await prisma.transaction.create({
            data: {
                amount: task.budget,
                type: 'TASK_PAYMENT',
                provider: 'STRIPE',
                currency: 'USD',
                stripePaymentIntentId: transfer.id, // Using transfer ID as ref
                status: 'PROCESSED',
                authorizedAt: new Date(),
                agentSignature: agentApiKey, // simplified "signature" for now
                userId: task.kin.userId, // The Kin user receiving funds
                kinTaskId: task.id
            }
        });

        // 5. Update Task Status
        await prisma.kinTask.update({
            where: { id: taskId },
            data: { status: 'COMPLETED' }
        });

        res.status(200).json({
            message: 'Payment authorized and processed successfully.',
            transactionId: transaction.id,
            stripeTransferId: transfer.id
        });

    } catch (error: any) {
        console.error('Authorize Payment Error:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
};

# Developed By Sergio Valle Bastidas | valle808@hawaii.edu | @Gi0metrics
