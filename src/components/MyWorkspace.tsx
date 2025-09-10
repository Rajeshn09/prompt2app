import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import ProjectCard from './ProjectCard';
import { Project } from '@/types/project';
import { useAuth } from '@/context/AuthContext';
import { Plus } from 'lucide-react';

const MyWorkspace: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [visibleProjects, setVisibleProjects] = useState<Project[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const PROJECTS_PER_PAGE = 8;

  // Dummy projects data
  const dummyProjects: Project[] = [
    {
      id: '1',
      name: 'Landing Page',
      thumbnail: 'photo-1461749280684-dccba630e2f6',
      lastEdited: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      id: '2',
      name: 'Restaurant Dummy Mobile App',
      thumbnail: 'photo-1498050108023-c5249f4df085',
      lastEdited: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    },
    {
      id: '3',
      name: 'To Do Application',
      thumbnail: 'photo-1483058712412-4245e9b90334',
      lastEdited: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    },
  ];

  useEffect(() => {
    if (isAuthenticated) {
      setProjects(dummyProjects);
      setVisibleProjects(dummyProjects);
    }
  }, [isAuthenticated]);

  const loadProjects = (pageNumber: number) => {
    const startIndex = (pageNumber - 1) * PROJECTS_PER_PAGE;
    const endIndex = startIndex + PROJECTS_PER_PAGE;
    const newProjects = projects.slice(startIndex, endIndex);
    
    if (pageNumber === 1) {
      setVisibleProjects(newProjects);
    } else {
      setVisibleProjects(prev => [...prev, ...newProjects]);
    }
    
    setHasMore(endIndex < projects.length);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadProjects(nextPage);
  };

  const handleProjectClick = (project: Project) => {
    // Navigate to workspace or project editor
    console.log('Opening project:', project.name);
  };

  const scrollToPrompt = () => {
    const promptElement = document.querySelector('[data-prompt-input]');
    if (promptElement) {
      promptElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">My Workspace</h2>
        <p className="text-muted-foreground">Your recent projects and creations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {dummyProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={handleProjectClick}
          />
        ))}
      </div>
    </div>
  );
};

export default MyWorkspace;