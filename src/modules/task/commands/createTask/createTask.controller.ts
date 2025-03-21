import { Controller, Post, Body, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTaskService } from './createTask.service';
import { CreateTaskDto } from './createTask.dto';
import { CreateTaskResponse } from './createTask-response.dto';
import { ErrorHandler } from 'src/shared/exceptions/error.handler';

@ApiTags('Tasks')
@Controller('api/tasks')
export class CreateTaskController {
  constructor(private readonly createTaskService: CreateTaskService) {}

  @Post('/create')
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Task created successfully', type: CreateTaskResponse })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Error creating task',
  })
  async createTask(@Body() dto: CreateTaskDto, @Res() res: Response) {
    try {
      const result = await this.createTaskService.createTask(dto);
      if(result.isErr()) {
        const error = result.unwrapErr();
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(ErrorHandler.internalServerError(error.message));

      }
      return res.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        message: 'Task created successfully',
        data: result.unwrap()
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(ErrorHandler.internalServerError(error.message));
    }
  }
}
