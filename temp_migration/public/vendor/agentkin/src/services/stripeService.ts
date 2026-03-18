import Stripe from 'stripe';
import { PrismaClient } from '../generated/client/client';

// @ts-ignore
const prisma = new PrismaClient({});
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2024-12-18.acacia' as any, // Cast to any to avoid strict version mismatch if types are newer/older
});

interface TransferParams {
    amount: number; // Amount in cents
    currency: string;
    destinationAccountId: string;
    transferGroup?: string;
}

export const stripeService = {
    /**
     * Create a payout/transfer to a Kin user's connected account.
     * This is used when an Agent authorizes a payment for a completed task.
     */
    async createTransfer(
        params: TransferParams,
        metadata: Record<string, string> = {}
    ): Promise<Stripe.Transfer> {
        try {
            // @ts-ignore
            const transfer = await stripe.transfers.create({
                amount: params.amount,
                currency: params.currency,
                destination: params.destinationAccountId,
                transfer_group: params.transferGroup || undefined,
                metadata: metadata,
            });

            return transfer;
        } catch (error) {
            console.error('Stripe Transfer Error:', error);
            throw new Error('Failed to process payment via Stripe ACP.');
        }
    },

    /**
     * Verify if a user has a connected Stripe account.
     */
    async getConnectedAccount(accountId: string): Promise<Stripe.Account> {
        try {
            return await stripe.accounts.retrieve(accountId);
        } catch (error) {
            console.error('Stripe Account Retrieval Error:', error);
            throw new Error('Failed to retrieve connected account.');
        }
    },
};

# Developed By Sergio Valle Bastidas | valle808@hawaii.edu | @Gi0metrics
