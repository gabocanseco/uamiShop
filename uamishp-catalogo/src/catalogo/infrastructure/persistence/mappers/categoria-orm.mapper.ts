import { CategoriaOrmEntity } from '../entities/categoria-orm.entity';
import { Categoria } from '@catalogo/domain/agreggates/categoria.agreggate';
import { CategoriaId } from '@catalogo/domain/value-objects/ids/categoria-id.vo';

export class CategoriaOrmMapper {
  static toDomain(ormEntity: CategoriaOrmEntity): Categoria {
    const id = CategoriaId.of(ormEntity.id);

    const categoriaPadreId = ormEntity.categoriaPadreId
      ? CategoriaId.of(ormEntity.categoriaPadreId)
      : undefined;

    return Categoria.reconstruct(
      id,
      ormEntity.nombre,
      ormEntity.descripcion,
      categoriaPadreId,
    );
  }

  static toOrm(domainEntity: Categoria): CategoriaOrmEntity {
    const ormEntity = new CategoriaOrmEntity();
    const primitives = domainEntity.toPrimitives();

    ormEntity.id = primitives.id;
    ormEntity.nombre = primitives.nombre;
    ormEntity.descripcion = primitives.descripcion;
    ormEntity.categoriaPadreId = primitives.categoriaPadreId;

    return ormEntity;
  }
}
