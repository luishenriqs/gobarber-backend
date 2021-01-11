/* *****************************************************************************
- DATA TRANSFER OBJECT – DTO
Um objeto simples usado para transferir dados de um local a outro na aplicação,
sem lógica de negócios em seus objetos e comumente associado à transferência de
dados entre uma camada de visão (view layer) e outra de persistência dos
dados (model layer).
***************************************************************************** */

/* OBS: [key:string] do lado esquerdo da chave indica que essa interface pode
receber qualquer elemento, desde que seja uma string e seu valor uma string ou
number; */

interface ITemplateVariables {
  [key: string]: string | number;
}

/* A tipagem da propriedade 'variables' é um objeto que pode receber qualquer
coisa dentro dele;  */

export default interface IParseMailTemplateDTO {
  template: string;
  variables: ITemplateVariables;
}
