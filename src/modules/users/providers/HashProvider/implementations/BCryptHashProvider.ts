/* O 'bcrypt' é uma biblioteca de criptografia. Dela usamos o método 'hash' que
gera uma criptografia, e o método 'compare' que compara duas senhas
criptografadas. Esses métodos pertencentes à biblioteca são usados dentro dos
métodos da aplicação: ('generateHash', e o 'compareHash'), assim, se em algum
momento for desejável trocar de biblioteca, não é necessário mexer nos métodos
da aplicação, apenas nos usados dentro deles, no caso o 'hash' e o 'compare'; */
import { compare, hash } from 'bcrypt';
import IHashProvider from '../models/IHashProvider';

export default class BCryptHashProvider implements IHashProvider {
  public async generateHash(payload: string): Promise<string> {
    return hash(payload, 8);
  }

  public async compareHash(payload: string, hashed: string): Promise<boolean> {
    return compare(payload, hashed);
  }
}
