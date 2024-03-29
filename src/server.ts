import express, { Application, Request, Response } from "express";
import { Postgres } from "./db/Postgres";
import { BookingsController } from "./controllers/BookingsController";
import { BookingsService, IBookingsService } from "./services/BookingsService";
import { BookingsRepository, IBookingsRepository } from "./repositories/BookingsRepository";
import { BookingsDatabase, IBookingsDatabase } from "./database/BookingsDatabase";
import bodyParser from "body-parser";
import { globalErrorHandlerMiddleware } from "./middlewares/GlobalErrorHandler";

process.on("unhandledRejection", (reason, _promise) => {
  console.error("Unhandled Promise Rejection:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});

class Server {
  private app: Application;
  private database: Postgres;
  private _services: {bookingsService: IBookingsService};

  constructor() {
    this.app = express();

    this.app.use(bodyParser.json());
    this.app.use(
      bodyParser.urlencoded({
        extended: true,
      }),
    );

    this.database = new Postgres();
    this.database.connect();

    this._services = this.initServices();
    
    this.setupRoutes();

    this.app.use((err: any, req: Request, res: Response, next: any) => {
      globalErrorHandlerMiddleware(err, req, res, next);
    });
  }

  public startServer(): void {
    const PORT = process.env.PORT || 3000;
    this.app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  }

  private async setupRoutes(): Promise<void> {
    // Health endpoint
    this.app.get("/health", async (_req: Request, res: Response) => {
      try{
        await this.database.health();

        return res.send("OK");
      } catch (error: any) {
        return res.status(503).send("NOT OK");
      }
    });

    // bookings
    const bookingsController = new BookingsController(this._services.bookingsService);

    this.app.get("/api/bookings", async (req: Request, res: Response) => await bookingsController.get(req, res));
    this.app.post("/api/bookings", async (req: Request, res: Response) => await bookingsController.create(req, res));
    this.app.delete("/api/bookings/:id", async (req: Request, res: Response) => await bookingsController.delete(req, res));
    this.app.patch("/api/bookings/:id", async (req: Request, res: Response) => await bookingsController.update(req, res));
  }

  private initServices(): {bookingsService: IBookingsService} {
    const repositories = this.initRepositories();
    return {
      bookingsService: new BookingsService(repositories.bookingsRepository)
    };
  }

  private initRepositories(): {bookingsRepository: IBookingsRepository} {
    const databases = this.initDatabases();
    return {
      bookingsRepository: new BookingsRepository(databases.bookingsDatabase)
    };
  }

  private initDatabases(): {bookingsDatabase: IBookingsDatabase} {
    return {
      bookingsDatabase: new BookingsDatabase(this.database)
    };
  }
}

const server = new Server();
server.startServer();
