import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

export interface OrderItem {
    product: string;
    productName: string;
    productBrand: string;
    variantId?: string;
    variantSnapshot?: any;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
}

export interface Order {
    _id: string;
    orderNumber: string;
    items: OrderItem[];
    itemsSubtotal: number;
    discountTotal: number;
    shippingFee: number;
    totalAmount: number;
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    paymentMethod: string;
    placedAt: string;
    shippedAt?: string;
    deliveredAt?: string;
    cancelledAt?: string;
}

export const useOrders = () => {
    return useQuery({
        queryKey: ["orders", "me"],
        queryFn: async () => {
            const { data } = await api.get("/orders/my-orders");
            return data.orders as Order[];
        },
    });
};

export const useOrderDetails = (orderId: string) => {
    return useQuery({
        queryKey: ["orders", orderId],
        queryFn: async () => {
            const { data } = await api.get(`/orders/${orderId}`);
            return data.order as Order;
        },
        enabled: !!orderId,
    });
};

export interface Shipment {
    _id: string;
    order: string;
    courier: string;
    trackingNumber: string;
    status: "preparing" | "in_transit" | "out_for_delivery" | "delivered";
    shippedAt?: string;
    deliveredAt?: string;
}

export const useShipment = (shipmentId: string) => {
    return useQuery({
        queryKey: ["shipments", shipmentId],
        queryFn: async () => {
            const { data } = await api.get(`/shipments/${shipmentId}`);
            return data as Shipment;
        },
        enabled: !!shipmentId,
    });
};
