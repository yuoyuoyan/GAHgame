#include <iostream>
#include <string>

std::string server_name_list[48] = {
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
};

std::string server_description_list[48] = {
    "每回合获得一个咖啡",
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
    "最终结算时每个入住的红房间获得5游戏点数",
    "最终结算时每个入住的蓝房间获得5游戏点数",
    "最终结算时获得所有其他玩家的结算效果",
    "最终结算时每个入住的黄房间获得5游戏点数",
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
    "在获得皇室任务奖励是可以获得5游戏点数",
    "一次性获得4份咖啡",
    "一次性获得4份饼干",
    "一次性获得3皇家点数",
    "最终结算时每个全部入住的层获得5游戏点数",
    "最终结算时每个全部入住的列获得5游戏点数",
    "最终结算时每个入住的红黄蓝房间组合获得4游戏点数",
};

int server_cost[48] = {
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
};

int server_type[48] = {
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
};

class Server {
public:
    Server(int server_id=0){
        name = server_name_list[server_id];
        description = server_description_list[server_id];
        cost = server_cost[server_id];
        type = server_type[server_id];

        // type 0, per turn
        cookie_per_turn = server_id == 0;
        cake_per_turn = server_id == 1;
        wine_per_turn = server_id == 2;
        coffee_per_turn = server_id == 3;
        // type 1, once
        food_all_plus1 = server_id == 20;
        coffee_plus4 = server_id == 42;
        wine_plus4 = server_id == 35;
        cookie_plus4 = server_id == 43;
        cake_plus4 = server_id == 38;
        royal_plus3 = server_id == 44;
        room_close2 = server_id == 34;
        comp_customer1 = server_id == 37;
        // type 2, always
        dice_12_plus1 = server_id == 12;
        dice_12_open_room = server_id == 13;
        dice_34_point2 = server_id == 11;
        dice_3_use_server = server_id == 21;
        dice_3_point5 = server_id == 18;
        dice_4_together = server_id == 14;
        dice_4_point4 = server_id == 15;
        dice_5_royal2 = server_id == 19;
        dice_5_plus2 = server_id == 17;
        dice_6_free_plus1 = server_id == 16;
        delivery_free = server_id == 23;
        blue_free = server_id == 8;
        red_free = server_id == 9;
        yellow_free = server_id == 10;
        customer_invite_free = server_id == 24;
        all_comp_money1 = server_id == 22;
        red_comp_money2 = server_id == 4;
        yellow_comp_money1 = server_id == 6;
        blue_comp_royal1 = server_id == 5;
        green_comp_point2 = server_id == 7;
        customer_req4_comp_point4 = server_id == 32;
        royal_task_comp_point5 = server_id == 41;
        royal_punish_replace_money1 = server_id == 25;
        // type 3, final
        point5_per_floor = server_id == 45;
        point5_per_column = server_id == 46;
        point2_per_area = server_id == 36;
        point1_per_room_open_or_close = server_id == 33;
        point1_per_room_close = server_id == 30;
        point5_per_major_task = server_id == 39;
        point2_per_remain_royal = server_id == 40;
        point2_per_use_server = server_id == 31;
        point3_per_blue = server_id == 27;
        point3_per_yellow = server_id == 29;
        point3_per_red = server_id == 26;
        point4_per_set = server_id == 47;
        copy_all = server_id == 28;
    };

    std::string get_name(){
        return name;
    }

    std::string get_description(){
        return description;
    }

    int get_cost(){
        return cost;
    }

    int get_type(){
        return type;
    }

    std::string get_type_string(){
        return (type==0) ? "每回合" :
               (type==0) ? "一次性" :
               (type==0) ? "永续" :
               "终局结算";
    }

