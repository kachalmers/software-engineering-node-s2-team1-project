const GENERATIONS = [
    {name: 'LOST', from: 1883, to: 1900},
    {name: 'GREATEST', from: 1901, to: 1927},
    {name: 'SILENT', from: 1928, to: 1945},
    {name: 'BOOMER', from: 1946, to: 1964},
    {name: 'X', from: 1965, to: 1980},
    {name: 'MILLENIAL', from: 1981, to: 1996},
    {name: 'Z', from: 1997, to: 2012},
    {name: 'ALPHA', from: 2013, to: 2023}
];

export const generation = (yob: number) => {
    const generation = GENERATIONS.find(generation => {
        if(yob >= generation.from && yob <= generation.to) {
            return true
        } else {
            return false
        }
    });
    if (generation) {
        return generation.name
    } else {
        return 'UNKNOWN'
    }
}