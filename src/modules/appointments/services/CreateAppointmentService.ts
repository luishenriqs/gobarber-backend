import { startOfHour, isBefore, getHours, format } from 'date-fns';
import { injectable, inject} from 'tsyringe';
import AppError from '@shared/errors/AppError';
import Appointment from '../infra/typeorm/entities/Appointment';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';

interface IRequest {
  provider_id: string;
  user_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository : IAppointmentsRepository,

    @inject('NotificationsRepository')
    private notificationsRepository : INotificationsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  // Método execute para a criação de um novo appointment;
  public async execute({ date, provider_id, user_id }: IRequest): Promise<Appointment> {
    // Regra de negocio para que o agendamento ocorra somente de hora em hora;
    const appointmentDate = startOfHour(date);

    /* Comparação entre data do appointment e data atual.
    AppError em caso de 'appointmentDate' ser data vencida; */
    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError("You can't create an appointment on a past date.");
    }

    // Condição para usuário não criar agendamento com si próprio;
    if (user_id === provider_id) {
      throw new AppError("You can't create an appointment whith yourself.");
    }

    /* Condição de criar appointments apenas na faixa das 8hrs as 17hrs;
    Se hora do agendamento for menor que 8 ou maior que 17 horas => AppError; */
    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppError("You can only create appointments between 8am and 5pm");
    }

    // Busca por agendamentos na mesma data e horário;
    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
      provider_id,
    );

    // Caso haja dois agendamentos na mesma data e horário instancia AppError;
    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked');
    }

    // Cria e salva o objeto do appointment no banco de dados;
    const appointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: appointmentDate,
    });

    // Formatando a data;
    const dateFormatted = format(appointmentDate, "dd/MM/yyyy 'às' HH:mm'h'");

    // Cria e salva uma notificação assim que um appointment é criado;
    await this.notificationsRepository.create({
      recipient_id: provider_id,
      content: `Novo agendamento para dia ${dateFormatted}`,
    });

    await this.cacheProvider.invalidate(
      `provider-appointments:${provider_id}:${format(appointmentDate, 'yyyy-M-d'
    )}`);

    return appointment;
  }
}

export default CreateAppointmentService;
