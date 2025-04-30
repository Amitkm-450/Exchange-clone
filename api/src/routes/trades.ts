import { Router } from "express";
import { Client } from "pg";

export const tradesRouter = Router();

const pgClient = new Client({
    user: 'your_user',
    host: 'localhost',
    database: 'my_database',
    password: 'your_password',
    port: 5432,
});

pgClient.connect();

tradesRouter.get("/", async (req, res) => {
    const { market } = req.query;
    res.json({});
})