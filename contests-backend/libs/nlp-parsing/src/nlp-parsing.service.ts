import { Injectable } from '@nestjs/common';
import fs from 'fs';
import natural from 'natural';
import axios from 'axios';
import puppeteer from 'puppeteer';
import PorterStemmerRu from '../../../node_modules/natural/lib/natural/stemmers/porter_stemmer_ru';
import { BayesClassifier, SentenceTokenizer } from 'natural';

export enum TOKEN_TYPE {
    DOCUMENTS = 'documents',
    CONTACTS = 'contacts',
    PARTICIPANTS = 'participants',
    PRIZES = 'prizes',
    FORMAT = 'format',
    PURPOSES = 'purposes',
}

export type ClassifiedToken = {
    token: string;
    type: TOKEN_TYPE;
    value: number;
};

@Injectable()
export class NlpParsingService {
    async parseHTML(contestLink: string): Promise<any> {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        await page.goto('http://knvsh.gov.spb.ru/contests/view/356/');
        const pageHtml = await page.evaluate(
            () => document.documentElement.outerHTML,
        );
        const deadline = await page.$eval(
            '.competition_detail > .short > .type  > span',
            (e) => e.innerHTML,
        );
        const desc = await page.$$eval(
            '#content > .competition_detail > .desc > *',
            (options) => options.map((option) => option.textContent),
        );
        await browser.close();
        const classifier =
            fs.existsSync('model.json') && !process.env.RETRAIN
                ? natural.BayesClassifier.restore(
                      JSON.parse(fs.readFileSync('model.json').toString()),
                  )
                : await this.train();
        const text = desc
            .map((x) => x.split(/\s+/).join(' '))
            .filter((x) => x !== ' ');
        const result = {};
        for (let i = 0; i < text.length; i++) {
            const classified: ClassifiedToken = this.classify(
                text[i],
                classifier,
            );
            if (classified.value > 0.01 && text[i].match(/.*:.*/)) {
                let str = text[i];
                while (!str.match(/.+\.\s*$/) && i < text.length - 1) {
                    str += text[++i] + '\n';
                }
                if (result[classified.type])
                    result[classified.type] += str + '\n';
                else result[classified.type] = str;
            }
        }
        return result;
    }

    async train(): Promise<BayesClassifier> {
        const tokenizer = new SentenceTokenizer();

        const docs = tokenizer.tokenize(
            fs.readFileSync('./data/docs.txt').toString().split('\n').join(' '),
        );
        const contacts = tokenizer.tokenize(
            fs
                .readFileSync('./data/contacts.txt')
                .toString()
                .split('\n')
                .join(' '),
        );
        const participants = tokenizer.tokenize(
            fs
                .readFileSync('./data/participants.txt')
                .toString()
                .split('\n')
                .join(' '),
        );
        const format = tokenizer.tokenize(
            fs
                .readFileSync('./data/format.txt')
                .toString()
                .split('\n')
                .join(' '),
        );
        const prize = tokenizer.tokenize(
            fs
                .readFileSync('./data/prize.txt')
                .toString()
                .split('\n')
                .join(' '),
        );
        const purpose = tokenizer.tokenize(
            fs
                .readFileSync('./data/purpose.txt')
                .toString()
                .split('\n')
                .join(' '),
        );
        const classifiedTokens = [
            ...docs.map((doc) => ({ token: doc, type: 'doc' })),
            ...contacts.map((contact) => ({ token: contact, type: 'contact' })),
            ...participants.map((participant) => ({
                token: participant,
                type: 'participant',
            })),
            ...prize.map((prize) => ({ token: prize, type: 'prize' })),
            ...format.map((format) => ({ token: format, type: 'format' })),
            ...purpose.map((purpose) => ({ token: purpose, type: 'purpose' })),
        ];
        const classifier = new BayesClassifier(PorterStemmerRu);
        for (const token of classifiedTokens)
            classifier.addDocument(token.token, token.type);
        await classifier.train();
        classifier.save('model.json');
        return classifier;
    }

    classify(text: string, classifier: BayesClassifier): ClassifiedToken {
        const classified = classifier.getClassifications(text)[0];
        return { token: text, type: classified.label, value: classified.value };
    }
}
