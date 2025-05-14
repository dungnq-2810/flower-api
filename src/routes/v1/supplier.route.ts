import { Router } from "express";
import { SupplierController } from "../../controllers/supplier.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";

const router = Router();
const supplierController = new SupplierController();

/**
 * @route   POST /api/v1/suppliers
 * @desc    Create a new supplier
 * @access  Private (Admin)
 */
router.post(
  "/",
  authenticate,
  authorize("admin"),
  supplierController.createSupplier
);

/**
 * @route   GET /api/v1/suppliers
 * @desc    Get all suppliers with pagination and filters
 * @access  Private (Admin)
 */
router.get("/", supplierController.getAllSuppliers);

/**
 * @route   GET /api/v1/suppliers/:id
 * @desc    Get supplier by ID
 * @access  Private (Admin)
 */
router.get(
  "/:id",
  authenticate,
  authorize("admin"),
  supplierController.getSupplierById
);

/**
 * @route   PUT /api/v1/suppliers/:id
 * @desc    Update supplier
 * @access  Private (Admin)
 */
router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  supplierController.updateSupplier
);

/**
 * @route   DELETE /api/v1/suppliers/:id
 * @desc    Delete supplier
 * @access  Private (Admin)
 */
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  supplierController.deleteSupplier
);

export default router;
