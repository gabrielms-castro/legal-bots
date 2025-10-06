import { chromium } from '@playwright/test';
import { auth2FA, loginComSenha } from './login.js';

async function run() {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({ viewport: { width: 1366, height: 768 }});
    const page = await context.newPage();

    // await loginComSenha(page, {
    //     loginURL: 'https://esaj.tjsp.jus.br/sajcas/login',
    //     userSelector: '#usernameForm',
    //     passSelector: '#passwordForm',
    //     submitSelector: '#pbEntrar',
    // username: process.env.ESAJ_USUARIO_1 as string,
    // password: process.env.ESAJ_SENHA_1 as string,
    //     posLoginSelector: 'body > div.flex.h-screen.flex-col.overflow-hidden.bg-neutral-lighter > header > div.flex.h-fit > div > div.select-none > button > div > p'        
    // })
    
    await loginComSenha(page, {
        loginURL: 'https://eproc1g.tjrs.jus.br/eproc/externo_controlador.php?acao=principal',
        userSelector: '#username',
        passSelector: '#password',
        submitSelector: '#kc-login',
        username: process.env.EPROC_USUARIO_1 as string,
        password: process.env.EPROC_SENHA_1 as string,
        toptpSelector: '#otp',
    });

    await auth2FA(page, {
        auth2FASelector: '#otp',
        submitSelector: '#kc-login',
        pos2FASelector: '#divInfraBarraLocalizacao > div > h1'
    });

    console.log("Logado com sucesso");

    await page.waitForTimeout(2000);
    await browser.close();
}

run();