import { Router as EndPointRouter } from "express";
import { RecordController } from "../controllers/record.js";
import { auth } from "../middleware/auth.js";

// https://expressjs.com/es/api.html#express.router
const recordEndPoint = EndPointRouter({ caseSensitive: true });

// http://localhost:3000/api/v1/record/all/
recordEndPoint.get("/all/", auth(), RecordController.getAllRecords);

// http://localhost:3000/api/v1/record/email/
recordEndPoint.get("/email/:email", auth(), RecordController.getRecordsByUser);

export { recordEndPoint };
