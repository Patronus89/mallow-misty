import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FolderOpen, Calendar, MessageSquare } from 'lucide-react';
import { Project } from '../types';
import CreateProjectModal from '../components/CreateProjectModal';

interface DashboardProps {
  projects: Project[];
  onProjectCreated: (project: Project) => void;
}

export default function Dashboard({ projects, onProjectCreated }: DashboardProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return formatDate(dateString);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Manage your text-to-app projects
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center"
        >
          <Plus size={16} className="mr-2" />
          New Project
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <FolderOpen size={20} className="text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Projects</p>
              <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar size={20} className="text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Projects</p>
              <p className="text-2xl font-bold text-gray-900">
                {projects.filter(p => {
                  const daysSinceUpdate = Math.floor(
                    (new Date().getTime() - new Date(p.updated_at).getTime()) / (1000 * 60 * 60 * 24)
                  );
                  return daysSinceUpdate <= 7;
                }).length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageSquare size={20} className="text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Recent Activity</p>
              <p className="text-2xl font-bold text-gray-900">
                {projects.filter(p => {
                  const daysSinceUpdate = Math.floor(
                    (new Date().getTime() - new Date(p.updated_at).getTime()) / (1000 * 60 * 60 * 24)
                  );
                  return daysSinceUpdate <= 1;
                }).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Your Projects</h2>
          <div className="text-sm text-gray-500">
            {projects.length} project{projects.length !== 1 ? 's' : ''}
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="card text-center py-12">
            <FolderOpen size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Create your first project to start building amazing web applications with AI
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary flex items-center mx-auto"
            >
              <Plus size={16} className="mr-2" />
              Create Your First Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="card hover:shadow-md transition-shadow cursor-pointer group"
                onClick={() => navigate(`/project/${project.id}`)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <FolderOpen size={16} className="text-primary-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                        {project.name}
                      </h3>
                      {project.description && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {project.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Updated {getTimeAgo(project.updated_at)}</span>
                  <div className="flex items-center space-x-1">
                    <Calendar size={14} />
                    <span>{formatDate(project.created_at)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {projects.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Plus size={20} className="text-primary-600 mr-3" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Create New Project</p>
                <p className="text-sm text-gray-500">Start building a new app</p>
              </div>
            </button>
            
            {projects.length > 0 && (
              <button
                onClick={() => navigate(`/project/${projects[0].id}`)}
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <MessageSquare size={20} className="text-green-600 mr-3" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Continue Latest Project</p>
                  <p className="text-sm text-gray-500">Open "{projects[0].name}"</p>
                </div>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Create Project Modal */}
      {showCreateModal && (
        <CreateProjectModal
          onClose={() => setShowCreateModal(false)}
          onCreate={onProjectCreated}
        />
      )}
    </div>
  );
} 