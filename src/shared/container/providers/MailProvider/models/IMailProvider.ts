/* Interface que determina quais métodos a implementação que o 'Mail Provider'
deve fornecer. Independentemente do ambiente (desenvolvimento ou produção),
o método fornecido deve ser este abaixo; */

import ISendMailDTO from '../dtos/ISendMailDTO';

export default interface IMailProvider {
  sendMail(data: ISendMailDTO): Promise<void>;
}
