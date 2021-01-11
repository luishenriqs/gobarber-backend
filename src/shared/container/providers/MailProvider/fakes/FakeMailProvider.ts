/* Este fake faz o papel do Mail Provider verdadeiro da pasta 'implementation'
e serve para a execução dos arquivos de testes. Note que ele fornece o mesmo
método ('sendMail') presente no provider verdadeiro; */
import IMailProvider from '../models/IMailProvider';

interface IMessage {
  to: string;
  body: string;
}

export default class FakeMailProvider implements IMailProvider {
  private messages: IMessage[] = [];

  public async sendMail(to: string, body: string): Promise<void> {
    this.messages.push({
      to,
      body,
    });
  }
}
