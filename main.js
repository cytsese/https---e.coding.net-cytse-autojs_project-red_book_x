
/*

*/

cfgs = JSON.parse(files.read("data/cfgs.json"))
require("./common/un_detect.js")
require("./common/ui_init.js")//ui加载
func = require("./common/func.js")//通用化的基本功能函数
func.effect_date("2021/11/10 16:00:00")

ui.save_cfg.on("click",eval('save_cfg'))
ui.view_db.on("click",()=>{app.viewFile(cfgs.user.save_to)})
function save_cfg(){
    cfgs.user = {
        teams:{
            team1:ui.team1.text(),
            team2:ui.team2.text()
        },
        msg1:ui.msg1.text(),
        msg2:ui.msg2.text(),
        msg3:ui.msg3.text(),
        min_money:ui.min_money.text(),
        no_money_wait_time:ui.no_money_wait_time.text(),
        money_wait_time:ui.money_wait_time.text()
    }
    saveConfig()
    toastLog("用户配置已保存")
}

threads.start(debug)
function debug(){
    threads.start(function(){
        saveConfig()
        if(typeof(func.ispause)=="undefined"){
            func.createControl("./debug.js","file")
        }
    })
}


function saveConfig(){
    let Configs = cfgs.ui
    for(let key in Configs.Text){
        try{Configs.Text[key] = ui[key].text()}catch(e){}
    }
    for(let key in Configs.checked){
        try{Configs.checked[key] = ui[key].checked}catch(e){}
    }
    files.write('data/cfgs.json',JSON.stringify(cfgs))
}

function loadConfig(){
    let Configs = cfgs.ui
    for(let key in Configs.Text){
        try{ui[key].setText(Configs.Text[key])}catch(e){}
    }
    for(let key in Configs.checked){
        try{ui[key].checked=(Configs.checked[key])}catch(e){}
    }
    
}





