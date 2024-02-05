import { Postgres } from "../db/Postgres";
import { booking } from "../db/schemas";import { InputBookingDto } from "../services/dtos/InputBookingDto";
import { BookingFieldName } from "../types/BookingFieldName";
;

export interface IBookingsDatabase {
    checkAvailability(parkingSpotId: number, startDateTime: Date, endDateTime: Date): Promise<booking[]>;
    create(booking: InputBookingDto): Promise<booking[]>;
    delete(id: number, userId?: number): Promise<booking[]>;
    get(limit: number, offset: number, userId?: number): Promise<booking[]>;
    getById(id: number, userId?: number): Promise<booking[]>;
    update(id: number, booking: Partial<InputBookingDto>, userId?: number): Promise<booking[]>
}

export class BookingsDatabase implements IBookingsDatabase {
    public static readonly TABLE_NAME: string = "bookings";

    constructor (private _pool: Postgres) {}

    public async get(limit: number, offset: number = 0, userId?: number): Promise<booking[]> {
        let query = `SELECT * FROM ${BookingsDatabase.TABLE_NAME}`;
        let params: any[] = [];
        let key = 1;

        if (userId !== undefined) {
            query += ` ${this.includeUserIdCondition(key)}`;
            params.push(userId);
            key++;
        }

        query += ` LIMIT $${key} OFFSET $${key + 1};`;
        params.push(limit, offset);

        return this._pool.query<booking>(query, params);
    }

    public async create(booking: InputBookingDto): Promise<booking[]> {
        const query = `INSERT INTO ${BookingsDatabase.TABLE_NAME} 
            (user_id, start_date_time, end_date_time, parking_spot_id) 
            VALUES ($1, $2, $3, $4) RETURNING *;`;

        return this._pool.query<booking>(query, [booking.user_id, booking.start_date_time, booking.end_date_time, booking.parking_spot_id]);
    }

    public async checkAvailability(parkingSpotId: number, startDateTime: Date, endDateTime: Date): Promise<booking[]> {
        const query = `SELECT * FROM ${BookingsDatabase.TABLE_NAME} 
            WHERE parking_spot_id = $1 AND start_date_time < $2 AND end_date_time > $3;`;

        return this._pool.query<booking>(query, [parkingSpotId, endDateTime, startDateTime]);
    }

    public async delete(id: number, userId?: number): Promise<booking[]> {
        let query = `DELETE FROM ${BookingsDatabase.TABLE_NAME}`;
        let key = 1;
        let params: any[] = [];

        if (userId !== undefined) {
            query += ` ${this.includeUserIdCondition(key)}`;
            params.push(userId);
            key++;
        }

        query += key > 1 ? ` AND id = $${key}` : ` WHERE id = $${key}`;
        query += ` RETURNING *;`;
        params.push(id);

        return this._pool.query(query, params);
    }

    public async getById(id: number, userId?: number): Promise<booking[]> {
        let query = `SELECT * FROM ${BookingsDatabase.TABLE_NAME}`;
        let params: any[] = [];
        let key = 1;

        if (userId !== undefined) {
            query += ` ${this.includeUserIdCondition(key)}`;
            params.push(userId);
            key++;
        }

        query += key > 1 ? ` AND id = $${key};` : ` WHERE id = $${key};`;
        params.push(id);

        return this._pool.query<booking>(query, params);
    }

    public async update(id: number, booking: Partial<InputBookingDto>, userId?: number): Promise<booking[]> {
        let query = `UPDATE ${BookingsDatabase.TABLE_NAME} SET`;
        let params: any[] = [];
        let key = 1;

        if (booking.start_date_time !== undefined) {
            query += ` start_date_time = $${key},`;
            params.push(booking.start_date_time);
            key++;
        }
        if (booking.end_date_time !== undefined) {
            query += ` end_date_time = $${key},`;
            params.push(booking.end_date_time);
            key++;
        }
        if (booking.parking_spot_id !== undefined) {
            query += ` parking_spot_id = $${key},`;
            params.push(booking.parking_spot_id);
            key++;
        }

        if (params.length === 0) {
            // prevent updating nothing since we have Partial<InputBookingDto>
            throw new Error("Nothing to update.");
        }

        query = query.slice(0, -1); // remove last comma

        if (userId !== undefined) {
            query += ` ${this.includeUserIdCondition(key)}`;
            params.push(userId);
            key++;
            query += ` AND id = $${key}`;
        } else {
            query += ` WHERE id = $${key}`;
        }

        query += ` RETURNING *;`;  

        return this._pool.query<booking>(query, [...params, id]);
    }

    protected includeUserIdCondition(key: number): string {
        return `WHERE user_id = $${key}`;
    }
}