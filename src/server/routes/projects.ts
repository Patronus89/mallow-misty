import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../database/setup';
import { Project, CreateProjectRequest, UpdateProjectRequest } from '../types';

const router = Router();

// Get all projects
router.get('/', (_req, res) => {
  const query = `
    SELECT * FROM projects 
    ORDER BY updated_at DESC
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch projects' });
    }
    
    res.json(rows as Project[]);
  });
});

// Get a single project
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  const query = 'SELECT * FROM projects WHERE id = ?';
  
  db.get(query, [id], (err, row) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch project' });
    }
    
    if (!row) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json(row as Project);
  });
});

// Create a new project
router.post('/', (req, res) => {
  const { name, description }: CreateProjectRequest = req.body;
  
  if (!name || name.trim().length === 0) {
    return res.status(400).json({ error: 'Project name is required' });
  }
  
  const id = uuidv4();
  const now = new Date().toISOString();
  
  const query = `
    INSERT INTO projects (id, name, description, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?)
  `;
  
  db.run(query, [id, name.trim(), description?.trim() || null, now, now], function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to create project' });
    }
    
    const project: Project = {
      id,
      name: name.trim(),
      description: description?.trim(),
      created_at: now,
      updated_at: now,
    };
    
    res.status(201).json(project);
  });
});

// Update a project
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, description }: UpdateProjectRequest = req.body;
  
  if (name !== undefined && name.trim().length === 0) {
    return res.status(400).json({ error: 'Project name cannot be empty' });
  }
  
  const now = new Date().toISOString();
  
  // Build dynamic query based on provided fields
  const updates: string[] = [];
  const values: any[] = [];
  
  if (name !== undefined) {
    updates.push('name = ?');
    values.push(name.trim());
  }
  
  if (description !== undefined) {
    updates.push('description = ?');
    values.push(description.trim());
  }
  
  updates.push('updated_at = ?');
  values.push(now);
  values.push(id);
  
  const query = `
    UPDATE projects 
    SET ${updates.join(', ')}
    WHERE id = ?
  `;
  
  db.run(query, values, function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to update project' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    // Fetch the updated project
    const selectQuery = 'SELECT * FROM projects WHERE id = ?';
    db.get(selectQuery, [id], (err, row) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to fetch updated project' });
      }
      
      res.json(row as Project);
    });
  });
});

// Delete a project
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  
  const query = 'DELETE FROM projects WHERE id = ?';
  
  db.run(query, [id], function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to delete project' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json({ message: 'Project deleted successfully' });
  });
});

// Get project with latest app version
router.get('/:id/with-latest-version', (req, res) => {
  const { id } = req.params;
  
  const query = `
    SELECT 
      p.*,
      av.version_number,
      av.html_content,
      av.css_content,
      av.js_content
    FROM projects p
    LEFT JOIN app_versions av ON p.id = av.project_id
    WHERE p.id = ? AND (av.version_number = (
      SELECT MAX(version_number) 
      FROM app_versions 
      WHERE project_id = p.id
    ) OR av.version_number IS NULL)
  `;
  
  db.get(query, [id], (err, row) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch project' });
    }
    
    if (!row) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json(row);
  });
});

export { router as projectRoutes }; 