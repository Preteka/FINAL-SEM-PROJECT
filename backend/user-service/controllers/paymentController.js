import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

let razorpay;
try {
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
        console.warn("[RAZORPAY] Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET. Payment functionality will be disabled.");
    } else {
        razorpay = new Razorpay({
            key_id: key_id,
            key_secret: key_secret,
        });
        console.log("[RAZORPAY] Razorpay initialized successfully");
    }
} catch (error) {
    console.error("[RAZORPAY] Initialization failed:", error.message);
}


export const createOrder = async (req, res) => {
    const { amount, currency = 'INR', receipt } = req.body;

    try {
        const options = {
            amount: amount * 100, // razorpay expects amount in paise
            currency,
            receipt,
        };

        const order = await razorpay.orders.create(options);
        res.status(200).json(order);
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({ message: 'Failed to create payment order', error });
    }
};

export const verifyPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    
    // Check if user is still using the placeholder
    if (key_secret === 'your_razorpay_key_secret_here') {
        console.warn("[RAZORPAY] CRITICAL: You are still using the placeholder 'your_razorpay_key_secret_here' in .env. Signature verification will always fail.");
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
        .createHmac("sha256", key_secret)
        .update(sign.toString())
        .digest("hex");

    if (razorpay_signature === expectedSign) {
        console.log("[RAZORPAY] Payment verified successfully for order:", razorpay_order_id);
        return res.status(200).json({ message: "Payment verified successfully" });
    } else {
        // DEV MODE BYPASS
        if (key_secret === 'your_razorpay_key_secret_here') {
            console.warn("[RAZORPAY] DEV MODE: Bypassing signature verification because placeholder secret is detected.");
            console.warn("               In production, this MUST be fixed (replace secret in .env).");
            return res.status(200).json({ message: "Payment verified successfully (DEV MODE BYPASS)" });
        }

        console.error("[RAZORPAY] Signature Mismatch!");
        console.error("  - Expected (calculated):", expectedSign.substring(0, 10) + "...");
        console.error("  - Received (from RZP):", razorpay_signature.substring(0, 10) + "...");
        console.error("  - Check your RAZORPAY_KEY_SECRET in .env");
        
        return res.status(400).json({ message: "Invalid signature sent! Ensure your RAZORPAY_KEY_SECRET is correct in the backend .env file." });
    }
};
