import path from 'path'
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

// AINDA ESTÁ MUITO RÍGIDO PARA QUE OUTRAS PESSOAS FORA DA MINHA REALIDADE UTILIZEM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
export const extensionDir = path.join(projectRoot, 'src', 'extensoes', 'presto_0.70'); // carregar de forma dinâmica futuramente
export const userDataDir = path.join(projectRoot, '.temp', 'user-data');
export const envs = loadEnv();

type SystemCredentials = {
  username: string;
  password: string;
}

type Envs = {
  totpApiEndpoint: string;
  totpApiKey: string;
  sistemas : {
    eproc?: SystemCredentials[];
    esaj?: SystemCredentials[];
    pje?: SystemCredentials[];
    presto?: SystemCredentials[];
    elaw?: SystemCredentials[];
    projuris?: SystemCredentials[];
  }
};

function requireEnv(name: string): string {
  const val = process.env[name];
  if (!val) {
    throw new Error(`Variável de ambiente ausente: ${name}`);
  }
  return val;
}

function getEnv(name: string) :string | undefined {
  return process.env[name];
}

function loadSystemCredentials(systemName: string): SystemCredentials[] {
  const credentials: SystemCredentials[] = [];
  let i = 1;
  while (true) {
    const username = getEnv(`${systemName}_USUARIO_${i}`);
    const password = getEnv(`${systemName}_SENHA_${i}`);

    if (!username || !password) break;

    credentials.push({ username, password });
    i++;
  }
  return credentials
}

function loadEnv(): Envs {
  return {
    totpApiEndpoint: requireEnv('TOTP_API_ENDPOINT'),
    totpApiKey: requireEnv('TOTP_API_KEY'),
    sistemas: {
      eproc: loadSystemCredentials('eproc'),
      esaj: loadSystemCredentials('esaj'),
      presto: loadSystemCredentials('presto'),
    },
  };
}


