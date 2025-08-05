import { useState } from 'react';
import { Code, Save } from 'lucide-react';
import { AppVersion } from '../types';

interface CodeEditorProps {
  currentApp: AppVersion | null;
  onAppUpdate: (app: AppVersion) => void;
  projectId: string;
}

type TabType = 'html' | 'css' | 'js';

export default function CodeEditor({ currentApp, onAppUpdate, projectId }: CodeEditorProps) {
  const [activeTab, setActiveTab] = useState<TabType>('html');
  const [htmlCode, setHtmlCode] = useState(currentApp?.html_content || '');
  const [cssCode, setCssCode] = useState(currentApp?.css_content || '');
  const [jsCode, setJsCode] = useState(currentApp?.js_content || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!currentApp) return;
    
    setSaving(true);
    
    try {
      const response = await fetch(`/api/preview/${projectId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          html: htmlCode,
          css: cssCode,
          js: jsCode,
        }),
      });

      if (response.ok) {
        const updatedApp = await response.json();
        onAppUpdate({
          ...currentApp,
          html_content: htmlCode,
          css_content: cssCode,
          js_content: jsCode,
          version_number: updatedApp.version_number,
        });
      }
    } catch (error) {
      console.error('Failed to save code:', error);
    } finally {
      setSaving(false);
    }
  };

  const getTabContent = () => {
    switch (activeTab) {
      case 'html':
        return (
          <textarea
            value={htmlCode}
            onChange={(e) => setHtmlCode(e.target.value)}
            className="w-full h-full p-4 font-mono text-sm bg-gray-900 text-gray-100 border-0 outline-none resize-none"
            placeholder="<!-- Your HTML code here -->"
            spellCheck={false}
          />
        );
      case 'css':
        return (
          <textarea
            value={cssCode}
            onChange={(e) => setCssCode(e.target.value)}
            className="w-full h-full p-4 font-mono text-sm bg-gray-900 text-gray-100 border-0 outline-none resize-none"
            placeholder="/* Your CSS code here */"
            spellCheck={false}
          />
        );
      case 'js':
        return (
          <textarea
            value={jsCode}
            onChange={(e) => setJsCode(e.target.value)}
            className="w-full h-full p-4 font-mono text-sm bg-gray-900 text-gray-100 border-0 outline-none resize-none"
            placeholder="// Your JavaScript code here"
            spellCheck={false}
          />
        );
      default:
        return null;
    }
  };

  const getTabLabel = (tab: TabType) => {
    switch (tab) {
      case 'html':
        return 'HTML';
      case 'css':
        return 'CSS';
      case 'js':
        return 'JavaScript';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Code size={20} className="text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Code Editor</h2>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary flex items-center"
        >
          <Save size={16} className="mr-2" />
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-gray-100 border-b border-gray-200">
        <div className="flex">
          {(['html', 'css', 'js'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-primary-600 text-primary-700 bg-white'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {getTabLabel(tab)}
            </button>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 bg-gray-900">
        {currentApp ? (
          getTabContent()
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-400">
              <Code size={48} className="mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Code Available</h3>
              <p className="text-sm">
                Start chatting with the AI to generate code for your app.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="bg-gray-800 text-gray-300 px-4 py-2 text-xs flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span>{getTabLabel(activeTab)}</span>
          <span>•</span>
          <span>UTF-8</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>Ln 1, Col 1</span>
          <span>•</span>
          <span>Spaces: 2</span>
        </div>
      </div>
    </div>
  );
} 