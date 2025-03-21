import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/shared/response/base-response';

export class AddDependencyResponseDto {
  @ApiProperty({ example: 1, description: 'Task ID' })
  taskId: number;

  @ApiProperty({ example: 2, description: 'Task ID that the task depends on' })
  dependOnTaskId: number;
}

export class AddDependencyResponse extends BaseResponse {
  @ApiProperty({ type: AddDependencyResponseDto, description: 'Task dependency details' })
  dependency: AddDependencyResponseDto;
}