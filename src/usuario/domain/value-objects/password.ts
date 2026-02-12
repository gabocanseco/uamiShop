// src/domain/value-objects/ContrasenaSegura.ts
import * as argon2 from 'argon2';

export class Password {
  private readonly _hash: string;

  private constructor(hash: string) {
    this._hash = hash;
  }
  
  public static async crear(contrasenaPlana: string): Promise<Password> {
    //Modificar para que funcione 
    if (await Password.estaComprometida(contrasenaPlana)) {
      throw new Error('La contraseña ha sido comprometida en filtraciones anteriores. Por favor, elige una contraseña diferente.');
    }

    const hash = await argon2.hash(contrasenaPlana, {
      type: argon2.argon2id, // Resistente a GPU y side-channel attacks
      memoryCost: 65536, // 64MB
      timeCost: 3, // Iteraciones
      parallelism: 4, // Paralelismo
      hashLength: 32, // 32 bytes
    });

    return new Password(hash);
  }

  private static async estaComprometida(contrasena: string): Promise<boolean> {
    // API de Have I Been Pwned (sin enviar la contraseña completa)
    const hash = require('crypto')
      .createHash('sha1')
      .update(contrasena)
      .digest('hex')
      .toUpperCase();
    
    const prefix = hash.substring(0, 5);
    const suffix = hash.substring(5);

    try {
      const response = await fetch(
        `https://api.pwnedpasswords.com/range/${prefix}`
      );
      const data = await response.text();
      return data.includes(suffix);
    } catch {
      return false; // Si falla la API, continuamos
    }
  }

  public async verificar(contrasenaPlana: string): Promise<boolean> {
    return await argon2.verify(this._hash, contrasenaPlana);
  }

  public necesitaRehash(): boolean {
    // Argon2 incluye parámetros en el hash, verificar si son actuales
    const parts = this._hash.split('$');
    if (parts.length < 4) return true;
    
    const params = parts[3].split(',');
    const memory = parseInt(params[0].split('=')[1]);
    const time = parseInt(params[1].split('=')[1]);
    const parallelism = parseInt(params[2].split('=')[1]);
    
    return memory < 65536 || time < 3 || parallelism < 4;
  }

  public get hash(): string {
    return this._hash;
  }
}