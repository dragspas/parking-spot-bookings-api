import {Pool, PoolClient, PoolConfig} from "pg";
import { databaseConfig } from "../configs/Database";

export class Postgres {
  protected pool: Pool;

  constructor() {
    this.pool = new Pool(databaseConfig);

    this.pool.on("error", (err) => {
      console.error("Database error: ", err);
    });
  }

  public async connect(): Promise<PoolClient> {
    const client = await this.pool.connect();

    client.on("error", (err) => {
      console.error(`Database connection error: ${err}`);
    });

    return client;
  }

  public async disconnect(): Promise<void> {
    await this.pool.end();
  }

  public async health(): Promise<void> {
    await this.query("SELECT version();");
  }

  public async query<T>(sql: string, params?: any[]): Promise<T[]> {
    const {rows} = await this.pool.query(sql, params);

    return rows;
  }
}
