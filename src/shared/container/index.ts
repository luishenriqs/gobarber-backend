/* ARQUIVOS USADOS PARA INJEÇÕES DE DEPENDÊNCIAS */
import { container } from 'tsyringe';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

/* Importação do arquivo index.ts da pasta users/providers que cria a injeção de
dependência do 'HashProvider'; */
import '@modules/users/providers';

/* Importação do arquivo index.ts da pasta container/provider que cria a injeção
de dependência do 'StorageProvider'; */
import '@shared/container/providers';

/* O container.registerSingleton retorna uma instância do repositório que foi chamado; */
container.registerSingleton<IAppointmentsRepository>(
  'AppointmentsRepository',
  AppointmentsRepository,
);

/* O container.registerSingleton retorna uma instância do repositório que foi chamado; */
container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);
