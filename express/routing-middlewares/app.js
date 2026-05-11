const express=require('express');
const app=express();

app.use(express.json());

const userRoutes=require('./routes/userRoutes');
const productRoutes=require('./routes/productRoutes');
const logger=require('./middlewares/logger');
const timer=require('./middlewares/timer');
const errorHandler=require('./middlewares/errorHandler');


app.use(logger);
app.use(timer);
app.use('/users', userRoutes);
app.use('/products', productRoutes);

app.use((req,res)=>{
    res.status(404).json({error:'Not Found'})
})

app.use(errorHandler);
app.listen(5000,()=>console.log('Server running on port 5000'))