// global const and variables
const guestCanvas  = document.getElementById("guestboard");
const guestContext  = guestCanvas.getContext("2d");
const actionCanvas = document.getElementById("actionboard");
const actionContext = actionCanvas.getContext("2d");
const player0Canvas = document.getElementById("player0board");
const player1Canvas = document.getElementById("player1board");
const player2Canvas = document.getElementById("player2board");
const player3Canvas = document.getElementById("player3board");
const player0Context = player0Canvas.getContext("2d");
const player1Context = player1Canvas.getContext("2d");
const player2Context = player2Canvas.getContext("2d");
const player3Context = player3Canvas.getContext("2d");
const serverCanvas = document.getElementById("serverboard");
const serverContext = serverCanvas.getContext("2d");
const hotelCanvas = document.getElementById("hotelboard");
const hotelContext = hotelCanvas.getContext("2d");
const logCanvas = document.getElementById("logboard");
const logContext = logCanvas.getContext("2d");
const alertCanvas = document.getElementById("alertboard");
const alertContext = alertCanvas.getContext("2d");

const guestAllImg = document.getElementById("guestImg");
const serverAllImg = document.getElementById("serverImg");
const guestBoardImg = document.getElementById("guestBoardImg");
const tokenImg = document.getElementById("tokenImg");
const hotelImg = document.getElementById("hotelImg");
const restartImg = document.getElementById("restartImg");
const majorTaskA0ImgX =   0;const majorTaskA0ImgY =   0;
const majorTaskA1ImgX = 160;const majorTaskA1ImgY =   0;
const majorTaskA2ImgX = 320;const majorTaskA2ImgY =   0;
const majorTaskA3ImgX = 480;const majorTaskA3ImgY =   0;
const majorTaskB0ImgX = 640;const majorTaskB0ImgY =   0;
const majorTaskB1ImgX = 800;const majorTaskB1ImgY =   0;
const majorTaskB2ImgX =   0;const majorTaskB2ImgY = 240;
const majorTaskB3ImgX = 160;const majorTaskB3ImgY = 240;
const majorTaskC0ImgX = 320;const majorTaskC0ImgY = 240;
const majorTaskC1ImgX = 480;const majorTaskC1ImgY = 240;
const majorTaskC2ImgX = 640;const majorTaskC2ImgY = 240;
const majorTaskC3ImgX = 800;const majorTaskC3ImgY = 240;
const royalTaskA0ImgX =   0;const royalTaskA0ImgY = 480;
const royalTaskA1ImgX =  80;const royalTaskA1ImgY = 480;
const royalTaskA2ImgX = 160;const royalTaskA2ImgY = 480;
const royalTaskA3ImgX = 240;const royalTaskA3ImgY = 480;
const royalTaskB0ImgX = 320;const royalTaskB0ImgY = 480;
const royalTaskB1ImgX = 400;const royalTaskB1ImgY = 480;
const royalTaskB2ImgX = 480;const royalTaskB2ImgY = 480;
const royalTaskB3ImgX = 560;const royalTaskB3ImgY = 480;
const royalTaskC0ImgX = 640;const royalTaskC0ImgY = 480;
const royalTaskC1ImgX = 720;const royalTaskC1ImgY = 480;
const royalTaskC2ImgX = 800;const royalTaskC2ImgY = 480;
const royalTaskC3ImgX = 880;const royalTaskC3ImgY = 480;
const gamePointTokenImgX = 0;const gamePointTokenImgY = 600;
const royalTokenImgX = 30;const royalTokenImgY = 600;
const moneyImgX = 60;const moneyImgY = 600;
const brownImgX = 90;const brownImgY = 600;
const whiteImgX = 120;const whiteImgY = 600;
const redImgX = 150;const redImgY = 600;
const blackImgX = 180;const blackImgY = 600;
const dice1ImgX = 210;const dice1ImgY = 600;
const dice2ImgX = 240;const dice2ImgY = 600;
const dice3ImgX = 270;const dice3ImgY = 600;
const dice4ImgX = 300;const dice4ImgY = 600;
const dice5ImgX = 330;const dice5ImgY = 600;
const dice6ImgX = 360;const dice6ImgY = 600;
const roomPreparedTokenImgX = 390;const roomPreparedTokenImgY = 600;
const roomClosedTokenImgX = 420;const roomClosedTokenImgY = 600;
const serverTokenImgX = 450;const serverTokenImgY = 600;
const roomRedPreparedImgX = 0;const roomRedPreparedImgY = 630;
const roomRedClosedImgX = 100;const roomRedClosedImgY = 630;
const roomBluePreparedImgX = 200;const roomBluePreparedImgY = 630;
const roomBlueClosedImgX = 300;const roomBlueClosedImgY = 630;
const roomYellowPreparedImgX = 400;const roomYellowPreparedImgY = 630;
const roomYellowClosedImgX = 500;const roomYellowClosedImgY = 630;
const actionBoardImgX = 0;const actionBoardImgY = 750;
const bonusRoomImgX = 0;const bonusRoomImgY = 910;
const tableImgX = 0;const tableImgY = 1030;
const serverBackImgX = 640;const serverBackImgY = 910;
const hotel0ImgX =   0;const hotel0ImgY =   0;
const hotel1ImgX =   0;const hotel1ImgY = 480;
const hotel2ImgX = 640;const hotel2ImgY = 480;
const hotel3ImgX =   0;const hotel3ImgY = 960;
const hotel4ImgX = 640;const hotel4ImgY = 960;

