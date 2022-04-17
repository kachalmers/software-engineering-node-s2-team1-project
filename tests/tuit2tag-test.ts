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

describe ('can find all t2ts', () => {});
/*
const T2T_COUNT = ??

test('findAllT2Ts', () => {
  return t2tDao.findAllTuit2Tags()
    .then(t2ts => expect(t2ts.length)
      .toBeGreaterThanOrEqual(T2T_COUNT));
});
*/

describe ('can find t2ts by tuit', () => {});
/*
  test('findT2TsByTuit', () => {
    return t2tDao.createTuit2Tag('123', '456')
      .then(newT2T => t2tDao.findTuit2TagByTuit(newT2T._id))
      .then(T2T => expect(T2T.tuit).toBe('123'))})
      });
 */

describe ('can find t2ts by tag', () => {});
describe ('can find tags by tuit', () => {});
describe ('can find tuit by tag text', () => {});
describe ('can delete t2t with tuit and tag', () => {});
describe ('can delete t2t by t2t ID', () => {});

