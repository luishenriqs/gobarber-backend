/* ARQUIVOS USADOS PARA INJEÇÕES DE DEPENDÊNCIAS */
import { container } from 'tsyringe';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import UserTokensRepository from '@modules/users/infra/typeorm/repositories/UserTokensRepository';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import NotificationsRepository from '@modules/notifications/infra/typeorm/repositories/NotificationsRepository';

/* Importação do arquivo index.ts da pasta users/providers que cria a injeção de
dependência do 'HashProvider'; */
import '@modules/users/providers';

/* Importação do arquivo index.ts da pasta container/provider que cria a injeção
de dependência do 'StorageProvider', do 'MailProvider', do 'MailTemplateProvider'
e do 'CacheProvider'; */
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

/* O container.registerSingleton retorna uma instância do repositório que foi chamado; */
container.registerSingleton<IUserTokensRepository>(
  'UserTokensRepository',
  UserTokensRepository,
);

/* O container.registerSingleton retorna uma instância do repositório que foi chamado; */
container.registerSingleton<INotificationsRepository>(
  'NotificationsRepository',
  NotificationsRepository,
);