// major task data
const majorTaskDescription = [
    ["积累20块钱", 
    "积累10点皇室点数", 
    "雇佣6名员工", 
    "准备/入住12个房间"],
    ["完整入住2个楼层", 
    "完整入住2个列", 
    "完整入住6个区域", 
    "完整入住所有的某颜色房间"],
    ["入住3个红和3个黄和3个蓝房间", 
    "入住4个红和3个黄房间", 
    "入住4个黄和3个蓝房间", 
    "入住4个蓝和3个红房间"]
];

const royalTaskDescription = [
    ["获得3块钱/失去3块钱或5游戏点数", 
    "获得2份任意食物/失去厨房全部食物", 
    "抽3员工打1减3费返还剩余/丢弃2张员工手牌或失去5游戏点数", 
    "免费准备1个房间/失去最高的准备好的房间或失去5游戏点数"],
    ["获得4种食物各1份/失去厨房和客桌上的全部食物", 
    "获得5块钱/失去5块钱或失去7游戏点数", 
    "抽3员工打1免费返还剩余/丢弃3张员工手牌或失去7游戏点数", 
    "2层以内免费准备1个房间并入住/失去最高的准备好的2个房间或失去7游戏点数"],
    ["获得8游戏点数/失去8游戏点数", 
    "免费准备1个房间并入住/失去最高层和次高层各1个已入住房间", 
    "每个已雇佣员工获得2游戏点数/每个已雇佣员工失去2游戏点数", 
    "免费雇佣1位手牌上的员工/失去1位已雇佣员工（终局结算优先）或失去10游戏点数"]
];

// hotel data
const roomColorByID = [
    [
        [2, 1, 0, 0, 2],
        [1, 1, 0, 0, 1],
        [2, 0, 2, 1, 1],
        [2, 0, 2, 0, 2]
    ],
    [
        [0, 1, 0, 0, 1],
        [2, 1, 2, 2, 2],
        [2, 1, 0, 0, 1],
        [2, 1, 2, 2, 0]
    ],
    [
        [2, 1, 0, 0, 0],
        [2, 1, 0, 2, 1],
        [2, 0, 2, 0, 1],
        [1, 2, 2, 0, 2]
    ],
    [
        [0, 2, 0, 1, 0],
        [0, 2, 1, 1, 1],
        [0, 1, 0, 2, 2],
        [2, 1, 0, 2, 1]
    ],
    [
        [0, 2, 0, 0, 2],
        [1, 2, 1, 1, 1],
        [1, 2, 2, 0, 2],
        [0, 0, 0, 1, 2]
    ]
];

const roomColorNumByID = [
    [7, 6, 7],
    [6, 6, 8],
    [7, 5, 8],
    [7, 7, 6],
    [7, 6, 7]
];

