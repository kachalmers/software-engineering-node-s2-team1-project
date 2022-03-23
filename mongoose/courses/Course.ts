import {ObjectId, Types} from "mongoose";

export default interface Course {
    _id?: ObjectId
    title: string;
    credits?: number;
    syllabus?: string;
    sections?: Types.ObjectId[];
}