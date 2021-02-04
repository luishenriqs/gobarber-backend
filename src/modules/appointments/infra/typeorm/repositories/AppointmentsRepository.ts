import { getRepository, Repository, Raw } from 'typeorm';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';

import Appointment from '../entities/Appointment';

class AppointmentsRepository implements IAppointmentsRepository {
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  /* ****************************[FIND BY DATE]****************************** */
  public async findByDate(
    date: Date,
    provider_id: string,
  ): Promise<Appointment | undefined> {
    const findAppointment = await this.ormRepository.findOne({
      where: { date, provider_id },
    });
    return findAppointment;
  }
  /* ************************************************************************ */

  /* *************************[FIND ALL IN MONTH]**************************** */
  public async findAllInMonthFromProvider({
    provider_id,
    month,
    year,
  }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
    const parsedMonth = String(month).padStart(2, '0');

    // Busca todos os agendamentos deste provider neste mês específico;
    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'`,
        ),
      },
    });
    return appointments;
  }
  /* OBSERVAÇÕES:
  ===> 'String(month)' => Converte o 'month' de number para string;
  ===> 'padStart(2, '0') => Se a string não tiver 2 dígitos insere à esq o '0',
  exemplo: se o valor do month é "1" após o 'padStart(2, '0')' será "01";
  ===> 'Raw()' => Permite passar uma condição para o campo, nesse caso o 'date:',
    diretamente para o banco 'Postegres', sem ser interpretado pelo 'typeorm';
  ===> `to_char` => Função do 'Postegres' que escreve um (dateFieldName), no
  formato escolhido, neste caso 'MM-YYYY', a partir dos campos informados, neste
  caso: '${parsedMonth}-${year}';
  *** Ou seja, para fazer a verificação de data no postegres é necessário
  passar o campo "date" no formato específico;
  */
  /* ************************************************************************ */

  /* ************************[FIND ALL IN DAY]******************************* */
  public async findAllInDayFromProvider({
    provider_id,
    day,
    month,
    year,
  }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
    const parsedDay = String(day).padStart(2, '0');
    const parsedMonth = String(month).padStart(2, '0');

    // Busca todos os agendamentos deste provider neste dia específico;
    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`,
        ),
      },
      relations: ['user'],
    });
    return appointments;
  }
  /* ************************************************************************ */

  /* ************************[CREATE AND SAVE]******************************* */
  public async create({
    provider_id,
    user_id,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create({
      provider_id,
      user_id,
      date,
    });
    await this.ormRepository.save(appointment);
    return appointment;
  }
  /* ************************************************************************ */
}

export default AppointmentsRepository;