const roomAreaByID = [
    [
        [8, 6, 7, 7, 9],
        [6, 6, 7, 7, 5],
        [0, 1, 2, 5, 5],
        [0, 1, 2, 3, 4]
    ],
    [
        [7, 1, 8, 8, 9],
        [0, 1, 6, 6, 6],
        [0, 1, 4, 4, 5],
        [0, 1, 2, 2, 3]
    ],
    [
        [4, 7, 8, 8, 8],
        [0, 1, 2, 2, 3],
        [4, 5, 1, 2, 6],
        [0, 1, 1, 2, 3]
    ],
    [
        [5, 6, 8, 7, 9],
        [5, 6, 7, 7, 7],
        [5, 1, 2, 3, 3],
        [0, 1, 2, 3, 4]
    ],
    [
        [7, 4, 8, 8, 9],
        [3, 4, 6, 6, 6],
        [3, 4, 4, 5, 2],
        [0, 0, 0, 1, 2]
    ]
];

const roomAreaRoomByID = [
    [2, 2, 2, 1, 1, 3, 3, 4, 1, 1],
    [3, 4, 2, 1, 2, 1, 3, 1, 2, 1],
    [1, 3, 2, 1, 3, 1, 2, 2, 4, 1],
    [1, 2, 2, 3, 1, 3, 2, 4, 1, 1],
    [3, 1, 2, 2, 4, 1, 3, 1, 2, 1]
];

// server data
const serverNameByID = [
    "早餐服务生",
    "女招待",
    "酒吧经理",
    "副主厨",
    "马夫",
    "饲养员",
    "女按摩师",
    "导游",
    "男管家",
    "专职司机",
    "花匠",
    "客房部主管",
    "餐厅经理",
    "装潢师",
    "擦鞋匠",
    "洗衣工",
    "厨工",
    "寄管员",
    "内饰建筑师",
    "侦探",
    "主厨",
    "人事经理",
    "监管人",
    "餐厅领班",
    "行李员",
    "会议经理",
    "订房部经理",
    "礼宾员",
    "秘书",
    "总台接待员",
    "女服务员",
    "助理经理",
    "楼层男主管",
    "前台接待",
    "门童",
    "酒侍",
    "客房服务生",
    "递送员",
    "甜点师",
    "市场总监",
    "接线员",
    "园丁",
    "咖啡师",
    "点心师",
    "泳池服务员",
    "楼层女主管",
    "电梯服务员",
    "酒店经理"
];

const serverDescriptionByID = [
    "每回合获得一个饼干",
    "每回合获得一个蛋糕",
    "每回合获得一个红酒",
    "每回合获得一个咖啡",
    "满足红色客人时获得2块钱",
    "满足蓝色客人时获得1皇家点数",
    "满足黄色客人时获得1块钱",
    "满足绿色客人时获得2游戏点数",
    "免费准备蓝色房间",
    "免费准备红色房间",
    "免费准备黄色房间",
    "使用色子3或4时获得2游戏点数",
    "使用色子1或2时加1强度",
    "使用色子1或2时可以准备一个房间",
    "使用色子4时可以同时获得钱和皇家点数",
    "使用色子4时可以获得4游戏点数",
    "使用色子6时无需支付费用并且强度加1",
    "使用色子5时加2强度",
    "使用色子3时获得5游戏点数",
    "使用色子5时获得2皇家点数",
    "一次性获得所有食物或饮料各一份",
    "使用色子3时可以雇佣一位员工",
    "满足客人并入住时可以获得1块钱",
    "免费从厨房上菜",
    "免费邀请客人",
    "可支付1块钱替代皇家任务惩罚",
    "最终结算时每个入住的红房间获得3游戏点数",
    "最终结算时每个入住的蓝房间获得3游戏点数",
    "最终结算时获得所有其他玩家的结算效果",
    "最终结算时每个入住的黄房间获得3游戏点数",
    "最终结算时每个入住的房间获得1游戏点数",
    "最终结算时每个雇佣的员工获得2游戏点数",
    "满足食物或饮料需求量为4的客人时获得4游戏点数",
    "最终结算时每个准备好或者入住的房间获得1游戏点数",
    "一次性将两个准备好的房间入住",
    "一次性获得4份红酒",
    "最终结算时每个全部入住的区域获得2游戏点数",
    "一次性满足一位客人的所有用餐需求",
    "一次性获得4份蛋糕",
    "最终结算时每个完成的全局任务获得5游戏点数",
    "最终结算时每个剩余的皇室点数获得2游戏点数",
    "在获得皇室任务奖励时可以获得5游戏点数",
    "一次性获得4份咖啡",
    "一次性获得4份饼干",
    "一次性获得3皇家点数",
    "最终结算时每个全部入住的层获得5游戏点数",
    "最终结算时每个全部入住的列获得5游戏点数",
    "最终结算时每个入住的红黄蓝房间组合获得4游戏点数",
];

