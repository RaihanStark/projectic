'use client';

import type { FormEvent } from 'react';
import { X } from 'lucide-react';
import { useState } from 'react';

type NewTaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: any) => void;
};

const NewTaskModal = ({ isOpen, onClose, onSubmit }: NewTaskModalProps) => {
  const [task, setTask] = useState({
    title: '',
    description: '',
    label: '',
    status: 'todo',
    urgency: 'medium',
    deadline: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setTask(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(task);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  const inputStyles
    = 'w-full rounded-md border-gray-300 bg-gray-50 p-2 text-base text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500';
  const labelStyles = 'mb-1 block text-sm font-medium text-gray-700';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-lg rounded-lg bg-white p-8 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="mb-6 text-2xl font-semibold text-gray-900">
          Create a New Task
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className={labelStyles}>
              Task Title
            </label>
            <input
              id="title"
              name="title"
              value={task.title}
              onChange={handleInputChange}
              className={inputStyles}
              placeholder="e.g., Design the new landing page"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className={labelStyles}>
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={task.description}
              onChange={handleInputChange}
              className={inputStyles}
              placeholder="Add a more detailed description..."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="label" className={labelStyles}>
                Label
              </label>
              <input
                id="label"
                name="label"
                value={task.label}
                onChange={handleInputChange}
                className={inputStyles}
                placeholder="e.g., Frontend"
              />
            </div>
            <div>
              <label htmlFor="deadline" className={labelStyles}>
                Deadline
              </label>
              <input
                id="deadline"
                name="deadline"
                type="date"
                value={task.deadline}
                onChange={handleInputChange}
                className={inputStyles}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="status" className={labelStyles}>
                Status
              </label>
              <select
                id="status"
                name="status"
                value={task.status}
                onChange={handleInputChange}
                className={inputStyles}
              >
                <option value="todo">Todo</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label htmlFor="urgency" className={labelStyles}>
                Urgency
              </label>
              <select
                id="urgency"
                name="urgency"
                value={task.urgency}
                onChange={handleInputChange}
                className={inputStyles}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-600"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTaskModal;
