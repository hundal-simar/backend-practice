const express= require('express');
const mongoose= require('mongoose');
const User= require('../models/User');

const router= express.Router();

// creating a user

router.post('/', async (req,res)=>{
    try {
        const user= new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})

// get all users

router.get('/', async (req,res)=>{
    try {
        const users= await User.find();
        res.status(200).json(users);  
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

// get user by id

router.get('/:id', async (req,res)=>{
    try {
        const user= await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

// update user by id

router.put('/:id', async (req,res)=>{
    try{
        const user= await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

// delete user by id

router.delete('/:id', async (req, res)=>{
    try{
        const user= await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

//get all projects and task assigned to a user

router.get('/:id/projects', async (req, res)=>{
    try{
        const projects= await User.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(req.params.id) }
            },
            {
                $lookup:{
                    from: 'projects',
                    localField: '_id',
                    foreignField: 'owner',
                    as: 'projects'
                }
            },
            {
                $addFields: {
                    totalprojects: { $size: '$projects' }
                }
            }
        ])
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

module.exports=router