import { v4 as generarUUID, validate as validarUUID } from 'uuid';

export class UsuarioId {
  private constructor(private readonly _valor: string) {}

  public static crear(): UsuarioId {
    return new UsuarioId(generarUUID());
  }
// Método para crear un UsuarioId a partir de un string
  public static desdeString(id: string): UsuarioId {
    if (!UsuarioId.esValido(id)) {
      throw new Error(`UsuarioId: Formato UUID inválido para el valor: ${id}`);
    }
    return new UsuarioId(id);
  }

  public static esValido(id: string): boolean {
    return validarUUID(id);
  }

  public get valor(): string {
    return this._valor;
  }

  public esIgual(otro: unknown): boolean {
    if (!(otro instanceof UsuarioId)) return false;
    return this._valor === otro._valor;
  }

  // Para uso en Set/Map
  public hashCode(): number {
    return this._valor.split('').reduce((acc, caracter) => {
      return acc + caracter.charCodeAt(0);
    }, 0);
  }

  public toString(): string {
    return `UsuarioId(${this._valor})`;
  }

  
}