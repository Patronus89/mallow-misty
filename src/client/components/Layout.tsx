import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Plus, 
  Home, 
  Settings, 
  Menu, 
  X,
  FolderOpen,
  MoreVertical
} from 'lucide-react';
import { Project } from '../types';
import CreateProjectModal from './CreateProjectModal';
import ProjectSettingsModal from './ProjectSettingsModal';

interface LayoutProps {
  children: React.ReactNode;
  projects: Project[];
  onProjectCreated: (project: Project) => void;
  onProjectDeleted: (projectId: string) => void;
  onProjectUpdated: (project: Project) => void;
}

export default function Layout({ 
  children, 
  projects, 
  onProjectCreated, 
  onProjectDeleted,
  onProjectUpdated 
}: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleCreateProject = (project: Project) => {
    onProjectCreated(project);
    setShowCreateModal(false);
    navigate(`/project/${project.id}`);
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onProjectDeleted(projectId);
        if (location.pathname === `/project/${projectId}`) {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  const handleUpdateProject = (updatedProject: Project) => {
    onProjectUpdated(updatedProject);
    setShowSettingsModal(false);
    setSelectedProject(null);
  };

  const openProjectSettings = (project: Project) => {
    setSelectedProject(project);
    setShowSettingsModal(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h1 className="text-xl font-semibold text-gray-900">Text-to-App</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            <button
              onClick={() => navigate('/dashboard')}
              className={`sidebar-item w-full ${location.pathname === '/dashboard' ? 'active' : ''}`}
            >
              <Home size={20} className="mr-3" />
              Dashboard
            </button>

            <div className="pt-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Projects</h3>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                  title="Create new project"
                >
                  <Plus size={16} />
                </button>
              </div>

              <div className="space-y-1">
                {projects.map((project) => (
                  <div key={project.id} className="group relative">
                    <button
                      onClick={() => navigate(`/project/${project.id}`)}
                      className={`sidebar-item w-full text-left ${
                        location.pathname === `/project/${project.id}` ? 'active' : ''
                      }`}
                    >
                      <FolderOpen size={16} className="mr-3 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {project.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(project.updated_at)}
                        </p>
                      </div>
                    </button>
                    
                    {/* Project actions */}
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openProjectSettings(project);
                          }}
                          className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                        >
                          <MoreVertical size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {projects.length === 0 && (
                  <div className="text-center py-8">
                    <FolderOpen size={32} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-sm text-gray-500">No projects yet</p>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="text-xs text-primary-600 hover:text-primary-700 mt-1"
                    >
                      Create your first project
                    </button>
                  </div>
                )}
              </div>
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <button className="sidebar-item w-full">
              <Settings size={20} className="mr-3" />
              Settings
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <Menu size={20} />
            </button>
            
            <div className="flex-1 lg:hidden" />
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                {projects.length} project{projects.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateProjectModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateProject}
        />
      )}

      {showSettingsModal && selectedProject && (
        <ProjectSettingsModal
          project={selectedProject}
          onClose={() => {
            setShowSettingsModal(false);
            setSelectedProject(null);
          }}
          onUpdate={handleUpdateProject}
          onDelete={handleDeleteProject}
        />
      )}
    </div>
  );
} 