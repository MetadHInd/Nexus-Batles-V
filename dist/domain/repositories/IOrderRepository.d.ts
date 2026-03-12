import { Order } from "../entities/Order";
export interface OrderRepository {
    createOrderWithItems(userId: number, items: {
        productId: number;
        quantity: number;
        price: number;
    }[]): Promise<void>;
    findByUser(userId: number): Promise<Order[]>;
}
