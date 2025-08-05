import Anthropic from '@anthropic-ai/sdk';
import { AIResponse } from '../types';
import 'dotenv/config';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are an expert web developer and UI/UX designer. Your task is to help users create web applications by converting their text descriptions into working HTML, CSS, and JavaScript code.

Guidelines:
1. Always generate modern, responsive, and beautiful web applications
2. Use semantic HTML5 elements
3. Write clean, well-structured CSS with modern features (Flexbox, Grid, CSS Variables)
4. Use vanilla JavaScript (no frameworks) unless specifically requested
5. Ensure the app is mobile-friendly and accessible
6. Include smooth animations and transitions where appropriate
7. Use a modern color palette and typography
8. Make the UI intuitive and user-friendly

When generating code:
- Return only the code without explanations in the response
- Structure the response as: HTML, CSS, then JavaScript
- Use modern CSS features like custom properties, flexbox, and grid
- Include proper error handling in JavaScript
- Make the code production-ready and well-commented

If the user asks for modifications to an existing app, analyze the current code and make the requested changes while maintaining the existing functionality.`;

export class AIService {
  static async generateApp(description: string, chatHistory: string[] = []): Promise<AIResponse> {
    try {
      const userPrompt = `Create a web application based on this description: "${description}"

${chatHistory.length > 0 ? `Previous conversation context:\n${chatHistory.join('\n')}\n` : ''}

Please generate a complete web application with HTML, CSS, and JavaScript. Make it modern, responsive, and beautiful.`;

      const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4000,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: userPrompt,
          },
        ],
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from AI');
      }

      const text = content.text;
      
      // Parse the response to extract HTML, CSS, and JavaScript
      const { html, css, js } = this.parseCodeResponse(text);
      
      return {
        message: `I've created a web application based on your description: "${description}". The app includes modern styling, responsive design, and interactive features.`,
        app_code: {
          html,
          css,
          js,
        },
      };
    } catch (error) {
      console.error('AI service error:', error);
      throw new Error('Failed to generate application code');
    }
  }

  static async modifyApp(
    description: string, 
    currentCode: { html: string; css: string; js: string },
    chatHistory: string[] = []
  ): Promise<AIResponse> {
    try {
      const userPrompt = `Modify this existing web application based on the request: "${description}"

Current HTML:
\`\`\`html
${currentCode.html}
\`\`\`

Current CSS:
\`\`\`css
${currentCode.css}
\`\`\`

Current JavaScript:
\`\`\`javascript
${currentCode.js}
\`\`\`

${chatHistory.length > 0 ? `Previous conversation context:\n${chatHistory.join('\n')}\n` : ''}

Please modify the existing code according to the request while maintaining the current functionality and design principles.`;

      const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4000,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: userPrompt,
          },
        ],
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from AI');
      }

      const text = content.text;
      
      // Parse the response to extract HTML, CSS, and JavaScript
      const { html, css, js } = this.parseCodeResponse(text);
      
      return {
        message: `I've updated the application based on your request: "${description}". The changes have been applied while maintaining the existing functionality.`,
        app_code: {
          html,
          css,
          js,
        },
      };
    } catch (error) {
      console.error('AI service error:', error);
      throw new Error('Failed to modify application code');
    }
  }

  private static parseCodeResponse(text: string): { html: string; css: string; js: string } {
    // Default code templates
    let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated App</title>
</head>
<body>
    <div id="app">
        <h1>Welcome to your generated app!</h1>
        <p>This is a placeholder. Please try again with a more specific description.</p>
    </div>
</body>
</html>`;

    let css = `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f8f9fa;
}

#app {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    text-align: center;
}

h1 {
    color: #2563eb;
    margin-bottom: 1rem;
}

p {
    color: #6b7280;
}`;

    let js = `// JavaScript functionality will be added here
console.log('App loaded successfully!');`;

    // Try to extract code blocks from the AI response
    const htmlMatch = text.match(/```html\s*([\s\S]*?)\s*```/i);
    const cssMatch = text.match(/```css\s*([\s\S]*?)\s*```/i);
    const jsMatch = text.match(/```javascript\s*([\s\S]*?)\s*```/i) || text.match(/```js\s*([\s\S]*?)\s*```/i);

    if (htmlMatch) {
      html = htmlMatch[1].trim();
    }
    if (cssMatch) {
      css = cssMatch[1].trim();
    }
    if (jsMatch) {
      js = jsMatch[1].trim();
    }

    return { html, css, js };
  }
} 