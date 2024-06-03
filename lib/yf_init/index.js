String.prototype.trimL = function (char) {
    return this.replace(new RegExp('^('+char+')+', 'g'),'')
}
String.prototype.trimR = function (char) {
    return this.replace(new RegExp('('+char+')+$', 'g'), '')
}
//let s='abc&nbsp;abcs&nbsp;hahasabchaha&nbsp;sabc&nbsp;'
//s=s.trimD('(&nbsp;)|(abc)|(s)') --结果hahasabchaha
//注意\参数都是\\,如果参数本身是\,那这边就是\\,参数那边就是\\\\
String.prototype.trimD = function (char) {
    return this.replace(new RegExp('^('+char+')+|('+char+')+$', 'g'), '')
}
//替换所有字符串
String.prototype.replaceAll=function(src,dest){
    return this.replace(new RegExp(src,'g'),dest)
}

//查找2个字符串之间的字符,如果start为'',则从头部查起,没找到返回undefined
String.prototype.findBetween = function(start,end){
    let s=this.indexOf(start)
    if(s===-1){
        return undefined
    }
    let e=this.lastIndexOf(end)
    if(e===-1){
        return undefined
    }
    if(s+start.length>=e){
        return undefined
    }
    return this.substring(s+start.length,e)
}

//两个字符串是否一个包含另一个
String.prototype.containOther = function(s){
    if(this.length>=s.length){
        return this.indexOf(s) !== -1
    }else{
        return s.indexOf(this) !== -1
    }
}

//提取中文,extraReg是额外要匹配的正则字符串，例如《|》
String.prototype.getChinese=function(extraReg) {
    //匹配中文字符以及这些中文标点符号 。 ？ ！ ， 、 ； ： “ ” ‘ ' （ ） 《 》 〈 〉 【 】 『 』 「 」 ﹃ ﹄ 〔 〕 … — ～ ﹏ ￥
    let reg = '[\u4e00-\u9fa5|\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5';
    if(extraReg){
        reg=reg+'|'+extraReg
    }
    reg+=']'
    let tempValue = this.match(new RegExp(reg,'g')); //匹配结果，可能为空，还需要进行判断
    let resultStr="";
    if(tempValue!=null){
        resultStr = tempValue.join("");
    }
    return resultStr; //返回匹配的字符串
}
//提取英文字,extraReg是额外要匹配的正则字符串，例如<|>|\n|\t
String.prototype.getEnglish=function(extraReg) {
    let reg = '[a-zA-Z';
    if(extraReg){
        reg=reg+'|'+extraReg
    }
    reg+=']'
    let tempValue = this.match(new RegExp(reg,'g')); //匹配结果，可能为空，还需要进行判断
    let resultStr="";
    if(tempValue!=null){
        resultStr = tempValue.join("");
    }
    return resultStr; //返回匹配的字符串
}

String.prototype.getWordsCount=function(){
    let reg=/[a-zA-Z]+\b/g
    return this.match(reg).length
}

String.prototype.isNumber=function(){
    var reg = /^[0-9]+.?[0-9]*$/
    if(reg.test(this)){
        return true
    }else{
        return false
    }
}

String.prototype.getByteSize=function(){
    let len = 0;
    for (let i = 0; i < this.length; i++) {
        const code = this.charCodeAt(i);
        if (0x00 <= code && code <= 0x7f) {
            len += 1;
        } else if (0x80 <= code && code <= 0x7ff) {
            len += 2;
        } else if (0x800 <= code && code <= 0xd7ff || 0xe000 <= code && code <= 0xffff) {
            len += 3;
        } else if (0x10000 <= code && code <= 0x10ffff) {
            len += 4;
        }
    }
    return len;
}