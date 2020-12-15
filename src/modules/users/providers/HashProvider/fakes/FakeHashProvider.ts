/* Este fake faz o papel do Hash Provider verdadeiro da pasta 'implementation'
e serve para a execução dos arquivos de testes. Note que ele fornece os mesmos
métodos ('generateHash' e o 'compareHash') presentes no provider verdadeiro; */
import IHashProvider from '../models/IHashProvider';

export default class FakeHashProvider implements IHashProvider {
  public async generateHash(payload: string): Promise<string> {
    return payload;
  }

  public async compareHash(payload: string, hashed: string): Promise<boolean> {
    return payload === hashed;
  }
}
