import express from "express";
import { getPreferencesByUser } from "../../controllers/index.js";

const router = express.Router();

router.post("/preferenceListByUser", getPreferencesByUser);

export default router;
