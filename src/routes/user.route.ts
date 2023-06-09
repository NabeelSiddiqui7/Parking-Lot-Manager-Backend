import { Prisma } from '@prisma/client';
import { Router } from 'express';
import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@exceptions/HttpException';
import { Route } from '@interfaces/route.interface';
import LotService from '@services/lot.service';
import TicketService from '@services/ticket.service';
import { ParkingLot, ParkingLotAvalibility, ParkingLotRate } from '@/interfaces/lot.interface';
import { Ticket, TicketPrice } from '@interfaces/ticket.interface';

class UserRoute implements Route {
    public router: Router = Router();
    public path: string = '/user';
    public lotService: LotService = new LotService();
    public ticketService: TicketService = new TicketService();

    constructor() {
        this.initializeRoutes();
    }

    public initializeRoutes() {
        // get avalible spots in a lot
        this.router.get(`${this.path}/lot`, async (req: Request, res: Response) => {
            const lotID: number = Number(req.query.id);
            const data: ParkingLotAvalibility = {
                booked: await this.lotService.getBookedSpaces(lotID),
                spaces: await this.lotService.getAllSpaces(lotID)
            }
            res.send(data);
        });
        // get all lots info
        this.router.get(`${this.path}/lots`, async (req: Request, res: Response, next: NextFunction) => {
            //const sortField: "name" | "location"  = req.query.sortField?.toString() as "name" | "location";
            //const order: "ASC" | "DESC" = req.query.order?.toString()?.toUpperCase() as "ASC" | "DESC"; // change this to be req.params.<varname> or req.body.<varname> dependent on how you make the request
            const data: ParkingLot[] = await this.lotService.getLots();
            
            res.send(data);
        });

        // get rate of a lot
        this.router.get(`${this.path}/rate`, async (req: Request, res: Response, next: NextFunction) => {
            const lotID: number = 1;
            const data: any = await this.lotService.getRate(lotID);
            if (data) {
                res.send(data);
            } else {
                next(new HttpException(402, 'No such lot exists'));
            }
        });

        // book ticket
        this.router.post(`${this.path}/ticket`, async (req: Request, res: Response, next: NextFunction) => {
            const result: number = await this.ticketService.insertTicket(Number(req.body.spaceid), req.body.time);
            res.statusCode = 200;
            if (result) {
                res.sendStatus(200);
            }
            else {
                next(new HttpException(500, 'Unable to insert ticket'))
            }

        });

        //expire ticket
        this.router.put(`${this.path}/ticket`, async (req: Request, res: Response, next: NextFunction) => {
            const ticketID: any = req.body.id;
            const updateTime = req.body.time;
            if (await this.ticketService.updateTicket(ticketID, updateTime)) {
                res.sendStatus(200);
            } else {
                next(new HttpException(402, 'No such ticket exists'));
            }
        });

        // get ticket info
        this.router.get(`${this.path}/ticket`, async (req: Request, res: Response, next: NextFunction) => {
            const ticketID: any = req.query.id;
            const data: any = await this.ticketService.getTicket(Number(ticketID));
            if (data) {
                res.send(data);
            } else {
                next(new HttpException(402, 'No such lot exists'));
            }
        });
    }
}

export default UserRoute;