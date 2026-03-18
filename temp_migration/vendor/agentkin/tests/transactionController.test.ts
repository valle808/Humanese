import { authorizePayment } from '../src/controllers/transactionController';
import { PrismaClient } from '../src/generated/client/client';
import { stripeService } from '../src/services/stripeService';

// Mock dependencies
jest.mock('../src/generated/client/client', () => {
    const mPrismaClient = {
        agentProfile: { findUnique: jest.fn() },
        kinTask: { findUnique: jest.fn(), update: jest.fn() },
        transaction: { findFirst: jest.fn(), create: jest.fn() },
    };
    return { PrismaClient: jest.fn(() => mPrismaClient) };
});

jest.mock('../src/services/stripeService', () => ({
    stripeService: {
        createTransfer: jest.fn()
    }
}));

describe('authorizePayment', () => {
    let mockRequest: any;
    let mockResponse: any;
    let mockNext: any;
    let prismaMock: any;

    beforeEach(() => {
        mockRequest = {
            body: {
                taskId: 'task_123',
                agentApiKey: 'valid_api_key'
            }
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        mockNext = jest.fn();

        // Reset mocks
        jest.clearAllMocks();

        // Get prisma instance mock
        // @ts-ignore
        prismaMock = new PrismaClient();
    });

    it('should authorize payment successfully', async () => {
        // Setup Mocks
        const mockAgent = { id: 'agent_1', API_Key: 'valid_api_key' };
        const mockTask = {
            id: 'task_123',
            budget: '50.00',
            status: 'IN_REVIEW',
            agentId: 'agent_1',
            kin: { userId: 'user_kin', stripeConnectAccountId: 'acct_123' }
        };

        prismaMock.agentProfile.findUnique.mockResolvedValue(mockAgent);
        prismaMock.kinTask.findUnique.mockResolvedValue(mockTask);
        prismaMock.transaction.findFirst.mockResolvedValue(null);
        (stripeService.createTransfer as jest.Mock).mockResolvedValue({ id: 'tr_mock' });
        prismaMock.transaction.create.mockResolvedValue({ id: 'tx_new' });
        prismaMock.kinTask.update.mockResolvedValue({ ...mockTask, status: 'COMPLETED' });

        // Execute
        await authorizePayment(mockRequest, mockResponse);

        // Assert
        expect(prismaMock.agentProfile.findUnique).toHaveBeenCalledWith({ where: { API_Key: 'valid_api_key' } });
        expect(stripeService.createTransfer).toHaveBeenCalled();
        expect(prismaMock.transaction.create).toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Payment authorized and processed successfully.',
            transactionId: 'tx_new'
        }));
    });

    it('should fail if agent API key is invalid', async () => {
        prismaMock.agentProfile.findUnique.mockResolvedValue(null);

        await authorizePayment(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid Agent API Key' });
    });
});

# Developed By Sergio Valle Bastidas | valle808@hawaii.edu | @Gi0metrics
