import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "../../config/swagger";
import cors from "cors";

const router = Router();
router.use(cors());
/**
 * @route   GET /api/v1/docs
 * @desc    API Documentation
 * @access  Public
 */
router.use("/", swaggerUi.serve);
router.get("/", swaggerUi.setup(swaggerSpec));

/**
 * @route   GET /api/v1/docs/json
 * @desc    Get swagger.json
 * @access  Public
 */
router.get("/json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

export default router;
