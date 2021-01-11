/* Este fake faz o papel do Mail Provider verdadeiro da pasta 'implementation'
e serve para a execução dos arquivos de testes. Note que ele fornece o mesmo
método ('sendMail') presente no provider verdadeiro; */

import IMailProvider from '../models/IMailProvider';
import ISendMailDTO from '../dtos/ISendMailDTO';

export default class FakeMailProvider implements IMailProvider {
  private messages: ISendMailDTO[] = [];

  public async sendMail(message: ISendMailDTO): Promise<void> {
    this.messages.push(message);
  }
}