const serverCostByID = [
    4, 6, 4, 6, 4,
    1, 1, 2, 5, 5,
    5, 2, 2, 2, 4,
    2, 3, 2, 3, 2,
    3, 3, 5, 1, 6,
    5, 4, 4, 5, 4,
    4, 4, 5, 5, 2,
    2, 3, 5, 3, 2,
    3, 3, 3, 2, 1,
    2, 4, 4
];

const serverTypeByID = [
    0, 0, 0, 0, 2,
    2, 2, 2, 2, 2,
    2, 2, 2, 2, 2,
    2, 2, 2, 2, 2,
    1, 2, 2, 2, 2,
    2, 3, 3, 3, 3,
    3, 3, 2, 3, 1,
    1, 3, 1, 1, 3,
    3, 2, 1, 1, 1,
    3, 3, 3
];

// guest data
const guestNameByID = [
    "莫拉斯先生",
    "雕塑家",
    "音乐家",
    "作曲家",
    "裁缝",
    "舞蹈家",
    "肖像画家",
    "摄影师",
    "歌唱家",
    "建筑师",
    "女演员",
    "诗人",
    "珠宝设计师",
    "画家",
    "歌剧演唱家",
    "男爵夫人",
    "公爵夫人",
    "帝国骑士",
    "实权伯爵",
    "侯爵",
    "公主",
    "伯爵夫人",
    "帝国储君",
    "男爵",
    "王子",
    "伯爵",
    "勋爵",
    "女男爵",
    "公爵",
    "费迪南德先生",
    "药剂师",
    "邮政顾问",
    "疏密会委员",
    "名誉教授",
    "将军",
    "审计长",
    "商务委员",
    "法律顾问",
    "少校",
    "兽医顾问",
    "医学顾问",
    "检察官",
    "皇室专员",
    "高级法务秘书",
    "卡斯卡特里波卡",
    "金钩船长",
    "霍隆先生",
    "英格豪斯",
    "博伊德尔先生",
    "欧多先生",
    "埃及法老",
    "马可波罗",
    "克莱默",
    "弗朗兹法默",
    "挚友乌韦",
    "售票员",
    "迪尔戈因",
    "麦克劳德"
];

const guestDescriptionByID = [
    "免费邀请1位客人",
    "免费开1间1层或2层房间",
    "原价开1个房间并抽取1张员工到手牌",
    "获得1个棕饼干",
    "获得1个棕饼干和2块钱",
    "获得1个黑咖啡和2个皇室点数",
    "获得1个任意食物资源和2块钱",
    "抽取2张员工到手牌",
    "获得1个白蛋糕并减3费打出1张员工",
    "分别减1费开2个房间",
    "额外关闭1个房间",
    "获得1个白蛋糕并减2费打出1张员工",
    "获得1个黑咖啡和3块钱",
    "减1费开1个房间并原价开1个房间",
    "免费邀请1位客人并获得3个皇室点数",
    "免费邀请1位客人",
    "减1费打出1张员工",
    "无奖励",
    "减1费打出1张员工并原价开1个房间",
    "抽取2张员工到手牌并获得2个皇室点数",
    "获得3个皇室点数",
    "获得3块钱",
    "减1费打出1张员工并获得3个皇室点数",
    "免费开1个房间",
    "额外关闭1个房间",
    "分别减1费打出2张员工",
    "获得1块钱",
    "抽取3张员工，减3费打出其中1张，剩余放回牌堆底部",
    "抽取3张员工，免费打出其中1张，剩余放回牌堆底部",
    "获得3个皇室点数",
    "获得1块钱",
    "免费邀请1位客人",
    "获得1块钱和1个皇室点数",
    "免费邀请1位客人",
    "获得1个红酒盒3块钱",
    "额外关闭1个房间",
    "获得5块钱",
    "获得3块钱并免费邀请1位客人",
    "获得3块钱",
    "减3费打出1张员工",
    "获得3块钱并免费邀请2位客人",
    "免费开2个房间",
    "获得4块钱",
    "获得1个红酒和3块钱",
    "抽取3张员工到手牌",
    "获得1块钱",
    "获得1个皇室点数",
    "减1费打出1张员工",
    "获得2个皇室点数",
    "减3费打出1张员工",
    "立即额外进行一个回合，不需要拿取骰子",
    "获得4块钱",
    "抽取1张员工到手牌并获得2个皇室点数",
    "额外关闭1个房间并获得3个皇室点数",
    "免费邀请1位客人并获得3个皇室点数",
    "额外关闭1个房间并获得1个皇室点数",
    "抽取2张员工到手牌",
    "免费打出1张员工"
];

