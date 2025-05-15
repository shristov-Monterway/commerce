# Project Overview

## Introduction

This e-commerce platform is designed to provide a global shopping experience with multi-language and multi-currency support. It allows users to browse products, make purchases, and manage their accounts in their preferred language and currency.

## Key Features

- **Multi-language Support**: The platform supports multiple languages, with all text content stored in language-specific JSON files.
- **Multi-currency Support**: Users can view prices in their preferred currency, with automatic conversion based on current exchange rates.
- **Authentication**: Multiple authentication methods including email/password, Google, and phone authentication.
- **Product Management**: Comprehensive product management with support for categories, tags, and inventory tracking.
- **Shopping Cart**: Client-side shopping cart with persistent storage.
- **Checkout Process**: Secure checkout process with Stripe integration.
- **User Accounts**: User account management with order history and address management.
- **Admin Panel**: Administrative interface for managing products, categories, and orders.

## Technology Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API routes, Firebase Cloud Functions
- **Database**: Firebase Firestore
- **Authentication**: Firebase Authentication
- **Storage**: Firebase Storage
- **Payment Processing**: Stripe
- **Internationalization**: Custom i18n implementation with JSON files
- **State Management**: Zustand
- **Deployment**: Vercel

## Project Structure

The project follows the Next.js App Router structure:

- `app/`: Contains the application routes and pages
- `components/`: Reusable React components
- `lib/`: Utility functions and API clients
- `public/`: Static assets
- `messages/`: Translation files
- `config/`: Configuration files, with `app-config.tsx` as the central configuration file
- `scripts/`: Utility scripts
- `documentation/`: Project documentation

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

The configuration file uses environment variables for sensitive information, but all configuration access throughout the application should go through this file.
