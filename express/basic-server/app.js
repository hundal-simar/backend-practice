const express = require('express');
const app = express();

app.use(express.json());

let users=[
    {id:1,name:'Alice'},
    {id:2,name:'Bob'},
    {id:3,name:'Charlie'}
]

app.get('/users',(req,res)=>{
    res.status(200).json(users)
})

app.post('/users',(req,res)=>{
    const newUser=req.body
    users.push(newUser)
    res.status(201).json(newUser)
})

app.use((req,res)=>{
    res.status(404).json({error:'Not Found'})
})

app.listen(5000,()=>console.log('Server running on port 5000')) 