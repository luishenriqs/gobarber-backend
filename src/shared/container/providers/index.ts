/* INJEÇÃO DE DEPENDÊNCIA */
import { container } from 'tsyringe';

import IStorageProvider from './StorageProvider/models/IStorageProvider';
import DiskStorageProvider from './StorageProvider/implementations/DiskStorageProvider';

import IMailProvider from './MailProvider/models/IMailProvider';
import EtherealMailProvider from './MailProvider/implementations/EtherealMailProvider';

import IMailTemplateProvider from './MailTemplateProvider/models/IMailTemplateProvider';
import HandlebarsMailTemplateProvider from './MailTemplateProvider/implementations/HandlebarsMailTemplateProvider';

/* *****************************************************************************
  OBS: Esse arquivo deve ser importado dentro da pasta 'shared/container';
***************************************************************************** */

/* Toda vez que for injetada a dependência 'StorageProvider' será criada uma nova
instância do 'DiskStorageProvider'; */
container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  DiskStorageProvider,
);

/* Toda vez que for injetada a dependência 'MailTemplateProvider'
será criada uma nova instância do 'HandlebarsMailTemplateProvider'; */
container.registerSingleton<IMailTemplateProvider>(
  'MailTemplateProvider',
  HandlebarsMailTemplateProvider,
);

/* Toda vez que for injetada a dependência 'MailProvider' será criada uma nova
instância do 'EtherealMailProvider'; */
container.registerInstance<IMailProvider>(
  'MailProvider',
  container.resolve(EtherealMailProvider),
);
