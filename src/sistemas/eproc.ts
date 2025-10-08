import fs from 'fs'
import { chromium } from 'playwright'
import { closeContext, createContext, CreateContextOptions } from '../servicos/playwright.js';
import type { Browser, BrowserContext, Page } from 'playwright';
import { loadSystemCredentials } from '../config.js';
import { LoginOptions } from './types.js';
import { auth2FA } from '../servicos/twoFA.js';

enum EprocURLs {
    TJ_SP = 'https://eproc1g.tjsp.jus.br/eproc/index.php',
    TJ_SC = 'https://eproc1g.tjsc.jus.br/eproc/index.php',
    TJ_RS = 'https://eproc1g.tjrs.jus.br/eproc/externo_controlador.php?acao=principal',
    TRF04 = 'https://eproc.trf4.jus.br',
    TRF04_RS = 'https://eproc.jfrs.jus.br/eprocV2/',
    TRF04_SC = 'https://eproc.jfsc.jus.br/',
    TRF04_PR = 'https://eproc.jfpr.jus.br/eprocV2/',
}

export class Eproc {
    private browser!: Browser;
    private context!: BrowserContext;
    private eprocCredentials = loadSystemCredentials('eproc');
    private systemURL!: string;
    private systemOTP!: string;

    page!: Page;
    system: string;
    
    constructor(private options: CreateContextOptions, system: string) {
        this.system = system
        const sys = this.getSystem();
        this.systemURL = sys.url;
        this.systemOTP = sys.otpServiceName
    }

    getContext(): BrowserContext {
        return this.context;
    } 

    private getSystem() {
        switch (this.system) {
            case 'TJ_SP': return { url: EprocURLs.TJ_SP, otpServiceName: 'EPROC SP' };
            case 'TJ_SC': return { url:EprocURLs.TJ_SC, otpServiceName: 'EPROC SC' }
            case 'TJ_RS': return { url: EprocURLs.TJ_RS, otpServiceName: 'EPROC RS' }
            case 'TRF04': return { url: EprocURLs.TRF04, otpServiceName: 'EPROC TRF04' }
            case 'TRF04_RS': return { url: EprocURLs.TRF04_RS, otpServiceName: 'EPROC TRF04 RS' }
            case 'TRF04_SC': return { url: EprocURLs.TRF04_SC, otpServiceName: 'EPROC TRF04 SC' }
            case 'TRF04_PR': return { url: EprocURLs.TRF04_PR, otpServiceName: 'EPROC TRF04 SP' }
            default: throw new Error('Sistema desconhecido')
        }
    }

    async init(): Promise<void> {
        const { browser, context }= await createContext(this.options)
        this.browser = browser;
        this.context = context;
        this.page = await this.newPage();
    }


    async newPage(): Promise<Page> {
        return this.context.newPage();
    }

    async close(): Promise<void> {
        await closeContext(this.browser, this.context)
    }

    async login(opts: LoginOptions = {}): Promise<void> {
        const { 
            loginURL = this.systemURL,
            userSelector = '#username',
            passSelector = '#password',
            submitSelector = '#kc-login',
            username = this.eprocCredentials[0].username,
            password = this.eprocCredentials[0].password,
            otpSelector = '#otp',
        } = opts;

        await this.page.goto(loginURL, { waitUntil: 'domcontentloaded' });
        await this.page.fill(userSelector, username);
        await this.page.fill(passSelector, password);
        await this.page.click(submitSelector);

        if (otpSelector) {
            try {
                await this.page.waitForSelector(otpSelector, { timeout: 20000 });
                await auth2FA(this.page, {
                    system: this.systemOTP,
                    auth2FASelector: otpSelector,
                    submitSelector: submitSelector,
                    pos2FASelector: '#divInfraBarraLocalizacao > div > h1'
                }); 
            } catch (error) {
                console.log(error)
            }
        }     
    }

    async loginComPresto() {

    }

    async pesquisarProcesso(numeroProcesso: string) {
        await this.page.fill('#txtNumProcessoPesquisaRapida[type=search]', numeroProcesso);
        await this.page.keyboard.press('Enter');
        await this.page.waitForSelector('#divInfraBarraLocalizacao > div > h1')
    }    

}

export async function loginComPresto(url: string) {
    const userDataDir = './.temp/user-data'
    const extensionPath = 'C:/Users/gcastro/AppData/Local/Google/Chrome/User Data/Default/Extensions/ajgkdaibodfheidcpeifpdhaopjbpneo/0.70.0_0';
    fs.mkdirSync(userDataDir, { recursive: true });

    const context = await chromium.launchPersistentContext(userDataDir, {
        headless: false,
        channel: 'chromium',
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