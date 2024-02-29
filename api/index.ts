import express from "express";

// create router of this API
export const router = express.Router();

router.get("/",(req, res)=>{
    res.send("Method GET in index.ts");
});