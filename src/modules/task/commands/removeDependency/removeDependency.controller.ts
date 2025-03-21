import { Controller, Delete, Param, HttpStatus, Res, Body, Post } from '@nestjs/common';
import { Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RemoveDependencyService } from './removeDependency.service';
import { ErrorHandler } from 'src/shared/exceptions/error.handler';
import { RemoveDependencyDto } from './removeDependency.dto';

@ApiTags('TasksDependency')
@Controller('api/tasks')
export class RemoveDependencyController {
  constructor(private readonly removeDependencyService : RemoveDependencyService) {}

  @Post('/removeDependency')
  @ApiOperation({ summary: 'Remove dependency from a task' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Dependency removed successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Dependency not found' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error removing dependency' })
  async removeDependency(@Body() dto: RemoveDependencyDto, @Res() res: Response) {
    try {
      const numericDependencyId = Number(dto.dependOnTaskId);
      const numericTaskId = Number(dto.taskId);
      if (isNaN(numericDependencyId) || isNaN(numericTaskId)) {
        return res.status(HttpStatus.BAD_REQUEST).json(ErrorHandler.badRequest('Invalid task ID'));
      }

      const result = await this.removeDependencyService.removeDependency(numericTaskId, numericDependencyId);
      if (result.isErr()) {
        const error = result.unwrapErr();
        return res.status(HttpStatus.NOT_FOUND).json(ErrorHandler.notFound(error.message));
      }

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Dependency removed successfully',
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(ErrorHandler.internalServerError(error.message));
    }
  }
  
}
