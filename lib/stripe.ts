import Stripe from 'stripe';

let stripeInstance: Stripe | null = null;

export const getStripe = () => {
  if (stripeInstance) return stripeInstance;

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    if (process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
      console.warn('STRIPE_SECRET_KEY is missing. Stripe functionality will be unavailable.');
    }
    return null;
  }

  stripeInstance = new Stripe(key, {
    // @ts-ignore
    apiVersion: '2024-04-10',
    appInfo: {
      name: 'OMEGA Sovereign Aid',
      version: '4.0.0',
      url: 'https://humanese.net/aid'
    }
  });

  return stripeInstance;
};
