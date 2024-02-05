import { IBookingsDatabase } from "../database/BookingsDatabase";
import { InputBookingDto } from "../services/dtos/InputBookingDto";
import { Booking } from "../services/entities/Booking";
import { RESOURCE_IS_NOT_AVAILABLE, RESOURCE_IS_NOT_CREATED, RESOURCE_IS_NOT_DELETED, RESOURCE_IS_NOT_UPDATED, RESOURCE_NOT_FOUND } from "../validations/ErrorReport";

export interface IBookingsRepository {
    checkAvailability(parkingSpotId: number, startDateTime: Date, endDateTime: Date): Promise<void>;
    create(booking: Partial<InputBookingDto>): Promise<Booking>;
    delete(id: number, userId?: number): Promise<Booking>;
    get(limit: number, offset: number, userId?: number): Promise<Booking[]>;
    getById(id: number, userId?: number): Promise<Booking>;
    update(id: number, booking: Partial<InputBookingDto>, userId?: number): Promise<Booking>;
}

export class BookingsRepository implements IBookingsRepository {
    constructor (private _database: IBookingsDatabase) {}

    public async get(limit: number, offset: number, userId?: number): Promise<Booking[]> {
        const result = await this._database.get(limit, offset, userId);

        return result.map(booking => this.deserialize(booking));
    }

    public async create(booking: InputBookingDto): Promise<Booking> {
        const result = await this._database.create(booking);

        if (result.length === 0) {
            throw RESOURCE_IS_NOT_CREATED;
        }

        return this.deserialize(result[0]);
    }

    public async checkAvailability(parkingSpotId: number, startDateTime: Date, endDateTime: Date): Promise<void> {
        const result = await this._database.checkAvailability(parkingSpotId, startDateTime, endDateTime);

        if (result.length !== 0) {
            throw RESOURCE_IS_NOT_AVAILABLE;
        }
    }

    public async delete(id: number, userId?: number): Promise<Booking> {
        const result = await this._database.delete(id, userId);

        if (result.length === 0) {
            throw RESOURCE_IS_NOT_DELETED;
        }

        return this.deserialize(result[0]);
    }

    public async getById(id: number, userId?: number): Promise<Booking> {
        const result = await this._database.getById(id, userId);

        if (result.length === 0) {
            throw RESOURCE_NOT_FOUND;
        }

        return this.deserialize(result[0]);
    }

    public async update(id: number, booking: Partial<InputBookingDto>, userId?: number): Promise<Booking> {
        const result = await this._database.update(id, booking, userId);

        if (result.length === 0) {
            throw RESOURCE_IS_NOT_UPDATED;
        }

        return this.deserialize(result[0]);
    }

    protected deserialize(booking: any): Booking {
        return new Booking(
            booking.id,
            booking.user_id,
            booking.start_date_time,
            booking.end_date_time,
            booking.parking_spot_id,
            booking.created_at,
            booking.updated_at
        )
    }
}