/* Implementação do 'MailTemplateProvider' para o fornecimento de template
nos serviços de envio de email;
Obs: Instale o handlebars => yarn add handlebars; */

import handlebars from 'handlebars';
import fs from 'fs';
import IParseMailTemplateDTO from '../dtos/IParseMailTemplateDTO';
import IMailTemplateProvider from '../models/IMailTemplateProvider';

class HandlebarsMailTemplateProvider implements IMailTemplateProvider {
  public async parse({
    file,
    variables,
  }: IParseMailTemplateDTO): Promise<string> {
    const templateFileContent = await fs.promises.readFile(file, {
      encoding: 'utf-8',
    });
    const parseTemplate = handlebars.compile(templateFileContent);
    return parseTemplate(variables);
  }
}

export default HandlebarsMailTemplateProvider;
