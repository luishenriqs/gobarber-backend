/* Implementação do 'Disk Storage Provider' para salvar arquivos no disco da
aplicação quando em ambiente de desenvolvimento. Ela conta com dois métodos:
o 'saveFile' e o 'deleteFile'; */
import fs from 'fs';
import path from 'path';
import uploadConfig from '@config/upload';
import IStorageProvider from '../models/IStorageProvider';

class DiskStorageProvider implements IStorageProvider {
  public async saveFile(file: string): Promise<string> {
    // rename => Forma de mover o arquivo da pasta original para a definitiva;
    await fs.promises.rename(
      path.resolve(uploadConfig.tmpFolder, file),
      path.resolve(uploadConfig.uploadsFolder, file),
    );

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    // filePath => Caminho completo para o arquivo;
    const filePath = path.resolve(uploadConfig.uploadsFolder, file);
    try {
      // Verificação se o arquivo existe;
      // stat => Trás informações sobre o arquivo (se existir) ou retorna erro;
      await fs.promises.stat(filePath);
    } catch {
      return;
    }
    // Se stat não retornou erro executa o unlink => Deleta o arquivo;
    await fs.promises.unlink(filePath);
  }
}

export default DiskStorageProvider;
