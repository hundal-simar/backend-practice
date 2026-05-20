const express = require('express');
const mongoose = require('mongoose');
const Project = require('../models/Comment');

const router = express.Router();

//create a comment

router.post('/', async (req,res)=>{
    try{
        const comment= new Comment(req.body);
        await comment.save();
        res.status(201).json(comment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})

// get all comments for a task

router.get('/task/:taskId', async (req,res)=>{
    try{
        const comments= await Comment.find({ task: req.params.taskId }).populate('author', 'name email');
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

// get comment by id
router.get('/:id', async (req,res)=>{
    try{
        const comment= await Comment.findById(req.params.id).populate('author', 'name email');
        res.status(200).json(comment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})


/// update comment by id

router.put('/:id', async (req,res)=>{
    try{
        const comment= await Comment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        res.status(200).json(comment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

// delete comment by id

router.delete('/:id', async (req, res)=>{  
    try{
        const comment= await Comment.findByIdAndDelete(req.params.id);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

module.exports=router