import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Project } from '@/types/project';
import { formatDistanceToNow } from 'date-fns';

interface ProjectCardProps {
  project: Project;
  onClick: (project: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 group"
      onClick={() => onClick(project)}
    >
      <CardContent className="p-0">
        <div className="aspect-video overflow-hidden rounded-t-lg">
          <img
            src={`https://images.unsplash.com/${project.thumbnail}?w=400&h=200&fit=crop`}
            alt={project.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
            {project.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            Last edited {formatDistanceToNow(project.lastEdited, { addSuffix: true })}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;