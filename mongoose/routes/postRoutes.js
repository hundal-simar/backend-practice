const express= require('express');
const router= express.Router();

const Post= require('../models/Post');
const Comment= require('../models/Comments');

router.get('/:id', async (req, res)=>{
    try{
        const {tag, sort, page=1, limit=5, search}=req.query
        let filter={};
        if(tag){
            filter.tags=tag
        }
         if(search){
            filter.title={$regex: search, $options: 'i'}
         }

         const skip=(page-1)*limit

        const post = await Post.find(req.filter)
                    .sort(sort)
                    .select("title tags createdAt author")
                    .skip(skip)
                    .limit(limit)
                    .populate('author', 'firstName email') 

        const comments= await Comment.find({ post: req.params.id })
                    .populate('author', 'firstName email')

        res.json({ post, comments })
        
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.get('/stats/author', async (req,res)=>{
    try{
        const stats=await Post.aggregate([
            {$group:{_id: "$author", postCount: {$sum:1}}},
            {$sort: {postCount: -1}}
        ])
        res.json(stats)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post('/', async (req, res)=>{
    try {
        const { title, body, author, tags } = req.body;
        const newPost = new Post({ title, body, author, tags, isPublished: true });
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})

module.exports=router