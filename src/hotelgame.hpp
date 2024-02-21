#include <iostream>
#include <random>
#include <ctime>
#include <vector>
#include <algorithm>
#include "customers.hpp"
#include "hotel.hpp"
#include "servers.hpp"

#define FOOD_COOKIE  0
#define FOOD_CAKE    1
#define FOOD_WINE    2
#define FOOD_COFFEE  3
#define ROOM_RED     0
#define ROOM_YELLOW  1
#define ROOM_BLUE    2
#define ROOM_OPEN    0
#define ROOM_CLOSE   1
#define TABLE_RED    0
#define TABLE_BLUE   1
#define TABLE_YELLOW 2
#define TABLE_GREEN  3
#define NUM_CUSTOMER 58
#define NUM_SERVER   48

std::string major_tasks_description[3][4] =
{
    {
        "拥有20块钱",
        "拥有10个皇室点数",
        "打出6个员工",
        "准备或入住12个房间"
    },
    {
        "入住2整层房间",
        "入住2整列房间",
        "入住6个完整的区域",
        "入住某一种颜色的所有房间"
    },
    {
        "入住所有颜色房间各3间",
        "入住4个红房间和3个黄房间",
        "入住4个黄房间和3个蓝房间",
        "入住4个蓝房间和3个红房间"
    }
};

std::string royal_tasks_description[3][4] =
{
    {
        "奖励：获得3块钱；惩罚：失去3块钱或5游戏点数",
        "奖励：获得2份任意食物；惩罚：失去厨房里所有食物",
        "奖励：抽取3张员工并减3费打出其中一张，剩余放回牌堆底部；惩罚：从手牌将2张员工放回牌堆底部，或失去5游戏点数",
        "奖励：免费开一个房间；惩罚：从最高层取消1个开好但未入住的房间，或失去5游戏点数"
    },
    {
        "奖励：获得所有种类食物各1份；惩罚：失去厨房里和未结算客人桌上的所有食物",
        "奖励：获得5块钱；惩罚：失去5块钱或者7游戏点数",
        "奖励：抽取3张员工并免费打出其中一张，剩余放回牌堆底部；惩罚：从手牌将3张员工放回牌堆底部，或失去7游戏点数",
        "奖励：在1或2层开一个免费房间，并立刻入住；惩罚：从最高层取消2个开好但未入住的房间，或失去7游戏点数"
    },
    {
        "奖励：获得8游戏点数；惩罚：失去8游戏点数",
        "奖励：免费开一个房间，并立刻入住；惩罚：从最高层和次高层分别取消一个已入住的房间",
        "奖励：每张打出的员工牌获得2游戏点数；惩罚：每张打出的员工牌失去2游戏点数",
        "奖励：免费从手牌打出一张员工牌；惩罚：丢弃一张已打出的拥有终局结算效果的员工，或失去10游戏点数"
    }
};

class AustriaHotel {
public:
    AustriaHotel(int players=2, bool standard_hotel=true, bool standard_server=true) {
        srand(time(0));
        game_init(players, standard_hotel, standard_server);
    }

    // game main function
    void play();
    void game_init(int players, bool standard_hotel, bool standard_server);
    void at_game_start();
    void at_game_end();
    void at_mini_round_start();
    void at_mini_round(bool special_round);
    void at_major_round_start();
    void at_major_round_end();
    bool at_dice_pick(bool special_round); // no dice substract in special round
    void at_food_delivery();
    void at_use_per_turn_server();
    void at_customer_checkout(bool free_close);

    void at_dice1(int strength, bool special_round);
    void at_dice2(int strength, bool special_round);
    void at_dice3(int strength, bool special_round);
    void at_dice4(int strength, bool special_round);
    void at_dice5(int strength, bool special_round);
    void at_dice6(int strength, bool special_round);
    void at_food_take(int strength, int food_id);
    void at_room_open(int strength, int discount, bool free_open);
    void at_room_close(int strength);
    void at_server_hire(int strength, bool free_hire);

