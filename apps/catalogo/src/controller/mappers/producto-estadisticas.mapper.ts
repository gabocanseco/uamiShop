import { ProductoEstadisticas } from '@catalogo/domain/agreggates/producto-estadisticas.agreggate';
import { ProductoEstadisticasResponseDto } from '@catalogo/controller/dtos/producto-estadisticas-response.dto';
import { plainToInstance } from 'class-transformer';

export class ProductoEstadisticasMapper {
  static toResponseDto(
    estadisticas: ProductoEstadisticas,
  ): ProductoEstadisticasResponseDto {
    return plainToInstance(ProductoEstadisticasResponseDto, {
      productoId: estadisticas.getProductoId().getValue(),
      ventasTotales: estadisticas.getVentasTotales(),
      cantidadVendida: estadisticas.getCantidadVendida(),
      vecesAgregadoAlCarrito: estadisticas.getVecesAgregadoAlCarrito(),
      ultimaVentaAt: estadisticas.getUltimaVentaAt().getValue(),
      ultimaAgregadoAlCarritoAt: estadisticas
        .getUltimaAgregadoAlCarritoAt()
        .getValue(),
    });
  }
}
