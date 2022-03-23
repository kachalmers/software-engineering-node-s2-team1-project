// import Course from "../mongoose/courses/Course";
// import Course from "../models/Course";
import Course from "../mongoose/courses/Course";

export default interface CourseDao {
    findAllCourses(): Promise<Course[]>;
    findAllCoursesDeep(): Promise<Course[]>;
    findCourseById(cid: string): Promise<Course>;
    findCourseByIdDeep(cid: string): Promise<Course>;
    createCourse(course: Course): Promise<Course>;
    deleteCourse(cid: string): Promise<any>;
    updateCourse(cid: string, course: Course): Promise<any>;
    addSectionToCourse(cid: string, sid: string): Promise<any>;
    removeSectionFromCourse(cid: string, sid: string): Promise<any>;
};