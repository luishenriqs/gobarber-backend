/* INJEÇÃO DE DEPENDÊNCIA */
import { container } from 'tsyringe';
import IStorageProvider from './StorageProvider/models/IStorageProvider';
import DiskStorageProvider from './StorageProvider/implementations/DiskStorageProvider';

// OBS: Esse arquivo deve ser importado dentro da pasta 'shared/container';

/* Toda vez que for injetada a dependência 'StorageProvider' será criada uma nova
instância do 'DiskStorageProvider'; */
container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  DiskStorageProvider,
);
