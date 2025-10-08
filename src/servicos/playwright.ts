import { Browser, BrowserContext, chromium, firefox, webkit } from 'playwright';
import path from 'path';

export interface CreateContextOptions {
  // Tipo de navegador
  browserType?: 'chromium' | 'firefox' | 'webkit';
  
  // Modo de exibição
  headless?: boolean;
  
  // Extensão (caminho para a extensão descompactada)
  extensionPath?: any;

  userDataDir?: string;
  
  // Download
  acceptDownloads?: boolean;
  downloadPath?: string;
  
  // Viewport
  viewport?: {
    width: number;
    height: number;
  } | null;
  
  // User Agent
  userAgent?: string;
  
  // Geolocalização
  geolocation?: {
    latitude: number;
    longitude: number;
  };
  permissions?: string[];
  
  // Timeout
  timeout?: number;
  
  // Proxy
  proxy?: {
    server: string;
    username?: string;
    password?: string;
  };
  
  // Ignorar erros HTTPS
  ignoreHTTPSErrors?: boolean;
  
  // Locale e timezone
  locale?: string;
  timezoneId?: string;
  
  // Cookies e storage state
  storageState?: string | {
    cookies: any[];
    origins: any[];
  };
  
  // Args extras do navegador
  args?: string[];
  
  // Devtools
  devtools?: boolean;
  
  // Slow motion (para debug)
  slowMo?: number;
}

export async function createContext(options: CreateContextOptions = {}): Promise<{ browser: Browser; context: BrowserContext }> {
  const {
    browserType = 'chromium',
    headless = true,
    extensionPath,
    userDataDir,
    acceptDownloads = false,
    downloadPath = './downloads',
    viewport = { width: 1366, height: 768 },
    userAgent,
    geolocation,
    permissions,
    timeout = 30000,
    proxy,
    ignoreHTTPSErrors = false,
    locale = 'pt-BR',
    timezoneId = 'America/Sao_Paulo',
    storageState,
    args = [],
    devtools = false,
    slowMo = 0,
  } = options;

  // Seleciona o tipo de navegador
  const browserEngine = browserType === 'firefox' 
    ? firefox 
    : browserType === 'webkit' 
    ? webkit 
    : chromium;

  // Configurações de launch do navegador
  const launchOptions: any = {
    headless: extensionPath ? false : headless, // Extensões requerem headful
    devtools,
    slowMo,
    args: [...args],
  };

  // Adiciona extensão se fornecida (apenas Chromium)
  if (extensionPath && userDataDir && browserType === 'chromium') {
    launchOptions.args.push(
      `--disable-extensions-except=${extensionPath}`,
      `--load-extension=${extensionPath}`
    );
  }

  // Adiciona proxy se fornecido
  if (proxy) {
    launchOptions.proxy = proxy;
  }

  // Lança o navegador
  const browser = await browserEngine.launch(launchOptions);

  // Configurações do contexto
  const contextOptions: any = {
    viewport,
    userAgent,
    locale,
    timezoneId,
    ignoreHTTPSErrors,
    acceptDownloads,
  };

  // Configura download path
  if (acceptDownloads && downloadPath) {
    contextOptions.downloadsPath = path.resolve(downloadPath);
  }

  // Adiciona geolocalização e permissões
  if (geolocation) {
    contextOptions.geolocation = geolocation;
  }
  if (permissions) {
    contextOptions.permissions = permissions;
  }

  // Adiciona storage state (cookies, localStorage, etc)
  if (storageState) {
    contextOptions.storageState = storageState;
  }

  // Cria o contexto
  let context;
  if (extensionPath && userDataDir) {
    context = await chromium.launchPersistentContext(userDataDir, contextOptions);
  } else {
    context = await browser.newContext(contextOptions);
  }


  // Define timeout padrão
  context.setDefaultTimeout(timeout);
  context.setDefaultNavigationTimeout(timeout);

  return { browser, context };
}

// Função auxiliar para fechar tudo
export async function closeContext(browser: Browser, context: BrowserContext): Promise<void> {
  await context.close();
  await browser.close();
}