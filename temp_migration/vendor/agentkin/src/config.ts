import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'super_secret_jwt_key',
  databaseUrl: process.env.DATABASE_URL,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  env: process.env.NODE_ENV || 'development',
};

# Developed By Sergio Valle Bastidas | valle808@hawaii.edu | @Gi0metrics
