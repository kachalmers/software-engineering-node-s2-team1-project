/**
 * @file CourseController
 */

import CourseControllerI from "../interfaces/CourseController";
import {Express, Request, Response} from "express";
import CourseDao from "../daos/CourseDao";
import Course from "../models/Course";

/**
 * @class
 */
export default class CourseController implements CourseControllerI {
    private courseDao: CourseDao = CourseDao.getInstance();

    /**
     * @constructor
     * @param {Express} app Express instance to declare HTTP endpoints
     */
    constructor(app: Express) {
        app.get("/courses", this.findAllCourses);
        app.get("/courses/:cid", this.findCourseById);
        app.post("/courses", this.createCourse);
        app.put("/courses/:cid", this.updateCourse);
        app.delete("/courses/:cid", this.deleteCourse);
        app.post("/courses/:cid/section/:sid", this.addSectionToCourse);
        app.delete("/courses/:cid/section/:sid", this.removeSectionFromCourse);
    }

    /**
     * Responds to request for all courses
     * @param {Request} req Responds to request URL /courses
     * @param {Response} res Used to respond with array of courses
     */
    findAllCourses = (req: Request, res: Response): Promise<any> =>
        this.courseDao.findAllCourses()
            .then(courses => res.json(courses));
    /**
     * Responds to request for single course instance whose primary key is req.params.cid
     * encoded in URL pattern /courses/:cid
     * @param {Request} req Request for pattern URL /courses/:cid where cid is the primary key of the course we're looking for
     * @param {Response} res Responds with JSON representation of course whose primary key is cid
     */
    findCourseById = (req: Request, res: Response): Promise<any> =>
        this.courseDao.findCourseById(req.params.cid)
            .then(course => res.json(course));
    findAllCoursesDeep = (req: Request, res: Response): Promise<any> =>
        this.courseDao.findAllCoursesDeep()
            .then(courses => res.json(courses));
    findCourseByIdDeep = (req: Request, res: Response): Promise<any> =>
        this.courseDao.findCourseByIdDeep(req.params.cid)
            .then(course => res.json(course));
    createCourse = (req: Request, res: Response): Promise<any> =>
        this.courseDao.createCourse(req.body)
            .then(course => res.json(course));
    updateCourse = (req: Request, res: Response): Promise<any> =>
        this.courseDao.updateCourse(req.params.cid, req.body)
            .then(status => res.send(status));
    deleteCourse = (req: Request, res: Response): Promise<any> =>
        this.courseDao.deleteCourse(req.params.cid)
            .then(status => res.send(status));
    addSectionToCourse = (req: Request, res: Response): Promise<any> =>
        this.courseDao
            .addSectionToCourse(req.params.cid, req.params.sid)
            .then(status => res.send(status));
    removeSectionFromCourse = (req: Request, res: Response): Promise<any> =>
        this.courseDao
            .removeSectionFromCourse(req.params.cid, req.params.sid)
            .then(status => res.send(status));
}