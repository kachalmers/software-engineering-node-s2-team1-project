import {Request, Response, Express} from "express";
import TuitDao from "../daos/TuitDao";
import TuitControllerI from "../interfaces/TuitController";

export default class TuitController implements TuitControllerI {
    static tuitDao = TuitDao.getInstance();
    private static tuitController: TuitController | null = null;
    public static getInstance = (app: Express): TuitController => {
        if(TuitController.tuitController === null) {
            TuitController.tuitController = new TuitController();

            app.get('/tuits', TuitController.tuitController.findAllTuits);
            app.get('/tuits/:tid', TuitController.tuitController.findTuitById);
            app.get('/users/:uid/tuits', TuitController.tuitController.findTuitsByUser);
            app.post('/tuits', TuitController.tuitController.createTuit);
            app.delete('/tuits/:tid', TuitController.tuitController.deleteTuit);
            app.put('/tuits/:tid', TuitController.tuitController.updateTuit);
        }
        return TuitController.tuitController;
    }

   findAllTuits = (req: Request, res: Response) =>
       TuitController.tuitDao.findAllTuits()
           .then(tuits => res.json(tuits));
   findTuitById = (req: Request, res: Response) =>
       TuitController.tuitDao.findTuitById(req.params.tid)
           .then(tuit => res.json(tuit));
   findTuitsByUser = (req: Request, res: Response) =>
       TuitController.tuitDao.findTuitsByUser(req.params.uid)
           .then(tuits => res.json(tuits));
   createTuit = (req: Request, res: Response) =>
       TuitController.tuitDao.createTuit(req.body)
           .then(tuit => res.json(tuit));
   deleteTuit = (req: Request, res: Response) =>
       TuitController.tuitDao.deleteTuit(req.params.tid)
           .then(status => res.json(status));
   updateTuit = (req: Request, res: Response) =>
       TuitController.tuitDao.updateTuit(req.params.tid, req.body)
           .then(status => res.json(status));
}

