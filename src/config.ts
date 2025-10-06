import dotenv from 'dotenv';
dotenv.config();

// AINDA ESTÁ MUITO RÍGIDO PARA QUE OUTRAS PESSOAS FORA DA MINHA REALIDADE UTILIZEM

type Envs = {
  totpApiEndpoint: string;
  totpApiKey: string;

  eprocUsuario1: string;
  eprocSenha1: string;

  esajUsuario1: string;
  esajSenha1: string;

  prestoUsuario1: string;
  prestoSenha1: string;
};

function requireEnv(name: string): string {
  const val = process.env[name];
  if (!val) {
    throw new Error(`Variável de ambiente ausente: ${name}`);
  }
  return val;
}

function loadEnv(): Envs {
  return {
    totpApiEndpoint: requireEnv('TOTP_API_ENDPOINT'),
    totpApiKey: requireEnv('TOTP_API_KEY'),

    eprocUsuario1: requireEnv('EPROC_USUARIO_1'),
    eprocSenha1: requireEnv('EPROC_SENHA_1'),

    esajUsuario1: requireEnv('ESAJ_USUARIO_1'),
    esajSenha1: requireEnv('ESAJ_SENHA_1'),

    prestoUsuario1: requireEnv('PRESTO_USUARIO_1'),
    prestoSenha1: requireEnv('PRESTO_SENHA_1'),
  };
}

export const envs = loadEnv();
