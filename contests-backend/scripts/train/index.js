const natural = require('natural');
const axios = require('axios');
const puppeteer = require('puppeteer');
const PorterStemmerRu = require('./node_modules/natural/lib/natural/stemmers/porter_stemmer_ru');
const fs = require('fs');

const train = async () => {
    const tokenizer = new natural.SentenceTokenizer();

    const docs = fs.readFileSync('./data/docs.txt').toString().split('\n');
    console.log(docs)
    const contacts = fs
        .readFileSync('./data/contacts.txt')
        .toString()
        .split('\n');
    const participants = fs
        .readFileSync('./data/participants.txt')
        .toString()
        .split('\n');

    const format = fs.readFileSync('./data/format.txt').toString().split('\n');

    //const time = fs.readFileSync('./data/time.txt').toString().split('\n');
    const prize = fs.readFileSync('./data/prize.txt').toString().split('\n');
    const purpose = fs
        .readFileSync('./data/purpose.txt')
        .toString()
        .split('\n');
    const classifiedTokens = [
        ...docs.map((doc) => ({ token: doc, type: 'documents' })),
        ...contacts.map((contact) => ({ token: contact, type: 'contacts' })),
        ...participants.map((participant) => ({
            token: participant,
            type: 'participants',
        })),
        ...prize.map((prize) => ({ token: prize, type: 'prizes' })),
        ...format.map((format) => ({ token: format, type: 'format' })),
        ...purpose.map((purpose) => ({ token: purpose, type: 'purposes' })),
        //...time.map((time) => ({ token: time, type: 'time' })),
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
