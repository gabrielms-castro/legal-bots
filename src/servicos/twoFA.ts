import { Page } from '@playwright/test';
import { envs } from '../config.js';

type _2FAOptions = {
    system: string
    auth2FASelector: string,
    submitSelector: string,
    pos2FASelector: string,
}

export async function auth2FA(page: Page, opts: _2FAOptions) {
    const { system, auth2FASelector, submitSelector, pos2FASelector } = opts;
    const TOTPCode = await fectchTOTPCode(system);
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
