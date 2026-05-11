const express = require('express');
const router = express.Router();

let products=[
    {id:1,name:'Laptop',price:999.99},
    {id:2,name:'Mouse',price:29.99},
    {id:3,name:'Keyboard',price:79.99}
]

router.get('/', (req,res)=>{
    res.status(200).json(products)
})

router.get('/:id', (req,res)=>{
    const productId=parseInt(req.params.id)
    const product=products.find(p=>p.id===productId) 
    if(!product){
        return res.status(404).json({message:'Product not found'})
    }
    res.status(200).json(product)
})

module.exports = router;