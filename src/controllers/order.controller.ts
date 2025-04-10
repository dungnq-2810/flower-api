import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import orderService from "../services/order.service";
import { validate } from "../middlewares/validation.middleware";
import {
  createOrderSchema,
  updateOrderStatusSchema,
} from "../validations/order.validation";
import { HttpException } from "../middlewares/error.middleware";

export class OrderController {
  public createOrder = [
    validate(createOrderSchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        if (!req.user) {
          throw new HttpException(401, "Authentication required");
        }

        const body = req.body;

        const order = await orderService.createOrder(body);

        res.status(201).json({
          status: "success",
          data: {
            order,
          },
        });
      } catch (error) {
        next(error);
      }
    },
  ];

  public getOrderById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const orderId = req.params.id;

      if (!req.user) {
        throw new HttpException(401, "Authentication required");
      }

      const { order, items } = await orderService.getOrderById(orderId);

      // Check if user owns the order or is an admin
      // Handle both numeric IDs and MongoDB ObjectIds
      let userIdMatches = false;
      if (typeof order.userId === "number" && typeof req.user.id === "number") {
        userIdMatches = order.userId === req.user.id;
      } else if (typeof order.userId === "object" && order.userId) {
        const userId = order.userId as any; // Use type assertion to bypass TypeScript restrictions
        if (typeof userId.equals === "function") {
          userIdMatches = userId.equals(req.user.id);
        }
      } else if (String(order.userId) === String(req.user.id)) {
        userIdMatches = true;
      }

      if (!userIdMatches && req.user.role !== "admin") {
        throw new HttpException(
          403,
          "You do not have permission to view this order"
        );
      }

      res.status(200).json({
        status: "success",
        data: {
          order,
          items,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public getUserOrders = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new HttpException(401, "Authentication required");
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      console.log(req.user);

      const result = await orderService.getUserOrders(req.user.id, page, limit);

      res.status(200).json({
        status: "success",
        data: {
          data: result.orders,
          totalCount: result.totalCount,
          totalPages: result.totalPages,
          currentPage: page,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public getAllOrders = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as any;

      const result = await orderService.getAllOrders(page, limit, status);

      res.status(200).json({
        status: "success",
        data: {
          orders: result.orders,
          totalCount: result.totalCount,
          totalPages: result.totalPages,
          currentPage: page,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public updateOrderStatus = [
    validate(updateOrderStatusSchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const orderId = req.params.id;
        const { status } = req.body;

        if (!req.user) {
          throw new HttpException(401, "Authentication required");
        }

        // Get the order first to check ownership
        const { order } = await orderService.getOrderById(orderId);

        // Handle both numeric IDs and MongoDB ObjectIds
        let userIdMatches = false;
        if (
          typeof order.userId === "number" &&
          typeof req.user.id === "number"
        ) {
          userIdMatches = order.userId === req.user.id;
        } else if (typeof order.userId === "object" && order.userId) {
          const userId = order.userId as any; // Use type assertion to bypass TypeScript restrictions
          if (typeof userId.equals === "function") {
            userIdMatches = userId.equals(req.user.id);
          }
        } else if (String(order.userId) === String(req.user.id)) {
          userIdMatches = true;
        }

        // Only admins can update order status (except for cancellation)
        if (
          req.user.role !== "admin" &&
          !(status === "cancelled" && userIdMatches)
        ) {
          throw new HttpException(
            403,
            "You do not have permission to update this order"
          );
        }

        const updatedOrder = await orderService.updateOrderStatus(
          orderId,
          status
        );

        res.status(200).json({
          status: "success",
          data: {
            order: updatedOrder,
          },
        });
      } catch (error) {
        next(error);
      }
    },
  ];

  public deleteOrder = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const orderId = req.params.id;

      if (!req.user) {
        throw new HttpException(401, "Authentication required");
      }

      // Only admins can delete orders
      if (req.user.role !== "admin") {
        throw new HttpException(
          403,
          "You do not have permission to delete orders"
        );
      }

      await orderService.deleteOrder(orderId);

      res.status(200).json({
        status: "success",
        message: "Order deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new OrderController();
