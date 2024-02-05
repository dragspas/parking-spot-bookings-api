export class Booking {
    id: number;
    userId: number;
    startDateTime: Date;
    endDateTime: Date;
    parkingSpotId: number;
    createdAt: Date | null;
    updatedAt: Date | null;

    constructor(
        id: number,
        userId: number,
        startDateTime: Date,
        endDateTime: Date,
        parkingSpotId: number,
        createdAt: Date | null,
        updatedAt: Date | null
    ) {
        this.id = id;
        this.userId = userId;
        this.startDateTime = startDateTime;
        this.endDateTime = endDateTime;
        this.parkingSpotId = parkingSpotId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}