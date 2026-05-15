const express= require('express');
const router= express.Router();

const Post= require('../models/Post');
const Comment= require('../models/Comments');

router.get('/:id', async (req, res)=>{
    try{
        const post = await Post.findById(req.params.id)
                    .populate('author', 'firstName email') 

        const comments= await Comment.find({ post: req.params.id })
                    .populate('author', 'firstName email')

        res.json({ post, comments })
        
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports=router