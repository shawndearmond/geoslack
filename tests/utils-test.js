"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const test = require("tape");
function trim(s) {
    return s.replace(/[\s]/g, '');
}
test('fetchAsync', async (t) => {
    t.plan(1);
    const options = {
        method: 'GET',
        host: 'raw.githubusercontent.com',
        path: '/styfle/geoslack/master/app.json'
    };
    try {
        const json = await utils_1.fetchAsync(options);
        const actual = JSON.parse(json);
        const expected = require('../app.json');
        t.equal(Object.keys(actual).length, Object.keys(expected).length);
    }
    catch (e) {
        t.fail(e.message);
    }
});
test('getExpiredUsers', t => {
    t.plan(1);
    const userToPerson = {
        'Amy': { user: 'Amy', date_started: new Date('2017-10-31T20:30:00.000Z') },
        'Bob': { user: 'Bob', date_started: new Date('2017-10-31T20:20:00.000Z') },
        'Chi': { user: 'Chi', date_started: new Date('2017-10-31T20:10:00.000Z') },
        'Dye': { user: 'Dye', date_started: new Date('2017-10-31T20:00:00.000Z') },
    };
    const now = new Date('2017-10-31T20:30:00.000Z');
    const actual = utils_1.getExpiredUsers(userToPerson, now);
    t.equal(actual.length, 2);
});
