import { Controller, Put, Param, Body, HttpStatus, Res, Get, Query } from '@nestjs/common';
import { Response } from 'express';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ErrorHandler } from 'src/shared/exceptions/error.handler';
import { GetTasksListService } from './getTaskList.service';
import { GetTasksListQueryDto } from './getTaskList-query.dto';
import { GetTasksListResponse } from './getTaskList-response.dto';

@ApiTags('Tasks')
@Controller('api/tasks')
export class GetTasksListController {
  constructor(private readonly getTaskListService: GetTasksListService) {}

  @Get('/getTaskList')
  // @ApiQuery({ type: GetTasksListQueryDto, name: 'Filter and Pagination' })
  @ApiOperation({ summary: 'Get all task with filter and pagination' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'PayOS status data retrieved successfully',
    type: GetTasksListResponse,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async getShowing(
    @Query() query: GetTasksListQueryDto,
    @Res() res: Response) {
    try{
      const result = await this.getTaskListService.getTasksList(query);

    if (result.isErr()) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorHandler.internalServerError(result.unwrapErr().message));
    }

    const data = result.unwrap();
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Tasks retrieved successfully',
      data,
    });
    }
    catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorHandler.internalServerError('Internal server error'));
    }
  }
}
