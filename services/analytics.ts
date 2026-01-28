
/**
 * AnalyticsService - Abstraction for Meta Pixel and Google Analytics (GTM/gtag)
 * Provides a unified way to track conversions and user behavior.
 */

declare global {
    interface Window {
        gtag?: (...args: any[]) => void;
        fbq?: (...args: any[]) => void;
    }
}

export const AnalyticsService = {
    /**
     * Track Page View
     */
    trackPageView: (url: string) => {
        // Google Analytics
        if (window.gtag) {
            window.gtag('config', 'G-XXXXXXXXXX', { page_path: url });
        }
        // Meta Pixel
        if (window.fbq) {
            window.fbq('track', 'PageView');
        }
    },

    /**
     * Track when a user views a specific product
     */
    trackViewContent: (product: any) => {
        if (window.gtag) {
            window.gtag('event', 'view_item', {
                currency: 'MXN',
                value: product.basePrice,
                items: [{
                    item_id: product.id,
                    item_name: product.name,
                    price: product.basePrice
                }]
            });
        }
        if (window.fbq) {
            window.fbq('track', 'ViewContent', {
                content_ids: [product.id],
                content_name: product.name,
                content_type: 'product',
                value: product.basePrice,
                currency: 'MXN'
            });
        }
    },

    /**
     * Track when a product is added to cart
     */
    trackAddToCart: (product: any, quantity: number) => {
        if (window.gtag) {
            window.gtag('event', 'add_to_cart', {
                items: [{
                    item_id: product.id,
                    item_name: product.name,
                    price: product.price,
                    quantity: quantity
                }]
            });
        }
        if (window.fbq) {
            window.fbq('track', 'AddToCart', {
                content_ids: [product.id],
                content_name: product.name,
                content_type: 'product',
                value: product.price * quantity,
                currency: 'MXN'
            });
        }
    },

    /**
     * Track beginning of checkout
     */
    trackInitiateCheckout: (cart: any[], total: number) => {
        if (window.gtag) {
            window.gtag('event', 'begin_checkout', {
                value: total,
                currency: 'MXN',
                items: cart.map(item => ({
                    item_id: item.productId,
                    item_name: item.name,
                    price: item.price,
                    quantity: item.quantity
                }))
            });
        }
        if (window.fbq) {
            window.fbq('track', 'InitiateCheckout', {
                content_ids: cart.map(item => item.productId),
                content_type: 'product',
                value: total,
                currency: 'MXN'
            });
        }
    },

    /**
     * Track successful purchase
     */
    trackPurchase: (orderId: string, total: number, cart: any[]) => {
        if (window.gtag) {
            window.gtag('event', 'purchase', {
                transaction_id: orderId,
                value: total,
                currency: 'MXN',
                items: cart.map(item => ({
                    item_id: item.productId,
                    item_name: item.name,
                    price: item.price,
                    quantity: item.quantity
                }))
            });
        }
        if (window.fbq) {
            window.fbq('track', 'Purchase', {
                content_ids: cart.map(item => item.productId),
                content_type: 'product',
                value: total,
                currency: 'MXN'
            });
        }
    }
};
