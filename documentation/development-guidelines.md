# Development Guidelines

## Overview

This document outlines the development guidelines and best practices for the e-commerce platform. Following these guidelines ensures consistency and maintainability of the codebase.

## Configuration Management

### Central Configuration

All configuration values should be accessed through the central configuration file `config/app-config.tsx`. This includes:

- Store information
- Currency settings
- Language settings
- Firebase configuration
- Stripe configuration
- API keys and endpoints
- Application paths

**Do not hardcode configuration values in components or utility functions.** Always import and use values from the central configuration file:

\`\`\`typescript
import appConfig from "@/config/app-config"

// Good
const defaultLanguage = appConfig.defaultLanguage

// Bad
const defaultLanguage = "en"
\`\`\`

### Store Branding

Store branding elements like the store name and description are defined in the central configuration file as `TranslatedText` objects:

\`\`\`typescript
// In app-config.tsx
storeName: {
  en: "GlobalShop",
  es: "GlobalShop",
  fr: "GlobalShop",
  de: "GlobalShop",
},
\`\`\`

When accessing these values in components, always use the current language with a fallback to the default language:

\`\`\`typescript
const storeName = appConfig.storeName[lang] || appConfig.storeName[appConfig.defaultLanguage]
\`\`\`

Do not include branding elements in the translation files (`messages/*.json`). These should be managed directly in the configuration file.

### Environment Variables

Environment variables should only be accessed in the central configuration file. Components and utility functions should never directly access `process.env`.

\`\`\`typescript
// Good - In app-config.tsx
const appConfig = {
  stripe: {
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
  }
}

// Bad - In a component
const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
\`\`\`

### Adding New Configuration

When adding new configuration values:

1. Add the new value to the `AppConfig` interface in `config/app-config.tsx`
2. Add the value to the `appConfig` object
3. Use environment variables for sensitive information

## Code Style

### General Guidelines

- Use TypeScript for all code
- Use ESLint and Prettier for code formatting
- Follow the [Next.js style guide](https://nextjs.org/docs/basic-features/eslint)
- Use meaningful variable and function names
- Write comments for complex logic
- Keep functions small and focused on a single task

### Component Guidelines

- Use functional components with hooks
- Use the `"use client"` directive only when necessary
- Keep components small and focused on a single responsibility
- Use composition to build complex components
- Use TypeScript interfaces for component props
- Use default props where appropriate

### File Structure

- Use kebab-case for file names (e.g., `product-card.tsx`)
- Group related files in directories
- Use index files to export from directories
- Keep the file structure flat where possible

## Internationalization

### Adding New Translations

1. Edit only the `messages/en.json` file to add, modify, or remove messages.
2. Run the translation script to update all other language files:

\`\`\`bash
# Make sure you have the OPENAI_API_KEY environment variable set
export OPENAI_API_KEY=your_openai_api_key

# Run the translation script
npm run translate
\`\`\`

### Using Translations

- Use the `useT` hook in client components
- Use the `getMessages` and `getTranslation` functions in server components
- Use the `TranslatedText` type for content that needs to be available in multiple languages

## State Management

- Use React state for simple, component-specific state
- Use Zustand for global state (e.g., shopping cart)
- Use React Context for state that needs to be shared between components
- Avoid prop drilling by using context or state management libraries

## Data Fetching

- Use server components for data fetching where possible
- Use React Query for client-side data fetching
- Handle loading and error states for all data fetching
- Use TypeScript types for API responses

## Testing

### Unit Testing

- Write unit tests for utility functions
- Use Jest for testing
- Mock external dependencies

### Component Testing

- Write component tests for complex components
- Use React Testing Library for component testing
- Test component behavior, not implementation details

### End-to-End Testing

- Write end-to-end tests for critical user flows
- Use Cypress for end-to-end testing
- Test on multiple browsers and devices

## Performance

- Use Next.js Image component for images
- Use Next.js Font component for fonts
- Use code splitting to reduce bundle size
- Use server components where possible
- Optimize for Core Web Vitals

## Accessibility

- Use semantic HTML elements
- Add ARIA attributes where necessary
- Ensure keyboard navigation works
- Test with screen readers
- Follow WCAG 2.1 guidelines

## Security

- Validate user input on the server
- Use Firebase Authentication for authentication
- Use Firebase Security Rules to secure data
- Keep sensitive information in environment variables
- Use HTTPS for all requests

## Git Workflow

- Use feature branches for new features
- Use pull requests for code review
- Write meaningful commit messages
- Keep commits small and focused
- Squash commits before merging

## Documentation

- Document complex logic with comments
- Update README files when making significant changes
- Document API endpoints
- Document environment variables
- Document deployment process
\`\`\`

Let's fix the documentation/deployment.md file:
