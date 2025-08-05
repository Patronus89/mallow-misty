import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../database/setup';
import { PreviewRequest } from '../types';

const router = Router();

// Get latest app version for preview
router.get('/:projectId', (req, res) => {
  const { projectId } = req.params;
  
  const query = `
    SELECT html_content, css_content, js_content, version_number
    FROM app_versions 
    WHERE project_id = ? 
    ORDER BY version_number DESC 
    LIMIT 1
  `;
  
  db.get(query, [projectId], (err, row) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch app version' });
    }
    
    if (!row) {
      return res.json({
        html_content: '',
        css_content: '',
        js_content: '',
        version_number: 0,
      });
    }
    
    res.json(row);
  });
});

// Save a new app version
router.post('/:projectId', (req, res) => {
  const { projectId } = req.params;
  const { html, css, js }: PreviewRequest = req.body;
  
  if (!html && !css && !js) {
    return res.status(400).json({ error: 'At least one code component is required' });
  }
  
  // Get the next version number
  const versionQuery = `
    SELECT MAX(version_number) as max_version
    FROM app_versions 
    WHERE project_id = ?
  `;
  
  db.get(versionQuery, [projectId], (err, row) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to get version number' });
    }
    
    const nextVersion = ((row as any)?.max_version || 0) + 1;
    const versionId = uuidv4();
    const now = new Date().toISOString();
    
    const insertQuery = `
      INSERT INTO app_versions (id, project_id, version_number, html_content, css_content, js_content, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    db.run(insertQuery, [
      versionId,
      projectId,
      nextVersion,
      html || '',
      css || '',
      js || '',
      now,
    ], function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to save app version' });
      }
      
      res.json({
        id: versionId,
        project_id: projectId,
        version_number: nextVersion,
        html_content: html || '',
        css_content: css || '',
        js_content: js || '',
        created_at: now,
      });
    });
  });
});

// Get all versions of an app
router.get('/:projectId/versions', (req, res) => {
  const { projectId } = req.params;
  
  const query = `
    SELECT id, version_number, created_at
    FROM app_versions 
    WHERE project_id = ? 
    ORDER BY version_number DESC
  `;
  
  db.all(query, [projectId], (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch app versions' });
    }
    
    res.json(rows);
  });
});

// Get a specific version of an app
router.get('/:projectId/versions/:versionNumber', (req, res) => {
  const { projectId, versionNumber } = req.params;
  
  const query = `
    SELECT * FROM app_versions 
    WHERE project_id = ? AND version_number = ?
  `;
  
  db.get(query, [projectId, versionNumber], (err, row) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch app version' });
    }
    
    if (!row) {
      return res.status(404).json({ error: 'App version not found' });
    }
    
    res.json(row);
  });
});

export { router as previewRoutes }; 