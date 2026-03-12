import { OrderRepository } from "@domain/repositories/IOrderRepository";
import { Order } from "../../domain/entities/Order";
export declare class MySQLOrderRepository implements OrderRepository {
    createOrderWithItems(userId: number, items: {
        productId: number;
        quantity: number;
        price: number;
    }[]): Promise<void>;
    findByUser(userId: number): Promise<Order[]>;
}
