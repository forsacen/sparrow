const router = require('express').Router()
module.exports=router


router.route('/').get((req, res)=>{
    res.send('welcome')
}).post((req,res)=>{
    res.send('success')
}).put((req,res)=>{
    res.send("faild")
})