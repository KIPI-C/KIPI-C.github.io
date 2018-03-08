//requestAnimationFrame动画兼容老旧浏览器
(function () { var lastTime = 0; var vendors = ['webkit', 'moz']; for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) { window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame']; window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame']; } if (!window.requestAnimationFrame) { window.requestAnimationFrame = function (callback, element) { var currTime = new Date().getTime(); var timeToCall = Math.max(0, 16.7 - (currTime - lastTime)); var id = window.setTimeout(function () { callback(currTime + timeToCall); }, timeToCall); lastTime = currTime + timeToCall; return id; }; } if (!window.cancelAnimationFrame) { window.cancelAnimationFrame = function (id) { clearTimeout(id); }; } }());
//主题
(function () {
    //大广告
    console.log("%c%s%s%c%s",
        "font-weight:bolder;color:#0d9;background-color:#005;display:box;padding: 10px 8px;font-size:22px;",
        "Welcome to play Camico ,Camico's author is KIPI-C :)                                                       ",
        "\n",
        "font-weight:bolder;color:deepskyblue;background-color:#005;display:box;padding:12px;padding-left:3px;padding-top:3px;font-size:22px;margin:-2px",
        "If you want to get more infmation, please to https://www.github.com/KIPI-C or https://kipi-c.github.io/ . ")
    var d = document//偷懒哈哈
        , cav = d.getElementById("game")
        , cavs=cav.style
        , ctx = cav.getContext("2d")//获取canvas画布
        , kpcimg = new Image()//logo
        , up = null, down = null, left = null, right = null//为移动设备备用的按钮

        , mobile = false//是移动设备？
        , ikd = false//是否keydown
        , k = {}//这个是装各种键按下的情况
        , zdp = []//这个是装子弹信息的
        , cwid, chei//默认宽高
        , t = true//偷懒到true，false都不想打了
        , f = false
        , kstate = "load"
        , loadcache = 0
        , kpcimgdraw = f
        , sp=false//是否竖屏

        , pq = 2//画质多少倍渲染
        , x = 150 * pq//用户x坐标
        , y = 175 * pq//y坐标
        , speed = 3 * pq//用户速度
        , zdspeed = 8 * pq//子弹速度
        , zdcolor = "#ee5"//子弹默认颜色
        , guncolor = "#005"//枪默认颜色
        , usercolor = "#0ea"//用户默认颜色
        , freeztime = 100//子弹冷却时间
        , freezok = true//是否正在冷却
        , wsad = "d"//默认右方向

    //初始化，防止爆炸
    k.w = f
    k.s = f
    k.a = f
    k.d = f
    k.j = f
    //循环刷新画布
    function raf() {
        //这个函数是用来每一秒运行六十次的，也就是说，这个游戏的动画是60fps的
        requestAnimationFrame(function () {
            raf()
            //TODO:1000/60毫秒后重复下面代码
            draw();
        });
    }

    //预加载的函数
    function load() {
        //看看是不是移动设备
        window.screen.width <= 1366 ? mobile = t : 0;
        // 强大的检测userAgent
        if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)|| /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))){
            mobile = true;
        }
        kpcimg.src = "img/KIPI-C.svg"
        cav.style.width = window.screen.width+ "px"
        cav.style.height = window.screen.height+ "px"
        ael(cav,"click",function(){
            fullScreen(cav)
        })

        if (window.screen.width < window.screen.height) {
            console.log(666)
        }
        //移动设备处理函数
        addController()
        cwid = 900 * pq;
        chei = parseInt(900 * window.screen.height/ window.screen.width) * pq;
        sphp()//竖屏处理
        cav.width = cwid;
        cav.height = chei;
        ael(d, "keydown", function (e) { kd(e) });//传递参数给kd处理
        ael(d, "keyup", function (e) { ku(e) });//传递参数给ku处理
        if (mobile) {
            ael(up, "touchstart", function () { kd({ key: "w" }) })
            ael(down, "touchstart", function () { kd({ key: "s" }) })
            ael(left, "touchstart", function () { kd({ key: "a" }) })
            ael(right, "touchstart", function () { kd({ key: "d" }) })
            ael(gun, "touchstart", function () { kd({ key: "j" }) })

            ael(up, "touchend", function () { ku({ key: "w" }) })
            ael(down, "touchend", function () { ku({ key: "s" }) })
            ael(left, "touchend", function () { ku({ key: "a" }) })
            ael(right, "touchend", function () { ku({ key: "d" }) })
            ael(gun, "touchend", function () { ku({ key: "j" }) })
        }
    }
    //画布更新图形的核心
    function draw() {
        if (kstate == "load") {
            loadcache += 1;
            if(loadcache<10){ctx.drawImage(kpcimg, cwid/45, chei/2-cwid*.16, cwid*.32, cwid*.32);}
            if (!kpcimgdraw) {
                ctx.fillStyle = "#002"
                ctx.fillRect(0, 0, cwid, chei);
                ctx.fillStyle = "#0ea"
                ctx.font = "bold " + 70 * pq + "px arial"
                ctx.fillText("KIPI-C Games", cwid*.4, chei*.45);
                ctx.font = 32 * pq + "px arial"
                ctx.fillText("Create a wonderful new world for you", cwid*.365, chei*.6);
                try {
                    up.style.display = "none";
                    down.style.display = "none";
                    left.style.display = "none";
                    right.style.display = "none";
                    gun.style.display = "none";
                } catch (e) { }
                kpcimgdraw = t;
            }
            if (loadcache >= 180) {
                kstate = "play";
                try {
                    up.style.display = "block";
                    down.style.display = "block";
                    left.style.display = "block";
                    right.style.display = "block";
                    gun.style.display = "block";
                } catch (e) { }
                clr()
            }
            sphp()
        }
        if (kstate == "play") {
            //clr();//清屏
            sphp();//竖屏横屏自动恢复
            //如果改变了方向，就禁止跑出界面
            if (k.w || k.s || k.a || k.d) {
                x < 0 ? x = 0 : 0
                y < 0 ? y = 0 : 0
                x + 50 * pq > cwid ? x = cwid - 50 * pq : 0
                y + 50 * pq > chei ? y = chei - 50 * pq : 0
                ctx.clearRect(x, y, 50 * pq, 50 * pq)
                //清理残影
                switch (wsad) {
                    case "w": ctx.clearRect(x + 15 * pq, y - 50 * pq, 20 * pq, 50 * pq); break;
                    case "s": ctx.clearRect(x + 15 * pq, y + 50 * pq, 20 * pq, 50 * pq); break;
                    case "a": ctx.clearRect(x - 50 * pq, y + 15 * pq, 50 * pq, 20 * pq); break;
                    case "d": ctx.clearRect(x + 50 * pq, y + 15 * pq, 50 * pq, 20 * pq); break;
                }
            }

            //获取W S A D的状态
            if (k.w) {
                y -= speed;
                wsad = "w"
            }
            else if (k.s) {
                y += speed;
                wsad = "s"
            }
            else if (k.a) {
                x -= speed;
                wsad = "a"
            }
            else if (k.d) {
                x += speed;
                wsad = "d"
            }

            //子弹数据处理
            //原理是建立一个数据库，一个一个子弹处理
            ctx.fillStyle = zdcolor
            if (zdp.length > 0) {
                for (i = 0; i < zdp.length; i++) {
                    var j = zdp[i];
                    ctx.clearRect(j.x, j.y, 10 * pq, 10 * pq);
                    switch (j.direct) {
                        case "w": j.y -= zdspeed; j.y < 0 ? zdp.splice(i, 1) : 0; break;
                        case "s": j.y += zdspeed; j.y + 10 * pq > chei ? zdp.splice(i, 1) : 0; break;
                        case "a": j.x -= zdspeed; j.x < 0 ? zdp.splice(i, 1) : 0; break;
                        case "d": j.x += zdspeed; j.x + 10 * pq > cwid ? zdp.splice(i, 1) : 0; break;
                    }
                    ctx.fillRect(j.x, j.y, 10 * pq, 10 * pq);
                    zdp.indexOf(j) == -1 ? ctx.clearRect(j.x, j.y, 10 * pq, 10 * pq) : 0;
                }
            }

            //枪的绘图
            ctx.fillStyle = guncolor;
            switch (wsad) {
                case "w":
                    ctx.fillRect(x + 15 * pq, y - 50 * pq, 20 * pq, 50 * pq);
                    drawuser(); break;
                case "s":
                    ctx.fillRect(x + 15 * pq, y + 50 * pq, 20 * pq, 50 * pq);
                    drawuser(); break;
                case "a":
                    ctx.fillRect(x - 50 * pq, y + 15 * pq, 50 * pq, 20 * pq);
                    drawuser(); break;
                case "d":
                    ctx.fillRect(x + 50 * pq, y + 15 * pq, 50 * pq, 20 * pq);
                    drawuser(); break;
            }
            //子弹的延时
            if (k.j && freezok) {
                freezok = f
                switch (wsad) {
                    case "w": zdp.push({ x: x + 20 * pq, y: y - 60 * pq, direct: wsad }); break;
                    case "s": zdp.push({ x: x + 20 * pq, y: y + 100 * pq, direct: wsad }); break;
                    case "a": zdp.push({ x: x - 60 * pq, y: y + 20 * pq, direct: wsad }); break;
                    case "d": zdp.push({ x: x + 100 * pq, y: y + 20 * pq, direct: wsad }); break;
                }
                setTimeout(function () {
                    freezok = t
                }, freeztime);
            }
        }
    }

    //keydown
    function kd(e) {
        e.key == "w" || e.key == "ArrowUp" ? k.w = t : 0
        e.key == "s" || e.key == "ArrowDown" ? k.s = t : 0
        e.key == "a" || e.key == "ArrowLeft" ? k.a = t : 0
        e.key == "d" || e.key == "ArrowRight" ? k.d = t : 0
        e.key == "j" ? k.j = t : 0
    }
    //keyup
    function ku(e) {
        e.key == "w" || e.key == "ArrowUp" ? k.w = f : 0
        e.key == "s" || e.key == "ArrowDown" ? k.s = f : 0
        e.key == "a" || e.key == "ArrowLeft" ? k.a = f : 0
        e.key == "d" || e.key == "ArrowRight" ? k.d = f : 0
        e.key == "j" ? k.j = f : 0
    }
    //添加事件
    function ael(el, ty, func) {
        el.addEventListener(ty, func)
    }
    //清理屏幕
    function clr() { ctx.clearRect(0, 0, cwid, chei) }
    //画出用户样式
    function drawuser() {
        ctx.beginPath();
        ctx.fillStyle = usercolor
        ctx.fillRect(x, y, 50 * pq, 50 * pq);
        ctx.closePath();
    }
    function addController() {
        function addsvg(src) {
            //包装方法，节省空间
            var a;
            a = d.body.appendChild(d.createElement("div"));
            a.className = "btn";//交给.btn样式处理
            a.style.backgroundImage = "url('" + src + "')";//以背景的形式使用svg
            a.style.width = 50 + "px";
            a.style.height = 50 + "px";
            return a
        }
        //看看是不是移动设备
        if (mobile) {
            //设置参数
            up = addsvg("img/up.svg");
            up.style.bottom = "140px";
            up.style.left = "70px";
            down = addsvg("img/down.svg");
            down.style.bottom = "20px";
            down.style.left = "70px";
            left = addsvg("img/left.svg");
            left.style.bottom = "80px";
            left.style.left = "10px";
            right = addsvg("img/right.svg");
            right.style.bottom = "80px";
            right.style.left = "130px";
            gun = addsvg("img/gun.svg");
            gun.style.bottom = "80px";
            gun.style.right = "80px"
        }
    }
    function fullScreen(element) { 
        if(element.requestFullScreen) { 
        element.requestFullScreen(); 
       } else if(element.webkitRequestFullScreen ) { 
         element.webkitRequestFullScreen(); 
        } else if(element.mozRequestFullScreen) { 
        element.mozRequestFullScreen(); 
       } 
    }
    //竖屏横屏自动恢复
    function sphp() {
        if(window.matchMedia("(orientation: portrait)").matches&&!sp){
            cavs.width = window.screen.height+ "px";
            cavs.height = window.screen.width+ "px";
            chei = parseInt(900 * window.screen.width/ window.screen.height) * pq;
            cavs.transform="rotate(90deg)";
            cavs.left=-parseInt(cavs.width)/2+parseInt(cavs.height)/2+"px";
            cavs.top=-parseInt(cavs.height)/2+parseInt(cavs.width)/2+"px";
            sp=t
        }
        if(!window.matchMedia("(orientation: portrait)").matches&&sp){
            cavs.width = window.screen.width+ "px";
            cavs.height = window.screen.height+ "px";
            chei = parseInt(900 * window.screen.height/ window.screen.width) * pq;
            cavs.transform="rotate(0)";
            cavs.left=0;
            cavs.top=0;
            sp=f
        }
    }
    //一切准备工作都完成
    //开工！
    load();
    raf();
})()
