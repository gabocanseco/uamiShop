import { Producto } from '@catalogo/domain/agreggates/producto.agreggate';
import { ProductoCatalogoDto } from '@catalogo/api/dtos/producto-catalogo.dto';

export class CatalogoApiMapper {
  public static productoToProductoCatalogoDto(
    producto: Producto,
  ): ProductoCatalogoDto {
    return {
      productoId: producto.getId().getValue(),
      nombre: producto.getNombre().getValue(),
      precio: {
        cantidad: producto.getPrecio().getCantidad(),
        moneda: producto.getPrecio().getMoneda(),
      },
      disponible: producto.toPrimitives().disponible,
    };
  }
}
