import { TaskStatus, TaskPriority } from '@prisma/client';

export class TaskDto {
  id: number;
  title: string;
  description: string;
  dueDate: Date;
  priority: TaskPriority;
  status: TaskStatus;
}