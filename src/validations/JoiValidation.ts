import { AnySchema } from "joi";
import { BAD_REQUEST } from "./ErrorReport";

export class JoiValidation {
    public static validate(schema: AnySchema, data: any, allowUnknown: boolean = false) {
        const result = schema.validate(data, { allowUnknown });

        if (!result.error) {
            return result.value;
        }

        throw BAD_REQUEST.withDetails(result.error.details);
    }
}