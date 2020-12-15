/* Este fake faz o papel do Disk Storage Provider verdadeiro da pasta 'implementation'
e serve para a execução dos arquivos de testes. Note que ele fornece os mesmos
métodos ('saveFile' e o 'deleteFile') presentes no provider verdadeiro; */
import IStorageProvider from '../models/IStorageProvider';

class FakeStorageProvider implements IStorageProvider {
  private storage: string[] = [];

  public async saveFile(file: string): Promise<string> {
    // Apenas insere o arquivo dentro de um array;
    this.storage.push(file);
    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    // Deleta o arquivo de dentro do array;
    const findIndex = this.storage.findIndex(
      storageFile => storageFile === file,
    );

    this.storage.splice(findIndex, 1);
  }
}

export default FakeStorageProvider;
