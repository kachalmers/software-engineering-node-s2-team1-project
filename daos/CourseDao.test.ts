import mongoose from "mongoose";
import CourseDao from "./CourseDao";
import SectionDao from "./SectionDao";
mongoose.connect('mongodb://localhost:27017/cs5500-test-123');

const sectionDao = SectionDao.getInstance();
const courseDao = CourseDao.getInstance();

const TEST_COURSE_COUNT = 10;
beforeEach(() => {
    const promises = [];
    for(let i = 0; i < TEST_COURSE_COUNT; i++) {
        const promise = courseDao.createCourse({
            title: `csTest-${i}`
        });
        promises.push(promise);
    }
    return Promise.all(promises);
});

afterEach(() => {
    const promises = [];
    for(let i = 0; i < TEST_COURSE_COUNT; i++) {
        const promise = courseDao
            .deleteCourseByTitle(`csTest-${i}`);
        promises.push(promise);
    }
    return Promise.all(promises);
});

describe('createCourse', () => {
    beforeAll(() => courseDao.deleteCourseByTitle('cs1234-test'))
    afterAll(() => courseDao.deleteCourseByTitle('cs1234-test'))
    test('createCourse', () => {
        return courseDao.createCourse({
            title: 'cs1234-test'
        }).then(course => expect(course.title).toBe('cs1234-test'))
    })
})

test('findAllCourses', () => {
    return courseDao.findAllCourses()
        .then(courses => expect(courses.length)
            .toBeGreaterThanOrEqual(TEST_COURSE_COUNT));
});

describe('findCourseById', () => {
    afterAll(() => courseDao
        .deleteCourseByTitle('cs-findCourseById'))
    test('findCourseById', () => {
        return courseDao
            .createCourse({title: 'cs-findCourseById'})
            .then(newCourse => courseDao
                .findCourseById(newCourse._id))
            .then(course => expect(course.title)
                .toBe('cs-findCourseById'));
    });
})

// courseDao
//     .addSectionToCourse("61ec897218898f8a4c3ff7c8", "61ecd42ad36f1e52c243953d")
//     .then(result => console.log(result));
// courseDao.findAllCoursesDeep()
//     .then(courses => console.log(courses));
// sectionDao.findAllSectionsDeep()
//     .then(sections => console.log(sections));
// courseDao.updateCourse(
//     '61ec835fba16e6188136169b',
//     {title: 'new title'}
// ).then(status => console.log(status));
