/* Interface que determina qual método o 'UserTokensRepository' deverá ter:
('generate'); */
import UserToken from '../infra/typeorm/entities/userToken';

export default interface IUserTokensRepository {
  generate(user_id: string): Promise<UserToken>;
  findByToken(token: string): Promise<UserToken | undefined>;
}
