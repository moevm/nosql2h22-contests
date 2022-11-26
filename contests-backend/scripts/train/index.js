const natural = require('natural');
const axios = require('axios');
const puppeteer = require('puppeteer');
const PorterStemmerRu = require('./node_modules/natural/lib/natural/stemmers/porter_stemmer_ru');
const fs = require('fs');

const train = async () => {
    const tokenizer = new natural.SentenceTokenizer();

    const docs = tokenizer.tokenize(
        fs.readFileSync('./data/docs.txt').toString().split('\n').join(' '),
    );
    const contacts = tokenizer.tokenize(
        fs.readFileSync('./data/contacts.txt').toString().split('\n').join(' '),
    );
    const participants = tokenizer.tokenize(
        fs
            .readFileSync('./data/participants.txt')
            .toString()
            .split('\n')
            .join(' '),
    );

    const format = tokenizer.tokenize(
        fs.readFileSync('./data/format.txt').toString().split('\n').join(' '),
    );

    const prize = tokenizer.tokenize(
        fs.readFileSync('./data/prize.txt').toString().split('\n').join(' '),
    );
    const purpose = tokenizer.tokenize(
        fs.readFileSync('./data/purpose.txt').toString().split('\n').join(' '),
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
        //...time.map(time => ({token: time, type: 'time'}))
    ];

    const classifier = new natural.BayesClassifier(PorterStemmerRu);
    for (const token of classifiedTokens) {
        classifier.addDocument(token.token, token.type);
    }
    classifier.train();
    classifier.save('model.json');
    return classifier;
};

(async () => {
    await train();
})();
