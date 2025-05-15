# Translation Management

## Overview

This project uses a centralized translation management system where English (en.json) is the source of truth, and other language translations are generated automatically using AI.

## How It Works

1. Developers only need to update the English translation file (`messages/en.json`) when adding, modifying, or removing messages.
2. A script automatically generates translations for other supported languages using OpenAI.
3. The script maintains consistency by:
   - Adding translations for new messages
   - Removing translations for deleted messages
   - Preserving existing translations for unchanged messages

## Supported Languages

The system supports all languages defined in the `supportedLanguages` array in `config/app-config.tsx`. 
The default language is defined as `defaultLanguage` in the same file.

## Usage

### Adding or Modifying Translations

1. Edit only the `messages/en.json` file to add, modify, or remove messages.
2. Run the translation script to update all other language files:

\`\`\`bash
# Make sure you have the OPENAI_API_KEY environment variable set
export OPENAI_API_KEY=your_openai_api_key

# Run the translation script
npm run translate
\`\`\`

### Adding Support for a New Language

1. Add the language code to the `supportedLanguages` array in `config/app-config.tsx`.
2. Run the translation script to generate the new language file.

### Translation File Structure

The translation files use a nested structure for organization:

\`\`\`json
{
  "common": {
    "button": {
      "submit": "Submit",
      "cancel": "Cancel"
    }
  },
  "auth": {
    "login": {
      "title": "Login"
    }
  }
}
\`\`\`

## Best Practices

1. **Keep messages concise and clear** - This helps with translation accuracy.
2. **Use variables for dynamic content** - For example, `"Hello, {name}"` instead of concatenating strings.
3. **Provide context in the message key** - Use descriptive keys like `auth.login.forgotPassword` instead of generic ones.
4. **Run the translation script regularly** - Especially after making significant changes to the English file.
5. **Review AI-generated translations** - While the AI is good, it's not perfect. Review important translations.

## Troubleshooting

- If you encounter errors with the OpenAI API, check your API key and network connection.
- If translations seem incorrect, you can manually edit the language files. Your changes will be preserved as long as the keys exist in the English file.
- If the script fails to run, make sure you have all the required dependencies installed.
\`\`\`

Let's fix the documentation/firebase-emulator.md file:
