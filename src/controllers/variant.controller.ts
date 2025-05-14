import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { VariantService } from '../services/variant.service';
import { validate } from '../middlewares/validation.middleware';
import { createVariantSchema, updateVariantSchema } from '../validations/variant.validation';
import { HttpException } from '../middlewares/error.middleware';

export class VariantController {
  private variantService = new VariantService();

  /**
   * Create a new variant
   */
  public createVariant = [
    validate(createVariantSchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const variantData = req.body;
        const variant = await this.variantService.createVariant(variantData);
        res.status(201).json({
          success: true,
          data: variant.toObject(),
          message: 'Variant created successfully',
        });
      } catch (error) {
        next(error);
      }
    },
  ];

  /**
   * Get variant by ID
   */
  public getVariantById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const variantId = req.params.id;
      const variant = await this.variantService.getVariantById(variantId);
      res.status(200).json({
        success: true,
        data: variant.toObject(),
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get variants by product ID
   */
  public getVariantsByProductId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const productId = req.params.productId;
      const variants = await this.variantService.getVariantsByProductId(productId);
      res.status(200).json({
        success: true,
        data: variants.map(variant => variant.toObject()),
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update variant
   */
  public updateVariant = [
    validate(updateVariantSchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const variantId = req.params.id;
        const variantData = req.body;
        const updatedVariant = await this.variantService.updateVariant(
          variantId,
          variantData
        );
        res.status(200).json({
          success: true,
          data: updatedVariant.toObject(),
          message: 'Variant updated successfully',
        });
      } catch (error) {
        next(error);
      }
    },
  ];

  /**
   * Delete variant
   */
  public deleteVariant = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const variantId = req.params.id;
      await this.variantService.deleteVariant(variantId);
      res.status(200).json({
        success: true,
        message: 'Variant deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}