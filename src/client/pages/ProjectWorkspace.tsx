import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Code, Download, ArrowLeft } from 'lucide-react';
import { Project, AppVersion } from '../types';
import ChatInterface from '../components/ChatInterface';
import PreviewWindow from '../components/PreviewWindow';
import CodeEditor from '../components/CodeEditor';

interface ProjectWorkspaceProps {
  onProjectUpdated?: (project: Project) => void;
  onProjectDeleted?: (projectId: string) => void;
}

export default function ProjectWorkspace({ onProjectUpdated, onProjectDeleted }: ProjectWorkspaceProps) {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentApp, setCurrentApp] = useState<AppVersion | null>(null);
  const [showCodeEditor, setShowCodeEditor] = useState(false);

  // Suppress unused parameter warnings
  (() => {
    if (onProjectUpdated) onProjectUpdated;
    if (onProjectDeleted) onProjectDeleted;
  })();



  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!projectId) return;
    
    fetchProject();
    setupWebSocket();
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/with-latest-version`);
      if (response.ok) {
        const data = await response.json();
        setProject(data);
        
        if (data.html_content) {
          setCurrentApp({
            id: data.id || '',
            project_id: data.id,
            version_number: data.version_number || 1,
            html_content: data.html_content,
            css_content: data.css_content || '',
            js_content: data.js_content || '',
            created_at: data.created_at || new Date().toISOString(),
          });
        }
      } else {
        setError('Failed to load project');
      }
    } catch (error) {
      console.error('Error fetching project:', error);
      setError('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const setupWebSocket = () => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    wsRef.current = new WebSocket(wsUrl);
    
    wsRef.current.onopen = () => {
      console.log('WebSocket connected');
    };
    
    wsRef.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'app_update' && message.project_id === projectId) {
          // Handle app updates
          setCurrentApp(message.data);
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    };
    
    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  };

  const handleAppGenerated = (appData: { html: string; css: string; js: string }) => {
    const newApp: AppVersion = {
      id: '',
      project_id: projectId!,
      version_number: (currentApp?.version_number || 0) + 1,
      html_content: appData.html,
      css_content: appData.css,
      js_content: appData.js,
      created_at: new Date().toISOString(),
    };
    
    setCurrentApp(newApp);
    
    // Save to backend
    fetch(`/api/preview/${projectId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appData),
    }).catch(console.error);
  };

  const handleDownloadApp = () => {
    if (!currentApp) return;
    
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${project?.name || 'Generated App'}</title>
    <style>
${currentApp.css_content}
    </style>
</head>
<body>
${currentApp.html_content}
    <script>
${currentApp.js_content}
    </script>
</body>
</html>`;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project?.name || 'app'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Project Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'The project you\'re looking for doesn\'t exist.'}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{project.name}</h1>
              {project.description && (
                <p className="text-sm text-gray-600">{project.description}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {currentApp && (
              <button
                onClick={handleDownloadApp}
                className="btn-secondary flex items-center"
                title="Download app"
              >
                <Download size={16} className="mr-2" />
                Download
              </button>
            )}
            <button
              onClick={() => setShowCodeEditor(!showCodeEditor)}
              className={`btn-secondary flex items-center ${showCodeEditor ? 'bg-primary-50 text-primary-700' : ''}`}
              title="Toggle code editor"
            >
              <Code size={16} className="mr-2" />
              Code
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Panel */}
        <div className={`${showCodeEditor ? 'w-1/3' : 'w-1/2'} flex flex-col border-r border-gray-200`}>
          <div className="flex-1 overflow-hidden">
            <ChatInterface
              projectId={projectId!}
              onAppGenerated={handleAppGenerated}
            />
          </div>
        </div>

        {/* Preview/Code Panel */}
        <div className={`${showCodeEditor ? 'w-2/3' : 'w-1/2'} flex flex-col`}>
          {showCodeEditor ? (
            <CodeEditor
              currentApp={currentApp}
              onAppUpdate={setCurrentApp}
              projectId={projectId!}
            />
          ) : (
            <PreviewWindow currentApp={currentApp} />
          )}
        </div>
      </div>
    </div>
  );
} 