import {Schema, Types} from "mongoose";

export default interface Section {
    name: string;
    seats?: number;
    room?: string;
    startTime?: number;
    duration?: number;
    course?: Types.ObjectId
}