/* *****************************************************************************
- DATA TRANSFER OBJECT – DTO
Um objeto simples usado para transferir dados de um local a outro na aplicação,
sem lógica de negócios em seus objetos e comumente associado à transferência de
dados entre uma camada de visão (view layer) e outra de persistência dos
dados (model layer).
***************************************************************************** */

import IParseMailTemplateDTO from '@shared/container/providers/MailTemplateProvider/dtos/IParseMailTemplateDTO';

interface IMailContact {
  name: string;
  email: string;
}

export default interface ISendMailDTO {
  to: IMailContact;
  from?: IMailContact;
  subject: string;
  templateData: IParseMailTemplateDTO;
}
