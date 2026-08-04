/* ==========================================================
   REMADEF PLATFORM
   Marketplace Types
   File: src/types/marketplace.ts
========================================================== */

import type {
    BaseEntity,
    UserReference,
    Pagination,
    Money,
    Attachment
} from "./common";

/* ==========================================================
   CATEGORY
========================================================== */

export interface ProductCategory
    extends BaseEntity {

    name: string;

    slug: string;

    description?: string;

    icon?: string;

    image?: string;

    parentId?: string;

}

/* ==========================================================
   PRODUCT STATUS
========================================================== */

export type ProductStatus =
    | "draft"
    | "active"
    | "out-of-stock"
    | "archived";

/* ==========================================================
   PRODUCT
========================================================== */

export interface Product
    extends BaseEntity {

    seller: UserReference;

    category: ProductCategory;

    name: string;

    slug: string;

    description: string;

    shortDescription?: string;

    sku?: string;

    images: Attachment[];

    thumbnail?: string;

    price: Money;

    discountPrice?: Money;

    currency: string;

    quantity: number;

    rating: number;

    reviewCount: number;

    status: ProductStatus;

    featured: boolean;

    verified: boolean;

    tags: string[];

}

/* ==========================================================
   REVIEW
========================================================== */

export interface ProductReview
    extends BaseEntity {

    productId: string;

    user: UserReference;

    rating: number;

    title?: string;

    comment: string;

}

/* ==========================================================
   CART ITEM
========================================================== */

export interface CartItem {

    id: string;

    product: Product;

    quantity: number;

    unitPrice: Money;

    total: Money;

}

/* ==========================================================
   CART
========================================================== */

export interface Cart {

    items: CartItem[];

    subtotal: Money;

    discount: Money;

    tax: Money;

    shipping: Money;

    total: Money;

    currency: string;

}

/* ==========================================================
   WISHLIST
========================================================== */

export interface Wishlist {

    items: Product[];

    total: number;

}

/* ==========================================================
   ORDER STATUS
========================================================== */

export type OrderStatus =
    | "pending"
    | "processing"
    | "paid"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "refunded";

/* ==========================================================
   ORDER
========================================================== */

export interface Order
    extends BaseEntity {

    orderNumber: string;

    buyer: UserReference;

    seller: UserReference;

    items: CartItem[];

    subtotal: Money;

    tax: Money;

    shipping: Money;

    total: Money;

    currency: string;

    status: OrderStatus;

    paymentStatus:
        | "pending"
        | "paid"
        | "failed"
        | "refunded";

}

/* ==========================================================
   FILTER
========================================================== */

export interface MarketplaceFilter {

    category?: string;

    seller?: string;

    minPrice?: number;

    maxPrice?: number;

    rating?: number;

    featured?: boolean;

    verified?: boolean;

    query?: string;

    sort?:
        | "latest"
        | "price-asc"
        | "price-desc"
        | "rating";

}

/* ==========================================================
   CREATE PRODUCT
========================================================== */

export interface CreateProductRequest {

    categoryId: string;

    name: string;

    description: string;

    price: number;

    quantity: number;

    images: string[];

    tags?: string[];

}

/* ==========================================================
   UPDATE PRODUCT
========================================================== */

export interface UpdateProductRequest {

    categoryId?: string;

    name?: string;

    description?: string;

    price?: number;

    quantity?: number;

    images?: string[];

    status?: ProductStatus;

    tags?: string[];

}

/* ==========================================================
   CHECKOUT
========================================================== */

export interface CheckoutRequest {

    addressId: string;

    paymentMethod: string;

    note?: string;

}

/* ==========================================================
   PRODUCT PAGE
========================================================== */

export interface ProductPage {

    items: Product[];

    pagination: Pagination;

}
