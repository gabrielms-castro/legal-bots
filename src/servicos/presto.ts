import { Page } from '@playwright/test';

export type PrestoLoginOptions = {
    loginURL?:string,
    userSelector?: string,
    passSelector?: string,
    firstSubmitSelector?: string,
    secondSubmitSelector?: string,
    username: string,
    password: string,
    postLoginSelector?: string,
}

export async function loginPresto(page: Page, opts: PrestoLoginOptions) {
    const { 
        loginURL='https://console.presto.oystr.com.br/', 
        userSelector='input[type=text]', 
        passSelector='input[type=password]', 
        firstSubmitSelector='//button[text()="Acessar"]', 
        secondSubmitSelector='//button[text()="Login"]',
        username, 
        password, 
        postLoginSelector='button[title=Sair]'
    } = opts;

    await page.goto(loginURL, { waitUntil: 'domcontentloaded' });

    if (await page.isVisible(postLoginSelector)) return;

    await page.fill(userSelector, username);
    await page.click(firstSubmitSelector);
    
    await page.fill(passSelector, password);
    await page.click(secondSubmitSelector);

    await page.waitForSelector(postLoginSelector, { timeout: 20000 });
}