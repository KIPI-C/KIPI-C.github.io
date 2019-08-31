var d=document
    ,si=null
    ,washed=false
    ,order=[]
    ,orderIndex=0
    ,playerNum=2
    ,playerNumMin=2
    ,playerNumMax=9
    ,pause=false
pokerList=[
    "sA","s2","s3","s4","s5","s6","s7","s8","s9","s10","sJ","sQ","sK",
    "hA","h2","h3","h4","h5","h6","h7","h8","h9","h10","hJ","hQ","hK",
    "cA","c2","c3","c4","c5","c6","c7","c8","c9","c10","cJ","cQ","cK",
    "dA","d2","d3","d4","d5","d6","d7","d8","d9","d10","dJ","dQ","dK",
    "jo","Jo"
]
table=[]
player=[]

function addPlayer(){
    var id=player.length
    player.push({thisTimeHave:[],thisTimeGet:[]})
    var playerdiv=d.createElement("div")
        playerdiv.id="p"+(id)
        d.querySelector("#player").appendChild(playerdiv)
    if(player.length>2){
        var del=d.createElement("button")
        del.id="p"+(id)+"del"
        del.innerHTML="-"
        del.addEventListener("click",function(){
            playerNum-=1
            player.splice(id,1)
            clear()
        })
        playerdiv.appendChild(del)
    }
    var title=d.createElement("h2")
        title.id="p"+(id)+"title"
        title.innerHTML="玩家"+(id)
        playerdiv.appendChild(title)
    var have=d.createElement("p")
        have.id="p"+(id)+"have"
        have.innerHTML="拥有总牌数：0"
        playerdiv.appendChild(have)
    var thave=d.createElement("p")
        thave.id="p"+(id)+"thave"
        thave.innerHTML="本轮拥有牌数：0"
        playerdiv.appendChild(thave)
    var tget=d.createElement("p")
        tget.id="p"+(id)+"tget"
        tget.innerHTML="本轮获得牌数：0"
        playerdiv.appendChild(tget)
    
}

function wash(list){
    var washed=[]
    for(var i of list){
        washed.splice(Math.round(Math.random()*washed.length),0,i)
    }
    return washed
}



function updateState(state){
    d.querySelector("#state").innerHTML="状态："+state
}

function updataPlayer(){
    for (var i in player) {
        if(order[orderIndex]==i)d.querySelector("#p"+i+"title").style.color="#2ac"
        else{d.querySelector("#p"+i+"title").style.color="#143"}
        d.querySelector("#p"+i+"have").innerHTML="拥有总牌数："+(player[i].thisTimeHave.length+player[i].thisTimeGet.length)
        d.querySelector("#p"+i+"thave").innerHTML="本轮拥有牌数："+player[i].thisTimeHave.length
        d.querySelector("#p"+i+"tget").innerHTML="本轮获得牌数："+player[i].thisTimeGet.length
    }
}

function updataTable(){
    d.querySelector("#table").innerHTML=""
    //显示
    for(var i in table){
        var poker=table[i]
        if(poker.slice(1,2)=="s")poker="黑桃"+poker.slice(2)
        else if(poker.slice(1,2)=="h")poker="红桃"+poker.slice(2)
        else if(poker.slice(1,2)=="c")poker="梅花"+poker.slice(2)
        else if(poker.slice(1,2)=="d")poker="方块"+poker.slice(2)
        else if(poker.slice(1,2)=="J")poker="大鬼"
        else if(poker.slice(1,2)=="j")poker="小鬼"
        d.querySelector("#table").innerHTML+=poker+" "
    }
    //看看赢没有
    for(var ii in table){
        if(ii==table.length-1)return false
        if(table[ii].slice(2)==table[table.length-1].slice(2)){
            for(var iii in table.slice(ii)){
                player[table[table.length-1].slice(0,1)].thisTimeGet.push(table[iii])
            }
            table.splice(ii)
            return true
        }
    }
}

function clear(){
    if(si){clearInterval(si);si=null}
    washed=false,order=[],table=[],player=[],orderIndex=0,pause=false

    d.querySelector("#player").innerHTML=""

    if(playerNum<playerNumMin)playerNum=playerNumMin
    while(player.length<playerNum){
        addPlayer()
    }
}

function gameover(){
    d.querySelector("#addAI").style.display="inline-block"
    for(var iiiii in player){
        if(iiiii>1)d.querySelector("#p"+iiiii+"del").style.display="inline-block"
    }
    clearInterval(si)
}

d.querySelector("#addAI").addEventListener("click",function(){
    if(playerNum<=playerNumMax){
        playerNum+=1
        addPlayer()
    }
})

d.querySelector("#start").addEventListener("click",function(){
    clear()
    for(var iiiii in player){
        if(iiiii>1)d.querySelector("#p"+iiiii+"del").style.display="none"
    }

    d.querySelector("#addAI").style.display="none"
    si=setInterval(function(){
        if(!pause){
            var cache=[]

            if(!washed){
                cache=wash(pokerList);//洗牌
                //一人一半
                var lastnum=0
                for(var iiii in player){
                    if(iiii<player.length-1){
                    player[iiii].thisTimeHave=cache.slice(lastnum,parseInt((parseInt(iiii)+1)*54/player.length));
                    lastnum=parseInt((parseInt(iiii)+1)*54/player.length)
                    }
                    else{
                        player[iiii].thisTimeHave=cache.slice(lastnum);
                        console.log(66666666666)
                    }
                }
                washed=true//洗牌了
                updateState("洗牌/发牌")
                //随机生成玩家发牌顺序
                cache=[]
                for(var i in player){
                    cache.push(i)
                }
                order=wash(cache)

            }
            else{
                updataPlayer()
                if(player[order[orderIndex]].thisTimeHave.length>0){
                    updateState("玩家"+order[orderIndex]+"出牌")
                    table.push(order[orderIndex]+player[order[orderIndex]].thisTimeHave.splice(0,1))//放入桌子
                    //如果没赢，顺序加一
                    if(!updataTable()){
                        if(orderIndex!=order.length-1)orderIndex+=1
                        else orderIndex=0
                    }
                    if(player[order[orderIndex]].thisTimeHave.length+player[order[orderIndex]].thisTimeGet.length==0){
                        updateState("玩家"+order[orderIndex]+"输了")
                        d.querySelector("#p"+order[orderIndex]+"title").style.color="#d11"
                        gameover()
                    }
                }
                else{
                    updateState("玩家"+order[orderIndex]+"洗牌")
                    d.querySelector("#p"+order[orderIndex]+"title").style.color="#a3c"
                    player[order[orderIndex]].thisTimeGet=wash(player[order[orderIndex]].thisTimeGet)
                    for(var ii in player[order[orderIndex]].thisTimeGet){
                        player[order[orderIndex]].thisTimeHave.push(player[order[orderIndex]].thisTimeGet[ii].slice(1))
                    }
                    player[order[orderIndex]].thisTimeGet=[]
                    
                }
            }
        }
    },d.querySelector("#delay").value)
})

d.querySelector("#pause").addEventListener("click",function(){
    pause=true
})

d.querySelector("#play").addEventListener("click",function(){
    pause=false
})

d.querySelector("#stop").addEventListener("click",function(){
    gameover()
})

addPlayer()
addPlayer()