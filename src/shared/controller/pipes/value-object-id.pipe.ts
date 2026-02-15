import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ValueObjectIdPipe implements PipeTransform<string, T> {
  // Recibe la clase del Value Object en el constructor para instanciarlo después
  constructor(
    private readonly ValueObjectClass: { of: (value: string) => T },
  ) {}
  transform(value: string, metadata: ArgumentMetadata): T {
    try {
      if (!value) {
        throw new Error('El ID no puede estar vacío');
      }

      return this.ValueObjectClass.of(value);
    } catch (error) {
      throw new BadRequestException(`ID inválido: ${error.message}`);
    }
  }
}
