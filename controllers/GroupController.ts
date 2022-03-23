import {Express, Request, Response} from "express";
import * as dao from "../daos/GroupDao";

const GroupController = (app: Express) => {
    const findAllGroups = (req: Request, res: Response) =>
        dao.findAllGroups()
            .then(groups => res.json(groups));
    const findGroupById = (req: Request, res: Response) =>
        dao.findGroupById(req.params.gid)
            .then(group => res.json(group));
    const findGroupByName = (req: Request, res: Response) =>
        dao.findGroupByName(req.params.name)
            .then(group => res.json(group));
    const createGroup = (req: Request, res: Response) =>
        dao.createGroup(req.body)
            .then(group => res.json(group));
    const deleteGroup = (req: Request, res: Response) =>
        dao.deleteGroup(req.params.gid)
            .then(status => res.json(status));
    const addUserToGroup = (req: Request, res: Response) =>
        dao.addUserToGroup(req.params.uid, req.params.gid)
            .then(membership => res.json(membership));
    const removeUserFromGroup = (req: Request, res: Response) =>
        dao.removeUserFromGroup(req.params.uid, req.params.gid)
            .then(status => res.json(status));
    const findUsersInGroup = (req: Request, res: Response) =>
        dao.findUsersInGroup(req.params.gid)
            .then(users => res.json(users));
    const findGroupsForUser = (req: Request, res: Response) =>
        dao.findGroupsForUser(req.params.uid)
            .then(groups => res.json(groups));
    
    app.get('/api/groups', findAllGroups);
    app.get('/api/groups/:gid', findGroupById);
    app.get('/api/groups/name/:name', findGroupByName);
    app.post('/api/groups', createGroup);
    app.delete('/api/groups/:gid', deleteGroup);
    app.post('/users/:uid/groups/:gid', addUserToGroup);
    app.delete('/users/:uid/groups/:gid', removeUserFromGroup);
}
export default GroupController;