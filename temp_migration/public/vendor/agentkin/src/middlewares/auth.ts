import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import prisma from '../utils/prisma';

export interface AuthRequest extends Request {
    user?: any;
    agent?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }

    try {
        const decoded = jwt.verify(token, config.jwtSecret) as any;

        const currentUser = await prisma.user.findUnique({
            where: { id: decoded.id }
        });

        if (!currentUser) {
            return next(new AppError('The user belonging to this token no longer does exist.', 401));
        }

        req.user = currentUser;
        next();
    } catch (err) {
        return next(new AppError('Invalid token', 401));
    }
};

export const agentAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const apiKey = req.headers['x-api-key'] as string;

    if (!apiKey) {
        return next(new AppError('API Key missing', 401));
    }

    try {
        const agent = await prisma.agentProfile.findUnique({
            where: { API_Key: apiKey }
        });

        if (!agent) {
            return next(new AppError('Invalid API Key', 401));
        }

        req.agent = agent;
        next();
    } catch (err) {
        return next(new AppError('Authentication failed', 401));
    }
};

# Developed By Sergio Valle Bastidas | valle808@hawaii.edu | @Gi0metrics
