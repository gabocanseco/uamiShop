import { Categoria } from '@catalogo/domain/agreggates/categoria.agreggate';
import { CategoriaResponseDto } from '../dtos/categoria-response.dto';
import { CategoriaRequestDto } from '../dtos/categoria-request.dto';
import { CategoriaId } from '@catalogo/domain/value-objects/ids/categoria-id.vo';
import { plainToInstance } from 'class-transformer';

export class CategoriaMapper {
  static toDomain(categoriaRequestDto: CategoriaRequestDto): Categoria {
    let categoriaPadreId: CategoriaId | undefined = undefined;
    if (categoriaRequestDto.categoriaPadreId) {
      categoriaPadreId = CategoriaId.of(categoriaRequestDto.categoriaPadreId);
    }
    return Categoria.crear(
      categoriaRequestDto.nombre,
      categoriaRequestDto.descripcion,
      categoriaPadreId,
    );
  }

  static toResponseDto(categoria: Categoria): CategoriaResponseDto {
    return plainToInstance(CategoriaResponseDto, categoria.toPrimitives());
  }
}
