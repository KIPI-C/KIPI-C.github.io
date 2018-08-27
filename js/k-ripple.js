/*
    k-ripple.js By KIPI-C 
    2018/8/21 21:36
*/
try{$k}catch(e){$k={}}
/*
任务进度条：
配置解析器：√
外部接口：√
停止控制元素操作：×
清理列表垃圾：√
pc监听器：
触屏监听器：
绘画：

*/
(function(){
    var d=document
        ,canvasStyle=d.head.appendChild(d.createElement("style"))
    //设置被控制元素的canvas的通用css
    canvasStyle.innerHTML="/*k-ripple.js*/\
    .k-ripple canvas{width:100%;height:100%;position:absolute;top:0;left:0;opacity:0.2;}"
    //创建外部接口
    $k.ripple={
        connetList:[]//这里是更新时检查已记录资源和记录动画的
        ,updata:function(){//刷新列表，检查资源
            var newList=d.getElementsByClassName("k-ripple")//获取所有class含有k-ripple的元素
            //现有列表垃圾清理
            for(let i=0;i<$k.ripple.connetList.length;i++){
                let connetBox=$k.ripple.connetList[i]//方便引用
                if(!(connetBox.element in document.all))//找出页面已经不存在的元素
                    if(typeof connetBox=="object"&&!contains(newList,connetBox.element)){
                        $k.ripple.connetList.splice(i,1);i--//从现有列表删除
                    }
                else $k.ripple.remove(connetBox.element)
            }
            //现有列表放入新元素，并做相应配置
            for(i in newList){
                let newEle=newList[i]//方便引用
                //这个if是过滤其他信息和过滤现有列表已有元素的
                if(typeof newList[i]=="object"){
                    if(!scontains($k.ripple.connetList,newEle)){
                        let id=$k.ripple.connetList.push({})-1//在现有列表创建一个新元素并获取id
                            ,cav=newEle.appendChild(d.createElement("canvas"))//创建&获取canvas
                            ,touch=false//mousedown阻塞开关
                            
                        //构建分区主体
                        $k.ripple.connetList[id]={
                            element:newEle//链接的元素
                            ,canvas:cav//链接的canvas
                            ,anList:[]//动画库
                            ,configure:{}//关于这个元素的配置，允许动态修改
                            ,onbeforePush:function(e){return e}//在把一个动画加入清单之前，你可以修改这个动画的属性
                            ,onbeforeDraw:function(){}//在这个元素的所有动画每次draw之前，每次clean之后
                            ,onafterDraw:function(){}//在这个元素的所有动画每次在draw完成后
                        }
                        let box=$k.ripple.connetList[id]
                            ,anList=box.anList
                        $k.ripple.connetList[id].__proto__=null
                        //解析k-ripple属性的配置
                        cfgParser(newEle,$k.ripple.connetList[id].configure)
                        //对canvas内画布的配置，质量为正常量的两倍，不然会十分模糊
                        cav.width=parseInt(getComputedStyle(newEle).width)*2
                        cav.height=parseInt(getComputedStyle(newEle).height)*2
                        //为了在元素里绝对定位，如果元素依照文本流则脱离文本流，但位置保持不变
                        getComputedStyle(newEle).position=="static"?newEle.style.position="relative":0
                        //添加pc端mousedown事件
                        newEle.addEventListener("mousedown",function(e){
                            if(!touch){//检测是否被阻塞
                                anList.push(box.onbeforePush({
                                    r:box.configure.initialRadius
                                    ,opacity:box.configure.opacity
                                    ,fade:false,finish:false
                                    ,x:e.offsetX*2,y:e.offsetY*2
                                    ,color:box.configure.color
                                    ,a:box.configure.acceleration
                                    ,speed:box.configure.speed
                                }))
                                console.log(e.offsetX,e.offsetY)
                            }
                        })
                        newEle.addEventListener("touchstart",function(e){
                            touch=true//阻塞mousedown，防止二次触发
                            anList.push({
                                r:box.configure.initialRadius
                                ,opacity:box.configure.opacity
                                ,fade:false,finish:false
                                ,x:e.offsetX,y:e.offsetY
                                ,color:box.configure.color
                                ,a:box.configure.acceleration
                                ,speed:box.configure.speed
                            })
                            console.log(e.offsetX,e.offsetY)
                        })
                        console.log("add:",$k.ripple.connetList[id])
                    }else{

                    }
                }//检测是否为object end
            }//第二for循环 end
        }
        ,remove:function(e){
            
        }
    }
    function anraf(){
        for(i in $k.ripple.connetList){
            let cav=$k.ripple.connetList[i].canvas
                ,ctx=cav.getContext("2d")
                ,max
            if(cav.width>cav.height)max=cav.width*2;else max=cav.height*2;
            ctx.clearRect(0,0,cav.width,cav.height)
            for(ii in $k.ripple.connetList[i].anList){
                let cfg=$k.ripple.connetList[i].anList[ii]
                if(cfg.color!=ctx.fillStyle)ctx.fillStyle=cfg.color
                if(!cfg.finish){
                    if(!cfg.fade){
                        if(cfg.r<max){
                            cfg.r+=cfg.speed
                            cfg.speed+=cfg.a
                        }
                        else{
                            cfg.fade=true
                        }
                    }
                    else{
                        if(cfg.opacity>0.1)cfg.opacity-=0.02
                        else{cfg.opacity=0;cfg.finish=true;console.log("over")}
                    }
                    ctx.beginPath();
                    ctx.globalAlpha=cfg.opacity
                    ctx.arc(cfg.x,cfg.y,cfg.r,0,Math.PI*2)
                    ctx.fill()
                    ctx.closePath()
                }
            }
        }
        requestAnimationFrame(function(){
            anraf()
        })
    }
    anraf()
    function cleanraf(){
        $k.ripple.connetList
    }
    function cfgParser(e,c){
        c.color="#fff"
        c.speed=6
        c.acceleration=2
        c.initialRadius=10
        c.opacity=1
        if(e.getAttribute("k-ripple")){
            s=e.getAttribute("k-ripple").split(",")
            for(i in s){
                t=s[i].slice(s[i].indexOf(":")+1,s[i].length)
                switch (s[i].slice(0,s[i].indexOf(":"))) {
                    case "color":c.color=t;break;
                    case "speed":c.speed=parseInt(t);break;
                    case "acceleration":c.acceleration=parseInt(t);break;
                    case "initialRadius":c.initialRadius=parseInt(t);break;
                    case "opacity":c.opacity=parseInt(t);break;
                }
            }
        }
        console.log("configure:",c)
    }
    function contains(arr, obj) {
        var i = arr.length;
        while (i--) {
            if (arr[i] === obj) {
                return true;
            }
        }
        return false;
    }
    function scontains(arr, obj) {
        var i = arr.length;
        while (i--) {
            if (arr[i].element === obj) {
                return true;
            }
        }
        return false;
    }
}());