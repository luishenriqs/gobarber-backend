/* Interface que determina quais métodos a implementação de criptografia a ser
usada deve fornecer. Independentemente de qual biblioteca for usada, os métodos
fornecidos devem ser estes abaixo; */
export default interface IHashProvider {
  generateHash(payload: string): Promise<string>;
  compareHash(payload: string, hashed: string): Promise<boolean>;
}
