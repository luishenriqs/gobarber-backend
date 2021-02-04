import { injectable, inject } from 'tsyringe';
import { getDate, getDaysInMonth, isAfter } from 'date-fns';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
}

type IResponse = Array<{
  day: number;
  available: boolean;
}>;

@injectable()
class ListProviderMonthAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    year,
    month,
  }: IRequest): Promise<IResponse> {
    // Busca todos os agendamentos deste provider neste mês específico;
    const appointments = await this.appointmentsRepository.findAllInMonthFromProvider(
      {
        provider_id,
        year,
        month,
      },
    );
    console.log("log do service Month: ", appointments)

    // Retorna a quantidade de dias deste mês específico;
    const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1));

    /* Transforma o número de dias deste mês em um array e com o índice
    começando a partir do 1; ===> [1, 2, 3, 4, 5, ...] */
    const eachDayArray = Array.from(
      { length: numberOfDaysInMonth },
      (_, index) => index + 1,
    );

    /* 'currentDate': data completa do momento atual; Essa informação é usada
    para descartar os dias já ultrapassados pelo tempo; */
    const currentDate = new Date(Date.now());

    const availability = eachDayArray.map(day => {
      // Data referente ao final de cada dia do mês;
      const compareDate = new Date(year, month - 1, day, 23, 59, 59);

      /* Retorna do array de agendamentos do mês apenas os do dia específico; */
      const appointmentsInDay = appointments.filter(appointment => {
        return getDate(appointment.date) === day;
      });

      /*
      Retorna cada dia do mês, e o seu boolean (available). Disponível (true) se:
        1 - se os agendamentos do dia (appointmentsInDay) não somarem o total de 10;
        2 - 'compareDate' for posterior (isAfter) ao momento atual 'currentDate';
      */
      return {
        day,
        available:
          appointmentsInDay.length < 10 && isAfter(compareDate, currentDate),
      };
    });

    return availability;
  }
}

export default ListProviderMonthAvailabilityService;
