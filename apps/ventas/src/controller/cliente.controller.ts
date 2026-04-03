import { Controller, Get, Post, Param } from '@nestjs/common';
import { ClienteService } from '@ventas/service/cliente.service';
import { ClienteResponseDto } from '@ventas/controller/dtos/cliente-response.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Clientes')
@Controller('clientes')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un cliente por ID' })
  @ApiParam({ name: 'id', description: 'ID del cliente' })
  @ApiResponse({
    status: 200,
    description: 'Cliente obtenido exitosamente',
    type: ClienteResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  async obtenerCliente(@Param('id') id: string): Promise<ClienteResponseDto> {
    const cliente = await this.clienteService.findById(id);
    if (!cliente) {
      return this.clienteService.findOrCreate(id);
    }
    return cliente;
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo cliente anónimo' })
  @ApiResponse({
    status: 201,
    description: 'Cliente creado exitosamente',
    type: ClienteResponseDto,
  })
  async crearCliente(): Promise<ClienteResponseDto> {
    const cliente = await this.clienteService.findOrCreate();
    return cliente;
  }
}
