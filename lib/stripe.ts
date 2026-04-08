import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is missing from environment variables.');
}

// Initialize the Stripe SDK with the official v2024-04-10 API version (or latest supported)
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  // @ts-ignore - The typescript version might be slightly behind the currently installed package
  apiVersion: '2024-04-10', // Always pin version to ensure payment stability
  appInfo: {
    name: 'OMEGA Sovereign Aid',
    version: '4.0.0',
    url: 'https://humanese.net/aid'
  }
});
