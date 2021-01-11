import { v4 as uuidv4 } from 'uuid';
import UserToken from '@modules/users/infra/typeorm/entities/userToken';
import IUserTokensRepository from '../IUserTokensRepository';

/* Simula o 'UserTokensRepository' verdadeiro, localizado
na pasta "infra/typeorm/repositories" para realização de testes; */
class FakeUserTokensRepository implements IUserTokensRepository {
  private userTokens: UserToken[] = [];

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = new UserToken();
    /* O 'Object.assing' gera um objeto com o nome do primeiro parâmetro
    e o conteúdo do segundo; */
    Object.assign(userToken, {
      id: uuidv4(),
      token: uuidv4(),
      user_id,
      created_at: new Date(),
      updated_at: new Date(),
    });

    // Salva no array 'userTokens';
    this.userTokens.push(userToken);

    return userToken;
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const userToken = this.userTokens.find(
      findToken => findToken.token === token,
    );
    return userToken;
  }
}

export default FakeUserTokensRepository;
