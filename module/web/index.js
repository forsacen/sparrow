const app = require('express')()
const router=require('./router')
app.engine('html', require('ejs').__express)
app.set('views',__dirname+'/views')
app.use(router)
module.exports = app