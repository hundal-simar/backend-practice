const mongoose= require('mongoose');
const express= require('express');
const router= express.Router();
const Author= require('../models/User');

router.post('/', async (req, res)=>{
    try{
        const { firstName, lastName, email, password, role } = req.body;
        const newAuthor = new Author({ firstName, lastName, email, password, role });
        const savedAuthor = await newAuthor.save();
        res.status(201).json(savedAuthor);  
    }catch(error){
        res.status(400).json({ message: error.message });
    }
})

router.get('/', async (req, res)=>{
    try{
        const authors = await Author.find();
        res.json(authors);
    }catch(error){
        res.status(500).json({ message: error.message });
    }
})

module.exports=router