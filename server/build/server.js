"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const passport_1 = __importDefault(require("passport"));
const passport_2 = __importDefault(require("./middlewares/passport"));
const indexRoutes_1 = __importDefault(require("./routes/indexRoutes"));
const ProductRoutes_1 = __importDefault(require("./routes/ProductRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const protectedRoutes_1 = __importDefault(require("./routes/protectedRoutes"));
class Server {
    constructor() {
        this.app = express_1.default();
        this.config();
        this.routes();
    }
    config() {
        const MONGO_URI = "mongodb://25.10.74.190:27029,25.11.15.59:27019,25.109.145.243:27033,25.10.146.93:27031,25.10.35.240:27030/prueba";
        //mongoose.set("useFindAndModify", true);
        mongoose_1.default
            .connect(MONGO_URI, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
        })
            .then((db) => console.log("DB is connected"))
            .catch((err) => console.log(err));
        // settings
        this.app.set("port", process.env.PORT || 3001);
        //middlewares
        this.app.use(morgan_1.default("dev"));
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: false }));
        this.app.use(cors_1.default());
        this.app.use(passport_1.default.initialize());
        passport_1.default.use(passport_2.default);
    }
    routes() {
        this.app.use(indexRoutes_1.default);
        this.app.use("/api/products", ProductRoutes_1.default);
        this.app.use(authRoutes_1.default);
        this.app.use(protectedRoutes_1.default);
    }
    start() {
        this.app.listen(this.app.get("port"), () => {
            console.log("Server on port", this.app.get("port"));
        });
    }
}
const server = new Server();
server.start();