const guestRequirementNumByID = [
    2, 1, 1, 1, 2,
    2, 2, 3, 3, 3,
    4, 4, 4, 4, 4,
    1, 1, 1, 2, 2,
    3, 3, 3, 3, 3,
    3, 3, 4, 4, 2,
    1, 1, 1, 2, 2,
    3, 3, 3, 3, 3,
    4, 4, 4, 4, 1,
    1, 1, 2, 2, 2,
    3, 3, 3, 4, 4,
    2, 2, 4
];

const guestRequirementByID = [
    [3, 1],
    [2],
    [2],
    [2],
    [2, 3],
    [0, 2],
    [2, 2],
    [2, 2, 2],
    [0, 2, 2],
    [2, 2, 3],
    [2, 2, 2, 3],
    [0, 0, 0, 2],
    [1, 1, 2, 2],
    [0, 2, 2, 2],
    [0, 1, 2, 2],
    [3],
    [3],
    [3],
    [1, 3],
    [3, 3],
    [0, 0, 3],
    [1, 1, 3],
    [0, 2, 3],
    [0, 3, 3],
    [0, 1, 3],
    [2, 3, 3],
    [1, 3, 3],
    [2, 2, 3, 3],
    [0, 0, 3, 3],
    [2, 2],
    [1],
    [1],
    [1],
    [1, 2],
    [1, 1],
    [1, 2, 3],
    [0, 1, 2],
    [1, 1, 2],
    [0, 0, 1],
    [1, 2, 2],
    [1, 1, 3, 3],
    [1, 2, 2, 2],
    [0, 0, 1, 2],
    [0, 1, 1, 1],
    [0],
    [0],
    [0],
    [0, 0],
    [0, 1],
    [0, 3],
    [0, 0, 2],
    [0, 0, 0],
    [0, 1, 1],
    [0, 3, 3, 3],
    [0, 0, 0, 3],
    [0, 3],
    [0, 2],
    [0, 0, 1, 1]
];

// type 0, points
// type 1, server
// type 2, room
// type 3, food
// type 4, customer
// type 5, special
const guestBonusTypeByID = [
    [4],
    [2],
    [2, 1],
    [3],
    [3, 0],
    [3, 0],
    [3, 0],
    [1],
    [3, 1],
    [2, 2],
    [2],
    [3, 1],
    [3, 0],
    [2, 2],
    [4, 0],
    [4],
    [1],
    [],
    [1, 2],
    [1, 0],
    [0],
    [0],
    [1, 0],
    [2],
    [2],
    [1, 1],
    [0],
    [1],
    [1],
    [0],
    [0],
    [4],
    [0, 0],
    [4],
    [3, 0],
    [2],
    [0],
    [0, 4],
    [0],
    [1],
    [0, 4],
    [2],
    [0],
    [3, 0],
    [1],
    [0],
    [0],
    [1],
    [0],
    [1],
    [5],
    [0],
    [1, 0],
    [2, 0],
    [4, 0],
    [2, 0],
    [1],
    [1]
];

const guestBonusGamePointByID = [
    4, 0, 0, 1, 0,
    0, 0, 7, 0, 1,
    7, 5, 5, 2, 4,
    0, 0, 3, 3, 2,
    4, 7, 1, 4, 7,
    4, 10, 5, 4, 3,
    1, 0, 0, 4, 0,
    7, 0, 2, 3, 3,
    3, 0, 5, 7, 0,
    0, 0, 0, 2, 0,
    4, 0, 5, 4, 3,
    0, 4, 2
];

const guestColorByID = [
    1, 1, 1, 1, 1,
    1, 1, 1, 1, 1,
    1, 1, 1, 1, 1,
    2, 2, 2, 2, 2,
    2, 2, 2, 2, 2,
    2, 2, 2, 2, 0,
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 3,
    3, 3, 3, 3, 3,
    3, 3, 3, 3, 3,
    3, 3, 3
];