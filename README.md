# MAPEANDO FUNCIONALIDADES DA APLICAÇÃO

# RECUPERAÇÃO DE SENHA

  **- RF - REQUISITOS FUNCIONAIS -**

    - O usuário deve poder recuperar a senha informando o seu e-mail;
    - O usuário deve receber um e-mail com instruções para recuperação de senha;
    - O usuário deve poder resetar sua senha;

  **- RNF - REQUISITOS NÃO FUNCIONAIS -**

    - Utilizar o Mailtrap para testar envios em ambiente de dev;
    - Utilizar o Amazon SES para envios em produção;
    - O envio de e-mails deve ocorrer em segundo plano (background-job);

  **- RN - REGRAS DE NEGÓCIOS -**

    - O link enviado por e-mail para resetar senha deve expirar em 2 horas;
    - O usuário precisa confirmar a nova senha após resetá-la;


# ATUALIZAÇÃO DO PERFIL

  **- RF - REQUISITOS FUNCIONAIS -**

    - O usuário deve poder atualizar seu nome, e-mail e senha;

  **- RN - REGRAS DE NEGÓCIOS -**

    - O usuário não pode atualizar seu e-mail com um e-mail já utilizado;
    - Para atualizar a sua senha, o usuário deve informar a senha antiga;
    - Para atualizar a sua senha, o usuário deve confirmar a nova senha;

# PAINEL DO PRESTADOR

  **- RF - REQUISITOS FUNCIONAIS -**

    - O prestador deve poder listar seus agendamentos de um dia específico;
    - O prestador deve receber uma notificação sempre que houver um novo agendamento;
    - O prestador deve poder visualizar as notificações não lidas;

  **- RNF - REQUISITOS NÃO FUNCIONAIS -**

    - Os agendamentos do dia devem ser armazenados em cache;
    - As notificações do prestador devem ser armazenadas no MongoDB;
    - As notificações do prestador devem ser enviadas em tempo-real utilizando Socket.io;

  **- RN - REGRAS DE NEGÓCIOS -**

    - A notificação deve ter um status de lida ou não-lida;

# AGENDAMENTO DE SERVIÇOS

  **- RF - REQUISITOS FUNCIONAIS -**

    - O usuário deve poder listar todos os prestadores de serviço disponíveis;
    - O usuário deve poder listar os dias de um mês com pelo menos um horário disponível de um prestador;
    - O usuário deve poder listar horários disponíveis em um dia específico de um prestador;
    - O usuário deve poder realizar um novo agendamento com um prestador;

  **- RNF - REQUISITOS NÃO FUNCIONAIS -**

    - A listagem de prestadores deve ser armazenada em cache;

  **- RN - REGRAS DE NEGÓCIOS -**

    - Cada agendamento deve durar 1 hora exatamente;
    - Os agendamentos devem estar disponíveis entre as 8 e 18 horas (Primeiro as 8:00 e último as 17:00);
    - O usuário não pode agendar um horário já ocupado;
    - O usuário não pode agendar em um horário que já passou;
    - O usuário não pode agendar um horário consigo mesmo;
