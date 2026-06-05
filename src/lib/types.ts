export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  phone_verified: boolean;
  email_verified: boolean;
  role: 'user' | 'admin';
  risk_score: number;
  two_factor_enabled: boolean;
  two_factor_secret: string | null;
  notification_preferences: NotificationPrefs;
  created_at: string;
  updated_at: string;
}

export interface NotificationPrefs {
  email: boolean;
  usage_alerts: boolean;
  security_alerts: boolean;
  marketing: boolean;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: 'free' | 'starter' | 'pro' | 'enterprise';
  status: 'active' | 'past_due' | 'cancelled' | 'trialing';
  current_period_start: string;
  current_period_end: string | null;
  usage_limit: number;
  usage_used: number;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApiKey {
  id: string;
  user_id: string;
  name: string;
  key_hash: string;
  key_prefix: string;
  last_used: string | null;
  created_at: string;
  revoked_at: string | null;
}

export interface UsageLog {
  id: string;
  user_id: string;
  api_key_id: string | null;
  action: string;
  model: string | null;
  tokens_in: number;
  tokens_out: number;
  latency_ms: number | null;
  ip_address: string | null;
  created_at: string;
}

export interface SecurityLog {
  id: string;
  user_id: string | null;
  action: string;
  ip_address: string | null;
  user_agent: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
}

export interface Invoice {
  id: string;
  user_id: string;
  subscription_id: string | null;
  amount_cents: number;
  currency: string;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  stripe_invoice_id: string | null;
  created_at: string;
  paid_at: string | null;
}

export interface UserSession {
  id: string;
  user_id: string;
  token: string;
  device_name: string | null;
  device_type: string | null;
  ip_address: string | null;
  user_agent: string | null;
  last_active: string;
  created_at: string;
}

export interface VerificationOtp {
  id: string;
  user_id: string;
  type: 'email' | 'phone' | '2fa';
  code: string;
  verified: boolean;
  expires_at: string;
  created_at: string;
}

export type PlanDetails = {
  name: string;
  price: string;
  priceCents: number;
  features: string[];
  usageLimit: number;
  popular?: boolean;
  description: string;
  icon: string;
};

export const PLANS: Record<Subscription['plan'], PlanDetails> = {
  free: {
    name: 'Free',
    price: '$0',
    priceCents: 0,
    usageLimit: 100,
    description: 'Perfect for exploring and prototyping',
    icon: 'zap',
    features: ['100 requests/month', 'GPT-3.5 & base models', 'Community support', '1 API key', 'Basic analytics'],
  },
  starter: {
    name: 'Starter',
    price: '$20',
    priceCents: 2000,
    usageLimit: 5000,
    description: 'For individuals building real projects',
    icon: 'rocket',
    features: ['5,000 requests/month', 'All models including GPT-4', 'Email support (24h)', '5 API keys', 'Usage analytics', 'Prompt templates'],
  },
  pro: {
    name: 'Pro',
    price: '$60',
    priceCents: 6000,
    usageLimit: 50000,
    description: 'For teams shipping at scale',
    icon: 'crown',
    popular: true,
    features: ['50,000 requests/month', 'Priority model access', 'Priority support (4h)', 'Unlimited API keys', 'Advanced analytics & export', 'Team sharing & SSO', 'Custom fine-tuning'],
  },
  enterprise: {
    name: 'Enterprise',
    price: 'Custom',
    priceCents: 0,
    usageLimit: -1,
    description: 'For organizations with advanced needs',
    icon: 'building',
    features: ['Unlimited requests', 'Custom model hosting', 'Dedicated account manager', '99.99% SLA guarantee', 'SSO / SAML / SCIM', 'On-premise deployment', 'Audit logs & compliance', 'Custom integrations'],
  },
};

export const MODEL_OPTIONS = [
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', color: '#10b981', speed: 'Fast', context: '128K' },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'OpenAI', color: '#22d3ee', speed: 'Fast', context: '128K' },
  { id: 'claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', color: '#f59e0b', speed: 'Fast', context: '200K' },
  { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'Anthropic', color: '#ef4444', speed: 'Medium', context: '200K' },
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', provider: 'Google', color: '#8b5cf6', speed: 'Fast', context: '1M' },
  { id: 'llama-3.1-70b', name: 'Llama 3.1 70B', provider: 'Meta', color: '#6366f1', speed: 'Fast', context: '128K' },
  { id: 'mistral-large', name: 'Mistral Large', provider: 'Mistral', color: '#f97316', speed: 'Fast', context: '32K' },
];
