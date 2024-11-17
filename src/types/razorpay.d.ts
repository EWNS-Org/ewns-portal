// src/types/razorpay.d.ts

// Declare Razorpay options interface (based on the Razorpay documentation)
interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    handler: (response: any) => void;
    prefill?: {
        name: string;
        email: string;
        contact: string;
    };
    theme?: {
        color: string;
    };
}

// Declare the Razorpay interface
interface RazorpayInstance {
    open(): void;
}

// Extend the Window interface
interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
}
