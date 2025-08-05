# Text-to-App Tool

A modern web application that allows users to create web applications by describing them in natural language. Built with TypeScript, React, and Node.js, powered by Anthropic's Claude AI.

## Features

- **AI-Powered App Generation**: Describe your app in natural language and watch it come to life
- **Real-time Preview**: See your app update in real-time as you chat with the AI
- **Multi-Project Support**: Work on multiple projects simultaneously
- **Code Editor**: View and edit the generated HTML, CSS, and JavaScript code
- **Responsive Design**: Preview your app on different device sizes
- **Modern UI**: Beautiful, intuitive interface built with Tailwind CSS
- **WebSocket Integration**: Real-time updates and communication

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **React Router** for navigation

### Backend
- **Node.js** with TypeScript
- **Express.js** for API server
- **SQLite** for database (easy to run locally)
- **WebSocket** for real-time communication
- **Anthropic Claude API** for AI-powered code generation

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Anthropic API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd text-to-app-tool
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` and add your Anthropic API key:
   ```
   ANTHROPIC_API_KEY=your_actual_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## Project Structure

```
src/
├── client/                 # Frontend React application
│   ├── components/        # Reusable UI components
│   ├── pages/            # Page components
│   ├── types/            # TypeScript type definitions
│   └── main.tsx          # React entry point
├── server/                # Backend Node.js application
│   ├── database/         # Database setup and migrations
│   ├── routes/           # API route handlers
│   ├── services/         # Business logic (AI service)
│   ├── types/            # TypeScript type definitions
│   ├── websocket/        # WebSocket management
│   └── index.ts          # Server entry point
```

## Usage

### Creating Your First App

1. **Create a new project**
   - Click "New Project" on the dashboard
   - Enter a name and optional description
   - Click "Create Project"

2. **Start chatting with the AI**
   - Describe your app in natural language
   - Be specific about features, design, and functionality
   - Examples:
     - "Create a todo app with a modern design"
     - "Build a weather dashboard with charts"
     - "Make a portfolio website with animations"

3. **Preview and iterate**
   - Watch your app appear in the preview window
   - Continue chatting to make modifications
   - Use the code editor to make manual adjustments

### Features

- **Chat Interface**: Natural language communication with AI
- **Live Preview**: Real-time app preview with responsive controls
- **Code Editor**: View and edit HTML, CSS, and JavaScript
- **Project Management**: Create, edit, and delete projects
- **Download**: Export your app as a standalone HTML file

## API Endpoints

### Projects
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create a new project
- `GET /api/projects/:id` - Get a specific project
- `PUT /api/projects/:id` - Update a project
- `DELETE /api/projects/:id` - Delete a project

### Chat
- `GET /api/chat/:projectId` - Get chat messages for a project
- `POST /api/chat` - Send a message and get AI response
- `DELETE /api/chat/:projectId` - Clear chat history

### Preview
- `GET /api/preview/:projectId` - Get latest app version
- `POST /api/preview/:projectId` - Save a new app version
- `GET /api/preview/:projectId/versions` - Get all versions

## Development

### Available Scripts

```bash
# Development
npm run dev              # Start both frontend and backend
npm run dev:client       # Start frontend only
npm run dev:server       # Start backend only

# Building
npm run build            # Build both frontend and backend
npm run build:client     # Build frontend only
npm run build:server     # Build backend only

# Production
npm start                # Start production server

# Database
npm run db:migrate       # Run database migrations

# Type checking
npm run type-check       # Check TypeScript types
```

### Database

The application uses SQLite for simplicity. The database file is automatically created in the `data/` directory when you first run the application.

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `ANTHROPIC_API_KEY` | Your Anthropic API key | Yes |
| `PORT` | Server port (default: 5000) | No |
| `NODE_ENV` | Environment (development/production) | No |

## Architecture

### Frontend Architecture
- **Component-based**: Modular React components
- **State Management**: React hooks for local state
- **Routing**: React Router for navigation
- **Styling**: Tailwind CSS for utility-first styling

### Backend Architecture
- **RESTful API**: Express.js with TypeScript
- **Database**: SQLite with proper indexing
- **Real-time**: WebSocket for live updates
- **AI Integration**: Anthropic Claude API service

### Data Flow
1. User describes app in chat
2. Frontend sends message to backend
3. Backend calls Anthropic API
4. AI generates HTML/CSS/JS code
5. Backend saves code and sends to frontend
6. Frontend updates preview in real-time

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ using TypeScript, React, and Node.js**
