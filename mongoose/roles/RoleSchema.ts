import mongoose from 'mongoose';
const RoleSchema = new mongoose.Schema({
    role: {type: String, enum: ['ADMIN', 'USER', 'FACULTY', 'STUDENT']},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'UserModel'}
}, {collection: "roles"});
export default RoleSchema;