/**
 * @file implements a user of the tuiter application including their username,
 * password, email, etc.
 */
import AccountType from "./AccountType";
import MaritalStatus from "./MaritalStatus";
import Location from "./Location";
import mongoose from "mongoose";

/**
 * @typedef User represents user of tuiter.
 * @property {mongoose.Schema.Types.ObjectId} _id user id
 * @property {string} username of user
 * @property {string} password for user to sign in
 * @property {string} firstName of user
 * @property {string} lastName of user
 * @property {string} email of user
 * @property {string} profilePhoto for user
 * @property {string} headerImage for user
 * @property {string} biography of user
 * @property {Date} dateOfBirth of user
 * @property {AccountType} accountType of user's account
 * @property {MaritalStatus} maritalStatus
 * @property {Date} joined Date user joined tuiter
 * @property {Location} location of user
 * @property {number} salary of user
 */
export default interface User {
    _id?: mongoose.Schema.Types.ObjectId,
    username: string,
    password: string,
    firstName?: string,
    lastName?: string,
    email: string,
    profilePhoto?: string,
    headerImage?: string,
    biography?: string,
    dateOfBirth?: Date,
    accountType?: AccountType,
    maritalStatus?: MaritalStatus,
    joined?: Date,
    location?: Location,
    salary?: number
};