/* OBS: Quando uma interface recebe uma informação composta, podemos
criar um DTO onde essas informações serão armazenadas; */

import IParseMailTemplateDTO from '../dtos/IParseMailTemplateDTO';

export default interface IMailTemplateProvider {
  parse(data: IParseMailTemplateDTO): Promise<string>;
}
