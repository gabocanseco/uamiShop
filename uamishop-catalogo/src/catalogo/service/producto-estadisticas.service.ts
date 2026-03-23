import { ProductoEstadisticas } from '@catalogo/domain/agreggates/producto-estadisticas.agreggate';
import type { IProductoEstadisticasRepository } from '@catalogo/repository/interfaces/producto-estadisticas.repository';
import { Inject, Injectable } from '@nestjs/common';
import { EntityNotFoundException } from '@shared/domain/exceptions/entity-not-found.exception';
import { ProductoId } from '@shared/domain/value-objects/ids/producto-id.vo';

@Injectable()
export class ProductoEstadisticasService {
  constructor(
    @Inject('IProductoEstadisticasRepository')
    private readonly productoEstadisticasRepository: IProductoEstadisticasRepository,
  ) {}

  /**
   * Crea o actualiza las estadísticas de un producto al registrar una venta.
   * Si el producto no tiene estadísticas previas, se crea una nueva entrada.
   * Si ya existen estadísticas, se actualizan con la nueva cantidad vendida.
   */
  async registrarVenta(
    productoId: ProductoId,
    cantidad: number,
  ): Promise<ProductoEstadisticas> {
    let productoEstadisticas =
      await this.productoEstadisticasRepository.findByProductoId(productoId);

    if (productoEstadisticas === null) {
      productoEstadisticas = ProductoEstadisticas.crear(productoId);
    }

    productoEstadisticas.incrementarVentas(cantidad);

    return this.productoEstadisticasRepository.save(productoEstadisticas);
  }

  /**
   *
   * Incrementa veces vecesAgregadoAlCarrito
   */
  async registrarAgregadoAlCarrito(
    productoId: ProductoId,
  ): Promise<ProductoEstadisticas> {
    let productoEstadisticas =
      await this.productoEstadisticasRepository.findByProductoId(productoId);

    if (productoEstadisticas === null) {
      productoEstadisticas = ProductoEstadisticas.crear(productoId);
    }

    productoEstadisticas.incrementarAgregadoAlCarrito();

    return this.productoEstadisticasRepository.save(productoEstadisticas);
  }

  /**
   *
   * Consulta por cantidadVendida descendente
   */
  async obtenerMasVendidos(limite: number): Promise<ProductoEstadisticas[]> {
    return this.productoEstadisticasRepository.findMasVendidos(limite);
  }

  async obtenerEstadisticas(
    productoId: ProductoId,
  ): Promise<ProductoEstadisticas> {
    const estadisticas =
      await this.productoEstadisticasRepository.findByProductoId(productoId);
    if (estadisticas === null) {
      throw new EntityNotFoundException(
        'ProductoEstadisticas',
        'Producto no encontrado',
      );
    }
    return estadisticas;
  }
}
