import { Injectable } from '@nestjs/common';
import { TaskStatus } from '@prisma/client';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';


@Injectable()
export class EmailRepository {
  constructor(private readonly prisma: PrismaService) {}

  async setEmail(email: string) {
    try{
      return this.prisma.userEmail.create({ data: {
        email: email,
      } });
    }
    catch(error){
      return null;
    }
  }

  async getTaskReminderEmails() {
    try{
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(now.getDate() + 1); // 24h tới

      return this.prisma.tasks.findMany({
        where: {
          OR: [
            { dueDate: { lte: now }, status: { not: TaskStatus.COMPLETE } },
            { dueDate: { gte: now, lte: tomorrow }, status: { not: TaskStatus.COMPLETE } }, 
          ],
        },
        orderBy: { dueDate: 'asc' },
      });
    }
    catch(error){
      return [];
    }
  }

  async getEmails() {
    try{
      return this.prisma.userEmail.findMany();
    }
    catch(error){
      return [];
    }
  }
}