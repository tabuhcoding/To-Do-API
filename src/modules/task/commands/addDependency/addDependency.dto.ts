import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';


export class AddDependencyDto {
  @ApiProperty({ example: 1, description: 'Task ID' })
  @IsInt()
  @IsNotEmpty()
  taskId: number;

  @ApiProperty({ example: 2, description: 'Task ID that the task depends on' })
  @IsInt()
  @IsNotEmpty()
  dependOnTaskId: number;
}
