import Joi from "joi";

export const AUTH = Joi.object({
    token: Joi.string().required()
});

export const PAGINATION = Joi.object({
    limit: Joi.number().integer().min(1).max(100).required(),
    offset: Joi.number().integer().min(0).optional()
});

export const BOOKING = Joi.object({
    start_date_time: Joi.date().greater('now').required(),
    end_date_time: Joi.date().greater(Joi.ref('start_date_time')).required(),
    parking_spot_id: Joi.number().integer().required()
});

export const BOOKING_UPDATE_PARAMS = Joi.object({
    id: Joi.number().integer().required()
});

export const BOOKING_UPDATE_BODY = Joi.object({
    start_date_time: Joi.date().greater('now').optional(),
    end_date_time: Joi.date().greater(Joi.ref('start_date_time')).optional(),
    parking_spot_id: Joi.number().integer().optional()
}).xor('start_date_time', 'end_date_time', 'parking_spot_id');

export const BOOKING_DELETE = Joi.object({
    id: Joi.number().integer().required()
})