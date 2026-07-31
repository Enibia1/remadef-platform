/* ==========================================================
   REMADEF PLATFORM
   Marketplace Service
   File: src/services/marketplace.service.ts

   NOTE:
   Marketplace remains DORMANT in REMADEF v1.
   This service is production-ready but can be disabled
   through Feature Flags until marketplace launch.
========================================================== */

import Client from "./client";
import ENDPOINTS from "../config/endpoints";

import type {
    ApiResponse,
    ListResponse
} from "../types/api";

import type {
    Product,
    ProductCategory,
    ProductReview,
    Cart,
    CartItem,
    Order,
    Wishlist,
    MarketplaceFilter,
    CreateProductRequest,
    UpdateProductRequest,
    CheckoutRequest
} from "../types/marketplace";

class MarketplaceService {

    /* ======================================================
       PRODUCTS
    ====================================================== */

    getProducts(
        page = 1,
        limit = 20,
        filter?: MarketplaceFilter
    ): Promise<ListResponse<Product>> {

        const params = new URLSearchParams({

            page: String(page),

            limit: String(limit)

        });

        if (filter) {

            Object.entries(filter).forEach(

                ([key, value]) => {

                    if (
                        value !== undefined &&
                        value !== null
                    ) {

                        params.append(
                            key,
                            String(value)
                        );

                    }

                }

            );

        }

        return Client.get(

            `${ENDPOINTS.MARKETPLACE.PRODUCTS}?${params.toString()}`,

            {
                cache: true,
                cacheTTL: 60000
            }

        );

    }

    getProduct(
        productId: string
    ): Promise<ApiResponse<Product>> {

        return Client.get(

            `${ENDPOINTS.MARKETPLACE.PRODUCTS}/${encodeURIComponent(productId)}`

        );

    }

    /* ======================================================
       CATEGORIES
    ====================================================== */

    getCategories(): Promise<ApiResponse<ProductCategory[]>> {

        return Client.get(

            ENDPOINTS.MARKETPLACE.CATEGORIES,

            {
                cache: true,
                cacheTTL: 300000
            }

        );

    }

    /* ======================================================
       SELLER
    ====================================================== */

    createProduct(
        data: CreateProductRequest
    ): Promise<ApiResponse<Product>> {

        return Client.post(

            ENDPOINTS.MARKETPLACE.PRODUCTS,

            data

        );

    }

    updateProduct(
        productId: string,
        data: UpdateProductRequest
    ): Promise<ApiResponse<Product>> {

        return Client.put(

            `${ENDPOINTS.MARKETPLACE.PRODUCTS}/${encodeURIComponent(productId)}`,

            data

        );

    }

    deleteProduct(
        productId: string
    ): Promise<ApiResponse> {

        return Client.delete(

            `${ENDPOINTS.MARKETPLACE.PRODUCTS}/${encodeURIComponent(productId)}`

        );

    }

    /* ======================================================
       CART
    ====================================================== */

    getCart(): Promise<ApiResponse<Cart>> {

        return Client.get(

            ENDPOINTS.MARKETPLACE.CART

        );

    }

    addToCart(
        item: CartItem
    ): Promise<ApiResponse<Cart>> {

        return Client.post(

            ENDPOINTS.MARKETPLACE.CART,

            item

        );

    }

    updateCartItem(
        itemId: string,
        quantity: number
    ): Promise<ApiResponse<Cart>> {

        return Client.patch(

            `${ENDPOINTS.MARKETPLACE.CART}/${encodeURIComponent(itemId)}`,

            {
                quantity
            }

        );

    }

    removeFromCart(
        itemId: string
    ): Promise<ApiResponse<Cart>> {

        return Client.delete(

            `${ENDPOINTS.MARKETPLACE.CART}/${encodeURIComponent(itemId)}`

        );

    }

    clearCart(): Promise<ApiResponse> {

        return Client.delete(

            ENDPOINTS.MARKETPLACE.CART

        );

    }

    /* ======================================================
       WISHLIST
    ====================================================== */

    getWishlist(): Promise<ApiResponse<Wishlist>> {

        return Client.get(

            ENDPOINTS.MARKETPLACE.WISHLIST

        );

    }

    addToWishlist(
        productId: string
    ): Promise<ApiResponse> {

        return Client.post(

            ENDPOINTS.MARKETPLACE.WISHLIST,

            {
                productId
            }

        );

    }

    removeFromWishlist(
        productId: string
    ): Promise<ApiResponse> {

        return Client.delete(

            `${ENDPOINTS.MARKETPLACE.WISHLIST}/${encodeURIComponent(productId)}`

        );

    }

    /* ======================================================
       ORDERS
    ====================================================== */

    checkout(
        data: CheckoutRequest
    ): Promise<ApiResponse<Order>> {

        return Client.post(

            ENDPOINTS.MARKETPLACE.CHECKOUT,

            data

        );

    }

    getOrders(): Promise<ListResponse<Order>> {

        return Client.get(

            ENDPOINTS.MARKETPLACE.ORDERS

        );

    }

    getOrder(
        orderId: string
    ): Promise<ApiResponse<Order>> {

        return Client.get(

            `${ENDPOINTS.MARKETPLACE.ORDERS}/${encodeURIComponent(orderId)}`

        );

    }

    /* ======================================================
       REVIEWS
    ====================================================== */

    getReviews(
        productId: string
    ): Promise<ApiResponse<ProductReview[]>> {

        return Client.get(

            `${ENDPOINTS.MARKETPLACE.PRODUCTS}/${encodeURIComponent(productId)}/reviews`

        );

    }

}
export default new MarketplaceService();
