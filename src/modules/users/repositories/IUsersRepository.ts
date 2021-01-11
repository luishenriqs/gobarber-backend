/* Interface que determina quais métodos o 'UserRepository' deverá ter:
('findByDate', 'findByEmail', 'Create' e 'Save'); */

/* OBS: Quando uma interface recebe uma informação composta, podemos
criar um DTO onde essas informações serão armazenadas; */

import ICreateUserDTO from '../dtos/ICreateUserDTO';
import User from '../infra/typeorm/entities/User';

export default interface IUsersRepository {
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  create(data: ICreateUserDTO): Promise<User>;
  save(user: User): Promise<User>;
}
