import { chromium } from '@playwright/test';
import { auth2FA, loginComPresto, loginComSenha, pesquisarProcesso } from './login.js';
import { envs } from './config.js';
import { loginPresto } from './servicos/presto.js';
import fs from 'node:fs';

async function run() {
    // const browser = await chromium.launch({ headless: false });
    // const context = await browser.newContext({ viewport: { width: 1366, height: 768 }});
    // const page = await context.newPage();
    
    // await loginComSenha(page, {
        //     loginURL: 'https://esaj.tjsp.jus.br/sajcas/login',
        //     userSelector: '#usernameForm',
    //     passSelector: '#passwordForm',
    //     submitSelector: '#pbEntrar',
    // username: process.env.ESAJ_USUARIO_1 as string,
    // password: process.env.ESAJ_SENHA_1 as string,
    //     posLoginSelector: 'body > div.flex.h-screen.flex-col.overflow-hidden.bg-neutral-lighter > header > div.flex.h-fit > div > div.select-none > button > div > p'        
    // })

    // login presto
    const userDataDir = './.temp/user-data'
    const extensionPath = 'C:/Users/gcastro/AppData/Local/Google/Chrome/User Data/Default/Extensions/ajgkdaibodfheidcpeifpdhaopjbpneo/0.70.0_0';
    fs.mkdirSync(userDataDir, { recursive: true });
    
    const context = await chromium.launchPersistentContext(userDataDir, {
        headless: false,
        channel: 'chromium', // ou 'chromium'
        args: [
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`,
        ],
    });
    const page = await context.newPage();

    await loginPresto(page, {
        username: envs.prestoUsuario1,
        password: envs.prestoSenha1,
    })

    await page.goto('https://eproc1g.tjrs.jus.br/eproc/externo_controlador.php?acao=principal', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(10000);
    
    // await loginComSenha(page, {
    //     loginURL: 'https://eproc1g.tjrs.jus.br/eproc/externo_controlador.php?acao=principal',
    //     userSelector: '#username',
    //     passSelector: '#password',
    //     submitSelector: '#kc-login',
    //     username: process.env.EPROC_USUARIO_1 as string,
    //     password: process.env.EPROC_SENHA_1 as string,
    //     toptpSelector: '#otp',
    // });

    // await auth2FA(page, {
    //     auth2FASelector: '#otp',
    //     submitSelector: '#kc-login',
    //     pos2FASelector: '#divInfraBarraLocalizacao > div > h1'
    // });

    await loginComPresto('https://eproc1g.tjrs.jus.br/eproc/externo_controlador.php?acao=principal');
    // console.log("Logado com sucesso");

    // await pesquisarProcesso(page);

    // const orgaoJulgadorElement = page.locator('#txtOrgaoJulgador')
    // const orgaoJulgadorText = await orgaoJulgadorElement.textContent();
    // console.log(`Orgao Julgador: ${orgaoJulgadorText}`);


    // await page.waitForTimeout(2000);
    // await browser.close();
}

run();