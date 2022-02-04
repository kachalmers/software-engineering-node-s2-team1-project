import {Request, Response, Express} from "express";
import UserDao from "../daos/UserDao";
import UserControllerI from "../interfaces/UserController";

export default class UserController implements UserControllerI {
    static userDao = UserDao.getInstance();
    private static userController: UserController | null = null;
    public static getInstance = (app: Express): UserController => {
        if(UserController.userController === null) {

            UserController.userController = new UserController();
            app.get("/hello", (req, res) => res.send('hello from users'));
            app.get("/users", UserController.userController.findAllUsers);
            app.get("/users/:uid", UserController.userController.findUserById);
            app.post("/users", UserController.userController.createUser);
            app.put("/users/:uid", UserController.userController.updateUser);
            app.delete("/users/:uid", UserController.userController.deleteUser);
        }
        return UserController.userController;
    }

   findAllUsers = (req: Request, res: Response) =>
       UserController.userDao.findAllUsers()
           .then(users => res.json(users));
   findUserById = (req: Request, res: Response) =>
       UserController.userDao.findUserById(req.params.uid)
           .then(user => res.json(user));
   createUser = (req: Request, res: Response) =>
       UserController.userDao.createUser(req.body)
           .then(user => res.json(user));
   deleteUser = (req: Request, res: Response) =>
       UserController.userDao.deleteUser(req.params.uid)
           .then(status => res.json(status));
   updateUser = (req: Request, res: Response) =>
       UserController.userDao.updateUser(req.params.uid, req.body)
           .then(status => res.json(status));
}

