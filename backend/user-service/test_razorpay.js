import fetch from 'node-fetch';

const BACKEND_URL = "https://final-sem-project-2.onrender.com/";

async function testRazorpay() {
    console.log("Testing Razorpay Order Creation...");
    try {
        const response = await fetch(`${BACKEND_URL}/api/payment/create-order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amount: 100, // 100 INR
                currency: 'INR',
                receipt: 'test_receipt_123'
            })
        });

        const data = await response.json();
        if (response.ok) {
            console.log("SUCCESS: Razorpay Order Created:", data.id);
        } else {
            console.error("FAILED: Order Creation:", data);
        }
    } catch (error) {
        console.error("ERROR: Could not connect to backend:", error.message);
    }
}

testRazorpay();
