import { Types } from 'mongoose';
import { Variant } from '../models';
import { IVariant, VariantDocument } from '../interfaces/models/variant.interface';
import { HttpException } from '../middlewares/error.middleware';

export class VariantService {
  /**
   * Create a new variant
   */
  public async createVariant(variantData: IVariant): Promise<VariantDocument> {
    try {
      const createdVariant = await Variant.create({
        ...variantData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return createdVariant;
    } catch (error) {
      throw new HttpException(500, `Failed to create variant: ${error.message}`);
    }
  }

  /**
   * Get variant by ID
   */
  public async getVariantById(variantId: string | Types.ObjectId | number): Promise<VariantDocument> {
    try {
      const variant = await Variant.findOne({ id: Number(variantId) });
      if (!variant) {
        throw new HttpException(404, 'Variant not found');
      }
      return variant;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(500, `Failed to get variant: ${error.message}`);
    }
  }

  /**
   * Get variants by product ID
   */
  public async getVariantsByProductId(productId: string | Types.ObjectId | number): Promise<VariantDocument[]> {
    try {
      const variants = await Variant.find({ productId: Number(productId) });
      return variants;
    } catch (error) {
      throw new HttpException(500, `Failed to get variants by product ID: ${error.message}`);
    }
  }

  /**
   * Update variant
   */
  public async updateVariant(
    variantId: string | Types.ObjectId | number,
    variantData: Partial<IVariant>
  ): Promise<VariantDocument> {
    try {
      const variant = await Variant.findOne({ id: Number(variantId) });
      if (!variant) {
        throw new HttpException(404, 'Variant not found');
      }

      const updatedVariant = await Variant.findOneAndUpdate(
        { id: Number(variantId) },
        {
          ...variantData,
          updatedAt: new Date().toISOString(),
        },
        { new: true }
      );

      if (!updatedVariant) {
        throw new HttpException(500, 'Failed to update variant');
      }

      return updatedVariant;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(500, `Failed to update variant: ${error.message}`);
    }
  }

  /**
   * Delete variant
   */
  public async deleteVariant(variantId: string | Types.ObjectId | number): Promise<void> {
    try {
      const variant = await Variant.findOne({ id: Number(variantId) });
      if (!variant) {
        throw new HttpException(404, 'Variant not found');
      }

      const deleteResult = await Variant.deleteOne({ id: Number(variantId) });
      if (deleteResult.deletedCount === 0) {
        throw new HttpException(500, 'Failed to delete variant');
      }
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(500, `Failed to delete variant: ${error.message}`);
    }
  }
}