/* Interface que determina quais métodos a implementação que o 'Mail Provider'
deve fornecer. Independentemente do ambiente (desenvolvimento ou produção),
os métodos fornecidos devem ser este abaixo; */
export default interface IMailProvider {
  sendMail(to: string, body: string): Promise<void>;
}
