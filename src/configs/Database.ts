export class DatabaseConfig {
    public static readonly HOST: string = process.env.DB_HOST || "postgres";
    public static readonly PORT: number = Number(process.env.DB_PORT) || 5432;
    public static readonly USER: string = process.env.DB_USER || "postgres";
    public static readonly PASSWORD: string = process.env.DB_PASSWORD || "postgres";
    public static readonly DATABASE: string = process.env.DB_DATABASE || "postgres";
}

export const databaseConfig: DatabaseConfig = {
    host: DatabaseConfig.HOST,
    port: DatabaseConfig.PORT,
    user: DatabaseConfig.USER,
    password: DatabaseConfig.PASSWORD,
    database: DatabaseConfig.DATABASE
}