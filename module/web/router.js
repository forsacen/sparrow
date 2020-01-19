const router = require('express').Router()
module.exports=router
const middleWare=require('./middleware')
router.use(middleWare.checkPlaform)

router.route('/').get((req, res)=>{
    res.render(req.platform+'/index.html',{uname:'Brad',vehicle:'Jeep'})
})