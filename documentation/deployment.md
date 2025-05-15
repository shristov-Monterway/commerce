# Deployment

## Overview

This document describes how to deploy the e-commerce platform to production. The platform is designed to be deployed to Vercel, but can be deployed to other platforms with some modifications.

## Prerequisites

Before deploying, you need:

1. A Firebase project with Firestore, Authentication, and Storage enabled
2. A Stripe account
3. An OpenAI API key (for translation generation)
4. An Exchange Rate API key

## Environment Variables

The following environment variables are required for deployment. These variables are used in the central configuration file `config/app-config.tsx`:

### Firebase Configuration

- `NEXT_PUBLIC_FIREBASE_API_KEY`: Firebase API key
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`: Firebase auth domain
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: Firebase project ID
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`: Firebase storage bucket
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`: Firebase messaging sender ID
- `NEXT_PUBLIC_FIREBASE_APP_ID`: Firebase app ID

### Stripe Configuration

- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Stripe publishable key
- `STRIPE_SECRET_KEY`: Stripe secret key
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook secret

### Other Configuration

- `NEXT_PUBLIC_BASE_URL`: Base URL of the application (e.g., https://example.com)
- `EXCHANGE_RATE_API_KEY`: API key for the exchange rate API
- `OPENAI_API_KEY`: OpenAI API key for translation generation

All these environment variables are accessed through the central configuration file `config/app-config.tsx`, which serves as the single source of truth for all configuration values in the application.

## Deployment Steps

### Deploying to Vercel

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Create a new project in Vercel
3. Connect your Git repository
4. Configure the environment variables
5. Deploy the project

### Configuring Firebase

1. Set up Firebase Authentication providers (email/password, Google, phone)
2. Deploy Firestore security rules
3. Configure Firebase Storage rules
4. Set up Firebase indexes

### Configuring Stripe

1. Create a Stripe webhook endpoint pointing to `<your-domain>/api/stripe/webhook`
2. Configure the webhook to listen for `checkout.session.completed` events
3. Get the webhook secret and add it to your environment variables

## Post-Deployment Steps

### Verifying Deployment

1. Visit the deployed application
2. Test authentication
3. Test product browsing and filtering
4. Test the shopping cart
5. Test the checkout process (use Stripe test cards)
6. Test language and currency switching

### Setting Up Admin Users

1. Create a user account
2. Use the Firebase console to set the `isAdmin` field to `true` in the user's Firestore document

### Generating Translations

If you've added new content, generate translations:

\`\`\`bash
npm run translate
\`\`\`

Then deploy the updated translation files.

## Monitoring and Maintenance

### Monitoring

1. Use Vercel Analytics to monitor application performance
2. Use Firebase Console to monitor database usage
3. Use Stripe Dashboard to monitor payments

### Maintenance

1. Regularly update dependencies
2. Monitor for security vulnerabilities
3. Update exchange rates regularly
4. Add new languages and currencies as needed by updating the central configuration file

## Troubleshooting

### Common Issues

1. **Firebase Authentication Issues**: Check Firebase Authentication configuration and security rules
2. **Stripe Webhook Issues**: Verify webhook endpoint and secret
3. **Translation Issues**: Check OpenAI API key and translation script
4. **Exchange Rate Issues**: Check Exchange Rate API key and API availability

### Getting Help

If you encounter issues, check:

1. Firebase documentation: https://firebase.google.com/docs
2. Stripe documentation: https://stripe.com/docs
3. Next.js documentation: https://nextjs.org/docs
4. Project issues on GitHub
\`\`\`

Let's update the development guidelines:
