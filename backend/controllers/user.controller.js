import User from '../models/user.model.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config()

export const registerUser = async (req, res) => {
    const { name, username, password } = req.body

    if (!name || !username || !password) {
        return res.status(400).json({
            success: false,
            message: "Please provide all the details"
        })
    }
    try {
        let user = await User.findOne({ username })
        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        user = new User({
            name,
            username,
            password: hashedPassword
        })

        await user.save()

        const payload = {
            user: {
                id: user.id
            }
        }
        const jwtSecret = req.jwtSecret;

        jwt.sign(payload, jwtSecret, { expiresIn: '1h' }, (err, token) => {
            if (err) {
                throw err
            }
            res.status(201).json({
                success: true,
                message: "User registration successful",
                token
            })
        })
    } catch (error) {
        console.error(error.message)
        res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
}

export const loginUser = async (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: "Please provide all the details"
        })
    }

    try {
        let user = await User.findOne({ username })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User does not exist!"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            })
        }

        const payload = {
            user: {
                id: user.id
            }
        }
        const jwtSecret = req.jwtSecret;

        jwt.sign(payload, jwtSecret, { 'expiresIn': '1h' }, (err, token) => {
            if (err) {
                console.error("Error in JWT signing:", err.message)
                return res.status(500).json({
                    success: false,
                    message: "Server error"
                })
            }
            res.status(200).json({
                success: true,
                message: "User login successful",
                token
            })
        })
    } catch (error) {
        console.error(error.message)
        res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
}