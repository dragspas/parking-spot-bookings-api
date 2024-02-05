import { Request } from "express";
import { JoiValidation } from "../validations/JoiValidation";
import { AUTH } from "../validations/schemas";
import { UNAUTHORIZED } from "../validations/ErrorReport";
import { Role } from "../enums/Role";

export class AuthRequest {
    public readonly userId: number;
    public readonly role: Role;

    constructor(req: Request) {
        const validated = JoiValidation.validate(AUTH, req.headers, true);

        // @note
        // token format: userId|role
        // actualy token should be in same standard format, JWT for example
        // but for simplicity I will use this
        // because basiclly, when we extract data from JWT, we should get same info
        const parsedToken = validated.token.split("|");
        
        if (parsedToken.length !== 2 || (parsedToken[1] !== Role.Admin && parsedToken[1] !== Role.Standard)) {
            throw UNAUTHORIZED;
        }

        this.userId = Number(parsedToken[0]);
        this.role = parsedToken[1] as Role;
    }
}