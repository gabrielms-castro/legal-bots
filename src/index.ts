import { extensionsDir, userDataDir } from './config.js';
import { loadExtension } from './servicos/extensoes.js';
import { Eproc } from './sistemas/eproc.js';

async function run() {
    if (process.argv.length < 3) {
        console.log('Nenhum argumento foi passado.');
        console.log('Exemplo de uso: <sistema>')
        process.exit(1)
    }
    const args = process.argv.slice(2);
    const sistema = args[0]

    const eproc = new Eproc(
        {
            headless: false,
            extensionPath: await loadExtension('presto', extensionsDir),
            browserType: 'chromium',
            userDataDir: userDataDir
        },
        sistema
    );

    await eproc.init();
    await eproc.login();
}

run();