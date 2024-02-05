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
    update(booking: Partial<InputBookingDto>): Promise<booking[]>
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

        if (userId !== undefined) {
            query += ` ${this.includeUserIdCondition(1)}`;
        }

        query += ` WHERE id = $${userId !== undefined ? 2 : 1} RETURNING *;`;

        return this._pool.query(query, [id, userId]);
    }

    public async getById(id: number, userId?: number): Promise<booking[]> {
        let query = `SELECT * FROM ${BookingsDatabase.TABLE_NAME}`;

        if (userId !== undefined) {
            query += ` ${this.includeUserIdCondition(1)}`;
        }

        query += ` WHERE id = $${userId !== undefined ? 2 : 1} LIMIT 1;`;

        return this._pool.query<booking>(query, [id, userId]);
    }

    public async update(booking: Partial<InputBookingDto>): Promise<booking[]> {
        let query = `UPDATE ${BookingsDatabase.TABLE_NAME}`;
        let params: any[] = [];
        let key = 1;

        [
            BookingFieldName.UserId, 
            BookingFieldName.StartDateTime, 
            BookingFieldName.EndDateTime, 
            BookingFieldName.ParkingSpotId
        ].forEach(field => {
            if (booking[field] !== undefined) {
                query += ` SET ${field} = $${key}`;
                params.push(booking[field]);
                key++;
            }
        });

        query += ` WHERE id = $${key} RETURNING *;`;   

        return this._pool.query<booking>(query, params);
    }

    protected includeUserIdCondition(key: number): string {
        return `WHERE user_id = $${key}`;
    }
}