import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

export default function TaskForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'General',
    tags: '',
    dueDate: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        priority: initialData.priority || 'medium',
        category: initialData.category || 'General',
        tags: initialData.tags ? initialData.tags.join(', ') : '',
        dueDate: initialData.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
    };
    if (!initialData) {
      // Add random image for new tasks to match PRD
      const randomSeed = Math.floor(Math.random() * 1000);
      submitData.imageUrl = `https://picsum.photos/seed/${randomSeed}/400/300`;
    }
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Title *</label>
        <Input required name="title" value={formData.title} onChange={handleChange} placeholder="Task title" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <Textarea name="description" value={formData.description} onChange={handleChange} placeholder="Task description..." />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Priority</label>
          <select 
            name="priority" 
            value={formData.priority} 
            onChange={handleChange}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <Input name="category" value={formData.category} onChange={handleChange} placeholder="e.g. Work, Personal" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Due Date</label>
          <Input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
          <Input name="tags" value={formData.tags} onChange={handleChange} placeholder="e.g. react, ui, frontend" />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{initialData ? 'Update Task' : 'Create Task'}</Button>
      </div>
    </form>
  );
}
