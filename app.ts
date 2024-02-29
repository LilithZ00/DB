import express from "express";
import { router as index } from "./api/index";
import { router as trip } from "./api/trip";
import { router as upload } from "./api/upload";
import bodyParser from "body-parser";
import cors from "cors";

// object app => Web API
export const app = express();
app.use(
    cors({
      origin: "*",
    })
  );
// req = request
// res = response
// app.use("/", (req, res)=>{
//     res.send("Hello World!!!");
// });
app.use(bodyParser.text());
app.use(bodyParser.json());
app.use("/", index);
app.use("/trip", trip);
app.use("/upload", upload);
app.use("/uploads", express.static("uploads"));