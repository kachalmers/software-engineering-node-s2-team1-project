/**
 * @file test for tuit2tag functionality
 */
import tuit2TagDao from "../daos/Tuit2TagDao";
import Tuit2TagController from "../controllers/Tuit2TagController";

const t2tDao = tuit2TagDao.getInstance();

//TODO: add beforeEach and afterEach for all tests

describe ('new t2t created successfully', () => {
    test('createT2T', () => {
        return t2tDao.createTuit2Tag('123', '456')
        .then(t2t => {
            expect(t2t.tuit).toBe('123')
            expect(t2t.tag).toBe('456')
        })
    })
});

describe ('can find all t2ts', () => {
    test('findAllT2Ts', () => {
        /*
        const T2T_COUNT = ??
        return t2tDao.findAllTuit2Tags()
            .then(t2ts => expect(t2ts.length)
            .toBeGreaterThanOrEqual(T2T_COUNT));
        */
    })
});

describe ('can find t2ts by tuit', () => {
    test('findT2TsByTuit', () => {
        /*
        return t2tDao.createTuit2Tag('123', '456')
            .then(newT2T => t2tDao.findTuit2TagByTuit(newT2T._id))
            .then(T2T => expect(T2T.tuit).toBe('123'))})
         */
    })
});

describe ('can find t2ts by tag', () => {
    test('findT2TsByTag', () => {
        // TODO
    })
});

describe ('can find tags by tuit', () => {
    test('findTagsByTuit', () => {
        // TODO
    })
});

describe ('can find tuit by tag text', () => {
    test('findTuitByTagText', () => {
        // TODO
    })
});

describe ('can delete t2t with tuit and tag', () => {
    test('deleteT2TByTuitAndTag', () => {
        // TODO
    })
});

describe ('can delete t2t by t2t ID', () => {
    test('deleteT2TByID', () => {
        // TODO
    })
});

