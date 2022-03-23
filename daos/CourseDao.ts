import CourseDaoI from "../interfaces/CourseDao";
import CourseModel from "../mongoose/courses/CourseModel";
import Course from "../mongoose/courses/Course";
import SectionDao from "./SectionDao";
import mongoose from "mongoose";

export default class CourseDao implements CourseDaoI {
    static courseDao: CourseDao = new CourseDao();
    sectionDao: SectionDao = SectionDao.getInstance();
    static getInstance(): CourseDao { return this.courseDao; }
    private constructor() {}
    async findAllCourses(): Promise<Course[]> {
        return await CourseModel.find();
    }
    async findCourseById(cid: any): Promise<any> {
        return await CourseModel.findById(cid);
    }
    async createCourse(course: Course): Promise<Course> {
        return await CourseModel.create(course);
    }
    async deleteCourse(cid: string): Promise<any> {
        return await CourseModel.deleteOne({_id: cid});
    }
    async deleteCourseByTitle(title: string): Promise<any> {
        return await CourseModel.deleteOne({title: title});
    }
    async updateCourse(cid: string, course: Course): Promise<any> {
        return await CourseModel.updateOne(
            {_id: cid},
            {$set: course});
    }
    async findAllCoursesDeep(): Promise<Course[]> {
        return await CourseModel
            .find()
            .populate("sections")
            .exec();
    }
    async findCourseByIdDeep(cid: string): Promise<any> {
        return await CourseModel
            .findById(cid)
            .populate("sections")
            .exec();
    }

    async addSectionToCourse(cid: string, sid: string): Promise<any> {
        const section = await this.sectionDao.findSectionById(sid);
        await this.sectionDao
            .updateSection(sid, {...section,
                course: new mongoose.Types.ObjectId(cid)});
        const course = await this.findCourseById(cid);
        return CourseModel.updateOne(
            {_id: cid},
            {$push: {sections: new mongoose.Types.ObjectId(sid)}});
        // course.sections.push(new mongoose.Types.ObjectId(sid));
        // return await this.updateCourse(cid, course);
    }

    removeSectionFromCourse(cid: string, sid: string): Promise<any> {
        return Promise.resolve(undefined);
    }
    
}