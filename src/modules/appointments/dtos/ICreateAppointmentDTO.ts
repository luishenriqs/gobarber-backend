/* *****************************************************************************
INTERFACE PARA UM - DATA TRANSFER OBJECT – DTO
Um objeto simples usado para transferir dados de um local a outro na aplicação,
sem lógica de negócios em seus objetos e comumente associado à transferência de
dados entre uma camada de visão (view layer) e outra de persistência dos
dados (model layer).
***************************************************************************** */
export default interface ICreateAppointmentDTO {
  provider_id: string;
  date: Date;
}
