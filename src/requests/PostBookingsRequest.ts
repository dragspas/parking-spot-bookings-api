import { Request } from "express";
import { JoiValidation } from "../validations/JoiValidation";
import { BOOKING } from "../validations/schemas";
import { AuthRequest } from "./AuthRequest";

export class PostBookingsRequest extends AuthRequest {
    public readonly startDateTime: Date;
    public readonly endDateTime: Date;
    public readonly parkingSpotId: number;

    constructor(req: Request) {
        super(req);

        const validated = JoiValidation.validate(BOOKING, req.body);

        this.startDateTime = validated.start_date_time;
        this.endDateTime = validated.end_date_time;
        this.parkingSpotId = validated.parking_spot_id;
    }
}