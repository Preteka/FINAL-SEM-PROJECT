import Razorpay from 'razorpay';
import dotenv from 'dotenv';
dotenv.config();

console.log("RAZORPAY_KEY_ID exists:", !!process.env.RAZORPAY_KEY_ID);

try {
    const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    console.log("Razorpay initialized successfully");
} catch (error) {
    console.error("Failed to initialize Razorpay:", error.message);
}
