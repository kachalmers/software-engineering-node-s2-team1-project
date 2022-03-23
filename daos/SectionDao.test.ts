import mongoose from "mongoose";
mongoose.connect('mongodb://localhost:27017/cs5500-test-123');
import SectionDao from './SectionDao';
import CourseDao from "./CourseDao";

test('test course dao', () => {

});

const courseDao = CourseDao.getInstance();
const sectionDao = SectionDao.getInstance();
sectionDao.findAllSectionsDeep()
    .then(sections => console.log(sections));
// sectionDao.findAllSections()
//     .then(sections => console.log(sections));
// sectionDao.createSectionForCourse(
//     "61ec897218898f8a4c3ff7c8",
//     {name: 'section 01'})
// .then(section => console.log(section));