const express= require('express');
const {MongoClient, ObjectId} = require('mongodb');
const app= express();
app.use(express.json());

const url= 'mongodb://localhost:27017/';

const client= new MongoClient(url);

let booksCollection;

async function connectDB(){
    try{
        await client.connect();
        const db= client.db('booksDB');
        booksCollection= db.collection('books');
        console.log('Connected to MongoDB');
        app.listen(3000, ()=> console.log('Server running on port 3000'));
    }catch(err){
        console.error('Error connecting to MongoDB', err);
    }
}

connectDB();

app.post('/books', async (req,res)=>{
    try{
        const result= await booksCollection.insertOne(req.body);
        res.send(result);
    } catch(err){
        console.error('Error adding book', err);
        res.status(500).send('Error adding book');
    }
})

app.get('/books', async (req,res)=>{
    try{
        const books= await booksCollection.find().toArray();
        res.json(books);
    }catch(err){
        console.error('Error fetching books', err);
        res.status(500).send('Error fetching books');
    }
})

app.get('/books/:id', async (req,res)=>{
    try{
        const book = await booksCollection.findOne({ _id: new ObjectId(req.params.id)})
        res.json(book);
    }
    catch(err){
        console.error('Error fetching book', err);      
        res.status(500).send('Error fetching book');
    }
})

app.put('/books/:id', async (req,res)=>{
    try{
        const result= await booksCollection.updateOne({ _id: new ObjectId(req.params.id)}, {$set: req.body});
        res.json(result);
    }catch(err){
        console.error('Error updating book', err);
        res.status(500).send('Error updating book');
    }
})

app.delete('/books/:id', async (req,res)=>{
    try{
        const result= await booksCollection.deleteOne({ _id: new ObjectId(req.params.id)});
        res.json(result);
    }catch(err){
        console.error('Error deleting book', err);
        res.status(500).send('Error deleting book');
    }
});



