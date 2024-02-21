#include <iostream>
#include <string>
#include <vector>

// #define TABLE_RED    0
// #define TABLE_BLUE   1
// #define TABLE_YELLOW 2
// #define TABLE_GREEN  3

std::string customer_name[58] =
{
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
};

std::string customer_description[58] =
{
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
};

int customer_num_food_requirement[58] = 
{
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
};

// #define FOOD_COOKIE  0
// #define FOOD_CAKE    1
// #define FOOD_WINE    2
// #define FOOD_COFFEE  3
int customer_food_requirement[58][4] =
{
    {3, 1, -1, -1},
    {2, -1, -1, -1},
    {2, -1, -1, -1},
    {2, -1, -1, -1},
    {2, 3, -1, -1},
    {0, 2, -1, -1},
    {2, 2, -1, -1},
    {2, 2, 2, -1},
    {0, 2, 2, -1},
    {2, 2, 3, -1},
    {2, 2, 2, 3},
    {0, 0, 0, 2},
    {1, 1, 2, 2},
    {0, 2, 2, 2},
    {0, 1, 2, 2},
    {3, -1, -1, -1},
    {3, -1, -1, -1},
    {3, -1, -1, -1},
    {1, 3, -1, -1},
    {3, 3, -1, -1},
    {0, 0, 3, -1},
    {1, 1, 3, -1},
    {0, 2, 3, -1},
    {0, 3, 3, -1},
    {0, 1, 3, -1},
    {2, 3, 3, -1},
    {1, 3, 3, -1},
    {2, 2, 3, 3},
    {0, 0, 3, 3},
    {2, 2, -1, -1},
    {1, -1, -1, -1},
    {1, -1, -1, -1},
    {1, -1, -1, -1},
    {1, 2, -1, -1},
    {1, 1, -1, -1},
    {1, 2, 3, -1},
    {0, 1, 2, -1},
    {1, 1, 2, -1},
    {0, 0, 1, -1},
    {1, 2, 2, -1},
    {1, 1, 3, 3},
    {1, 2, 2, 2},
    {0, 0, 1, 2},
    {0, 1, 1, 1},
    {0, -1, -1, -1},
    {0, -1, -1, -1},
    {0, -1, -1, -1},
    {0, 0, -1, -1},
    {0, 1, -1, -1},
    {0, 3, -1, -1},
    {0, 0, 2, -1},
    {0, 0, 0, -1},
    {0, 1, 1, -1},
    {0, 3, 3, 3},
    {0, 0, 0, 3},
    {0, 3, -1, -1},
    {0, 2, -1, -1},
    {0, 0, 1, 1}
};

// type 0, points
// type 1, server
// type 2, room
// type 3, food
// type 4, customer
// type 5, special
int customer_bonus_type[58][2] =
{
    {4, -1},
    {2, -1},
    {2, 1},
    {3, -1},
    {3, 0},
    {3, 0},
    {3, 0},
    {1, -1},
    {3, 1},
    {2, 2},
    {2, -1},
    {3, 1},
    {3, 0},
    {2, 2},
    {4, 0},
    {4, -1},
    {1, -1},
    {-1, -1},
    {1, 2},
    {1, 0},
    {0, -1},
    {0, -1},
    {1, 0},
    {2, -1},
    {2, -1},
    {1, 1},
    {0, -1},
    {1, -1},
    {1, -1},
    {0, -1},
    {0, -1},
    {4, -1},
    {0, 0},
    {4, -1},
    {3, 0},
    {2, -1},
    {0, -1},
    {0, 4},
    {0, -1},
    {1, -1},
    {0, 4},
    {2, -1},
    {0, -1},
    {3, 0},
    {1, -1},
    {0, -1},
    {0, -1},
    {1, -1},
    {0, -1},
    {1, -1},
    {5, -1},
    {0, -1},
    {1, 0},
    {2, 0},
    {4, 0},
    {2, 0},
    {1, -1},
    {1, -1}
};

int customer_bonus_game_point[58] =
{
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
};

