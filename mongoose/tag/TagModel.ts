/**
 * @file Implements mongoose model to CRUD documents in
 * the tags collection
 */
import mongoose from "mongoose";
import TagSchema from "./TagSchema";

const TagModel = mongoose.model('TagModel', TagSchema);

export default TagModel;