import {Request, Response, Express} from "express";

const SessionController = (app: Express) => {
    const setSession = (req: Request, res: Response) => {
        var name = req.params['name'];
        var value = req.params['value'];
        // @ts-ignore
        req.session[name] = value;
        res.send(req.session);
    }

    const getSession = (req: Request, res: Response) => {
        var name = req.params['name'];
        // @ts-ignore
        var value = req.session[name];
        res.send(value);
    }
    const getSessionAll = (req: Request, res: Response) => {
        // @ts-ignore
        res.send(req.session);
    }
    const resetSession = (req: Request, res: Response) => {
        // @ts-ignore
        req.session.destroy();
        res.send(200);
    }
    
    app.get('/api/session/set/:name/:value',
        setSession);
    app.get('/api/session/get/:name',
        getSession);
    app.get('/api/session/get',
        getSessionAll);
    app.get('/api/session/reset',
        resetSession);
}

export default SessionController;