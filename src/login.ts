import { Page } from '@playwright/test';
import dotenv from 'dotenv'
dotenv.config();

type LoginOptions = {
    loginURL:string,
    userSelector: string,
    passSelector: string,
    submitSelector: string,
    username: string,
    password: string,
    toptpSelector: string,
}

type _2FAOptions = {
    auth2FASelector: string,
    submitSelector: string,
    pos2FASelector: string,
}


export async function loginComSenha(page: Page, opts: LoginOptions) {
    const { loginURL, userSelector, passSelector, submitSelector, username, password, toptpSelector } = opts;
    await page.goto(loginURL, { waitUntil: 'domcontentloaded'});
    await page.fill(userSelector, username);
    await page.fill(passSelector, password);
    await page.click(submitSelector);
    await page.waitForSelector(toptpSelector, { timeout: 20000 });
}

export async function auth2FA(page: Page, opts: _2FAOptions) {
    const { auth2FASelector, submitSelector, pos2FASelector } = opts;
    const TOTPCode = await fectchTOTPCode('EPROC RS');
    await page.fill(auth2FASelector, TOTPCode['totp_code']);
    await page.click(submitSelector);
    await page.waitForSelector(pos2FASelector, { timeout: 20000 });
}

async function fectchTOTPCode(nomeSistema: string) {
    const response = await fetch(`${process.env.TOTP_API_ENDPOINT}`, {
        method: 'POST',
        headers: {
            'Authorization' : `Bearer ${process.env.TOTP_API_KEY}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'            
        },
        body: JSON.stringify({ "nome_servico": nomeSistema })
    });
    const data = await response.json();
    return data;
}
