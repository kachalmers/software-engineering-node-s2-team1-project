import mongoose from "mongoose";
import RoleSchema from "./RoleSchema";
const RoleModel = mongoose.model("RoleModel", RoleSchema);
export default RoleModel;