    int  update_customer_waitlist(int picked_id, bool invite_free);
    void print_hotel(int player);
    void print_status(bool first_pick);

private:
    // top info
    int  num_player;    // 2-4 players in a game
    int  num_dice;
    int  major_task_id[3]; // 4 possible major tasks each
    int  major_task_flag[3][3]; // record those who completed the major tasks, -1 as invalid
    int  royal_task_id[3]; // 4 possible royal tasks each
    bool use_standard_hotel; // all players use the same pattern of hotel
    int  hotel_id[4];         // if not using standard hotel, each pick a random pattern, cannot be the same, max 4, -1 as invalid
    bool use_standard_server; // 4 decks of standard server sets, each has 6 servers, remaining will be shuffled into the server deck
    int  server_set_id[4];     // if using standard server, each pick a random set, cannot be the same, max 4, -1 as invalid

    // round info
    int major_round;   // totally 7 round in game
    int mini_round;    // 2*num_players mini rounds in a main round
    int curr_player;   // current player
    int action_point[6]; // number of dices remaining in each actions
    bool special_round_flag; // special extra round from 法老王

    // point info
    int game_point[4]; // final points to determine victory
    int money_point[4];
    int royal_point[4];

    // resource info
    int kicken_resource[4][4]; // 4 players, 4 kinds of resources
    std::vector<Customer> customer_deck;
    Customer customer_waitlist[5]; // 5 customers waiting in list
    int num_customer_on_table[4]; // customers in hotel not satisfied yet
    std::vector<Customer> customer_on_table[4]; // -1 as invalid
    int num_server_on_hand[4]; // number of servers not hired yet
    std::vector<Server> server_deck;
    std::vector<Server> server_on_hand[4]; // player's servers on hand
    std::vector<Server> server_hired[4]; // servers already hired by players
    int num_server_hired[4]; // number of servers already hired
    int bonus_per_turn[4]; // record whether per-turn server has been used this turn
    int bonus_flag[4]; // every bit in the flag represents the in-game effect from hired server
    // [ 0] cookie_per_turn
    // [ 1] cake_per_turn
    // [ 2] wine_per_turn
    // [ 3] coffee_per_turn
    // [ 4] dice_12_plus1
    // [ 5] dice_12_open_room
    // [ 6] dice_34_point2
    // [ 7] dice_3_use_server
    // [ 8] dice_3_point5
    // [ 9] dice_4_together
    // [10] dice_4_point4
    // [11] dice_5_royal2
    // [12] dice_5_plus2
    // [13] dice_6_free_plus1
    // [14] delivery_free
    // [15] blue_fre
    // [16] red_fre
    // [17] yellow_free
    // [18] customer_invite_free
    // [19] all_comp_money1
    // [20] red_comp_money
    // [21] yellow_comp_money
    // [22] blue_comp_royal
    // [23] green_comp_point
    // [24] customer_req4_comp_point4
    // [25] royal_task_comp_point5
    // [26] royal_punish_replace_money1
    int final_flag[4]; // every bit in the flag represents the final effect from hired server
    // [ 0] point5_per_floor
    // [ 1] point5_per_column
    // [ 2] point2_per_area
    // [ 3] point1_per_room_open_or_close
    // [ 4] point1_per_room_close
    // [ 5] point5_per_major_task
    // [ 6] point2_per_remain_royal
    // [ 7] point2_per_use_server
    // [ 8] point3_per_blue
    // [ 9] point3_per_yellow
    // [10] point3_per_red
    // [11] point4_per_set
    // [12] copy_all

    // room info
    int room_status[4][4][5][3]; // 4 players, 4 floors, 5 columns, 3 type of status (open/close, color, area id)
    // 0 as open, 1 as closed, -1 as not ready
    int num_area_close[4]; // all hotel patterns have 10 areas
    int num_area_open[4][10]; // record the remaining room numbers in each areas
    int num_floor_closed[4];
    int num_column_closed[4];
    int num_red_closed[4];
    int num_yellow_closed[4];
    int num_blue_closed[4];
    int num_room_opened[4];
    int num_room_closed[4];
};