import { WebSocketServer, WebSocket } from 'ws';
import { WebSocketMessage } from '../types';

export class WebSocketManager {
  private wss: WebSocketServer;
  private clients: Map<string, WebSocket> = new Map();

  constructor(wss: WebSocketServer) {
    this.wss = wss;
    this.setupWebSocket();
  }

  private setupWebSocket() {
    this.wss.on('connection', (ws: WebSocket, _request) => {
      const clientId = this.generateClientId();
      this.clients.set(clientId, ws);

      console.log(`🔌 WebSocket client connected: ${clientId}`);

      ws.on('message', (data) => {
        try {
          const message: WebSocketMessage = JSON.parse(data.toString());
          this.handleMessage(clientId, message);
        } catch (error) {
          console.error('WebSocket message parsing error:', error);
          this.sendError(clientId, 'Invalid message format');
        }
      });

      ws.on('close', () => {
        this.clients.delete(clientId);
        console.log(`🔌 WebSocket client disconnected: ${clientId}`);
      });

      ws.on('error', (error) => {
        console.error(`WebSocket error for client ${clientId}:`, error);
        this.clients.delete(clientId);
      });

      // Send welcome message
      this.sendMessage(clientId, {
        type: 'project_update',
        data: { message: 'Connected to Text-to-App server' }
      });
    });
  }

  private handleMessage(clientId: string, message: WebSocketMessage) {
    switch (message.type) {
      case 'chat_message':
        this.broadcastToProject(message.project_id, message);
        break;
      case 'app_update':
        this.broadcastToProject(message.project_id, message);
        break;
      case 'project_update':
        this.broadcastToProject(message.project_id, message);
        break;
      default:
        this.sendError(clientId, `Unknown message type: ${message.type}`);
    }
  }

  private broadcastToProject(projectId: string | undefined, message: WebSocketMessage) {
    if (!projectId) {
      console.warn('No project ID provided for broadcast');
      return;
    }

    this.clients.forEach((ws, clientId) => {
      if (ws.readyState === WebSocket.OPEN) {
        try {
          ws.send(JSON.stringify(message));
        } catch (error) {
          console.error(`Failed to send message to client ${clientId}:`, error);
        }
      }
    });
  }

  public sendMessage(clientId: string, message: WebSocketMessage) {
    const ws = this.clients.get(clientId);
    if (ws && ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(JSON.stringify(message));
      } catch (error) {
        console.error(`Failed to send message to client ${clientId}:`, error);
      }
    }
  }

  public sendError(clientId: string, error: string) {
    this.sendMessage(clientId, {
      type: 'error',
      data: { error }
    });
  }

  public broadcastAppUpdate(projectId: string, appData: any) {
    this.broadcastToProject(projectId, {
      type: 'app_update',
      data: appData,
      project_id: projectId
    });
  }

  public broadcastChatMessage(projectId: string, message: any) {
    this.broadcastToProject(projectId, {
      type: 'chat_message',
      data: message,
      project_id: projectId
    });
  }

  private generateClientId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  public getConnectedClients(): number {
    return this.clients.size;
  }
} 