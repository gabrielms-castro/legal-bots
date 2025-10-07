import path from 'path'
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

// AINDA ESTÁ MUITO RÍGIDO PARA QUE OUTRAS PESSOAS FORA DA MINHA REALIDADE UTILIZEM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const projectRoot = path.resolve(__dirname, '..');
export const extensionsDir = path.join(projectRoot, 'extensoes')
export const userDataDir = path.join(projectRoot, '.temp', 'user-data');


type SystemCredentials = {
  username: string;
  password: string;
  pin?: string;
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
    
    if (systemName.toLowerCase() === 'presto') {
      const pin = getEnv(`${systemName}_PIN_${i}`);
      credentials.push({ username, password, pin });

    } else {
      credentials.push({ username, password });
    }

    i++;
  }

  return credentials
}

// alterar futuramente. cada classe chama sua própria config/credencial
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


export const envs = loadEnv();