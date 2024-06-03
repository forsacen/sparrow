const common = require('./lib/yf_common')
const webDao = require('./web/dao')
const apiDao = require('./api/dao')
const G = require('./global')
const zlib = require('zlib')
const cfg = require('./config')
function thread() {

}
thread.prototype.updateCache = async function () {
    while (1) {
        {
            let data = {}
            data.main = await this.getMainList()
            data.hot = await this.getMainHot()
            data.tuijian = await this.getMainTuijian()
            const mainList=[]
            for (let i = 0; i < data.main.length; i++) {
                mainList.push(zlib.deflateSync(JSON.stringify(data.main[i])))
            }
            const mainPageData = {
                t: 'main',
                data: {
                    main: data.main[0],
                    hot: data.hot,
                    tuijian: data.tuijian
                }
            }
            G.cache.mainHot=data.hot
            G.cache.tuijian=data.tuijian
            G.cache.mainList=mainList
            G.cache.mainPageData = zlib.deflateSync(JSON.stringify(mainPageData))
        }
        await common.sleep(cfg.thread.updateCacheDur.mainList)
    }
}

thread.prototype.getMainList = async () => {
    let data = await apiDao.getMainPageList()
    let d = [], arry = [], j = 0
    for (let i = 0; i < data.length; i++) {
        arry.push(data[i])
        j++
        if (j >= cfg.module.api.dataCount.mainList) {
            d.push(arry)
            arry = []
            j = 0
        }
    }
    return d
}

thread.prototype.getMainHot = async () => {
    let data = await apiDao.getMainHot()
    return data
}

thread.prototype.getMainTuijian = async () => {
    let data = await apiDao.getMainTuijian()
    return data
}

thread.prototype.getDataCount = async () => {
    let count = await apiDao.getDataCount()
    return count
}

thread.prototype.begin = function () {
    G.cache = {
        mainPageData: [],
        mainHot:{},
        mainTuijian:{},
    }
    //G.count={}
    /*this.updateMainErtong()
    this.updateMainKehuan()
    this.updateMainZhuanji()
    this.updateMainJingsong()*/
    this.updateCache()
    /*this.updateHot()
    this.updateTuijian()
    this.updateDataCount()*/
}

module.exports = new thread()