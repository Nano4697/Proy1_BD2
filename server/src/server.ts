import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import cors from "cors";
import passport from 'passport'
import passportMiddleware from './middlewares/passport'

import config from './config/config';
import indexRoutes from "./routes/indexRoutes";
import ProductRoutes from "./routes/ProductRoutes";
import authRoutes from './routes/authRoutes'
import protectedRoutes from './routes/protectedRoutes'

class Server {
    public app: express.Application;
    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }

    config() {
        const MONGO_URI = "mongodb://localhost:27035/test";
        //mongoose.set("useFindAndModify", true);
        mongoose
            .connect(MONGO_URI, {
                useNewUrlParser: true,
                useCreateIndex: true,
                useUnifiedTopology: true,
            })
            .then((db) => console.log("DB is connected")).catch(err => console.log( err ));
        // settings
        this.app.set("port", process.env.PORT || 3000);
        //middlewares
        this.app.use(morgan("dev"));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(cors());
        this.app.use(passport.initialize());
        passport.use(passportMiddleware);
    }

    routes() {
        this.app.use(indexRoutes);
        this.app.use("/api/products", ProductRoutes);
        this.app.use(authRoutes);
        this.app.use(protectedRoutes);
    }

    start() {
        this.app.listen(this.app.get("port"), () => {
            console.log("Server on port", this.app.get("port"));
        });
    }
}

const server = new Server();
server.start();
