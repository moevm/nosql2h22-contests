import * as process from 'process';
import {
    Contest,
    ContestSchema,
    FORMAT,
    Requirements,
} from '../libs/domain/src/entities/contest.schema';
import * as moment from 'moment';
import { v4 as uuid } from 'uuid';
import { faker } from '@faker-js/faker';
import mongoose, { Model } from 'mongoose';
import { Link } from '../libs/nlp-parsing/src/nlp-parsing.service';

faker.setLocale('ru');
moment.locale('ru');

const TITLES: string[] = [
    'Конкурс лучших инновационных проектов в сфере науки и высшего профессионального образования Санкт-Петербурга',
    'Конкурсный отбор на предоставление в 2012 году субсидий хозяйственным обществам, имеющим место нахождения в Санкт-Петербурге, создаваемым высшими учебными заведениями, бюджетными научными учреждениями и академическими институтами',
    'Конкурс на соискание премий Правительства Санкт-Петербурга за выполнение дипломных проектов по заданию исполнительных органов государственной власти Санкт-Петербурга',
    'Конкурс на соискание премий Правительства Санкт-Петербурга и Санкт-Петербургского научного центра РАН за выдающиеся научные результаты в области науки и техники',
    'Конкурсный отбор претендентов для заселения на свободные места в общежитие ГБОУ СПО«Автотранспортный и электромеханический колледж»',
    'Конкурс на замещение вакантной должности государственной гражданской службы Санкт-Петербурга в Комитете по науке и высшей школе',
    'Конкурс на предоставление субсидий хозяйственным обществам, создаваемым вузами, бюджетными научными учреждениями и академическими институтами',
    'Конкурс «Поддержка научного и инженерного творчества школьников старших классов Санкт-Петербурга»',
    'Мониторинг тенденции развития науки в Санкт-Петербурге',
    'Конкурс «Студент года» в системе среднего профессионального образования',
];

const REPORTINGS: string[] = [
    'Форма заявки на участие в конкурсе для юридического лица',
    'Форма заявки на участие в конкурсе для физического лица',
    'Согласие на обработку персональных данных',
    'Заявление на участие в конкурсном отборе, заверенное печатью организации',
    'Выписка из Единого государственного реестра юридических лиц или нотариально заверенная копия такой выписки',
    'сопроводительное письмо от образовательной организации',
    'копии дипломов, сертификатов (распечатка с официального портала Российского совета олимпиад школьников)',
];

const ACADEMIC_DEGREES: string[] = [
    'Школьники',
    'Студенты',
    'Магистранты',
    'Аспиранты',
];

const PRIZES: string[] = [
    'Гранты',
    'Стипендии',
    'Денежный приз',
    'Грамоты',
    'Медаль',
];

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function getRandomElem(arr) {
    return arr[getRandomInt(0, arr.length)];
}

(async () => {
    await mongoose.connect(
        process.env.MONGODB_URL || 'mongodb://root:root@localhost:27017/',
    );
    const contestModel: Model<Contest> = mongoose.model(
        'Contests',
        ContestSchema,
    );
    const count = process.env.TEST_DATA_COUNT || 10;

    for (let i = 0; i < count; i++) {
        const dateFrom: Date = faker.date.between(
            moment.utc('01.01.2022', 'DD.MM.YYYY').toDate(),
            moment.utc('31.12.2022', 'DD.MM.YYYY').toDate(),
        );
        const dateTo: Date = faker.date.between(
            dateFrom,
            moment.utc(dateFrom).add(getRandomInt(0, 30), 'days').toDate(),
        );

        const prize = [];
        for (let i = 0; i < getRandomInt(1, 3); i++)
            prize.push(getRandomElem(PRIZES));

        const reporting = [];
        for (let i = 0; i < getRandomInt(1, 4); i++)
            reporting.push(getRandomElem(REPORTINGS));

        const links: Link[] = [];
        for (let i = 0; i < getRandomInt(1, 3); i++)
            links.push({ text: 'Файл', link: faker.image.cats() });

        const requirements: Requirements[] = [];
        for (let i = 0; i < getRandomInt(1, 3); i++) {
            const ageMax = getRandomInt(7, 31);
            const ageMin = getRandomInt(7, ageMax);
            const citizenship = [];
            for (let i = 0; i < getRandomInt(1, 4); i++)
                citizenship.push(faker.address.country());
            const academicDegree = [];
            for (let i = 0; i < getRandomInt(1, 3); i++)
                academicDegree.push(getRandomElem(ACADEMIC_DEGREES));
            requirements.push({
                ageMax,
                ageMin,
                academicDegree,
                citizenship,
            });
        }

        const contest = new Contest({
            link: `test-${uuid()}`,
            name: getRandomElem(TITLES),
            dateTo,
            dateFrom,
            prize,
            reporting,
            format: getRandomInt(0, 2) ? FORMAT.ONLINE : FORMAT.OFFLINE,
            requirements,
            city: faker.address.city(),
            links,
        });
        await contestModel.collection.insertOne(contest);
    }
    process.exit();
})();
