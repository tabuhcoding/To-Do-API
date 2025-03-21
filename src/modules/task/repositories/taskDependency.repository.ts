import { Injectable } from '@nestjs/common';
import { Err, Ok, Result } from 'oxide.ts';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';
import { AddDependencyResponseDto } from '../commands/addDependency/addDependency-response.dto';
@Injectable()
export class TaskDependencyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createTaskDependency(taskId: number, dependOnTaskId: number): Promise<Result<AddDependencyResponseDto, Error>> {
    try{
      const taskIdExists = await this.prisma.tasks.findMany({
        select: { id: true },
      });
      if (!taskIdExists.some(task => task.id === taskId || task.id === dependOnTaskId)) {
        return Err(new Error("One or both of the tasks do not exist."));
      }
      const taskDependencyExists = await this.prisma.taskDependency.findFirst({
        where: {
          taskId,
          dependOnTaskId,
        },
      });
      if (taskDependencyExists) {
        return Err(new Error("The dependency already exists."));
      }

      const createTaskDependency = await this.prisma.taskDependency.create({
        data: {
          taskId,
          dependOnTaskId,
        },
      });
      return Ok(createTaskDependency);
    }
    catch{
      return Err(new Error("Error creating task dependency."));
    }
  }

  async deleteTaskDependency(taskId: number, dependOnTaskId: number): Promise<Result<boolean, Error>> {
    try{
      const taskDependency = await this.prisma.taskDependency.findFirst({
        where: {
          taskId,
          dependOnTaskId,
        },
      });
    
      if (!taskDependency) {
        throw new Error("The dependency does not exist.");
      }
    
      await this.prisma.taskDependency.delete({
        where: {
          taskId_dependOnTaskId: {
            taskId,
            dependOnTaskId,
          },
        },
      });
    
      return Ok(true);
    }
    catch{
      throw new Error("Error deleting task dependency.");
    }
  }
  
  
  async getAllDependencies(taskId: number, visited = new Set<number>(), level = 0): Promise<string> {
    try {
      if (visited.has(taskId)) return ""; 
      visited.add(taskId);
  
      const dependencies = await this.prisma.taskDependency.findMany({
        where: { taskId: taskId >> 0 },
        select: { dependOnTaskId: true },
      });
  
      if (dependencies.length === 0) return ""; 
  
      let dependencyList: string[] = [];
  
      for (const dep of dependencies) {
        const depStr = `${dep.dependOnTaskId} (${taskId})`;
        dependencyList.push(depStr);
  
        const subDeps = await this.getAllDependencies(dep.dependOnTaskId, visited, level + 1);
        if (subDeps) {
          dependencyList.push(`-> ${subDeps}`);
        }
      }
  
      return dependencyList.join(" ");
    } catch (error) {
      console.log(error);
      throw new Error("Error getting all dependencies");
    }
  }
  
  async checkCircularDependencyDFS(taskId: number, dependOnTaskId: number): Promise<boolean> {
    const dependencies = await this.prisma.taskDependency.findMany();
  
    const graph = new Map<number, number[]>();
  
    dependencies.forEach(({ taskId, dependOnTaskId }) => {
      if (!graph.has(taskId)) graph.set(taskId, []);
      graph.get(taskId)!.push(dependOnTaskId);
    });
  
    if (!graph.has(taskId)) graph.set(taskId, []);
    graph.get(taskId)!.push(dependOnTaskId);
  
    return this.hasCycleDFS(graph, taskId);
  }
  
  private hasCycleDFS(graph: Map<number, number[]>, startNode: number): boolean {
    const visited = new Set<number>();
    const stack = new Set<number>();
  
    const dfs = (node: number): boolean => {
      if (stack.has(node)) return true; 
      if (visited.has(node)) return false;
  
      visited.add(node);
      stack.add(node);
  
      for (const neighbor of graph.get(node) || []) {
        if (dfs(neighbor)) return true;
      }
  
      stack.delete(node);
      return false;
    };
  
    return dfs(startNode);
  }

  async removeTaskDependencies(taskId: number, dependOnTaskId: number): Promise<Result<boolean, Error>> {
    try {
      await this.prisma.taskDependency.delete({
        where: {
          taskId_dependOnTaskId: {
            taskId,
            dependOnTaskId,
          },
        },
      });
      return Ok(true);
    } catch (error) {
      return Err(new Error("Error removing task dependencies."));
    }
  }
  
}