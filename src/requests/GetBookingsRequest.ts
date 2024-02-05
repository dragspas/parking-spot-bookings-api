import { Request } from "express";
import { JoiValidation } from "../validations/JoiValidation";
import { PAGINATION } from "../validations/schemas";
import { AuthRequest } from "./AuthRequest";

export class GetBookingsRequest extends AuthRequest {
    public readonly limit: number;
    public readonly offset: number;

    constructor(req: Request) {
        super(req);

        const validated = JoiValidation.validate(PAGINATION, req.query);

        this.limit = Number(validated.limit);
        this.offset = Number(validated.offset) || 0;
    }
}