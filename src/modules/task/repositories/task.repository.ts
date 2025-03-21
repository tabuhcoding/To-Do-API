import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';
import { CreateTaskDto } from '../commands/createTask/createTask.dto';
import { UpdateTaskDto } from '../commands/updateTask/updateTask.dto';
import { UpdateTaskResponseDto } from '../commands/updateTask/updateTask-response.dto';

@Injectable()
export class TasksRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createTask(dto: CreateTaskDto) {
    return this.prisma.tasks.create({ data: {
      title: dto.title,
      description: dto.description,
      priority: dto.priority,
      dueDate: dto.dueDate,
    } });
  }

  async deleteTask(id: number) {
    try {
      return await this.prisma.tasks.update({
        where: { id },
        data: { isDelete: true },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new Error(`Task with ID ${id} not found`);
      }
      throw error;
    }
  }

  async updateTask(id: number, dto: UpdateTaskDto): Promise<UpdateTaskResponseDto | null> {
    try {
      const existingTask = await this.prisma.tasks.findFirst({ where: { id, isDelete: false } });      
      if (!existingTask) {
        return null;
      }

      const updatedTask = await this.prisma.tasks.update({
        where: { id },
        data: {
          ...dto,
        },
      });

      return {
        id: updatedTask.id,
        title: updatedTask.title,
        description: updatedTask.description,
        dueDate: updatedTask.dueDate,
        priority: updatedTask.priority,
        status: updatedTask.status,
      };
    } catch (error) {
      console.error('Error updating task:', error);
      return null;
    }
  }
}