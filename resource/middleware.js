middleware={}
module.exports = middleware


/*middleware.checkPlaform=(req, res,next)=>{
    let deviceAgent = req.headers["user-agent"].toLowerCase();
    if(deviceAgent.match(/(iphone|ipod|ipad|android)/)){
        req.platform = 'wap' //mobile
    }else{
        req.platform = 'pc' //pc
    }
    next()
}*/