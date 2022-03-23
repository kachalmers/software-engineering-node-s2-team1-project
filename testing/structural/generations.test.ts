import {generation} from "./generations";
// test('Someone born in 1883 is from the LOST generation', () => {
//     expect(generation(1883)).toBe('LOST');
// });
// test('Someone born before 1883 is unknown generation', () => {
//     expect(generation(1880)).toBe('UNKNOWN');
// });

const TESTS = [
    {yob: 1800, expected: 'UNKNOWN'},
    {yob: 1883, expected: 'LOST'},    {yob: 1885, expected: 'LOST'},
    {yob: 1900, expected: 'LOST'},
    {yob: 1901, expected: 'GREATEST'},{yob: 1911, expected: 'GREATEST'},
    {yob: 1927, expected: 'GREATEST'},
    {yob: 1928, expected: 'SILENT'},  {yob: 1934, expected: 'SILENT'},
    {yob: 1945, expected: 'SILENT'},
    {yob: 1946, expected: 'BOOMER'},  {yob: 1950, expected: 'BOOMER'},
    {yob: 1964, expected: 'BOOMER'},
    {yob: 1965, expected: 'X'},       {yob: 1970, expected: 'X'},
    {yob: 1980, expected: 'X'},
    {yob: 1981, expected: 'MILLENIAL'},{yob: 1985, expected: 'MILLENIAL'},
    {yob: 1996, expected: 'MILLENIAL'},
    {yob: 1997, expected: 'Z'},       {yob: 2000, expected: 'Z'},
    {yob: 2012, expected: 'Z'},
    {yob: 2013, expected: 'ALPHA'},   {yob: 2020, expected: 'ALPHA'},
    {yob: 2023, expected: 'ALPHA'},
];

describe('correct generation from yob', () => {
    TESTS.forEach(t => {
        const testName = `born in ${t.yob} generation ${t.expected}`;
        test(testName, () => {
            const gen = generation(t.yob);
            expect(gen).toBe(t.expected);
        });
    });
});