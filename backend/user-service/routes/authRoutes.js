import express from 'express';
import nodemailer from 'nodemailer';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import emailjs from '@emailjs/nodejs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const USERS_FILE = path.resolve(__dirname, '../../../database/users.json');

const router = express.Router();

// Mock OTP storage (In production, use Redis or a DB)
const otpStore = new Map();

// Generate a random 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Helper to read users
async function getUsers() {
    try {
        const data = await fs.readFile(USERS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

// Helper to save users
async function saveUsers(users) {
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
}

// Route: Register New User (Final Step after OTP and Password)
router.post('/register', async (req, res) => {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
        return res.status(400).json({ message: 'Email, Name, and Password are required' });
    }

    try {
        const users = await getUsers();
        let user = users.find(u => u.email === email);

        if (user) {
            // If user exists in local JSON but this is a new Firebase registration,
            // we update the local record.
            user.name = name;
            user.firstName = name.split(' ')[0];
            user.lastName = name.split(' ').length > 1 ? name.split(' ').slice(1).join(' ') : '';
            user.updatedAt = new Date().toISOString();
        } else {
            // Create new user in local JSON
            user = {
                id: `user_${Date.now()}`,
                firstName: name.split(' ')[0],
                lastName: name.split(' ').length > 1 ? name.split(' ').slice(1).join(' ') : '',
                name: name,
                email: email,
                role: 'user',
                createdAt: new Date().toISOString()
            };
            users.push(user);
        }

        await saveUsers(users);
        console.log(`[AUTH] User record synced/created: ${email}`);

        return res.json({
            success: true,
            message: 'Registration data saved successfully.',
            user: user
        });
    } catch (error) {
        console.error('Error during registration sync:', error);
        return res.status(500).json({ message: 'Failed to sync user data' });
    }
});

// Route: Send OTP
router.post('/send-otp', async (req, res) => {
    const { email, name } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const otp = generateOTP();
    otpStore.set(email, { otp, expiresAt: Date.now() + 600000 }); // 10 min expiry

    console.log(`[AUTH] OTP for ${email}: ${otp}`);

    try {
        if (process.env.EMAILJS_SERVICE_ID && process.env.EMAILJS_TEMPLATE_ID && process.env.EMAILJS_PUBLIC_KEY) {

            // Sending via @emailjs/nodejs SDK
            await emailjs.send(
                process.env.EMAILJS_SERVICE_ID,
                process.env.EMAILJS_TEMPLATE_ID,
                {
                    to_email: email,
                    user_email: email,
                    email: email,
                    reply_to: email,
                    to_name: name || email.split('@')[0],
                    otp: otp
                },
                {
                    publicKey: process.env.EMAILJS_PUBLIC_KEY,
                    privateKey: process.env.EMAILJS_PRIVATE_KEY,
                }
            );

            return res.json({ message: 'OTP sent successfully to your email' });

        } else {
            return res.json({
                message: 'OTP sent successfully (Development Mode: Check server console)',
                otp: otp
            });
        }
    } catch (error) {
        console.error('Error sending email:', error.message || error);
        console.warn('[AUTH] Falling back to Development Mode due to error.');
        return res.json({
            message: 'Email failed. Development Mode Fallback: OTP generated successfully. (Check console for OTP)',
            otp: otp
        });
    }
});

// Route: Verify OTP (Step 2 of Registration)
router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const storedData = otpStore.get(email);

    if (!storedData) {
        return res.status(400).json({ message: 'OTP not requested or expired' });
    }

    if (Date.now() > storedData.expiresAt) {
        otpStore.delete(email);
        return res.status(400).json({ message: 'OTP expired' });
    }

    if (storedData.otp !== otp) {
        return res.status(400).json({ message: 'Invalid OTP' });
    }

    // OTP Verified Successfully
    otpStore.delete(email);
    console.log(`[AUTH] OTP verified for: ${email}`);

    return res.json({
        success: true,
        message: 'OTP verified successfully'
    });
});

export default router;
