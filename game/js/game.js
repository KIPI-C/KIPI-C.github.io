//requestAnimationFrame动画兼容老旧浏览器
(function(){var lastTime = 0;var vendors = ['webkit', 'moz'];for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||window[vendors[x] + 'CancelRequestAnimationFrame'];}if (!window.requestAnimationFrame) {window.requestAnimationFrame = function(callback, element) { var currTime = new Date().getTime();var timeToCall = Math.max(0, 16.7 - (currTime - lastTime)); var id = window.setTimeout(function() {callback(currTime + timeToCall);}, timeToCall);lastTime = currTime + timeToCall;return id;};}if (!window.cancelAnimationFrame) {window.cancelAnimationFrame = function(id) {clearTimeout(id);};}}());

//main
(function(){
    var d=document
    ,cav=d.getElementById("game")
    ,ctx=cav.getContext("2d")
    ,up=null
    ,down=null
    ,left=null
    ,right=null

    ,mobile=false
    ,ikd=false//是否keydown
    ,k={}
    ,zdp=[]
    ,t=true
    ,f=false

    ,x=0
    ,y=0
    ,speed=3//用户速度
    ,zdspeed=5
    ,zdcolor="#dd0"
    ,guncolor="#005"
    ,usercolor="#0ea"
    ,freeztime=200//子弹冷却时间
    ,freezok=true//是否正在冷却
    ,wsad="d"
    k.w=f
    k.s=f
    k.a=f
    k.d=f
    k.j=f
    console.log("speed:"+speed,"freeztime:"+freeztime)
    function kd(e){}
    function ku(e){}
    function raf(){
        requestAnimationFrame(function(){
            raf()
            draw();
        });
    }
    function load(){
        window.screen.width<=800?mobile=t:0
        addController()
        cav.style.width=getComputedStyle(document.body,"").width;
        cav.style.height=getComputedStyle(document.body,"").height;
        d.addEventListener("keydown",function(e){kd(e)});
        d.addEventListener("keyup",function(e){ku(e)});
        if(mobile){
            up.addEventListener("touchstart",function(){kd({key:"w"})})
            down.addEventListener("touchstart",function(){kd({key:"s"})})
            left.addEventListener("touchstart",function(){kd({key:"a"})})
            right.addEventListener("touchstart",function(){kd({key:"d"})})
            gun.addEventListener("touchstart",function(){kd({key:"j"})})

            up.addEventListener("touchend",function(){ku({key:"w"})})
            down.addEventListener("touchend",function(){ku({key:"s"})})
            left.addEventListener("touchend",function(){ku({key:"a"})})
            right.addEventListener("touchend",function(){ku({key:"d"})})
            gun.addEventListener("touchend",function(){ku({key:"j"})})
        }
        x=150;
        y=175;
    }

    function draw(){
        clr()
        //如果改变了方向，就禁止跑出界面
        if(k.w||k.s||k.a||k.d){
            x<0?x=0:0
            y<0?y=0:0
            x+50>900?x=900-50:0
            y+50>400?y=400-50:0
        }
        //W S A D状态
        if(k.w){
            y-=speed;
            wsad="w"
        }
        else if(k.s){
            y+=speed;
            wsad="s"
        }
        else if(k.a){
            x-=speed;
            wsad="a"
        }
        else if(k.d){
            x+=speed;
            wsad="d"
        }
        //子弹数据处理
        ctx.fillStyle=zdcolor
        for (i=0;i<zdp.length;i++){
            var j=zdp[i]
            switch(j.direct){
                case "w":j.y-=zdspeed;ctx.fillRect(j.x+20,j.y-60,10,10);j.y<0?zdp.splice(i,1):0;break;
                case "s":j.y+=zdspeed;ctx.fillRect(j.x+20,j.y+100,10,10);j.y+10>400?zdp.splice(i,1):0;break;
                case "a":j.x-=zdspeed;ctx.fillRect(j.x-60,j.y+20,10,10);j.x<0?zdp.splice(i,1):0;break;
                case "d":j.x+=zdspeed;ctx.fillRect(j.x+100,j.y+20,10,10);j.x+10>900?zdp.splice(i,1):0;break;
            }
        }
        //枪的绘图
        ctx.fillStyle=guncolor;
        switch(wsad){
            case "w":
                ctx.fillRect(x+15,y-50,20,50);
                drawuser();break;
            case "s":
                ctx.fillRect(x+15,y+50,20,50);
                drawuser();break;
            case "a":
                ctx.fillRect(x-50,y+15,50,20);
                drawuser();break;
            case "d":
                ctx.fillRect(x+50,y+15,50,20);
                drawuser();break;
        }
        
        if(k.j&&freezok){
            freezok=f
            zdp.push({
                x:x,
                y:y,
                direct:wsad
            })
            console.log("boom",zdp)
            setTimeout(function(){
                freezok=t
                console.log("ready")
            },freeztime);
        }
    }

    //keydown
    function kd(e){
        e.key=="w"||e.key=="ArrowUp"?k.w=t:0
        e.key=="s"||e.key=="ArrowDown"?k.s=t:0
        e.key=="a"||e.key=="ArrowLeft"?k.a=t:0
        e.key=="d"||e.key=="ArrowRight"?k.d=t:0
        e.key=="j"?k.j=t:0
    }
    //keyup
    function ku(e){
        e.key=="w"||e.key=="ArrowUp"?k.w=f:0
        e.key=="s"||e.key=="ArrowDown"?k.s=f:0
        e.key=="a"||e.key=="ArrowLeft"?k.a=f:0
        e.key=="d"||e.key=="ArrowRight"?k.d=f:0
        e.key=="j"?k.j=f:0
    }
    //清理屏幕
    function clr(){ctx.clearRect(0,0,900,400)}
    //画出用户样式
    function drawuser(){
        ctx.beginPath();
        ctx.fillStyle=usercolor
        ctx.fillRect(x,y,50,50);
        ctx.closePath();
    }
    function addController() {
        function addsvg(src){
            var a
            a=d.body.appendChild(d.createElement("div"));
            a.className="btn";
            a.style.background="url('"+src+"') 0.0";
            a.style.width=50+"px";
            a.style.height=50+"px";
            return a
        }
        if(mobile){
            up=addsvg("img/up.svg")
            up.style.bottom="140px"
            up.style.left="70px"
            down=addsvg("img/down.svg")
            down.style.bottom="20px"
            down.style.left="70px"
            left=addsvg("img/left.svg")
            left.style.bottom="80px"
            left.style.left="10px"
            right=addsvg("img/right.svg")
            right.style.bottom="80px"
            right.style.left="130px"
            gun=addsvg("img/gun.svg")
            gun.style.bottom="80px"
            gun.style.right="80px"
        }
    }
    load();
    raf();

})()