    int get_type_detail(int server_type){
        if(server_type == 0){
            return cookie_per_turn ? 0x1 : 0x0 |
                   cake_per_turn   ? 0x2 : 0x0 |
                   wine_per_turn   ? 0x4 : 0x0 |
                   coffee_per_turn ? 0x8 : 0x0;
        } else if(server_type == 1){
            return food_all_plus1 ? 0x01 : 0x0 |
                   coffee_plus4   ? 0x02 : 0x0 |
                   wine_plus4     ? 0x04 : 0x0 |
                   cookie_plus4   ? 0x08 : 0x0 |
                   cake_plus4     ? 0x10 : 0x0 |
                   royal_plus3    ? 0x20 : 0x0 |
                   room_close2    ? 0x40 : 0x0 |
                   comp_customer1 ? 0x80 : 0x0;
        } else if(server_type == 2){
            return dice_12_plus1               ? 0x000001 : 0x0 |
                   dice_12_open_room           ? 0x000002 : 0x0 |
                   dice_34_point2              ? 0x000004 : 0x0 |
                   dice_3_use_server           ? 0x000008 : 0x0 |
                   dice_3_point5               ? 0x000010 : 0x0 |
                   dice_4_together             ? 0x000020 : 0x0 |
                   dice_4_point4               ? 0x000040 : 0x0 |
                   dice_5_royal2               ? 0x000080 : 0x0 |
                   dice_5_plus2                ? 0x000100 : 0x0 |
                   dice_6_free_plus1           ? 0x000200 : 0x0 |
                   delivery_free               ? 0x000400 : 0x0 |
                   blue_free                   ? 0x000800 : 0x0 |
                   red_free                    ? 0x001000 : 0x0 |
                   yellow_free                 ? 0x002000 : 0x0 |
                   customer_invite_free        ? 0x004000 : 0x0 |
                   all_comp_money1             ? 0x008000 : 0x0 |
                   red_comp_money2             ? 0x010000 : 0x0 |
                   yellow_comp_money1          ? 0x020000 : 0x0 |
                   blue_comp_royal1            ? 0x040000 : 0x0 |
                   green_comp_point2           ? 0x080000 : 0x0 |
                   customer_req4_comp_point4   ? 0x100000 : 0x0 |
                   royal_task_comp_point5      ? 0x200000 : 0x0 |
                   royal_punish_replace_money1 ? 0x400000 : 0x0;
        } else if(server_type == 3){
            return point5_per_floor              ? 0x0001 : 0x0 |
                   point5_per_column             ? 0x0002 : 0x0 |
                   point2_per_area               ? 0x0004 : 0x0 |
                   point1_per_room_open_or_close ? 0x0008 : 0x0 |
                   point1_per_room_close         ? 0x0010 : 0x0 |
                   point5_per_major_task         ? 0x0020 : 0x0 |
                   point2_per_remain_royal       ? 0x0040 : 0x0 |
                   point2_per_use_server         ? 0x0080 : 0x0 |
                   point3_per_blue               ? 0x0100 : 0x0 |
                   point3_per_yellow             ? 0x0200 : 0x0 |
                   point3_per_red                ? 0x0400 : 0x0 |
                   point4_per_set                ? 0x0800 : 0x0 |
                   copy_all                      ? 0x1000 : 0x0 ;
        }
    }
private:
    std::string name;
    std::string description;
    int cost;
    int type; // 0 as once per turn, 1 as once, 2 as always, 3 as final

    // type 0, per turn
    bool cookie_per_turn;
    bool cake_per_turn;
    bool wine_per_turn;
    bool coffee_per_turn;
    // type 1, once
    bool food_all_plus1;
    bool coffee_plus4;
    bool wine_plus4;
    bool cookie_plus4;
    bool cake_plus4;
    bool royal_plus3;
    bool room_close2;
    bool comp_customer1;
    // type 2, always
    bool dice_12_plus1;
    bool dice_12_open_room;
    bool dice_34_point2;
    bool dice_3_use_server;
    bool dice_3_point5;
    bool dice_4_together;
    bool dice_4_point4;
    bool dice_5_royal2;
    bool dice_5_plus2;
    bool dice_6_free_plus1;
    bool delivery_free;
    bool blue_free;
    bool red_free;
    bool yellow_free;
    bool customer_invite_free;
    bool all_comp_money1;
    bool red_comp_money2;
    bool yellow_comp_money1;
    bool blue_comp_royal1;
    bool green_comp_point2;
    bool customer_req4_comp_point4;
    bool royal_task_comp_point5;
    bool royal_punish_replace_money1;
    // type 3, final
    bool point5_per_floor;
    bool point5_per_column;
    bool point2_per_area;
    bool point1_per_room_open_or_close;
    bool point1_per_room_close;
    bool point5_per_major_task;
    bool point2_per_remain_royal;
    bool point2_per_use_server;
    bool point3_per_blue;
    bool point3_per_yellow;
    bool point3_per_red;
    bool point4_per_set;
    bool copy_all;
};