import { v4 as uuidv4 } from 'uuid';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllProvidersDTO from '../../dtos/IFindAllProvidersDTO';
import User from '../../infra/typeorm/entities/User';

/* Simula o 'UsersRepository' verdadeiro, localizado
na pasta "infra/typeorm/repositories" para realização de testes; */
class FakeUsersRepository implements IUsersRepository {
  private users: User[] = [];

  /* ************************[FIND ALL PROVIDERS]**************************** */
  public async findAllProviders({
    except_user_id,
  }: IFindAllProvidersDTO): Promise<User[]> {
    let { users } = this;
    if (except_user_id) {
      users = this.users.filter(user => user.id !== except_user_id);
    }
    return users;
  }
  /* ************************************************************************ */

  /* ****************************[FIND BY ID]******************************** */
  public async findById(id: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.id === id);
    return findUser;
  }
  /* ************************************************************************ */

  /* ***************************[FIND BY EMAIL]****************************** */
  public async findByEmail(email: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.email === email);
    return findUser;
  }
  /* ************************************************************************ */

  /* ******************************[CREATE]********************************** */
  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = new User();
    Object.assign(user, { id: uuidv4() }, userData);
    this.users.push(user);
    return user;
  }
  /* ************************************************************************ */

  /* ******************************[SAVE]************************************ */
  public async save(user: User): Promise<User> {
    const findIndex = this.users.findIndex(findUser => findUser.id === user.id);
    this.users[findIndex] = user;
    return user;
  }
  /* ************************************************************************ */
}

export default FakeUsersRepository;
