import Stripe from 'stripe';

// Server-side Stripe client
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
});

// Product IDs (create these in Stripe Dashboard)
export const STRIPE_PRODUCTS = {
  // Subscription tiers
  BASIC: process.env.STRIPE_PRICE_BASIC || 'price_basic',
  PRO: process.env.STRIPE_PRICE_PRO || 'price_pro',
  ENTERPRISE: process.env.STRIPE_PRICE_ENTERPRISE || 'price_enterprise',
} as const;

// Subscription plans configuration
export const SUBSCRIPTION_PLANS = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'Perfect for getting started',
    price: 29,
    interval: 'month' as const,
    features: [
      'Access to 10 courses',
      'Basic AI tutor (50 messages/month)',
      'Community access',
      'Certificate generation',
    ],
    stripePriceId: STRIPE_PRODUCTS.BASIC,
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For serious learners',
    price: 99,
    interval: 'month' as const,
    features: [
      'Access to all courses',
      'Unlimited AI tutor',
      'VR surgery simulations',
      'Priority support',
      'Verified certificates',
      'Analytics dashboard',
    ],
    stripePriceId: STRIPE_PRODUCTS.PRO,
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For institutions',
    price: 499,
    interval: 'month' as const,
    features: [
      'Everything in Pro',
      'Custom branding',
      'Team management',
      'API access',
      'Dedicated support',
      'Custom integrations',
      'SLA guarantee',
    ],
    stripePriceId: STRIPE_PRODUCTS.ENTERPRISE,
  },
];

// Helper to create checkout session
export async function createCheckoutSession({
  userId,
  email,
  priceId,
  successUrl,
  cancelUrl,
}: {
  userId: string;
  email: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const session = await stripe.checkout.sessions.create({
    customer_email: email,
    client_reference_id: userId,
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId,
    },
  });

  return session;
}

// Helper to create customer portal session
export async function createPortalSession({
  customerId,
  returnUrl,
}: {
  customerId: string;
  returnUrl: string;
}) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session;
}

// Helper to get subscription status
export async function getSubscriptionStatus(subscriptionId: string) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  return {
    status: subscription.status,
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
  };
}

