import User from "../models/User";

export default interface UserDaoI {
        findAllUsers(): Promise<User[]>;
        findUserById(uid: string): Promise<User | null>;
        createUser(user: User): Promise<User>;
        updateUser(uid: string, user: User): Promise<any>;
        deleteUser(uid: string): Promise<any>;
}
