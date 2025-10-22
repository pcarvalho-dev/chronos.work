import "reflect-metadata";
import express from "express";
import session from "express-session";
import morgan from "morgan";
import passport from "./config/passport.js";
import { AppDataSource } from "./database/data-source.js";
import authRouter from "./routes/auth.js";
import timeLogRouter from "./routes/timeLog.js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { apiReference } from "@scalar/express-api-reference";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// HTTP Request Logger
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const apiPort = process.env.PORT || 8000;
const jwtSecret = process.env.SECRET || "your-secret-key";
app.use(
    session({
        secret: jwtSecret, // Change this to a random secret key
        resave: false,
        saveUninitialized: false,
    })
);

app.use(passport.initialize());
app.use(passport.session());

// Health check endpoint
app.get("/health", (req, res) => {
    res.send("OK");
});

// Serve OpenAPI spec
app.get("/openapi.json", (req, res) => {
    const openapiSpec = readFileSync(join(__dirname, "..", "openapi.json"), "utf-8");
    res.setHeader("Content-Type", "application/json");
    res.send(openapiSpec);
});

// API Documentation with Scalar (interactive)
app.use("/docs", apiReference({
    spec: {
        url: "/openapi.json"
    },
    theme: "purple",
    layout: "modern",
}));

app.use("/auth", authRouter);
app.use("/timelog", timeLogRouter);

AppDataSource.initialize().then(() => {
    console.log("Data Source has been initialized!");
}).catch((err) => {
    console.error("Error during Data Source initialization", err);
});

app.listen(apiPort, () => {
    console.log("Server is running on port " + apiPort);
});
