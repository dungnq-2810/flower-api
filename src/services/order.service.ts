import { Types } from 'mongoose';
import Order from '../models/order.model';
import OrderItem from '../models/order-item.model';
import Product from '../models/product.model';
import { IOrder, OrderDocument, OrderStatus } from '../interfaces/models/order.interface';
import { IOrderItem, OrderItemDocument } from '../interfaces/models/order-item.interface';
import { ProductDocument } from '../interfaces/models/product.interface';
import { HttpException } from '../middlewares/error.middleware';

interface OrderItemInput {
  productId: string | number;
  quantity: number;
}

export class OrderService {
  public async createOrder(
    userId: string | Types.ObjectId | number,
    items: OrderItemInput[]
  ): Promise<OrderDocument> {
    if (!items.length) {
      throw new HttpException(400, 'Order must have at least one item');
    }
    
    // Calculate total and validate products
    let total = 0;
    const orderItems: Partial<IOrderItem>[] = [];
    
    for (const item of items) {
      // Find product by id or _id based on type
      const product = typeof item.productId === 'number'
        ? await Product.findOne({ id: item.productId })
        : await Product.findById(item.productId);
      
      if (!product) {
        throw new HttpException(404, `Product with ID ${item.productId} not found`);
      }
      
      const productObj = product.toObject<ProductDocument>();
      
      if (productObj.stock !== undefined && productObj.stock < item.quantity) {
        throw new HttpException(400, `Not enough stock for product: ${productObj.name}`);
      }
      
      const price = productObj.price;
      const itemTotal = price * item.quantity;
      
      total += itemTotal;
      
      orderItems.push({
        productId: productObj.id,
        productName: productObj.name,
        productImage: productObj.image,
        quantity: item.quantity,
        price,
        subtotal: itemTotal,
        orderId: 0, // Will be updated after order creation
      });
    }
    
    // Get numeric userId regardless of input type
    const numericUserId = typeof userId === 'number' 
      ? userId 
      : typeof userId === 'string' ? Number(userId) : Number(userId.toString());
      
    // Create order
    const order = await Order.create({
      userId: numericUserId,
      status: 'pending',
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      subtotal: total,
      shippingFee: 0,
      discount: 0,
      total,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    const orderObj = order.toObject<OrderDocument>();
    
    // Create order items with correct orderId
    await Promise.all(
      orderItems.map((item) => {
        item.orderId = orderObj.id;
        return OrderItem.create(item);
      })
    );
    
    // Update product stock
    await Promise.all(
      items.map(async (item) => {
        // Update by numeric id if productId is a number
        typeof item.productId === 'number'
          ? await Product.findOneAndUpdate(
              { id: item.productId },
              { $inc: { stock: -item.quantity } }
            )
          : await Product.findByIdAndUpdate(
              item.productId,
              { $inc: { stock: -item.quantity } }
            );
      })
    );
    
    return orderObj;
  }
  
  public async getOrderById(orderId: string | Types.ObjectId | number): Promise<{
    order: OrderDocument;
    items: OrderItemDocument[];
  }> {
    // Find by id or _id based on type
    const order = typeof orderId === 'number'
      ? await Order.findOne({ id: orderId })
      : await Order.findById(orderId);
    
    if (!order) {
      throw new HttpException(404, 'Order not found');
    }
    
    const orderObj = order.toObject<OrderDocument>();
    const items = await OrderItem.find({ orderId: orderObj.id });
    
    return { 
      order: orderObj, 
      items: items.map(item => item.toObject<OrderItemDocument>()) 
    };
  }
  
  public async getUserOrders(
    userId: string | Types.ObjectId | number,
    page: number = 1,
    limit: number = 10
  ): Promise<{ orders: OrderDocument[]; totalCount: number; totalPages: number }> {
    const skip = (page - 1) * limit;
    
    // Get numeric userId regardless of input type
    const numericUserId = typeof userId === 'number' 
      ? userId 
      : typeof userId === 'string' ? Number(userId) : Number(userId.toString());
    
    const [orders, totalCount] = await Promise.all([
      Order.find({ userId: numericUserId })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Order.countDocuments({ userId: numericUserId }),
    ]);
    
    const totalPages = Math.ceil(totalCount / limit);
    
    return { 
      orders: orders.map(order => order.toObject<OrderDocument>()), 
      totalCount, 
      totalPages 
    };
  }
  
  public async getAllOrders(
    page: number = 1,
    limit: number = 10,
    status?: OrderStatus
  ): Promise<{ orders: OrderDocument[]; totalCount: number; totalPages: number }> {
    const query = status ? { status } : {};
    const skip = (page - 1) * limit;
    
    const [orders, totalCount] = await Promise.all([
      Order.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Order.countDocuments(query),
    ]);
    
    const totalPages = Math.ceil(totalCount / limit);
    
    return { 
      orders: orders.map(order => order.toObject<OrderDocument>()), 
      totalCount, 
      totalPages 
    };
  }
  
  public async updateOrderStatus(
    orderId: string | Types.ObjectId | number,
    status: OrderStatus
  ): Promise<OrderDocument> {
    // Find by id or _id based on type
    const order = typeof orderId === 'number'
      ? await Order.findOne({ id: orderId })
      : await Order.findById(orderId);
    
    if (!order) {
      throw new HttpException(404, 'Order not found');
    }
    
    const orderObj = order.toObject<OrderDocument>();
    
    // Handle cancellation logic
    if (status === 'cancelled' && orderObj.status !== 'cancelled') {
      // Restore product stock
      const orderItems = await OrderItem.find({ orderId: orderObj.id });
      
      await Promise.all(
        orderItems.map(async (item) => {
          const itemObj = item.toObject<OrderItemDocument>();
          await Product.findOneAndUpdate(
            { id: itemObj.productId },
            { $inc: { stock: itemObj.quantity } }
          );
        })
      );
    }
    
    // Update by numeric id if orderId is a number
    const updatedOrder = typeof orderId === 'number'
      ? await Order.findOneAndUpdate(
          { id: orderId },
          { 
            status,
            updatedAt: new Date().toISOString()
          },
          { new: true }
        )
      : await Order.findByIdAndUpdate(
          orderId,
          { 
            status,
            updatedAt: new Date().toISOString()
          },
          { new: true }
        );
    
    if (!updatedOrder) {
      throw new HttpException(404, 'Order not found');
    }
    
    return updatedOrder.toObject<OrderDocument>();
  }
  
  public async deleteOrder(orderId: string | Types.ObjectId | number): Promise<void> {
    // Find by id or _id based on type
    const order = typeof orderId === 'number'
      ? await Order.findOne({ id: orderId })
      : await Order.findById(orderId);
    
    if (!order) {
      throw new HttpException(404, 'Order not found');
    }
    
    const orderObj = order.toObject<OrderDocument>();
    
    // Restore product stock if order is not cancelled
    if (orderObj.status !== 'cancelled') {
      const orderItems = await OrderItem.find({ orderId: orderObj.id });
      
      await Promise.all(
        orderItems.map(async (item) => {
          const itemObj = item.toObject<OrderItemDocument>();
          await Product.findOneAndUpdate(
            { id: itemObj.productId },
            { $inc: { stock: itemObj.quantity } }
          );
        })
      );
    }
    
    // Delete order items
    await OrderItem.deleteMany({ orderId: orderObj.id });
    
    // Delete order by numeric id if orderId is a number
    typeof orderId === 'number'
      ? await Order.findOneAndDelete({ id: orderId })
      : await Order.findByIdAndDelete(orderId);
  }
}

export default new OrderService();
