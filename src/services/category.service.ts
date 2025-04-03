import { Types } from "mongoose";
import Category from "../models/category.model";
import {
  ICategory,
  CategoryDocument,
} from "../interfaces/models/category.interface";
import { HttpException } from "../middlewares/error.middleware";

export class CategoryService {
  public async createCategory(
    categoryData: ICategory
  ): Promise<CategoryDocument> {
    const existingCategory = await Category.findOne({
      slug: categoryData.slug,
    });

    if (existingCategory) {
      throw new HttpException(409, "Category with this slug already exists");
    }

    const newCategory = await Category.create(categoryData);

    return newCategory.toObject<CategoryDocument>();
  }

  public async getCategoryById(
    categoryId: string | Types.ObjectId | number
  ): Promise<CategoryDocument> {
    // Find category by id or _id based on type
    const category =
      typeof categoryId === "number"
        ? await Category.findOne({ id: categoryId })
        : await Category.findById(categoryId);

    if (!category) {
      throw new HttpException(404, "Category not found");
    }

    return category.toObject<CategoryDocument>();
  }

  public async getCategoryBySlug(slug: string): Promise<CategoryDocument> {
    const category = await Category.findOne({ slug });

    if (!category) {
      throw new HttpException(404, "Category not found");
    }

    return category.toObject<CategoryDocument>();
  }

  public async getAllCategories(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<{
    categories: CategoryDocument[];
    totalCount: number;
    totalPages: number;
  }> {
    const query: Record<string, any> = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const [categories, totalCount] = await Promise.all([
      Category.find(query).skip(skip).limit(limit).sort({ name: 1 }),
      Category.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalCount / limit);
    return {
      categories: categories.map((category) =>
        category.toObject<CategoryDocument>()
      ),
      totalCount,
      totalPages,
    };
  }

  public async updateCategory(
    categoryId: string | Types.ObjectId | number,
    categoryData: Partial<ICategory>
  ): Promise<CategoryDocument> {
    // Find category by id or _id based on type
    const category =
      typeof categoryId === "number"
        ? await Category.findOne({ id: categoryId })
        : await Category.findById(categoryId);

    if (!category) {
      throw new HttpException(404, "Category not found");
    }

    const categoryObj = category.toObject<CategoryDocument>();

    // Check if slug exists (if trying to update slug)
    if (categoryData.slug && categoryData.slug !== categoryObj.slug) {
      const searchQuery =
        typeof categoryId === "number"
          ? { slug: categoryData.slug, id: { $ne: categoryId } }
          : { slug: categoryData.slug, _id: { $ne: categoryId } };

      const existingCategory = await Category.findOne(searchQuery);

      if (existingCategory) {
        throw new HttpException(409, "Category with this slug already exists");
      }
    }

    // Update by numeric id if categoryId is a number
    const updatedCategory =
      typeof categoryId === "number"
        ? await Category.findOneAndUpdate({ id: categoryId }, categoryData, {
            new: true,
          })
        : await Category.findByIdAndUpdate(categoryId, categoryData, {
            new: true,
          });

    if (!updatedCategory) {
      throw new HttpException(404, "Category not found");
    }

    return updatedCategory.toObject<CategoryDocument>();
  }

  public async deleteCategory(
    categoryId: string | Types.ObjectId | number
  ): Promise<void> {
    // Delete by numeric id if categoryId is a number
    const result =
      typeof categoryId === "number"
        ? await Category.findOneAndDelete({ id: categoryId })
        : await Category.findByIdAndDelete(categoryId);

    if (!result) {
      throw new HttpException(404, "Category not found");
    }
  }
}

export default new CategoryService();
