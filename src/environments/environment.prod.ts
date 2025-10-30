export const environment = {
  production: true,
  envName: 'prod',
  // Base API URL for production
  apiUrl: 'https://api.pizzaboys.com',
  // Disable debug logging in production
  enableDebug: false,
  // Analytics / monitoring keys (use production keys)
  analyticsKey: 'PROD-ANALYTICS-KEY',
  // Feature flags for production
  featureFlags: {
    newCheckoutFlow: false,
    experimentalPricing: false
  }
};
