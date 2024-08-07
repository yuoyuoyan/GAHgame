var btn = document.getElementById("btn");
var canvas = document.getElementById("chessboard");
//var canvas = document.querySelector(".an");
var context = canvas.getContext("2d");
var chessMapArr = [];//记录棋盘落子情况
var chessColor = ["black", "white"];//棋子颜色
var step = 0;//记录当前步数
var flag = false;//判断游戏是否结束
//输赢检查方向模式
var checkMode = [
    [1,0],//水平
    [0,1],//竖直
    [1,1],//左斜线
    [1,-1],//右斜线
];


//新游戏按钮响应函数
btn.addEventListener("click",function(){
    startGame();//开始新游戏
})

//开始新游戏
function startGame() {
    //初始化棋盘数组
    for(var i=0; i<14; i++){
       chessMapArr[i] = [];
       for(var j=0; j<14; j++){
          chessMapArr[i][j] = 0;
        }    
    }
    //清空棋盘
    cleanChessBoard();
    //绘制棋盘
    drawChessBoard();
    //重置游戏是否结束标志
    over = false;
}

//绘制棋盘
function drawChessBoard() {
    for (var i = 0; i < 14; i++) {
        //context.strokeStyle = "#BFBFBF";
        context.beginPath();
        context.moveTo((i+1) * 30, 30);
        context.lineTo((i+1) * 30, canvas.height - 30);
        context.closePath();
        context.stroke();
        context.beginPath();
        context.moveTo(30, (i+1) * 30);
        context.lineTo(canvas.width - 30, (i+1) * 30);
        context.closePath();
        context.stroke();
    }
}

//清除棋盘
function cleanChessBoard() {
    context.fillStyle = "#8f7a66";
    context.fillRect(0, 0, canvas.width, canvas.height);
}


//绘制棋子
function drawChess(x,y,color) {
    context.beginPath();
    context.arc(x,y,15,0,Math.PI*2,false);
    context.closePath();
    context.fillStyle = color;
    context.fill();
    //context.stroke();
}

//下棋落子(canvas点击响应函数)
canvas.addEventListener("click",function(e){
    //判断游戏是否结束
    if (flag) {
        alert("Game Over~");
        return;
    }

    //判断点击范围是否越出棋盘
    if(e.offsetX < 30 || e.offsetX > 420 || e.offsetY < 30 || e.offsetY > 420){
       return;
    }
    var dx = Math.floor((e.offsetX + 15) / 30 ) * 30;
    var dy = Math.floor((e.offsetY + 15) / 30 ) * 30;
    if(chessMapArr[dx/30-1][dy/30-1] == 0){
        drawChess(dx,dy,chessColor[step % 2]);//落下棋子
        chessMapArr[dx/30-1][dy/30-1]= chessColor[step % 2];
        //console.log(dx/30-1,dy/30-1, chessColor[step % 2]);//打印当前棋子位置与颜色
        //检查当前玩家是否赢了游戏
        for(var i=0;i<4;i++){
            checkWin(dx/30-1,dy/30-1, chessColor[step % 2],checkMode[i]);
        }
        step++;
    } 
});


//胜负判断函数
function checkWin(x,y,color,mode)
{
    var count = 1;//记录分数
    for(var i=1;i<5;i++){
        if(chessMapArr[x + i * mode[0]]){
            if(chessMapArr[x + i * mode[0]][y + i * mode[1]] == color){
                count++;
            }else{
                break;
            }
        }
    }
    
    for(var j=1;j<5;j++){
        if(chessMapArr[x - j * mode[0]]){
            if(chessMapArr[x - j * mode[0]][y - j * mode[1]] == color){
                count++;
            }else{
                break;
            }
        }
    }
    if(mode == checkMode[0])
    { console.log("水平方向有： " + count + "个" + color);}
    if(mode == checkMode[1])
    { console.log("竖直方向有： " + count + "个" + color);}
    if(mode == checkMode[2])
    { console.log("左斜方向有： " + count + "个" + color);}
    if(mode == checkMode[3])
    { console.log("右斜方向有： " + count + "个" + color);}
   
    if(count >= 5){
        alert(color + " you win! " + "帅~");
        // 游戏结束
        flag = true;
    }
}