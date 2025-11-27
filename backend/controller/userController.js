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

