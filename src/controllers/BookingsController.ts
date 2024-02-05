import { Request, Response } from "express";
import { GetBookingsRequest } from "../requests/GetBookingsRequest";
import { ErrorReport, INTERNAL_SERVER_ERROR } from "../validations/ErrorReport";
import { IBookingsService } from "../services/BookingsService";
import { PostBookingsRequest } from "../requests/PostBookingsRequest";
import { DeleteBookingsRequest } from "../requests/DeleteBookingsRequest";
import { PatchBookingsRequest } from "../requests/PatchBookingsRequest";

export class BookingsController {
    constructor(private bookingService: IBookingsService) {}

    async get(req: Request, res: Response): Promise<Response> {
        try {
            // @note 
            // we could implement more params Headers,
            // start and end date, so it could be filtered
            // by time frame
            const {userId, role, offset, limit} = new GetBookingsRequest(req);

            const result = await this.bookingService.get(userId, role, limit, offset);

            return res.status(200).json(result);
        } catch (error: any) {
            // @note
            // here we should add some logs, so we could monitor and track incidents
            return this.sendError(res, error);
        }
    }

    async create(req: Request, res: Response): Promise<Response> {
        try{
            const {userId, startDateTime, endDateTime, parkingSpotId} = new PostBookingsRequest(req);
            
            // @note
            // parking spot existance should be checked both here and in update process
            // leaving without on purpose since I have alredy showcased service/repo/db layering for bookings

            const result = await this.bookingService.create(userId, startDateTime, endDateTime, parkingSpotId);

            return res.status(200).json(result);
        } catch (error: any) {
            return this.sendError(res, error);
        }
    }

    async delete(req: Request, res: Response): Promise<Response> {
        try{
            const {id, userId, role} = new DeleteBookingsRequest(req);
            
            const result = await this.bookingService.delete(id, userId, role);

            return res.status(200).json(result);
        } catch (error: any) {
            return this.sendError(res, error);
        }
    }

    async update(req: Request, res: Response): Promise<Response> {
        try {
            const {id, userId, role, startDateTime, endDateTime, parkingSpotId} = new PatchBookingsRequest(req);

            const result = await this.bookingService.update(id, userId, role, startDateTime, endDateTime, parkingSpotId);
            
            return res.status(200).json(result);
        } catch (error: any) {
            return this.sendError(res, error);
        }
    }

    // @note
    // this method should be in base class
    // and reused in other controllers
    // to keep it simple and clean I will leave it here
    protected sendError(res: Response, error: any): Response {
        if (error instanceof ErrorReport) {
            return res.status(error.status).send(error.body);
        }

        return res.status(INTERNAL_SERVER_ERROR.status).send(INTERNAL_SERVER_ERROR.body);
    }
}