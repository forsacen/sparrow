const path=require('path')
let cfg={
    common:{
        debug:true,
        cluster:false,
        baseDomain:['noveltest.com'],
        port:80,
    },
    loger:{
        addr:'127.0.0.1:27017',//数据库地址
        database:'log',//数据库名
        collection:'cnennovel',
        // auth:{
        //     user:'admin',
        //     password:'333221abc',
        // },
        project:'cnennovel_server',
    },
    module:{
        web:{
            view:`${path.dirname(__dirname)}/server/views`,
            static:`${path.dirname(__dirname)}/server/static`,
            compress:true,
            domain:[],
            maxAge:60*60,
            dao:{
                addr:'127.0.0.1:27017',//数据库地址
                database:'cnennovel',//数据库名
                collection:'books',
                // auth:{
                //     user:'admin',
                //     password:'333221abc',
                // },
                srv:false,
            },
        },
        api:{
            compress:false,
            domain:[],
            dao:{
                addr:'127.0.0.1:27017',//数据库地址
                database:'cnennovel',//数据库名
                collection:'books',
                // auth:{
                //     user:'admin',
                //     password:'333221abc',
                // },
                srv:false,
            },
            dataCount:{
                mainList:9, //每页多少条数据
                mainHot:10,
                mainTuijian:15,
                mainPages:20 //移动端最多有多少页
            }
        },
        resource:{
            compress:true,
            domain:[],
            dao:{
                addr:'127.0.0.1:27017',//数据库地址
                database:'cnennovel',//数据库名
                collection:'books',
                // auth:{
                //     user:'admin',
                //     password:'333221abc',
                // },
                srv:false,
            },
        },
    },
    page:{
        maxPagination:10,//如果这里为0，则不限制最多显示页面
    },
    search:{
        limit:10,
        timerLimit:5000,
    },
    serverRender:{
        agent:'yf_server_render_agent',
        url:'http://www.noveltest.com:3000'
    },
    thread:{
        updateCacheDur:{
            mainList:60*60*24*1000,
            mainHot:60*60*24*1000,
            hot:60*60*24*1000,
        },
        updateCountDur: 60*60*24*1000,
    },
}
module.exports=cfg