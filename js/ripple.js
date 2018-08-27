try{$k}catch(e){$k={}}
Array.prototype.isInArray = function (obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}
(function(){
function contains(arr, obj) {
    var i = arr.length;
    while (i--) {
        if (arr[i] === obj) {
            return true;
        }
    }
    return false;
}
function getTop(e){
    var offset=e.offsetTop;
    if(e.offsetParent!=null) offset+=getTop(e.offsetParent);
    return offset;
}
function getLeft(e){
    var offset=e.offsetLeft;
    if(e.offsetParent!=null) offset+=getLeft(e.offsetParent);
    return offset;
}
function startDrawd(c,x,y,id,an){
    var ctx=c.getContext("2d")
    raf(ctx,x,y)
    function raf(ctx,x,y){
        requestAnimationFrame(function(){
            drawdark(ctx,x,y)
            raf(ctx,x,y)
        });
    }
}
function startDrawl(c,x,y,an){
    an.drawing=true
    var ctx=c.getContext("2d")
    ,max
    ctx.globalAlpha=1
    raf(ctx,x,y)
    if(c.width>c.height)max=c.width*3;
    else max=c.height*3
    var cache=20,xx=5
    function raf(ctx,x,y){
        requestAnimationFrame(function(){
            ctx.clearRect(0, 0, c.width, c.height);
            drawlight(ctx,x,y,cache)
            cache+=xx
            xx+=1
            if(cache<max){
                raf(ctx,x,y)
            }
            else{
                console.log("ok")
                an.drawing=false
            }
        });
    }
}
function drawlight(ctx,x,y,cache){
    ctx.drawImage($k.ripple.lightdemo,x-cache/2,y-cache/2,cache,cache)
}
function drawdark(ctx,x,y){

}
var d=document
,s=d.head.appendChild(d.createElement("style"))
,list=[]

s.innerHTML="/*k-ripple.js*/\
.k-ripple canvas{width:100%;height:100%;position:absolute;top:0;left:0;opacity:0.2;}"

$k.ripple={
    list:[]
    ,anlist:[]
    ,updata:function(){
        list=d.getElementsByClassName("k-ripple")
        for(i in list){
            if(typeof list[i]=="object"){
                if(!contains(this.list,list[i])){
                    this.list.push(list[i])
                    console.log(i,"-----------");
                    console.log("pushed:",list[i])
                    let c=list[i].appendChild(d.createElement("canvas"))
                    this.anlist.push({canvas:c})
                    let dark=(function(){if(list[i].className.indexOf("k-ripple-dark")>0)return false;else return true}())
                    ,id=this.anlist.length
                    ,an=this.anlist[this.anlist.length-1]
                    c.width=parseInt(getComputedStyle(list[i]).width)*2
                    c.height=parseInt(getComputedStyle(list[i]).height)*2
                    console.log("link canvas:",c);
                    console.log("btn position:",getComputedStyle(list[i]).position);
                    console.log("anlist:",an)
                    an.a=[]
                    if(getComputedStyle(list[i]).position=="static"){
                        list[i].style.position="relative"
                    }
                    list[i].addEventListener("mousedown",function(e){
                        if (!(navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
                            an.a.push({
                                drawing:true
                            })
                            console.log("mousedown:",e)
                        }
                        if(e.button==0){
                            if(dark)startDrawd(c,e.offsetX*2,e.offsetY*2,id,an.a[an.a.length-1]);
                            else startDrawl(c,e.offsetX*2,e.offsetY*2,id,an.a[an.a.length-1])
                        }
                    })
                    list[i].addEventListener("touchstart",function(e){
                        an.a.push({
                            drawing:false
                        })
                        console.log("touchstart:",e)
                        var touch=e.changedTouches[0]
                        ,top=getTop(c),left=getLeft(c)
                        if(dark)startDrawd(c,(touch.pageX-left)*2,(touch.pageY-top)*2,id,an.a[an.a.length-1]);
                        else startDrawl(c,(touch.pageX-left)*2,(touch.pageY-top)*2,id,an.a[an.a.length-1])
                    })
                    list[i].addEventListener("touchend",function(){
                        var max,ctx=c.getContext("2d")
                        console.log("touchend")
                        if(c.width>c.height)max=c.width*3;
                        else max=c.height*3
                        raf()
                        function raf(){
                            requestAnimationFrame(function(){
                                function check(arr){
                                    return arr.drawing==true
                                }
                                if(an.a.filter(check).length<1){
                                    if(ctx.globalAlpha>0.1){
                                        ctx.clearRect(0, 0, c.width, c.height);
                                        ctx.globalAlpha-=0.02
                                        ctx.drawImage($k.ripple.lightdemo,-max/2,-max/2,max,max)
                                        raf()
                                    }
                                    else ctx.clearRect(0, 0, c.width, c.height);
                                }
                                else raf()
                                console.log(an.a.filter(check),an.a)
                            })
                        }
                    })
                }
            }
        }
        console.log(this,this.list.isInArray);
    }
}
window.onload=function(){
    var demo=d.body.appendChild(d.createElement("canvas"))
    demo.style.width="0px"
    demo.style.height="0px"
    demo.width=2000
    demo.height=2000
    var ctx=demo.getContext("2d")
    ctx.fillStyle="#fff"
    ctx.arc(1000,1000,1000,0,2*Math.PI)
    ctx.fill()
    $k.ripple.lightdemo=new Image()
    $k.ripple.lightdemo.src=demo.toDataURL("image/png")
    ctx.fillStyle="#000"
    ctx.arc(1000,1000,1000,0,2*Math.PI)
    ctx.fill()
    $k.ripple.darkdemo=new Image()
    $k.ripple.darkdemo.src=demo.toDataURL("image/png")
}
}())