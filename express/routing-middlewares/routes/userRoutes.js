const express = require('express');
const router=express.Router();

let users=[
    {id:1,name:'Alice'},
    {id:2,name:'Bob'},
    {id:3,name:'Charlie'},
]

router.get('/', (req,res)=>{
    res.status(200).json(users)
})

router.get('/:id', (req,res)=>{
    const userId=parseInt(req.params.id)
    const user=users.find(u=>u.id===userId) 
    if(!user){
        return res.status(404).json({message:'User not found'})
    }
    res.status(200).json(user)
})

router.post('/', (req,res)=>{
    const newUser=req.body
    users.push(newUser)
    res.status(201).json(newUser)
})

module.exports=router;