class Customer {
public:
    Customer(int customer_id=0){
        name = customer_name[customer_id];
        description = customer_description[customer_id];
        table_color = (customer_id>=0  && customer_id<=14) ? 2 :
                      (customer_id>=15 && customer_id<=28) ? 1 :
                      (customer_id>=29 && customer_id<=43) ? 0 :
                      (customer_id>=44 && customer_id<=57) ? 3 : -1;
        num_food_requirement = customer_num_food_requirement[customer_id];
        food_requirement[0] = customer_food_requirement[customer_id][0];
        food_requirement[1] = customer_food_requirement[customer_id][1];
        food_requirement[2] = customer_food_requirement[customer_id][2];
        food_requirement[3] = customer_food_requirement[customer_id][3];
        invitation_cost = 0;
        bonus_type[0] = customer_bonus_type[customer_id][0];
        bonus_type[1] = customer_bonus_type[customer_id][1];
        // type 0, points
        bonus_game_point = customer_bonus_game_point[customer_id];
        switch(customer_id){
            case 5:  bonus_royal_point = 2; break;
            case 14: bonus_royal_point = 3; break;
            case 19: bonus_royal_point = 2; break;
            case 20: bonus_royal_point = 3; break;
            case 22: bonus_royal_point = 3; break;
            case 29: bonus_royal_point = 3; break;
            case 32: bonus_royal_point = 1; break;
            case 46: bonus_royal_point = 1; break;
            case 48: bonus_royal_point = 2; break;
            case 52: bonus_royal_point = 2; break;
            case 53: bonus_royal_point = 3; break;
            case 54: bonus_royal_point = 3; break;
            case 55: bonus_royal_point = 1; break;
            default: bonus_royal_point = 0;
        }
        switch(customer_id){
            case 4:  bonus_money = 2; break;
            case 6:  bonus_money = 2; break;
            case 12: bonus_money = 3; break;
            case 21: bonus_money = 3; break;
            case 26: bonus_money = 1; break;
            case 30: bonus_money = 1; break;
            case 32: bonus_money = 1; break;
            case 34: bonus_money = 3; break;
            case 36: bonus_money = 5; break;
            case 37: bonus_money = 3; break;
            case 38: bonus_money = 3; break;
            case 40: bonus_money = 3; break;
            case 42: bonus_money = 4; break;
            case 43: bonus_money = 3; break;
            case 45: bonus_money = 1; break;
            case 51: bonus_money = 4; break;
            default: bonus_money = 0;
        }
        // type 1, server
        switch(customer_id){
            case 2:  bonus_server_to_hand = 1; break;
            case 7:  bonus_server_to_hand = 2; break;
            case 19: bonus_server_to_hand = 2; break;
            case 44: bonus_server_to_hand = 3; break;
            case 52: bonus_server_to_hand = 1; break;
            case 56: bonus_server_to_hand = 2; break;
            default: bonus_server_to_hand = 0;
        }
        switch(customer_id){
            case 57: bonus_server_to_hire_free = 1; break;
            default: bonus_server_to_hire_free = 0;
        }
        switch(customer_id){
            case 16: bonus_server_to_hire_minus1 = 1; break;
            case 18: bonus_server_to_hire_minus1 = 1; break;
            case 22: bonus_server_to_hire_minus1 = 1; break;
            case 25: bonus_server_to_hire_minus1 = 2; break;
            case 47: bonus_server_to_hire_minus1 = 1; break;
            default: bonus_server_to_hire_minus1 = 0;
        }
        switch(customer_id){
            case 11: bonus_server_to_hire_minus2 = 1; break;
            default: bonus_server_to_hire_minus2 = 0;
        }
        switch(customer_id){
            case 8:  bonus_server_to_hire_minus3 = 1; break;
            case 39: bonus_server_to_hire_minus3 = 1; break;
            case 49: bonus_server_to_hire_minus3 = 1; break;
            default: bonus_server_to_hire_minus3 = 0;
        }
        switch(customer_id){
            case 28: bonus_server_1from3_free = 1; break;
            default: bonus_server_1from3_free = 0;
        }
        switch(customer_id){
            case 27: bonus_server_1from3_minus3 = 1; break;
            default: bonus_server_1from3_minus3 = 0;
        }
        // type 2, room
        switch(customer_id){
            case 2:  bonus_open_room = 1; break;
            case 13: bonus_open_room = 1; break;
            case 18: bonus_open_room = 1; break;
            default: bonus_open_room = 0;
        }
        switch(customer_id){
            case 23: bonus_open_room_free = 1; break;
            case 41: bonus_open_room_free = 2; break;
            default: bonus_open_room_free = 0;
        }
        switch(customer_id){
            case 1:  bonus_open_room_free_max_floor2 = 1; break;
            default: bonus_open_room_free_max_floor2 = 0;
        }
        switch(customer_id){
            case 9:  bonus_open_room_minus1 = 2; break;
            case 13: bonus_open_room_minus1 = 2; break;
            default: bonus_open_room_minus1 = 0;
        }
        switch(customer_id){
            case 10: bonus_close_room = 1; break;
            case 24: bonus_close_room = 1; break;
            case 35: bonus_close_room = 1; break;
            case 53: bonus_close_room = 1; break;
            case 55: bonus_close_room = 1; break;
            default: bonus_close_room = 0;
        }
        // type 3, food
        switch(customer_id){
            case 6:  bonus_food_all_kind = 1; break;
            default: bonus_food_all_kind = 0;
        }
        switch(customer_id){
            case 3:  bonus_food_cookie = 1; break;
            case 4:  bonus_food_cookie = 1; break;
            default: bonus_food_cookie = 0;
        }
        switch(customer_id){
            case 8:  bonus_food_cake = 1; break;
            case 11: bonus_food_cake = 1; break;
            default: bonus_food_cake = 0;
        }
        switch(customer_id){
            case 34: bonus_food_wine = 1; break;
            case 43: bonus_food_wine = 1; break;
            default: bonus_food_wine = 0;
        }
        switch(customer_id){
            case 12: bonus_food_coffee = 1; break;
            default: bonus_food_coffee = 0;
        }
        // type 4, customer
        switch(customer_id){
            case 0:  bonus_customer_free_invite = 1; break;
            case 14: bonus_customer_free_invite = 1; break;
            case 15: bonus_customer_free_invite = 1; break;
            case 31: bonus_customer_free_invite = 1; break;
            case 33: bonus_customer_free_invite = 1; break;
            case 37: bonus_customer_free_invite = 1; break;
            case 40: bonus_customer_free_invite = 2; break;
            case 54: bonus_customer_free_invite = 1; break;
            default: bonus_customer_free_invite = 0;
        }
        // type 5, special
        switch(customer_id){
            case 50: bonus_mini_round = 1; break;
            default: bonus_mini_round = 0;
        }
    }

