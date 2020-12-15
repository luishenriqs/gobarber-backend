/* Interface que determina quais métodos a implementação de 'Storage Provider'
deve fornecer. Independentemente do ambiente (desenvolvimento ou produção),
os métodos fornecidos devem ser estes abaixo; */
export default interface IStorageProvider {
  saveFile(file: string): Promise<string>;
  deleteFile(file: string): Promise<void>;
}
