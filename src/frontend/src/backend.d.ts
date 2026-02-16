import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type OrderId = string;
export type Time = bigint;
export interface OrderItem {
    productId: ProductId;
    quantity: bigint;
}
export type ProductId = string;
export interface Order {
    id: OrderId;
    status: OrderStatus;
    total: bigint;
    userId: Principal;
    timestamp: Time;
    items: Array<OrderItem>;
}
export interface UserProfile {
    name: string;
    email: string;
    phone: string;
    phoneVerified: boolean;
}
export interface Product {
    id: ProductId;
    published: boolean;
    name: string;
    description: string;
    stock: bigint;
    category: Category;
    price: bigint;
}
export enum Category {
    electronics = "electronics",
    homeDecor = "homeDecor"
}
export enum OrderStatus {
    cancelled = "cancelled",
    pending = "pending",
    completed = "completed"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    adminCreateProduct(product: Product): Promise<void>;
    adminGetAllProducts(): Promise<Array<Product>>;
    adminSetProductPublishStatus(productId: ProductId, published: boolean): Promise<void>;
    adminUpdateProduct(product: Product): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createOrder(items: Array<OrderItem>): Promise<OrderId>;
    getAllOrders(): Promise<Array<Order>>;
    getAllProducts(): Promise<Array<Product>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getOrder(orderId: OrderId): Promise<Order>;
    getOrdersByUser(userId: Principal): Promise<Array<Order>>;
    getProduct(productId: ProductId): Promise<Product>;
    getProductsByCategory(category: Category): Promise<Array<Product>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initializeShop(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    isPhoneVerified(phone: string): Promise<boolean>;
    requestPhoneVerification(phone: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    verifyPhoneVerificationCode(phone: string, code: string): Promise<boolean>;
}
