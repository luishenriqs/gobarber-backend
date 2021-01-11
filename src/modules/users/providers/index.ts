/* INJEÇÃO DE DEPENDÊNCIA */
import { container } from 'tsyringe';
import IHashProvider from './HashProvider/models/IHashProvider';
import BCryptHashProvider from './HashProvider/implementations/BCryptHashProvider';

/* *****************************************************************************
OBS: Esse arquivo deve ser importado dentro da pasta 'shared/container';
****************************************************************************  */

/* Toda vez que for injetada a dependência 'HashProvider' será criada uma nova
instância do 'BCryptHashProvider'; */
container.registerSingleton<IHashProvider>('HashProvider', BCryptHashProvider);
