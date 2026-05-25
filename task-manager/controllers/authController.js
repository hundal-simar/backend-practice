const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User= require('../models/User')
const { generateAccessToken, generateRefreshToken }= require('../utils/generateTokens');

const register= async (req, res)=>{
    try{
        const { name, email, password }= req.body;
        const existingUser= await User.findOne({email})
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword= await bcrypt.hash(password, 10);
        const user= new User({ name, email, password: hashedPassword });
        const accessToken= generateAccessToken(user._id);
        const refreshToken= generateRefreshToken(user._id);
        user.refreshToken= refreshToken;
        await user.save();
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'Strict' });
        res.status(201).json({user, accessToken });
    }catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const login= async (req, res)=>{
    try{
        const { email, password }= req.body;
        const user= await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch= await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const accessToken= generateAccessToken(user._id);
        const refreshToken= generateRefreshToken(user._id);
        user.refreshToken= refreshToken;
        await user.save();
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'Strict' });
        res.status(200).json({ user, accessToken });
    }catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getMe= async (req,res)=>{
    res.json(req.user);
}

const refreshAccessToken= async (req,res)=>{
    try{
        const refreshToken= req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ message: 'No refresh token provided' });
        }
        const decoded= jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user= await User.findById(decoded.id);
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }
        const newAccessToken= generateAccessToken(user._id);
        res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
        res.status(401).json({ message: 'Invalid refresh token' });
    }
}

const logout= async (req,res)=>{
    try{
        const refreshToken= req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(400).json({ message: 'No refresh token provided' });
        }
        const decoded= jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user= await User.findById(decoded.id);
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }
        user.refreshToken= undefined;
        await user.save();
        res.clearCookie('refreshToken');
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports= { register, login, getMe, refreshAccessToken, logout }