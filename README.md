# E-Commerce Platform

A multi-language, multi-currency e-commerce platform built with Next.js, Firebase, and Stripe.

## Features

- **Multi-language Support**: Support for multiple languages with automatic translation generation
- **Multi-currency Support**: Support for multiple currencies with automatic exchange rate conversion
- **Authentication**: Email/password, Google, and phone authentication
- **Product Management**: Comprehensive product management with categories and tags
- **Shopping Cart**: Client-side shopping cart with persistent storage
- **Checkout Process**: Secure checkout process with Stripe integration
- **User Accounts**: User account management with order history and address management
- **Admin Panel**: Administrative interface for managing products, categories, and orders

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API routes, Firebase Cloud Functions
- **Database**: Firebase Firestore
- **Authentication**: Firebase Authentication
- **Storage**: Firebase Storage
- **Payment Processing**: Stripe
- **Internationalization**: Custom i18n implementation with JSON files
- **State Management**: Zustand
- **Deployment**: Vercel

## Configuration

All project configuration is centralized in the `config/app-config.tsx` file. This includes:

- Store information (name, description)
- Currency settings (default currency, supported currencies)
- Language settings (default language, supported languages)
- Firebase configuration
- Stripe configuration
- Exchange rate API configuration
- Base URL
- OpenAI API configuration for translations
- Application paths

This centralized approach ensures that configuration values are consistent throughout the application and makes it easy to modify settings in one place.

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm or yarn
- Firebase account
- Stripe account
- OpenAI API key (for translation generation)
- Exchange Rate API key

### Installation

1. Clone the repository:

\`\`\`bash
git clone https://github.com/yourusername/e-commerce.git
cd e-commerce
\`\`\`

2. Install dependencies:

\`\`\`bash
npm install
# or
yarn install
\`\`\`

3. Create a `.env.local` file with the following environment variables:

\`\`\`
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-firebase-app-id
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
NEXT_PUBLIC_BASE_URL=http://localhost:3000
OPENAI_API_KEY=your-openai-api-key
\`\`\`

4. Start the development server:

\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Local Development with Firebase Emulator

For local development without connecting to production Firebase services, you can use the Firebase Emulator Suite:

1. Start the Firebase emulators:

\`\`\`bash
npm run emulators
\`\`\`

2. In a separate terminal, start the Next.js development server with emulator support:

\`\`\`bash
npm run dev:emulator
\`\`\`

3. Seed the emulator with sample data:

\`\`\`bash
npm run seed:emulator
\`\`\`

For detailed instructions on using the Firebase Emulator, see the [Firebase Emulator documentation](./documentation/firebase-emulator.md).

### Firebase Setup

1. Create a Firebase project
2. Enable Firestore, Authentication, and Storage
3. Add authentication providers (email/password, Google, phone)
4. Deploy Firestore security rules
5. Configure Firebase Storage rules
6. Set up Firebase indexes

### Stripe Setup

1. Create a Stripe account
2. Get your publishable and secret keys
3. Set up a webhook endpoint for `checkout.session.completed` events
4. Get your webhook secret

## Documentation

For detailed documentation, see the [documentation](./documentation) directory:

- [Project Overview](./documentation/project-overview.md)
- [Architecture](./documentation/architecture.md)
- [Internationalization](./documentation/internationalization.md)
- [Authentication](./documentation/authentication.md)
- [Database Structure](./documentation/database-structure.md)
- [API Reference](./documentation/api-reference.md)
- [Deployment](./documentation/deployment.md)
- [Development Guidelines](./documentation/development-guidelines.md)
- [Firebase Emulator](./documentation/firebase-emulator.md)
- [Translation Management](./documentation/translation-management.md)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Firebase](https://firebase.google.com/)
- [Stripe](https://stripe.com/)
- [OpenAI](https://openai.com/)
\`\`\`

Now, let's fix the documentation/architecture.md file:
