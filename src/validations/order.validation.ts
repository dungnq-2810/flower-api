import Joi from "joi";

export const createOrderSchema = Joi.object({
  orderId: Joi.string().optional(),
  userId: Joi.string().required(),
  customerName: Joi.string().required(),
  customerEmail: Joi.string().email().required(),
  customerPhone: Joi.string().required(),
  shippingAddress: Joi.string().required(),
  status: Joi.string()
    .valid("pending", "confirmed", "shipped", "delivered", "cancelled")
    .required(),
  paymentMethod: Joi.string().valid("cod", "paypal", "credit_card").required(),
  paymentStatus: Joi.string().valid("pending", "paid", "failed").required(),
  subtotal: Joi.number().min(0).required(),
  shippingFee: Joi.number().min(0).required(),
  discount: Joi.number().min(0).required(),
  total: Joi.number().min(0).required(),
  notes: Joi.string().allow(null, "").optional(),
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().required(),
        productName: Joi.string().required(),
        price: Joi.number().min(0).required(),
        productImage: Joi.string().uri().required(),
        quantity: Joi.number().integer().min(1).required(),
      })
    )
    .min(1)
    .required(),
});

export const updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid("pending", "processing", "shipped", "delivered", "cancelled")
    .required(),
});
