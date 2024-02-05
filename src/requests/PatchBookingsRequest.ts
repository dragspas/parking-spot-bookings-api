import { Request } from "express";
import { JoiValidation } from "../validations/JoiValidation";
import { BOOKING_UPDATE_BODY, BOOKING_UPDATE_QUERY } from "../validations/schemas";
import { AuthRequest } from "./AuthRequest";

export class PatchBookingsRequest extends AuthRequest {
    public readonly id: number;
    public readonly startDateTime?: Date;
    public readonly endDateTime?: Date;
    public readonly parkingSpotId?: number;

    constructor(req: Request) {
        super(req);
        
        const validatedQuery = JoiValidation.validate(BOOKING_UPDATE_QUERY, req.body);
        const validatedBody = JoiValidation.validate(BOOKING_UPDATE_BODY, req.body);

        this.id = validatedQuery.id;
        this.startDateTime = validatedBody.start_date_time ?? undefined;
        this.endDateTime = validatedBody.end_date_time ?? undefined;
        this.parkingSpotId = validatedBody.parking_spot_id ?? undefined;
    }
}