import { Controller, Put, Param, Body, HttpStatus, Res, Post } from '@nestjs/common';
import { Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ErrorHandler } from 'src/shared/exceptions/error.handler';
import { SetEmailNotifyService } from './setEmailGetNotify.service';

@ApiTags('EmailNotify')
@Controller('api/notify')
export class SetEmailNotifyController {
  constructor(private readonly setEmailNotifyService: SetEmailNotifyService) {}

  @Post('/setEmailNotify/:email')
  @ApiOperation({ summary: 'Set email for notify' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Email set successfully' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Error setting email',
  })
  async setEmailNotify(@Param('email') email: string, @Res() res: Response) {
    try {
      const result = await this.setEmailNotifyService.setEmailNotify(email);
      if (!result) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(ErrorHandler.internalServerError('Error setting email'));
      }

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Email set successfully',
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(ErrorHandler.internalServerError(error.message));
    }
  }
  
}
