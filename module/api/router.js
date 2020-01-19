const router = require('express').Router()
module.exports=router


router.route('/user').get((req, res)=>{
    res.send('{"name":"liu","age":34}')
}).post((req,res)=>{
    res.send('success')
}).put((req,res)=>{
    res.send("faild")
})