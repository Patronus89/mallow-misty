import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../database/setup';
import { ChatMessage, ChatRequest, ChatResponse } from '../types';
import { AIService } from '../services/ai';

const router = Router();

// Get chat messages for a project
router.get('/:projectId', (req, res) => {
  const { projectId } = req.params;
  
  const query = `
    SELECT * FROM chat_messages 
    WHERE project_id = ? 
    ORDER BY created_at ASC
  `;
  
  db.all(query, [projectId], (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch chat messages' });
    }
    
    res.json(rows as ChatMessage[]);
  });
});

// Send a chat message and get AI response
router.post('/', async (req, res) => {
  const { project_id, message }: ChatRequest = req.body;
  
  if (!project_id || !message || message.trim().length === 0) {
    return res.status(400).json({ error: 'Project ID and message are required' });
  }
  
  try {
    // First, save the user message
    const userMessageId = uuidv4();
    const now = new Date().toISOString();
    
    // User message will be saved in the database
    
    // Save user message
    const insertUserQuery = `
      INSERT INTO chat_messages (id, project_id, role, content, created_at)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    db.run(insertUserQuery, [
      userMessageId, 
      project_id, 
      'user', 
      message.trim(), 
      now
    ], async function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to save user message' });
      }
      
      try {
        // Get chat history for context
        const historyQuery = `
          SELECT content FROM chat_messages 
          WHERE project_id = ? 
          ORDER BY created_at ASC
        `;
        
        db.all(historyQuery, [project_id], async (err, rows) => {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Failed to fetch chat history' });
          }
          
          const chatHistory = rows.map((row: any) => row.content);
          
          // Get current app version if it exists
          const appVersionQuery = `
            SELECT html_content, css_content, js_content 
            FROM app_versions 
            WHERE project_id = ? 
            ORDER BY version_number DESC 
            LIMIT 1
          `;
          
          db.get(appVersionQuery, [project_id], async (err, appVersion) => {
            if (err) {
              console.error('Database error:', err);
              return res.status(500).json({ error: 'Failed to fetch app version' });
            }
            
            try {
              let aiResponse;
              
              if (appVersion && (appVersion as any).html_content) {
                // Modify existing app
                aiResponse = await AIService.modifyApp(
                  message.trim(),
                  {
                    html: (appVersion as any).html_content,
                    css: (appVersion as any).css_content || '',
                    js: (appVersion as any).js_content || '',
                  },
                  chatHistory
                );
              } else {
                // Generate new app
                aiResponse = await AIService.generateApp(message.trim(), chatHistory);
              }
              
              // Save AI response
              const aiMessageId = uuidv4();
              const aiMessage: ChatMessage = {
                id: aiMessageId,
                project_id,
                role: 'assistant',
                content: aiResponse.message,
                created_at: new Date().toISOString(),
              };
              
              const insertAIQuery = `
                INSERT INTO chat_messages (id, project_id, role, content, created_at)
                VALUES (?, ?, ?, ?, ?)
              `;
              
              db.run(insertAIQuery, [
                aiMessageId,
                project_id,
                'assistant',
                aiResponse.message,
                aiMessage.created_at,
              ], function(err) {
                if (err) {
                  console.error('Database error:', err);
                  return res.status(500).json({ error: 'Failed to save AI response' });
                }
                
                // Save app version if generated
                if (aiResponse.app_code) {
                  const versionQuery = `
                    INSERT INTO app_versions (id, project_id, version_number, html_content, css_content, js_content, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                  `;
                  
                  const versionId = uuidv4();
                  const versionNumber = (appVersion ? 1 : 1); // For now, always increment
                  
                  db.run(versionQuery, [
                    versionId,
                    project_id,
                    versionNumber,
                    aiResponse.app_code.html,
                    aiResponse.app_code.css,
                    aiResponse.app_code.js,
                    new Date().toISOString(),
                  ], function(err) {
                    if (err) {
                      console.error('Database error:', err);
                      // Don't fail the request if version save fails
                    }
                    
                    const response: ChatResponse = {
                      message: aiMessage,
                      generated_app: aiResponse.app_code,
                    };
                    
                    res.json(response);
                  });
                } else {
                  const response: ChatResponse = {
                    message: aiMessage,
                  };
                  
                  res.json(response);
                }
              });
            } catch (aiError) {
              console.error('AI service error:', aiError);
              return res.status(500).json({ error: 'Failed to generate AI response' });
            }
          });
        });
      } catch (error) {
        console.error('Error processing chat:', error);
        return res.status(500).json({ error: 'Failed to process chat message' });
      }
    });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Clear chat history for a project
router.delete('/:projectId', (req, res) => {
  const { projectId } = req.params;
  
  const query = 'DELETE FROM chat_messages WHERE project_id = ?';
  
  db.run(query, [projectId], function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to clear chat history' });
    }
    
    res.json({ message: 'Chat history cleared successfully' });
  });
});

export { router as chatRoutes }; 