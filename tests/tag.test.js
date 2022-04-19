/**
 * @file test for tuit2tag functionality
 */
import tagDao from "../daos/TagDao";

const TagDao = tagDao.getInstance();

const myTag = {
    _id: '001',
    tag: 'Yearnin4Learnin',
    count: 4
};

describe ('new tag created successfully', () => {
    test('createTag', () => {
        /*
        return TagDao.createTag(myTag)
            .then(thisTag => {
                expect(thisTag.tag).toBe('Yearnin4Learnin')
                expect(thisTag.count).toBe(4)
            })
         */
    })
});

describe ('delete tag successfully', () => {
    test('deleteTag', () => {
        // TODO
    })
});

describe('find all tags', () => {
    test('findAllTags', () => {
        // TODO
    })
});

describe('find tags by text', () => {
    test('findTagsByText', () => {
        // TODO
    })
});

describe( 'find tags by id', () => {
    test('findTagsByID', () => {
        // TODO
    })
});

describe('update existing tag', () => {
    test('updateTag', () => {
        // TODO
    })
});
