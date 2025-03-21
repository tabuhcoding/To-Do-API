import { Controller, Put, Param, Body, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateTaskService } from './updateTask.service';
import { UpdateTaskDto } from './updateTask.dto';
import { UpdateTaskResponse } from './updateTask-response.dto';
import { ErrorHandler } from 'src/shared/exceptions/error.handler';

@ApiTags('Tasks')
@Controller('api/tasks')
export class UpdateTaskController {
  constructor(private readonly updateTaskService: UpdateTaskService) {}

  @Put('/update/:id')
  @ApiOperation({ summary: 'Update an existing task' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Task updated successfully', type: UpdateTaskResponse })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Error updating task',
  })
  async updateTask(@Param('id') id: string, @Body() dto: UpdateTaskDto, @Res() res: Response) {
    try {
      const taskId = Number(id);
      if (isNaN(taskId)) {
        return res.status(HttpStatus.BAD_REQUEST).json(ErrorHandler.badRequest('Invalid Task ID'));
      }

      const result = await this.updateTaskService.updateTask(taskId, dto);
      if (result.isErr()) {
        const error = result.unwrapErr();
        return res.status(HttpStatus.NOT_FOUND).json(ErrorHandler.notFound(error.message));
      }

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Task updated successfully',
        data: result.unwrap()
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(ErrorHandler.internalServerError(error.message));
    }
  }
}
