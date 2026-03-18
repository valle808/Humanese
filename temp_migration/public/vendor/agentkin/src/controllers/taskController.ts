import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { AppError } from '../middlewares/errorHandler';
import { AuthRequest } from '../middlewares/auth';

export const createTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const agent = req.agent;
        const { title, description, budget } = req.body;

        const task = await prisma.kinTask.create({
            data: {
                agentId: agent.id,
                title,
                description,
                budget: parseFloat(budget),
                status: 'OPEN'
            }
        });

        // Emit socket event 'new_task'
        const io = req.app.get('io');
        if (io) {
            io.emit('new_task', task);
        }

        res.status(201).json({
            status: 'success',
            data: { task }
        });
    } catch (error) {
        next(error);
    }
};

export const getTasks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tasks = await prisma.kinTask.findMany({
            where: { status: 'OPEN' },
            include: { agent: { select: { agentName: true, modelType: true } } }
        });

        res.status(200).json({
            status: 'success',
            results: tasks.length,
            data: { tasks }
        });
    } catch (error) {
        next(error);
    }
};

export const claimTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        const { id } = req.params;

        // Check if user has a KinProfile
        const kinProfile = await prisma.kinProfile.findUnique({
            where: { userId: user.id }
        });

        if (!kinProfile) {
            return next(new AppError('Only Kin can claim tasks. Please create a Kin Profile.', 403));
        }

        // Check task status
        const task = await prisma.kinTask.findUnique({ where: { id } });

        if (!task) {
            return next(new AppError('Task not found', 404));
        }

        if (task.status !== 'OPEN') {
            return next(new AppError('Task is no longer available', 400));
        }

        // Assign task
        const updatedTask = await prisma.kinTask.update({
            where: { id },
            data: {
                status: 'CLAIMED',
                kinId: kinProfile.id
            }
        });

        res.status(200).json({
            status: 'success',
            data: { task: updatedTask }
        });
    } catch (error) {
        next(error);
    }
};

export const submitProof = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        const { id } = req.params;
        const { proof } = req.body;
        let proofData = proof;

        if (req.file) {
            proofData = req.file.path; // Store file path
        }

        if (!proofData && !req.file) {
            return next(new AppError('Please provide proof of work (text or file)', 400));
        }

        const kinProfile = await prisma.kinProfile.findUnique({ where: { userId: user.id } });

        const task = await prisma.kinTask.findUnique({ where: { id } });

        if (!task || task.kinId !== kinProfile?.id) {
            return next(new AppError('You have not claimed this task', 403));
        }

        const updatedTask = await prisma.kinTask.update({
            where: { id },
            data: {
                status: 'IN_REVIEW',
                proofOfWork: proofData
            }
        });

        res.status(200).json({
            status: 'success',
            data: { task: updatedTask }
        });
    } catch (error) {
        next(error);
    }
};

export const verifyTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const agent = req.agent;
        const { id } = req.params;
        const { approved } = req.body; // true/false

        const task = await prisma.kinTask.findUnique({ where: { id } });

        if (!task || task.agentId !== agent.id) {
            return next(new AppError('This is not your task', 403));
        }

        if (task.status !== 'IN_REVIEW') {
            return next(new AppError('Task is not in review', 400));
        }

        const newStatus = approved ? 'COMPLETED' : 'DISPUTED';
        // Logic for payment would go here if approved

        const updatedTask = await prisma.kinTask.update({
            where: { id },
            data: { status: newStatus }
        });

        res.status(200).json({
            status: 'success',
            data: { task: updatedTask }
        });

    } catch (error) {
        next(error);
    }
}

# Developed By Sergio Valle Bastidas | valle808@hawaii.edu | @Gi0metrics
