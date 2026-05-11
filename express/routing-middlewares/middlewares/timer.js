const timer=(req, res, next)=>{
    const start=Date.now()
    res.on('finish',()=>{
        const duration=Date.now()-start
        console.log(`Request to ${req.url} took ${duration}ms`)
    })
    next()
}

module.exports = timer;
