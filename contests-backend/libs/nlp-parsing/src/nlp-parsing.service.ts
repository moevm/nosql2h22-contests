import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { BayesClassifier, SentenceTokenizer } from 'natural';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const model = require('./model.json');

export enum TOKEN_TYPE {
    DOCUMENTS = 'documents',
    CONTACTS = 'contacts',
    PARTICIPANTS = 'participants',
    PRIZES = 'prizes',
    FORMAT = 'format',
    PURPOSES = 'purposes',
    TIME = 'time',
}

export interface ParsedContent {
    documents?: string;
    contacts?: string;
    participants?: string;
    prizes?: string;
    format?: string;
    purposes?: string;
    time?: string;
}

export interface Token {
    token: string;
    type: TOKEN_TYPE;
}

export interface ClassifiedToken extends Token {
    value: number;
}

export type ParsedPage = {
    name: string;
    time: string;
    content: string[];
    links: Link[];
};

export type Link = {
    text: string;
    link: string;
};

@Injectable()
export class NlpParsingService {
    async parseHTML(contestLink: string): Promise<any> {
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        await page.goto(contestLink);
        const time: string = await page.$eval(
            '.competition_detail > .short > .type  > span',
            (e) => e.innerHTML,
        );
        const content = await page.$$eval(
            '#content > .competition_detail > .desc > *:not(.title)',
            (options) =>
                options.map((option) => ({
                    highlighted: Array.from(
                        option.getElementsByTagName('strong'),
                    ).map((x) => x.textContent),
                    text: option.textContent,
                })),
        );
        const links: Link[] = await page.$$eval(
            '#content > .competition_detail > .short > .docs > p > a',
            (options) =>
                options.map((option) => ({
                    link: option.href,
                    text: option.textContent,
                })),
        );
        const name: string = await page.$eval(
            '#content > .competition_detail > .desc > .title',
            (e) => e.textContent,
        );
        await browser.close();
        return {
            content,
            time,
            links,
            name,
        };
    }

    async parseContent(content: any): Promise<ParsedContent> {
        const classifier = new BayesClassifier.restore(model);
        const result = {};
        for (let i = 0; i < content.length; i++) {
            if (content[i].text.match(/.*:.*/)) {
                let str = content[i].text.split(/[\s\t\n]+/).join(' ');
                while (!str.match(/.+\.[\s\n\t]*$/) && i < content.length - 1) {
                    str +=
                        content[++i].text.split(/[\s\t\n]+/).join(' ') + '\n';
                }
                const classified: ClassifiedToken = this.classify(
                    str,
                    classifier,
                );
                if (classified.value > 0.01) {
                    if (result[classified.type])
                        result[classified.type] += str + '\n';
                    else result[classified.type] = str + '\n';
                }
            }
        }
        // console.log(result);
        return result;
    }

    classify(text: string, classifier: BayesClassifier): ClassifiedToken {
        const classified = classifier.getClassifications(text);
        return {
            token: text,
            type: classified[0].label,
            value: classified[0].value,
        };
    }

    // tokenizeData(path: string): string[] {
    //     const tokenizer = new SentenceTokenizer();
    //     return tokenizer.tokenize(
    //         fs.readFileSync(path).toString().split('\n').join(' '),
    //     );
    // }

    // async train(): Promise<BayesClassifier> {
    //     const docs: string[] = this.tokenizeData('./data/docs.txt');
    //     const contacts: string[] = this.tokenizeData('./data/contacts.txt');
    //     const participants: string[] = this.tokenizeData(
    //         './data/participants.txt',
    //     );
    //     const format: string[] = this.tokenizeData('./data/format.txt');
    //     const prize: string[] = this.tokenizeData('./data/prize.txt');
    //     const purpose: string[] = this.tokenizeData('./data/purpose.txt');
    //     const classifiedTokens = [
    //         ...docs.map((doc) => ({ token: doc, type: 'doc' })),
    //         ...contacts.map((contact) => ({ token: contact, type: 'contact' })),
    //         ...participants.map((participant) => ({
    //             token: participant,
    //             type: 'participant',
    //         })),
    //         ...prize.map((prize) => ({ token: prize, type: 'prize' })),
    //         ...format.map((format) => ({ token: format, type: 'format' })),
    //         ...purpose.map((purpose) => ({ token: purpose, type: 'purpose' })),
    //     ];
    //     const classifier = new BayesClassifier(PorterStemmerRu);
    //     for (const token of classifiedTokens)
    //         classifier.addDocument(token.token, token.type);
    //     await classifier.train();
    //     classifier.save('model.json');
    //     return classifier;
    // }
}
