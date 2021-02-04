import { injectable, inject } from 'tsyringe';
import { getHours, isAfter } from 'date-fns';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

type IResponse = Array<{
  hour: number;
  available: boolean;
}>;

@injectable()
class ListProviderDayAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    year,
    month,
    day,
  }: IRequest): Promise<IResponse> {
    // Busca todos os agendamentos deste provider neste dia específico;
    const appointments = await this.appointmentsRepository.findAllInDayFromProvider(
      {
        provider_id,
        year,
        month,
        day,
      },
    );

    const hourStart = 8;

    /* Cria um array de 10 horas ===> [8, 9, 10, 11, 12, 13, 14, 15, 16, 17].
    Cada posição do array representa um horário disponível para agendamento,
    sendo o primeiro horário definido a partir do 'hourStart' que é '8';   */
    const eachHourArray = Array.from(
      { length: 10 },
      (_, index) => index + hourStart,
    );

    /* 'currentDate': data completa do momento atual; Essa informação é usada
    para descartar horários já ultrapassados pelo tempo; */
    const currentDate = new Date(Date.now());

    // Retorna todos os horários do dia e seu boolean de available;
    const availability = eachHourArray.map(hour => {
      /* 'hasAppointmentInHour': Para cada hora específica: retorna um
      'appointment' se houver um no horário; */
      const hasAppointmentInHour = appointments.find(
        appointment => getHours(appointment.date) === hour,
      );

      /* 'compareDate': data completa especificada na consulta (year, month, day)
      junto com a hora de cada volta (loop) no array; */
      const compareDate = new Date(year, month - 1, day, hour);

      /*
      Retorna um horário (hour), e um boolean (available). (true) se:
        1 - ainda não possuir nenhum agendamento (!hasAppointmentInHour);
        2 - 'compareDate' for posterior (isAfter) ao momento atual 'currentDate';
      */
      return {
        hour,
        available: !hasAppointmentInHour && isAfter(compareDate, currentDate),
      };
    });

    /* Lista todos os horários do dia e suas respectivas disponibilidades;
    Horário disponível se: vago e em momento futuro;*/
    return availability;
  }
}

export default ListProviderDayAvailabilityService;
