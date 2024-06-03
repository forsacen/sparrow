const os = require('os');
const fs=require('fs')

function _getIp() {
    let interfaces = os.networkInterfaces();
    for (let devName in interfaces) {
        let iface = interfaces[devName];
        for (let i = 0; i < iface.length; i++) {
            let alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
}

function loger(opt) {
    this.col = null
    this.project = ''
    if (opt&&opt.col) {
        this.col = opt.col
    }
    if (opt&&opt.project) {
        this.project = opt.project
    }
}

loger.prototype.setCollection = function (col) {
    this.col = col
}

loger.prototype.setProject=function(project){
    this.project=project
}

loger.prototype.save = function (flag, arg) {
    if (!this.col) {
        throw new Error('db or col is undefined')
    }
    const data = {
        host: os.hostname(),
        ip: _getIp(),
        project: this.project,
        time: new Date().toISOString(),
        label: flag,
        
    }
    if (arg instanceof Error) {
        data.msg = arg.message
        data.stack=arg.stack
    } else if (arg instanceof Object && !Array.isArray(arg)) {
        for (let key in arg) {
            data[key] = arg[key]
        }
    } else{
        data.msg = arg
    }
    try{
        const re=this.col.insertOne(data)
        return re
    }catch(e){
        fs.appendFile('mongodberror.txt',e.message+'\t'+new Date().toISOString()+'\n------------------------\n',function(err){
            if(err){
                console.log(err)
            }
        })
        return e
    }
}

loger.prototype.warn = function (arg) {
    return this.save('warn', arg)
}

loger.prototype.fatal = function (arg) {
    return this.save('fatal', arg)
}

loger.prototype.log = function (arg) {
    return this.save('log', arg)
}

module.exports = loger
