import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderAppointments: ListProviderAppointmentsService;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProviderAppointments', () => {
  beforeEach(() => {
  /* ************************************************************************ */
  /* O 'beforeEach' executa de forma automática todas as suas instruções
  antes da execução de cada teste. Desta forma evita-se de repetir o mesmo
  código em todos os testes; */
    fakeAppointmentsRepository =  new FakeAppointmentsRepository;
    fakeCacheProvider =  new FakeCacheProvider;
    listProviderAppointments = new ListProviderAppointmentsService(
      fakeAppointmentsRepository,
      fakeCacheProvider,
    );
  });
  /* ************************************************************************ */

  /* ************************************************************************ */
  // Espera listar todos os agendamentos do provider no dia específico;
  it('should be able to list the appointments on a specific day', async () => {
    // Cria um agendamento falso;
    // Ano: 2021, Mês: Maio (Posição quatro no array), Dia: 20;
    const appointment1 = await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(2021, 4, 20, 14, 0, 0),
    });

    // Cria um segundo agendamento;
    const appointment2 = await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(2021, 4, 20, 15, 0, 0),
    });

    // Chama a execução do service;
    const appointments = await listProviderAppointments.execute({
      provider_id: 'provider',
      year: 2021,
      month: 5,
      day: 20,
    });

    // Espera que na listagem de appointments constem os agendamentos criados;
    expect(appointments).toEqual([appointment1, appointment2]);
  });
  /* ************************************************************************ */
});
