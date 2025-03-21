import { Controller, Delete, Param, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeleteTaskService } from './deleteTask.service';
import { ErrorHandler } from 'src/shared/exceptions/error.handler';

@ApiTags('Tasks')
@Controller('api/tasks')
export class DeleteTaskController {
  constructor(private readonly deleteTaskService: DeleteTaskService) {}

  @Delete('/delete/:id')
  @ApiOperation({ summary: 'Delete a task by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Task deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Task not found' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error deleting task' })
  async deleteTask(@Param('id') id: string, @Res() res: Response) {
    try {
      const numericId = Number(id);
      if (isNaN(numericId)) {
        return res.status(HttpStatus.BAD_REQUEST).json(ErrorHandler.badRequest('Invalid task ID'));
      }

      const result = await this.deleteTaskService.deleteTask(numericId);
      if (result.isErr()) {
        const error = result.unwrapErr();
        return res.status(HttpStatus.NOT_FOUND).json(ErrorHandler.notFound(error.message));
      }

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Task deleted successfully',
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(ErrorHandler.internalServerError(error.message));
    }
  }
}
