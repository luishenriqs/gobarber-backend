interface IMailConfig {
  driver: 'ethereal' | 'ses';

  defaults: {
    from: {
      email: string;
      name: string;
    }
  };
}

/*
  Em ambiente de desenvolvimento: 'ethereal';
  Em ambiente de produção: 'amazon ses';
*/
export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',

  defaults: {
    from: {
      email: 'lh.p@sorahius.com.br', // Exemplo de um email e um domínio;
      name: 'Luís Henrique',
    }
  }

} as IMailConfig;
