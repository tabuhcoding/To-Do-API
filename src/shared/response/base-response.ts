import { ApiProperty } from '@nestjs/swagger';

export class BaseResponse {
  @ApiProperty({ example: 200, description: 'HTTP status code' })
  statusCode: number;

  @ApiProperty({ example: 'Success', description: 'Response message' })
  message: string;
}