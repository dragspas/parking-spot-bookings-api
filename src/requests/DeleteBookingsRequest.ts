import { Request } from "express";
import { JoiValidation } from "../validations/JoiValidation";
import { BOOKING_DELETE, PAGINATION } from "../validations/schemas";
import { AuthRequest } from "./AuthRequest";

export class DeleteBookingsRequest extends AuthRequest {
    public id: number;

    constructor(req: Request) {
        super(req);

        const validated = JoiValidation.validate(BOOKING_DELETE, req.params);

        this.id = Number(validated.id);
    }
}