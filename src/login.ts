import { chromium } from 'playwright'
import { Page } from '@playwright/test';
import { envs } from './config.js';
import fs from 'node:fs'

export type LoginOptions = {
    loginURL:string,
    userSelector: string,
    passSelector: string,
    submitSelector: string,
    username: string,
    password: string,
    toptpSelector?: string,
    postLoginSelector?: string,
}

type _2FAOptions = {
    auth2FASelector: string,
    submitSelector: string,
    pos2FASelector: string,
}

export async function loginComSenha(page: Page, opts: LoginOptions) {
    const { 
        loginURL, 
        userSelector, 
        passSelector, 
        submitSelector, 
        username, 
        password, 
        toptpSelector 
    } = opts;

    await page.goto(loginURL, { waitUntil: 'domcontentloaded' });
    await page.fill(userSelector, username);
    await page.fill(passSelector, password);
    await page.click(submitSelector);

    if (toptpSelector) await page.waitForSelector(toptpSelector, { timeout: 20000 });
}

export async function auth2FA(page: Page, opts: _2FAOptions) {
    const { auth2FASelector, submitSelector, pos2FASelector } = opts;
    const TOTPCode = await fectchTOTPCode('EPROC RS');
    await page.fill(auth2FASelector, TOTPCode['totp_code']);
    await page.click(submitSelector);
    await page.waitForSelector(pos2FASelector, { timeout: 20000 });
}

async function fectchTOTPCode(nomeSistema: string) {
    const response = await fetch(envs.totpApiEndpoint, {
        method: 'POST',
        headers: {
            'Authorization' : `Bearer ${envs.totpApiKey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'            
        },
        body: JSON.stringify({ "nome_servico": nomeSistema })
    });
    const data = await response.json();
    return data;
}

export async function pesquisarProcesso(page: Page, numeroProcesso: string) {
    await page.fill('#txtNumProcessoPesquisaRapida[type=search]', numeroProcesso);
    await page.keyboard.press('Enter');
    await page.waitForSelector('#divInfraBarraLocalizacao > div > h1')
}

export async function loginComPresto(url: string) {
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
    const page = await context.newPage()
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(10000);
    await context.close();
}