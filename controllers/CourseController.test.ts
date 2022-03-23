import axios from 'axios';
import CourseController from "../controllers/CourseController";
import CourseDao from "../daos/CourseDao";
import express from "express";

const app = express();
const courseController = new CourseController(app);
const courseDao = CourseDao.getInstance();



describe('findAllCourses Controller', () => {
    jest.mock('axios');

    test('findAllCourses Controller', () => {
        const courseResponse = [
            {title: 'cs5500'},
            {title: 'cs5610'},
        ];
        // axios.get.mockResolvedValue(courseResponse);
        //
        // return courseController.findAllCourses().then(data => expect(data).toEqual(users));
    });
});
    