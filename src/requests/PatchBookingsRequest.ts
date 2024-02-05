import { Request } from "express";
import { JoiValidation } from "../validations/JoiValidation";
import { BOOKING_UPDATE_BODY, BOOKING_UPDATE_PARAMS } from "../validations/schemas";
import { AuthRequest } from "./AuthRequest";

export class PatchBookingsRequest extends AuthRequest {
    public readonly id: number;
    public readonly startDateTime?: Date;
    public readonly endDateTime?: Date;
    public readonly parkingSpotId?: number;

    constructor(req: Request) {
        super(req);
        
        const validatedParams = JoiValidation.validate(BOOKING_UPDATE_PARAMS, req.params);
        const validatedBody = JoiValidation.validate(BOOKING_UPDATE_BODY, req.body);

        this.id = validatedParams.id;
        this.startDateTime = validatedBody.start_date_time ?? undefined;
        this.endDateTime = validatedBody.end_date_time ?? undefined;
        this.parkingSpotId = validatedBody.parking_spot_id ?? undefined;
    }
}