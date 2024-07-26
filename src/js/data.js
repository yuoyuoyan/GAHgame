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
    "2层以内免费准备2个房间/失去最高的已入住的2个房间或失去7游戏点数"],
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

const guestRequirementNum = [
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

const guestColorByID = [];