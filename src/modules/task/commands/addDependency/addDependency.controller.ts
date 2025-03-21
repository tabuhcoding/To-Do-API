import { Controller, Post, Body, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ErrorHandler } from 'src/shared/exceptions/error.handler';
import { AddDependencyService } from './addDependency.service';
import { AddDependencyDto } from './addDependency.dto';
import { AddDependencyResponse } from './addDependency-response.dto';

@ApiTags('TasksDependency')
@Controller('api/tasks')
export class AddDependencyController {
  constructor(private readonly addDependencyService: AddDependencyService) {}
  
  @Post('/addDependency')
  @ApiOperation({ summary: 'Add dependency to a task' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Dependency added successfully', type: AddDependencyResponse })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'One or both of the tasks do not exist',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The dependency already exists or has circular dependency',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Error adding dependency',
  })
  async addDependency(@Body() dto: AddDependencyDto, @Res() res: Response) {
    try {
      const result = await this.addDependencyService.addDependency(dto.taskId, dto.dependOnTaskId);
      if(result.isErr()) {
        const error = result.unwrapErr();
        if(error.message === 'Invalid task ID' || error.message === 'One or both of the tasks do not exist.') {
          return res.status(HttpStatus.NOT_FOUND).json(ErrorHandler.notFound(error.message));
        }
        if(error.message === 'Circular dependency detected.' || 
          error.message === 'The dependency already exists.' ||
          error.message === 'Task cannot depend on itself.') {
          return res.status(HttpStatus.BAD_REQUEST).json(ErrorHandler.badRequest(error.message));
        }
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(ErrorHandler.internalServerError(error.message));
      }
      return res.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        message: 'Dependency added successfully',
        dependency: result.unwrap()
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(ErrorHandler.internalServerError(error.message));
    }
  }
}