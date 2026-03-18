import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { AppError } from '../middlewares/errorHandler';
import crypto from 'crypto';

const signToken = (id: string, role: string) => {
    return jwt.sign({ id, role }, config.jwtSecret, {
        expiresIn: '30d'
    });
};

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password, role } = req.body;

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return next(new AppError('Email already in use', 400));
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create User
        const user = await prisma.user.create({
            data: {
                email,
                passwordHash: hashedPassword,
                role: role || 'KIN', // Default to Kin
                // Create initial profiles if needed
                kinProfile: role === 'KIN' ? { create: { skills: [] } } : undefined
            }
        });

        // Create Token
        const token = signToken(user.id, user.role);

        res.status(201).json({
            status: 'success',
            token,
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        // 1) Check if email and password exist
        if (!email || !password) {
            return next(new AppError('Please provide email and password', 400));
        }

        // 2) Check if user exists & password is correct
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user || !user.passwordHash || !(await bcrypt.compare(password, user.passwordHash))) {
            return next(new AppError('Incorrect email or password', 401));
        }

        // 3) If everything ok, send token to client
        const token = signToken(user.id, user.role);

        res.status(200).json({
            status: 'success',
            token,
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

export const registerAgent = async (req: Request, res: Response, next: NextFunction) => {
    // Requires DEVELOPER authentication
    try {
        // Current user context from auth middleware
        const user = (req as any).user;

        if (user.role !== 'DEVELOPER') {
            return next(new AppError('Only developers can register agents', 403));
        }

        const { agentName, modelType } = req.body;

        // Generate API Key
        const apiKey = `ag_${crypto.randomBytes(32).toString('hex')}`;

        // Create AgentProfile
        const agent = await prisma.agentProfile.create({
            data: {
                userId: user.id,
                agentName,
                modelType,
                API_Key: apiKey
            }
        });

        res.status(201).json({
            status: 'success',
            data: {
                agent: {
                    id: agent.id,
                    agentName: agent.agentName,
                    modelType: agent.modelType
                },
                API_Key: apiKey // Return only once
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = (req as any).user;
        const agent = (req as any).agent;

        if (agent) {
            return res.status(200).json({
                status: 'success',
                role: 'AGENT',
                data: { agent }
            });
        }

        res.status(200).json({
            status: 'success',
            role: user.role,
            data: { user }
        });
    } catch (error) {
        next(error);
    }
};

# Developed By Sergio Valle Bastidas | valle808@hawaii.edu | @Gi0metrics
