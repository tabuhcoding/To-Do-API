import { ApiProperty } from '@nestjs/swagger';
import { TaskPriority, TaskStatus } from '@prisma/client';
import { BaseResponse } from 'src/shared/response/base-response';

class TaskDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Complete project report' })
  title: string;

  @ApiProperty({ example: 'Prepare the final project report for submission' })
  description: string;

  @ApiProperty({ example: '2025-04-01T12:00:00Z' })
  dueDate: Date;

  @ApiProperty({ example: 'HIGH', enum: TaskPriority })
  priority: TaskPriority;

  @ApiProperty({ example: 'TODO', enum: TaskStatus })
  status: TaskStatus;
}

class PaginationDto {
  @ApiProperty({ example: 10 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 1 })
  totalPages: number;
}

export class GetTasksListResponseDto {
  @ApiProperty({ type: [TaskDto] })
  data: TaskDto[];

  @ApiProperty({ type: PaginationDto })
  pagination: PaginationDto;
}

export class GetTasksListResponse extends BaseResponse {
  @ApiProperty({ type: GetTasksListResponseDto })
  data: GetTasksListResponseDto;
}
