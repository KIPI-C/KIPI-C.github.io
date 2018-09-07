/*
    k-ripple.js By KIPI-C 
    2018/8/21 21:36
*/

try{$k}catch(e){$k={}}//创建$k库
(function(){
    var d=document
        ,canvasStyle=d.head.appendChild(d.createElement("style"))
    //设置被控制元素的canvas的通用css
    canvasStyle.innerHTML="/*k-ripple.js*/.k-ripple canvas{width:100%;height:100%;position:absolute;top:0;left:0;opacity:0.2;}"
    //创建外部接口
    $k.ripple={
        version:"1.0"
        ,connetList:[]//这里是所有动画和资源的记录中心
        ,updata:function(){//刷新列表，检查资源
            var newList=d.getElementsByClassName("k-ripple")//获取所有class含有k-ripple的元素
            //现有列表垃圾清理
            for(let i=0;i<$k.ripple.connetList.length;i++){
                let connetBox=$k.ripple.connetList[i]
                if(!connetBox in $k.ripple.connetList){
                    if(!(connetBox.element in d.all)){//找出页面已经不存在的元素
                        if(typeof connetBox=="object"&&!contains(newList,connetBox.element)){
                            $k.ripple.connetList.splice(i,1);i--//从现有列表删除
                            
                        }
                    }
                    else $k.ripple.remove(connetBox.element)//如果这个元素还在，就移除k-ripple.js的操作
                }
                
            }
            for(i in newList){
                let newEle=newList[i]//方便引用
                console.log(newEle)
                //这个if是过滤其他信息
                if(typeof newList[i]=="object"){
                    console.log(newEle)
                    if(!scontains($k.ripple.connetList,newEle)){
                        //现有列表放入更新检查到的新元素，并做相应配置
                        let id=$k.ripple.connetList.push({})-1//在现有列表创建一个新元素并获取id
                            ,cav=newEle.appendChild(d.createElement("canvas"))//创建&获取canvas
                            ,touch=false//mousedown阻塞开关
                            
                        //构建分区主体
                        $k.ripple.connetList[id]={
                            element:newEle//链接的元素
                            ,canvas:cav//链接的canvas
                            ,anList:[]//动画库
                            ,configure:{}//关于这个元素的配置，允许动态修改
                            ,mousedown:false//检查鼠标是否按下
                            ,onbeforePush:function(e){return e}//在把一个动画加入清单之前，你可以修改这个动画的属性
                            ,onbeforeDraw:function(){}//在这个元素的所有动画每次draw之前，每次clean之后
                            ,onafterDraw:function(){}//在这个元素的所有动画每次在draw完成后
                        }
                        let box=$k.ripple.connetList[id]
                            ,anList=box.anList
                        $k.ripple.connetList[id].__proto__=null//清理不必要的东西
                        //解析k-ripple属性的配置
                        cfgParser(newEle,$k.ripple.connetList[id].configure)
                        //对canvas内画布的配置，质量为正常量的两倍，不然会十分模糊
                        cav.width=parseInt(getComputedStyle(newEle).width)*2
                        cav.height=parseInt(getComputedStyle(newEle).height)*2
                        //为了在元素里绝对定位，如果元素依照文本流则脱离文本流，但位置保持不变
                        getComputedStyle(newEle).position=="static"?newEle.style.position="relative":0

                        //添加鼠标事件
                        newEle.addEventListener("mousedown",function(e){
                            if(!touch){//检测是否被阻塞
                                box.mousedown=true//告知全局鼠标按下
                                anList.push(box.onbeforePush({
                                    r:box.configure.initialRadius//初始半径
                                    ,opacity:box.configure.opacity//透明度
                                    ,fade:false,finish:false//状态
                                    ,x:e.offsetX*2,y:e.offsetY*2//位置
                                    ,color:box.configure.color//颜色
                                    ,a:box.configure.acceleration//加速度
                                    ,speed:box.configure.speed//速度
                                }))
                            }
                        })
                        d.addEventListener("mouseup",function(e){
                            if(!touch){//检测是否被阻塞
                                box.mousedown=false//告知全局鼠标放开
                            }
                        })

                        //添加触屏事件
                        newEle.addEventListener("touchstart",function(e){
                            box.mousedown=true//告知全局屏幕按下
                            touch=true//阻塞mousedown，防止二次触发
                            var offset=e.offsetTop;
                            if(e.offsetParent!=null)offset+=getTop(e.offsetParent);
                            
                            
                            anList.push({
                                r:box.configure.initialRadius
                                ,opacity:box.configure.opacity
                                ,fade:false,finish:false
                                ,x:(e.changedTouches[0].pageX-getOffsetLeft(newEle))*2//触摸事件没有偏移度，只能用外部方法
                                ,y:(e.changedTouches[0].pageY-getOffsetTop(newEle))*2
                                ,color:box.configure.color
                                ,a:box.configure.acceleration
                                ,speed:box.configure.speed
                            })
                        })
                        newEle.addEventListener("touchend",function(e){
                            box.mousedown=false//告知全局屏幕放开
                        })
                    }else{

                    }
                }//检测是否为object end
            }//第二for循环 end
            return $k.ripple.connetList
        }
        ,remove:function(e){//帮一个元素清理水波纹特效并清理内存
            for(i in $k.ripple.connetList){
                if(e==$k.ripple.connetList[i].element){
                    e.removeChild($k.ripple.connetList[i].canvas)
                    e.className=e.className.replace("k-ripple","")
                    $k.ripple.connetList.splice(i,1)
                    return true
                }
            }
            return false
        }
    }
    //绘画函数
    function anraf(){
        for(i in $k.ripple.connetList){
            let cav=$k.ripple.connetList[i].canvas
                ,ctx=cav.getContext("2d")
                ,max
            if($k.ripple.connetList[i].anList.length>0){
                //节省性能，没有任务时不清理canvas和计算
                ctx.clearRect(0,0,cav.width,cav.height)
                if(cav.width>cav.height)max=cav.width*2;else max=cav.height*2;
            }
            for(ii in $k.ripple.connetList[i].anList){
                let cfg=$k.ripple.connetList[i].anList[ii]
                if(!cfg.finish){//没有完成
                    if(cfg.color!=ctx.fillStyle)ctx.fillStyle=cfg.color//节省性能，ctx.fillStyle换颜色需要时间
                    if($k.ripple.connetList[i].mousedown&&!cfg.fade){
                        if(cfg.r<max){
                            cfg.r+=cfg.speed
                            cfg.speed+=cfg.a
                        }
                        else cfg.fade=true
                    }
                    else if(!$k.ripple.connetList[i].mousedown&&!cfg.fade){
                        if(cfg.r<max){
                            cfg.r+=20
                        }
                        else cfg.fade=true
                    }
                    else{
                        if(!$k.ripple.connetList[i].mousedown){
                            if(cfg.opacity>0.1)cfg.opacity-=0.05
                            else{cfg.opacity=0;cfg.finish=true}
                        }
                        if($k.ripple.connetList[i].mousedown&&cfg.opacity<1){
                            if(cfg.opacity>0.1)cfg.opacity-=0.1
                            else{cfg.opacity=0;cfg.finish=true}
                        }
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
    
    function cfgParser(e,c){
        //k-ripple属性解析器
        c.color="#fff"
        c.speed=5
        c.acceleration=.1
        c.initialRadius=5
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
    function getOffsetTop(e){
        var offset=e.offsetTop;
        if(e.offsetParent!=null) offset+=getOffsetTop(e.offsetParent);
        return offset;
    }
    function getOffsetLeft(e){
        var offset=e.offsetLeft;
        if(e.offsetParent!=null) offset+=getOffsetLeft(e.offsetParent);
        return offset;
    }
    anraf()
    setInterval(function(){
        let i=0;
        for(i in $k.ripple.connetList){
            for(let ii=0;ii<$k.ripple.connetList[i].anList.length;ii++){
                if($k.ripple.connetList[i].anList[ii].finish==true){$k.ripple.connetList[i].anList.splice(ii,1);ii--}
            }
        }
    },100)
}());
