export class ErrorReport extends Error {
    private readonly _status: number;
    private readonly _message: string;
    private readonly _details: any[];

    constructor(status: number, message: string, details: any[] = []) {
        super(message);

        this._status = status;
        this._message = message;
        this._details = details;
    }

    public get status(): number {
        return this._status;
    }

    public get message(): string {
        return this._message;
    }

    public get details(): any[] {
        return this._details;
    }

    public get body(): object {
        return {
            status: this._status,
            message: this._message,
            details: this._details
        };
    }

    public withDetails(details: any[]): ErrorReport {
        return new ErrorReport(this._status, this._message, details);
    }
}

export const BAD_REQUEST = new ErrorReport(400, "Bad Request.");
export const UNAUTHORIZED = new ErrorReport(401, "Unauthorized.");
export const FORBIDDEN = new ErrorReport(403, "Forbidden.");
export const INTERNAL_SERVER_ERROR = new ErrorReport(500, "Internal Server Error.");
export const RESOURCE_IS_NOT_CREATED = new ErrorReport(400, "Resource is not created.");
export const RESOURCE_IS_NOT_UPDATED = new ErrorReport(400, "Resource is not updated.");
export const RESOURCE_NOT_FOUND = new ErrorReport(404, "Resource not found.");
export const RESOURCE_IS_NOT_AVAILABLE = new ErrorReport(400, "Resource is not available.");
export const RESOURCE_IS_NOT_DELETED = new ErrorReport(400, "Resource is not deleted.");