/**
 * @file Implements mongoose model to CRUD documents in
 * the Tuits2Tags collection
 */
import mongoose from "mongoose";
import Tuit2TagSchema from "./Tuit2TagSchema";

const Tuit2TagModel = mongoose.model('Tuit2TagModel', Tuit2TagSchema);

export default Tuit2TagModel;