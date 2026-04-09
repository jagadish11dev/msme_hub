const User = require('../models/User');
const bcrypt = require('bcryptjs');
const twilio = require('twilio');
const jwt = require('jsonwebtoken');

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_123';

/**
 * @desc    Register a new user and send WhatsApp OTP
 * @route   POST /api/auth/register
 */
const registerUser = async (req, res) => {
    try {
        console.log('--- [DEBUG] Incoming Registration Request ---');
        console.log('Body:', req.body);
        const { name, phoneNumber, city, email, password, role } = req.body;

        if (!name || !phoneNumber || !city || !password) {
            return res.status(400).json({ error: 'Please provide all required fields (name, phoneNumber, city, password)' });
        }

        // Check if user already exists
        let user = await User.findOne({ phoneNumber });
        
        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        const hashedPassword = await bcrypt.hash(password, 10);

        if (user) {
            // Update existing user (re-registration or password reset attempt)
            user.name = name;
            user.city = city;
            user.email = email || user.email;
            user.password = hashedPassword;
            user.role = role || user.role;
            user.otp = otp;
            user.otpExpires = otpExpires;
            user.isVerified = false; // Reset verification
        } else {
            // Create new user
            user = new User({
                name,
                phoneNumber,
                city,
                email,
                password: hashedPassword,
                role: role || 'buyer',
                otp,
                otpExpires,
                isVerified: false
            });
        }

        await user.save();

        // LOG OTP BEFORE SENDING
        console.log(`\n--- [DEBUG] Generated OTP for ${phoneNumber}: ${otp} ---\n`);

        // Send WhatsApp via Twilio
        // Note: The phone number must be in E.164 format (e.g., +91...)
        try {
            await client.messages.create({
                from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
                to: `whatsapp:${phoneNumber}`,
                body: `Your SupplyAdda verification code is: ${otp}. It will expire in 10 minutes.`
            });
            console.log(`OTP sent message triggered via Twilio to WhatsApp: ${phoneNumber}`);
        } catch (twilioError) {
            console.error('Twilio Error:', twilioError.message);
            // In a real app, we might want to still return 201 but notify about OTP failure
            return res.status(500).json({ error: 'User registered but failed to send WhatsApp OTP. Please try again later.' });
        }

        return res.status(201).json({ 
            message: 'User registered successfully. Please verify your WhatsApp number.',
            phoneNumber 
        });

    } catch (error) {
        console.error('Registration Error:', error.message);
        return res.status(500).json({ error: 'Server error during registration.' });
    }
};

/**
 * @desc    Verify WhatsApp OTP
 * @route   POST /api/auth/verify-otp
 */
const verifyOtp = async (req, res) => {
    try {
        const { phoneNumber, otp } = req.body;

        if (!phoneNumber || !otp) {
            return res.status(400).json({ error: 'Phone number and OTP are required.' });
        }

        const user = await User.findOne({ phoneNumber });

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ error: 'Invalid or expired OTP.' });
        }

        // Mark as verified and clear OTP
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

        return res.json({ 
            message: 'WhatsApp number verified successfully!', 
            token,
            user: {
                id: user._id,
                name: user.name,
                phoneNumber: user.phoneNumber,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Verification Error:', error.message);
        return res.status(500).json({ error: 'Server error during verification.' });
    }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 */
const loginUser = async (req, res) => {
    try {
        const { phoneNumber, password } = req.body;

        if (!phoneNumber || !password) {
            return res.status(400).json({ error: 'Phone number and password are required.' });
        }

        const user = await User.findOne({ phoneNumber });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        if (!user.isVerified) {
            return res.status(403).json({ error: 'Account not verified. Please verify your WhatsApp number.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

        return res.json({ 
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                phoneNumber: user.phoneNumber,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login Error:', error.message);
        return res.status(500).json({ error: 'Server error during login.' });
    }
};

module.exports = {
    registerUser,
    verifyOtp,
    loginUser
};
