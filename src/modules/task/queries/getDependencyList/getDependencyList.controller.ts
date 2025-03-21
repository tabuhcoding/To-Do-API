import { Controller, Put, Param, Body, HttpStatus, Res, Get, Query } from '@nestjs/common';
import { Response } from 'express';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ErrorHandler } from 'src/shared/exceptions/error.handler';
import { GetDependencyListService } from './getDependencyList.service';

@ApiTags('TasksDependency')
@Controller('api/tasks')
export class GetDependencyListController {
  constructor(private readonly getDependencyListService: GetDependencyListService) {}

  @Get('/getDependencyList/:taskId')
  @ApiOperation({ summary: 'Get all dependencies of a task' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Dependencies retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Task not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async getDependencyList(@Param('taskId') taskId: number, @Res() res: Response) {
    try {
      const result = await this.getDependencyListService.getTasksList(taskId);

      if (result.isErr()) {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json(ErrorHandler.internalServerError(result.unwrapErr().message));
      }

      const data = result.unwrap();
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Dependencies retrieved successfully',
        data,
      });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorHandler.internalServerError('Internal server error'));
    }
  }
}
