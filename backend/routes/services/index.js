import express from "express";
import { getPreferencesByUser } from "../controllers";

const router = express.Router();

router.get("/preferenceListByUser", getPreferencesByUser);

export default router;
