import * as crypto from 'crypto';

export class RandomIdGeneratorUtils {
   private static readonly salt: string = 'Lorem ipsum dolor sit amet.';

   static generate(nomeChave: string, idBase: number): string {
      const baseParaCodificar = `${nomeChave}${idBase}${RandomIdGeneratorUtils.salt}`;
      return crypto.createHash('sha256').update(baseParaCodificar).digest('hex');
   }
}
