import { ApiProperty } from '@nestjs/swagger';

export class ClienteResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ required: false })
  email?: string;

  @ApiProperty({ required: false })
  nombre?: string;

  @ApiProperty({ required: false })
  telefono?: string;

  @ApiProperty()
  fechaCreacion!: Date;
}
