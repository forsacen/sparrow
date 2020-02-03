const path=require('path')
function _getEntryFile(){
    let entry=module
    while(entry.parent){
        entry=entry.parent
    }
    return entry.filename
}

function _getEntryDir(){
    let entry=module
    while(entry.parent){
        entry=entry.parent
    }
    return entry.path
}
global.__entryfile=_getEntryFile()
global.__entrydir=_getEntryDir()
global.__projectname=path.basename(_getEntryDir())