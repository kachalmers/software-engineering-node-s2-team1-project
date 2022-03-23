import mongoose, {Schema} from "mongoose";
import Section from "./Section";
const SectionSchema = new mongoose.Schema<Section>({
    name: String,
    seats: Number,
    room: String,
    startTime: Number,
    duration: Number,
    course: {type: Schema.Types.ObjectId, ref: "CourseModel"}
}, {collection: "sections"});
export default SectionSchema;