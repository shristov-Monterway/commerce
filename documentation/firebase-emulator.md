# Firebase Emulator Setup

This guide explains how to set up and use the Firebase Emulator Suite for local development of the e-commerce platform.

## What is Firebase Emulator?

The Firebase Emulator Suite provides local emulators for Firebase services, allowing you to develop and test your app without connecting to production Firebase services. This is useful for:

- Developing without an internet connection
- Testing without affecting production data
- Faster development iterations
- Avoiding costs associated with using production services

## Services Emulated

Our configuration includes emulators for:

- **Authentication**: For testing user authentication flows
- **Firestore**: For storing and querying data
- **Storage**: For storing and retrieving files

## Setup

1. Install the Firebase CLI globally (if not already installed):

\`\`\`bash
npm install -g firebase-tools
\`\`\`

2. Log in to Firebase (only needed once):

\`\`\`bash
firebase login
\`\`\`

3. Install the required dependencies:

\`\`\`bash
npm install
\`\`\`

## Running the Emulators

To start the Firebase emulators:

\`\`\`bash
npm run emulators
\`\`\`

This will start all configured emulators and open the Emulator UI at [http://localhost:4000](http://localhost:4000).

## Running the App with Emulators

To run the Next.js app with Firebase emulators:

\`\`\`bash
npm run dev:emulator
\`\`\`

This sets the `NEXT_PUBLIC_USE_FIREBASE_EMULATOR` environment variable to `true`, which tells the app to connect to the local emulators instead of production Firebase services.

## Seeding the Emulator with Sample Data

To populate the emulators with sample data:

\`\`\`bash
npm run seed:emulator
\`\`\`

This will add sample categories, products, and other data to the Firestore emulator.

## Emulator UI

The Emulator UI provides a visual interface for interacting with the emulators. You can:

- View and edit Firestore data
- Manage authentication users
- Monitor Storage files
- View logs for all emulated services

Access the UI at [http://localhost:4000](http://localhost:4000) when the emulators are running.

## Persistence

By default, emulator data is not persisted between sessions. If you want to persist data, you can add the `--export-on-exit` and `--import` flags to the emulator start command in your package.json:

\`\`\`json
"emulators": "firebase emulators:start --export-on-exit=./emulator-data --import=./emulator-data"
\`\`\`

This will save the emulator state when you stop the emulators and restore it when you start them again.

## Troubleshooting

### Port Conflicts

If you see an error about ports being in use, you can change the ports in the `firebase.json` file.

### Authentication Issues

If you're having trouble with authentication in the emulator:

1. Make sure you're using the emulator URL for authentication (`http://localhost:9099`)
2. Check that `connectAuthEmulator` is being called correctly in your code
3. Try clearing your browser cookies and local storage

### Firestore Connection Issues

If you're having trouble connecting to the Firestore emulator:

1. Ensure the emulator is running (`npm run emulators`)
2. Check that `connectFirestoreEmulator` is being called with the correct host and port
3. Look for any CORS errors in your browser console
\`\`\`

Let's update the main README.md to include a link to the Firebase emulator documentation:
