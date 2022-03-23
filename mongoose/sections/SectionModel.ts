import mongoose from "mongoose";
import SectionSchema from "./SectionSchema";
import Section from "./Section";
const SectionModel = mongoose.model<Section>(
    "SectionModel",
    SectionSchema
);
export default SectionModel;
