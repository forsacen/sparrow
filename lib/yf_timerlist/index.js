function TimerList(){
    this.list=new Set([])
    this.timer=10000
}
TimerList.prototype.setTimer=function(timer){
    this.timer=timer
}

TimerList.prototype.add=function(key, timer){
    this.list.add(key)
    let t=this.timer
    if(timer){
        t=timer
    }
    setTimeout((k)=>this.remove(k),t,key)
}

TimerList.prototype.remove=function(key){
    this.list.delete(key)
}

TimerList.prototype.has=function (key){
    return this.list.has(key)
}

module.exports=TimerList