    std::string get_name(){
        return name;
    }

    std::string get_description(){
        return description;
    }

    int get_color(){
        return table_color;
    }

    std::string get_color_string(){
        return (table_color == 2) ? "黄" :
               (table_color == 1) ? "蓝" :
               (table_color == 0) ? "红" :
               (table_color == 3) ? "绿" : "查无此色";
    }

    int get_num_food_requirement(){
        return num_food_requirement;
    }

    int get_food_requirement(int idx){
        return food_requirement[idx];
    }

    std::string get_food_requirement_string(int idx){
        return (food_requirement[idx]==0) ? "棕饼干" :
               (food_requirement[idx]==1) ? "白蛋糕" :
               (food_requirement[idx]==2) ? "红酒" :
               (food_requirement[idx]==3) ? "黑咖啡" : "查无此食物";
    }

    void update_food_requirement(int idx){
        for(int i=0; i<idx; i++){
            food_requirement[i] = food_requirement[i+1];
        }
        food_requirement[idx] = -1;
        num_food_requirement--;
    }

    int get_invitation_cost() {
        return invitation_cost;
    }

    void set_invitation_cost(int cost) {
        invitation_cost = cost;
    }

    int get_bonus_game_point(){
        return bonus_game_point;
    }

private:
    std::string name;
    std::string description;
    int table_color;
    int num_food_requirement; // max 4
    int food_requirement[4]; // [0] must be available value, -1 as not available
    int invitation_cost;

    int bonus_type[2]; // max 2 bonus, 6 types of bonus, -1 as invalid

    // type 0, points
    int bonus_game_point;
    int bonus_royal_point;
    int bonus_money;

    // type 1, server
    int bonus_server_to_hand;
    int bonus_server_to_hire_free;
    int bonus_server_to_hire_minus1;
    int bonus_server_to_hire_minus2;
    int bonus_server_to_hire_minus3;
    int bonus_server_1from3_free;
    int bonus_server_1from3_minus3;

    // type 2, room
    int bonus_open_room;
    int bonus_open_room_free;
    int bonus_open_room_free_max_floor2;
    int bonus_open_room_minus1;
    int bonus_close_room;

    // type 3, food
    int bonus_food_all_kind;
    int bonus_food_cookie;
    int bonus_food_cake;
    int bonus_food_wine;
    int bonus_food_coffee;

    // type 4, customer
    int bonus_customer_free_invite;

    // type 5, special
    int bonus_mini_round;
};