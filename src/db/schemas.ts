export interface booking {
    id: number;
    user_id: number;
    start_date_time: Date;
    end_date_time: Date;
    parking_spot_id: number;
    created_at?: Date | null;
    updated_at?: Date | null;
}