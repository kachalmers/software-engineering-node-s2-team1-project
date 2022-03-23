/**
 * @file Implements mongoose schema for courses
 */

import mongoose from "mongoose";
import Course from "./Course";

/**
 * @typedef Course Represents online courses
 * @property {string} title The course's title
 * @property {number} credits How many credits
 * @property {string} syllabus Course's syllabus
 * @property {ObjectId[]} sections Array of Section IDs
 */

const CourseSchema = new mongoose.Schema<Course>({
    title: String,
    credits: Number,
    syllabus: String,
    sections: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "SectionModel"
    }]
}, {collection: "courses"});
export default CourseSchema;