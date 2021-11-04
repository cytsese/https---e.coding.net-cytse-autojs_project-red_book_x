var imgs = ["file://./res/splashIcon.png",
    "http://pic1.win4000.com/mobile/2018-11-05/5bdff127e2e79.jpg",
    "https://b.zhutix.com/bizhi/colorful-geometry/3.png",
    "http://pic1.win4000.com/mobile/2020-08-04/5f291dac4a673.jpg",
    "http://pic1.win4000.com/mobile/2020-07-14/5f0d5f4a95c66.jpg"
    ]
var cfgs = JSON.parse(files.read("data/cfgs.json"))

// var HotUpdate = HotUpdate
var imgs = imgs
var imgsrc = imgs[2]
var textColor = "#FFFFFF"
var bg = "#000000"
var viewpagers=["首页","高级"]
//其他设置
// var DeviceInfo = _func.getDeviceInfo()
console.setGlobalLogConfig({
    "file": cfgs.project.log_to
});//设置日志输出路径

//界面函数
// create_mainFrame=create_mainFrame
function create_mainFrame(){
    //setting()
    // var HotUpdate(engines.myEngine())
    ui.statusBarColor(bg)
    ui.layout(files.read("./xml/mainFrame.xml"))
    createViews()
    binds()
    loadConfig()
}

//加载tab页面视图
function createViews(){
    ui.inflate(files.read("./xml/tab1.xml"),ui.tab1,true)
    //设置滑动页面的标题
    ui.viewpager.setTitles(viewpagers);
    //让滑动页面和标签栏联动
    ui.tabs.setupWithViewPager(ui.viewpager);
    ui.toolbar.setTitle(cfgs.project.name+'  '+cfgs.project.version)
    ui.软件说明.setText(files.read("README.md"))
    ui.save_to.setText('数据文件保存路径：'+cfgs.user.save_to)
}

//所有的事件绑定
function binds(){
    
    //创建选项菜单(右上角)
    ui.emitter.on("create_options_menu", menu=>{
        menu.add("强制更新");
        menu.add("运行日志");
        menu.add("Cloud Code");
    });
    //监听选项菜单点击
    ui.emitter.on("options_item_selected", (e, item)=>{
        var key = item.getTitle()
        switch(key){
            case "强制更新":threads.start(function(){
                var url = cfgs.project.src
                if(!url){toastLog('资源加载失败');return}
                var master_dir = './data/temp/cytse-autojs_project-'+url.split('/autojs_project/d/')[1].split('/git/')[0]+'-master/'
                var project_info = cfgs.project
                var project_name = project_info.name
                var last = files.read('./data/cfgs.json')//由于版本号存储在cfgs中
                var is_new = false
                var thread = threads.start(function(){
                    files.writeBytes("./source.zip",http.get(url).body.bytes())
                    $zip.unzip('./source.zip', './data/temp');
                    if(last != files.read(master_dir + '/data/cfgs.json')){
                        is_new = true
                        func.copy_dir(master_dir,'./')
                    }
                })
                var dialog = dialogs.build({
                    title: "正在加载项目 "+project_name,
                    progress: {
                        max: 100,
                        showMinMax: false
                    },
                    autoDismiss: false
                    })
                    dialog.show()
                    var speed = 0.1
                    var dialogInterval = setInterval(()=>{
                        var p = dialog.getProgress();
                        dialog.setProgress(p+speed);
                        if(!thread.isAlive()){speed=5}
                        if(p >= 99 && !thread.isAlive()){
                            clearInterval(dialogInterval);
                            dialog.dismiss();
                            dialog = null;
                            
                        }else{
                        dialog.setProgress(99);
                        }
                    }, 10)
                thread.join()
                // engines.myEngine().forceStop()
                if(is_new){
                    toast(project_name+" 加载成功");
                    engines.execScriptFile('main.js'); 
                }else{
                    toastLog('没有新版本可用')
                }
                return
                })
                break
            case "关于":
                alert("关于", "");
                break;
            case "运行日志":
                app.viewFile(cfgs.project.log_to)
                break;
        }
        e.consumed = true;
    });
    activity.setSupportActionBar(ui.toolbar);



    //让工具栏左上角可以打开侧拉菜单
    // ui.toolbar.setupWithDrawer(ui.drawer);

    // ui.menu.setDataSource([
    // {
    //     title: "选项",
    //     icon: "@drawable/ic_android_black_48dp"
    // },
    // {
    //     title: "退出",
    //     icon: "@drawable/ic_exit_to_app_black_48dp"
    // }
    // ]);

    // ui.menu.on("item_click", item => {
    //     switch(item.title){
    //         case "退出":
    //             ui.finish();
    //             break;
    //     }
    // })

    ui.acces.on("check", function (checked) {
        // 用户勾选无障碍服务的选项时，跳转到页面让用户去开启
        if (checked && auto.service == null) {
            app.startActivity({
                action: "android.settings.ACCESSIBILITY_SETTINGS"
                
            });
        }
        if (!checked && auto.service != null) {
            auto.service.disableSelf();
        }
    });

    // 当用户回到本界面时，resume事件会被触发
    ui.emitter.on("resume", function () {
        // 此时根据无障碍服务的开启情况，同步开关的状态
        ui.acces.checked = auto.service != null;
    });
    
    ui.window.on("check",function(checked){
            if(!auto.service){
                toast("请先开启无障碍服务")
                return false
            }
            if(!checked){return false}
            app.startActivity({
            packageName: "com.android.settings",
            className: "com.android.settings.Settings$AppDrawOverlaySettingsActivity",
            data: "package:" + auto.service.getPackageName().toString()
        });
    })

    ui.capture.on("check", function (checked) {
        // 屏幕截图权限
        if(!checked){return false}
        threads.start(function(){
            if(device.width>device.height){
                flag = false
            }else{
                flag = true
            }
            if(!requestScreenCapture(flag)){
                ui.capture.checked = false
            }
        })
    });
}
create_mainFrame()

module.exports = {}