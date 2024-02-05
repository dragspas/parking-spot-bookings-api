import { ErrorReport, INTERNAL_SERVER_ERROR } from "../validations/ErrorReport";

export const globalErrorHandlerMiddleware = function errorHandler(err: any, req: any, res: any, next: any) {
    if (res.headersSent) {
        return next(err);
    }

    if (!(err instanceof ErrorReport)) {
        return res.status(INTERNAL_SERVER_ERROR.status).send(INTERNAL_SERVER_ERROR.body);
    }
}