import "reflect-metadata";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import { AppDataSource } from "./database/data-source.js";
import authRouter from "./routes/auth.js";
import timeLogRouter from "./routes/timeLog.js";
import managerRouter from "./routes/manager.js";
import auditRouter from "./routes/audit.js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// CORS Configuration
app.use(cors({
    origin: (origin, callback) => {
        // Lista de origens permitidas (web)
        const allowedOrigins = [
            "http://localhost:3000",
            "http://localhost:3001",
            "http://localhost:3002",
            "https://chronoswork.com.br"
        ];

        // Permitir requisições sem Origin (apps mobile, Postman, etc)
        if (!origin) {
            return callback(null, true);
        }

        // Permitir origens da lista
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        // Bloquear outras origens
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
}));

// HTTP Request Logger
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const apiPort = process.env.PORT || 8000;

// Serve static files (uploads)
app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

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
app.get("/docs", (req, res) => {
    const spec = JSON.parse(readFileSync(join(__dirname, "..", "openapi.json"), "utf-8"));
    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Chronos.work API Documentation</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body>
    <script id="api-reference" data-url="/openapi.json"></script>
    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
</body>
</html>`;
    res.send(html);
});

app.use("/auth", authRouter);
app.use("/timelog", timeLogRouter);
app.use("/manager", managerRouter);
app.use("/audit", auditRouter);

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");

        app.listen(apiPort, () => {
            console.log(`Server is running on port ${apiPort}`);
        });
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err);
        process.exit(1);
    });
