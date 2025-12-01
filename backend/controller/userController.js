import UserModel from "../model/userModel.js";
import jwt from 'jsonwebtoken';
import validator from 'validator'
import bcrypt from 'bcrypt'
import 'dotenv/config'

export const loginUser = async (req,res) => {
    const {email, password}  = req.body;
    try {
        const user = await UserModel.findOne({email})
        if (!user) {
            return res.json({success: true, message:"User doen't exists"})
        }
        const isMatch = await bcrypt.compare(password,user.password)
        if (!isMatch) {
            return res.json({success:false,message:"Invalid credentials"})
        }
        const token = createToken(user._id)
        res.json({success:true,token})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"})
    }
}

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

export const registerUser = async (req, res) => {

    try {
        const { email, password } = req.body;

        //if you is already exists
        const exists = UserModel.findOne({ email });
        if (exists) {
            res.json({ success: true, message: "User is already have an account." })
        }

        //validation of email format & strong password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter valid email." })
        }
        if (password.length < 6) {
            return res.json({ success: false, message: "Please enter strong passwod" })
        }

        //hashing user password
        const salt = await bcrypt.genSalt(10);
        const hasshedPassword = await bcrypt.hash(password, salt);
        const newUser = new UserModel({
            email: email,
            password: hasshedPassword
        })
        const user = await newUser.save();
        const token = createToken(user._id)
        res.json({ success: true, token })
    } catch (error) {
        console.log(error);
        res.json({success: false, message:"Error"})
    }
}

// Get user data by userId
export const getUserData = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        // Find user by ID and exclude password
        const user = await UserModel.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user: {
                _id: user._id,
                email: user.email,
                name: user.name || null,
                createdAt: user.createdAt,
                // Add any other fields you want to return
            }
        });

    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({
            success: false,
            message: "Server error while fetching user data"
        });
    }
};

// Update user profile (optional)
export const updateUserProfile = async (req, res) => {
    try {
        const { userId, name, email } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser
        });

    } catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).json({
            success: false,
            message: "Server error while updating profile"
        });
    }
};

