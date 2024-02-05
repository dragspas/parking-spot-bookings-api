import { Role } from "../enums/Role";
import { IBookingsRepository } from "../repositories/BookingsRepository";
import { BAD_REQUEST } from "../validations/ErrorReport";
import { Booking } from "./entities/Booking";
import { RoleContext } from "./roles/RoleContext";

export interface IBookingsService {
    get(userId: number, role: Role, limit: number, offset: number): Promise<Booking[]>;
    create(userId: number, startDateTime: Date, endDateTime: Date, parkingSpotId: number): Promise<Booking>;
    update(id: number, userId: number, role: Role, startDateTime?: Date, endDateTime?: Date, parkingSpotId?: number): Promise<Booking>;
    delete(id: number, userId: number, role: Role): Promise<Booking>;
}

export class BookingsService implements IBookingsService {
    constructor (private _bookingsRepository: IBookingsRepository) {}

    public async get(userId: number, role: Role, limit: number, offset: number = 0): Promise<Booking[]> {
        // @note
        // based on userId pulled from token we should now check if eser exists, and assert role metch
        // but for simplicity I will skip that step and assuem user is authenticated
        // also authentication should be placed out of specific services
        const roleContext = new RoleContext(role);

        return this._bookingsRepository.get(limit, offset, !roleContext.hasMasterAccess() ? userId : undefined);
    }

    public async create(userId: number, startDateTime: Date, endDateTime: Date, parkingSpotId: number): Promise<Booking> {
        // @note
        // we could also here add some info logs, for monitoring
        // also some metrics could be sent externaly
        // probably we would have to do somthing async here
        // like sending notification to user (RabbitMQ or similar)

        await this._bookingsRepository.checkAvailability(parkingSpotId, startDateTime, endDateTime);

        return this._bookingsRepository.create({
            user_id: userId,
            start_date_time: startDateTime,
            end_date_time: endDateTime,
            parking_spot_id: parkingSpotId
        });
    }

    public async update(id: number, userId: number, role: Role, startDateTime?: Date, endDateTime?: Date, parkingSpotId?: number): Promise<Booking> {
        const roleContext = new RoleContext(role);
        const booking = await this._bookingsRepository.getById(id, !roleContext.hasMasterAccess() ? userId : undefined);

        // in case of partialy update only one field
        if ((startDateTime || booking.startDateTime) >= (endDateTime || booking.endDateTime)) {
            throw BAD_REQUEST;
        }

        await this._bookingsRepository.checkAvailability(
            parkingSpotId || booking.parkingSpotId,
            startDateTime || booking.startDateTime,
            endDateTime || booking.endDateTime,
        );

        return this._bookingsRepository.update(id, {
            start_date_time: startDateTime,
            end_date_time: endDateTime,
            parking_spot_id: parkingSpotId
        }, !roleContext.hasMasterAccess() ? userId : undefined);
    }

    public async delete(id: number, userId: number, role: Role): Promise<Booking> {
        const roleContext = new RoleContext(role);
        return this._bookingsRepository.delete(id, !roleContext.hasMasterAccess() ? userId : undefined);
    }
}