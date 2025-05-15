import { Router } from "express";
import orderController from "../../controllers/order.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";

const router = Router();

/**
 * @route POST /api/v1/orders
 * @desc Create a new order
 * @access Private
 */
router.post("/", authenticate, orderController.createOrder);

/**
 * @route GET /api/v1/orders
 * @desc Get all orders (admin only)
 * @access Private (Admin)
 */
router.get("/", authenticate, authorize("admin"), orderController.getAllOrders);

/**
 * @route GET /api/v1/orders/user
 * @desc Get user's orders
 * @access Private
 */
router.get("/user", authenticate, orderController.getUserOrders);

/**
 * @route GET /api/v1/orders/:id
 * @desc Get order by ID
 * @access Private (Owner or Admin)
 */
router.get("/:id", authenticate, orderController.getOrderById);

/**
 * @route PUT /api/v1/orders/:id/status
 * @desc Update order status
 * @access Private (Admin or Owner for cancellation)
 */
router.put("/:id/status", authenticate, orderController.updateOrderStatus);

/**
 * @route DELETE /api/v1/orders/:id
 * @desc Delete order
 * @access Private (Admin)
 */
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  orderController.deleteOrder
);

router.post("/callback", orderController.callback);

export default router;
