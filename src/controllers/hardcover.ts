import { Request, Response } from 'express';
import HardcoverService from '@services/hardcover';

export default class HardcoverController {
    static async handler(req: Request, res: Response): Promise<void> {
        const hardcover: HardcoverService = new HardcoverService();
        res.ok(await hardcover.handle(req.params.method, req.query) as object);
    };
};
