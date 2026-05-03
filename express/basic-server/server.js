const http=require('http');

let users=[
    {id:1,name:'Alice'},
    {id:2,name:'Bob'},
    {id:3,name:'Charlie'}
]

const server=http.createServer((req,res)=>{
    console.log(`[${req.method}] ${req.url}`)
    const {method,url}=req;

    if(method==='GET' && url==='/users'){
        res.setHeader('Content-Type','application/json')
        res.statusCode=200
        res.end(JSON.stringify(users))
    }

    else if(method==='POST' && url==='/users'){
        let body='';
        req.on('data',(chunk)=>{
            body+=chunk.toString()
        })
        req.on('end',()=>{
            const newUser=JSON.parse(body)
            users.push(newUser)
            res.setHeader('Content-Type','application/json')
            res.statusCode=201
            res.end(JSON.stringify(newUser))
        })
    }

    else{
        res.statusCode=404
        res.end(JSON.stringify({error:'Not Found'}))
    }
})

server.listen(5000,()=>console.log('Server running on port 5000'))