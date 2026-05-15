import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Calendar, Tag, Trash2, Edit2, CheckCircle, Circle } from 'lucide-react';
import { format } from 'date-fns';

export default function TaskCard({ task, onStatusChange, onDelete, onEdit }) {
  const isCompleted = task.status === 'completed';

  const priorityColors = {
    low: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  return (
    <Card className={`transition-all duration-200 hover:shadow-lg ${isCompleted ? 'opacity-75' : ''}`}>
      {task.imageUrl && (
        <div className="h-40 w-full rounded-t-xl overflow-hidden">
          <img src={task.imageUrl} alt={task.title} className="w-full h-full object-cover transition-transform hover:scale-105" />
        </div>
      )}
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-4">
          <h3 className={`font-semibold text-lg line-clamp-1 ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
            {task.title}
          </h3>
          <Badge variant="secondary" className={priorityColors[task.priority]}>
            {task.priority}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
          <Badge variant="outline">{task.category}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
          {task.description || 'No description provided.'}
        </p>
        
        <div className="flex flex-col gap-2 mt-4 text-xs text-muted-foreground">
          {task.dueDate && (
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5" />
              <span>{format(new Date(task.dueDate), 'PPP')}</span>
            </div>
          )}
          {task.tags?.length > 0 && (
            <div className="flex items-center gap-2">
              <Tag className="h-3.5 w-3.5" />
              <div className="flex gap-1 flex-wrap">
                {task.tags.map(tag => (
                  <span key={tag} className="bg-secondary px-1.5 py-0.5 rounded-md">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between items-center gap-2">
        <Button 
          variant={isCompleted ? "outline" : "default"} 
          size="sm" 
          onClick={() => onStatusChange(task._id, isCompleted ? 'pending' : 'completed')}
          className="w-full gap-2"
        >
          {isCompleted ? <Circle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
          {isCompleted ? 'Reopen' : 'Complete'}
        </Button>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => onEdit(task)}>
            <Edit2 className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(task._id)}>
            <Trash2 className="h-4 w-4 text-destructive hover:text-destructive/80" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
