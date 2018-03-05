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
        , kpcimgdraw = false

        , pq = 2//画质多少倍渲染
        , x = 150 * pq//用户x坐标
        , y = 175 * pq//y坐标
        , speed = 3 * pq//用户速度
        , zdspeed = 5 * pq//子弹速度
        , zdcolor = "#ee5"//子弹默认颜色
        , guncolor = "#005"//枪默认颜色
        , usercolor = "#0ea"//用户默认颜色
        , freeztime = 500//子弹冷却时间
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
        chei = parseInt(900 * (window.screen.height)/ (window.screen.width)) * pq;
        cav.width = cwid;
        cav.height = chei;
        ael(d, "keydown", function (e) { kd(e) });//传递参数给kd处理
        ael(d, "keyup", function (e) { ku(e) });//传递参数给ku处理
        kpcimg.src = "img/KIPI-C.svg"
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
            if(loadcache<10){ctx.drawImage(kpcimg, cwid/45, chei*.35, cwid*.32, cwid*.32);}
            if (!kpcimgdraw) {
                console.log("drawing logo")
                ctx.fillStyle = "#002"
                ctx.fillRect(0, 0, cwid, chei);
                ctx.fillStyle = "#0ea"
                ctx.font = "bold " + 70 * pq + "px arial"
                ctx.fillText("KIPI-C Games", cwid/2.5, chei/2.5);
                ctx.font = 40 * pq + "px arial"
                ctx.fillText("Create a new world for you", cwid/2.55, chei/1.8);
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
        }
        if (kstate == "play") {
            //clr();//清屏
            //如果改变了方向，就禁止跑出界面
            if (k.w || k.s || k.a || k.d) {
                x < 0 ? x = 0 : 0
                y < 0 ? y = 0 : 0
                x + 50 * pq > cwid ? x = cwid - 50 * pq : 0
                y + 50 * pq > chei ? y = chei - 50 * pq : 0
                ctx.clearRect(x, y, 50 * pq, 50 * pq)
                switch (wsad) {
                    case "w": ctx.clearRect(x + 15 * pq, y - 50 * pq, 20 * pq, 50 * pq); break;
                    case "s": ctx.clearRect(x + 15 * pq, y + 50 * pq, 20 * pq, 50 * pq); break;
                    case "a": ctx.clearRect(x - 50 * pq, y + 15 * pq, 50 * pq, 20 * pq); break;
                    case "d": ctx.clearRect(x + 50 * pq, y + 15 * pq, 50 * pq, 20 * pq); break;
                }
            }

            //W S A D的状态
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
    //一切准备工作都完成
    //开工！
    load();
    raf();
})()
