import User from "../models/users/User";

export default interface UserDaoI {
    findAllUsers (): Promise<User[]>;
    findUserById (uid: string): Promise<any>;
    createUser (user: User): Promise<User>;
    updateUser (uid: string, user: User): Promise<any>;
    deleteUser (uid: string): Promise<any>;
    deleteAllUsers (): Promise<any>;
};