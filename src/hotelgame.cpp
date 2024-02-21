#include <iostream>
#include <random>
#include <ctime>
#include <vector>
#include <algorithm>
#include "hotelgame.hpp"

#define DEBUG 0

void AustriaHotel::game_init(int players, bool standard_hotel, bool standard_server){
    // top info
    num_player = players;
    num_dice = players * 2 + 6;
    major_task_id[0] = rand() % 4;
    major_task_id[1] = rand() % 4;
    major_task_id[2] = rand() % 4;
    for(int i=0; i<3; i++){
        for(int j=0; j<3; j++){
            major_task_flag[i][j] = -1;
        }
    }
    royal_task_id[0] = rand() % 4;
    royal_task_id[1] = rand() % 4;
    royal_task_id[2] = rand() % 4;

    std::random_device rd;
    std::mt19937 g(rd());
    use_standard_hotel = standard_hotel;
    if(!use_standard_hotel){
        std::vector<int> hotel_id_deck{0, 1, 2, 3};
        std::shuffle(hotel_id_deck.begin(), hotel_id_deck.end(), g);
        hotel_id[0] = hotel_id_deck[0];
        hotel_id[1] = hotel_id_deck[1];
        hotel_id[2] = hotel_id_deck[2];
        hotel_id[3] = hotel_id_deck[3];
        hotel_id_deck.clear();
    }
    else {
        hotel_id[0] = 4;
        hotel_id[1] = 4;
        hotel_id[2] = 4;
        hotel_id[3] = 4;
    }

    use_standard_server = standard_server;
    if(use_standard_server){
        std::vector<int> server_id_deck{0, 1, 2, 3};
        std::shuffle(server_id_deck.begin(), server_id_deck.end(), g);
        server_set_id[0] = server_id_deck[0];
        server_set_id[1] = server_id_deck[1];
        server_set_id[2] = server_id_deck[2];
        server_set_id[3] = server_id_deck[3];
        server_id_deck.clear();
    }
    
    // round info
    major_round = 0;
    mini_round = 0;
    curr_player = 0;
    for(int i=0; i<6; i++){
        action_point[i] = 0;
    }
    special_round_flag = false;
    // point info
    for(int i=0; i<4; i++){
        game_point[i] = 0;
        money_point[i] = 10;
        royal_point[i] = 0;
    }
    // resource info
    for(int i=0; i<4; i++){
        for(int j=0; j<4; j++){
            kicken_resource[i][j] = 1;
        }
        num_customer_on_table[i] = 0;
        num_server_on_hand[i] = 0;
        num_server_hired[i] = 0;
        bonus_per_turn[i] = 0;
        bonus_flag[i] = 0;
        final_flag[i] = 0;
    }
    // room info
    for(int i=0; i<4; i++){
        for(int floor=0; floor<4; floor++){
            for(int column=0; column<5; column++){
                room_status[i][floor][column][0] = -1;
                room_status[i][floor][column][1] = hotel_pattern_color[hotel_id[i]][floor][column];
                room_status[i][floor][column][2] = hotel_pattern_area_id[hotel_id[i]][floor][column];
            }
        }
        num_area_close[i] = 0;
        for(int j=0; j<10; j++){
            num_area_open[i][j] = hotel_pattern_area_room[hotel_id[i]][j];
        }
        num_floor_closed[i] = 0;
        num_column_closed[i] = 0;
        num_red_closed[i] = 0;
        num_yellow_closed[i] = 0;
        num_blue_closed[i] = 0;
        num_room_opened[i] = 0;
        num_room_closed[i] = 0;
    }
}

// game main function
void AustriaHotel::play() {
    // game start, draw servers, pick the first customer
    at_game_start();
    while (true) {
        // throw dices
        at_major_round_start();
        for(int player=0; player<num_player; player++){
            curr_player = player;
            // invite customer
            at_mini_round_start();
            // players taking actions
            // 1. take a dice (optionally boost with cost)
            // 2. deliver food from kichen to tables
            // 3. use a per-turn server
            // 4. complete a customer
            // 5. end this mini round
            at_mini_round(special_round_flag);
            if(special_round_flag){
                // excute a special mini round if 法老 is completed
                at_mini_round(special_round_flag);
                special_round_flag = false;
            }
        }
        // accumulate major round and reset mini round
        // calculate royal tasks when needed
        at_major_round_end();
        if(major_round>=7){
            break;
        }
    }
    // calculate game point to determine victory
    at_game_end();
}

void AustriaHotel::at_game_start() {
    std::random_device rd;
    std::mt19937 g(rd());
    // initialize customer deck
#if DEBUG
    std::cout << "init customer deck" << std::endl;
#endif
    for(int i=0; i<NUM_CUSTOMER; i++) {
        Customer tmp_customer(i);
        customer_deck.push_back(tmp_customer);
    }
    std::shuffle(customer_deck.begin(), customer_deck.end(), g);
    // draw 5 customers to waiting list
#if DEBUG
    std::cout << "draw 5 customer cards from deck" << std::endl;
#endif
    int customer_cost = 3;
    for(int i=0; i<5; i++) {
        customer_waitlist[i] = customer_deck.back();
        customer_waitlist[i].set_invitation_cost(customer_cost);
        customer_cost = (customer_cost > 0) ? customer_cost-1 : 0;
        customer_deck.pop_back();
    }

    // initialize server deck
#if DEBUG
    std::cout << "init server deck" << std::endl;
#endif
    for(int i=0; i<NUM_SERVER; i++) {
        Server tmp_server(i);
        server_deck.push_back(tmp_server);
    }
    std::shuffle(server_deck.begin(), server_deck.end(), g);
    for(int i=0; i<num_player; i++) {
        for(int j=0; j<6; j++){
            server_on_hand[i].push_back(server_deck.back());
            server_deck.pop_back();
            num_server_on_hand[i]++;
        }
    }

    // show status, and ask to pick a customer
    bool first_pick = true;
    for(int player=0; player<num_player; player++){
        curr_player = player;
        print_status(first_pick);
        std::cout << "游戏开始，请免费挑选第一位客人（输入客人数字）：" << std::endl;
        int customer_pick;
        int pick_attempt = 0;
#if DEBUG
        customer_pick = rand() % 5;
#else
        std::cin >> customer_pick;
#endif
        while(customer_pick < 0 || customer_pick > 4){
            pick_attempt++;
            if(pick_attempt > 3) std::cout << "你个傻逼，数字0到4都看不懂么？数字0到4啊！！！" << std::endl;
            else std::cout << "请输入0到4之间的数字来挑选客人" << std::endl;
            std::cin >> customer_pick;
        }
        update_customer_waitlist(customer_pick, first_pick);
    }

    // open 3 initial rooms
    std::cout << "开启三个初始房间：" << std::endl;
    at_room_open(3, 0, false);
}

void AustriaHotel::at_game_end(){
    // TODO
    ;
}

void AustriaHotel::at_mini_round_start(){
    print_status(false);
    if(num_customer_on_table[curr_player] >= 3){
        std::cout << "酒店中无空余餐桌，无法邀请新客人" << std::endl;
    }
    else{
        std::cout << "请输入0到4之间的数字来挑选客人，输入5放弃邀请客人" << std::endl;
        int customer_pick;
        int pick_attempt = 0;
#if DEBUG
        customer_pick = rand() % 5;
#else
        std::cin >> customer_pick;
#endif
        while(customer_pick < 0 || customer_pick > 5){
            pick_attempt++;
            if(pick_attempt > 3) std::cout << "你个傻逼，数字0到5都看不懂么？数字0到5啊！！！" << std::endl;
            else std::cout << "请输入0到5之间的数字来邀请客人或放弃邀请" << std::endl;
            std::cin >> customer_pick;
        }
        bool invite_free = (bonus_flag[curr_player] >> 18) & 0x1;
        update_customer_waitlist(customer_pick, invite_free);
        // update per turn flag
        bonus_per_turn[curr_player] = bonus_flag[curr_player] & 0xf;
    }
}

void AustriaHotel::at_mini_round(bool special_round){
    // players taking actions
    // 1. take a dice (optionally boost with cost)
    // 2. deliver food from kichen to tables
    // 3. use a per-turn server
    // 4. complete a customer
    // 5. end this mini round
    bool dice_taken = false;
    bool no_food_in_kichen = false;
    bool no_per_turn_server = false;
    bool no_comp_customer = false;
    while(true){
        print_status(false);

        std::cout << "可选操作：" << std::endl;
        std::cout << "0：取走一个骰子进行操作";
        if(dice_taken) std::cout << "（本轮不可再操作）" << std::endl;
        else std::cout << "（可花1块钱做强度+1 boost）" << std::endl;
    
        std::cout << "1：从厨房最多上3份食物至宾客餐桌";
        no_food_in_kichen = kicken_resource[curr_player][0] == 0 && 
                            kicken_resource[curr_player][1] == 0 && 
                            kicken_resource[curr_player][2] == 0 && 
                            kicken_resource[curr_player][3] == 0;
        if(no_food_in_kichen){
            std::cout << "（无菜可上）" << std::endl;
        }
        else std::cout << std::endl;
    
        std::cout << "2：使用有每轮效果的员工";
        no_per_turn_server = !(bonus_flag[curr_player] & 0xf);
        if(no_per_turn_server) std::cout << "（无相应员工可用）" << std::endl;
        else std::cout << std::endl;
    
        std::cout << "3：结算一个已满足的宾客";
        if(num_customer_on_table[curr_player] == 0) {
            std::cout << "（无宾客可结算）" << std::endl;
            no_comp_customer = true;
        }
        else {
            bool tmp_flag = false;
            for(int i=0; i<num_customer_on_table[curr_player]; i++){
                if(customer_on_table[curr_player][i].get_num_food_requirement()==0) tmp_flag = true;
            }
            if(tmp_flag) std::cout << std::endl;
            else {
                std::cout << "（无宾客可结算）" << std::endl;
                no_comp_customer = true;
            }
        }

        std::cout << "4：结束当前回合";
    
        std::cout << "请输入0到4之间的数字来选择操作" << std::endl;
        int player_pick;
        int pick_attempt = 0;
#if DEBUG
        player_pick = rand() % 5;
#else
        std::cin >> player_pick;
#endif
        while(player_pick < 0 || player_pick > 4){
            pick_attempt++;
            if(pick_attempt > 3) std::cout << "你个傻逼，数字0到4都看不懂么？数字0到4啊！！！" << std::endl;
            else std::cout << "请输入0到4之间的数字来选择操作" << std::endl;
            std::cin >> player_pick;
        }
        switch(player_pick){
            case 0: 
                if(dice_taken){
                    std::cout << "本轮已无法再做次操作" << std::endl;
                } else {
                    dice_taken = at_dice_pick(special_round);
                }
                break;
            case 1:
                if(no_food_in_kichen){
                    std::cout << "本轮已无法再做次操作" << std::endl;
                } else { 
                    at_food_delivery();
                }
                break;
            case 2: 
                if(no_per_turn_server){
                    std::cout << "本轮已无法再做次操作" << std::endl;
                } else { 
                    at_use_per_turn_server(); 
                }
                break;
            case 3: 
                if(no_comp_customer){
                    std::cout << "本轮已无法再做次操作" << std::endl;
                } else { 
                    at_customer_checkout(false); 
                }break;
            case 4: return;
            default: break;
        }
    }
}

void AustriaHotel::at_major_round_start(){
    // clear and throw dices
    for(int i=0; i<6; i++){
        action_point[i] = 0;
    }
    for(int i=0; i<num_dice; i++){
        int dice_value = rand() % 6;
        action_point[dice_value]++;
    }
}

void AustriaHotel::at_major_round_end(){
    major_round++;
    mini_round = 0;
}

bool AustriaHotel::at_dice_pick(bool special_round){
    std::cout << "请输入1到6之间的数字来选择操作，输入0来放弃该操作" << std::endl;
    int player_pick;
    int pick_attempt = 0;
#if DEBUG
    player_pick = rand() % 7;
#else
    std::cin >> player_pick;
#endif
    bool dice_work_flag;
    do{
        while(player_pick < 0 || player_pick > 6){
            pick_attempt++;
            if(pick_attempt > 3) std::cout << "你个傻逼，数字0到6都看不懂么？数字0到6啊！！！" << std::endl;
            else std::cout << "请输入0到6之间的数字来选择操作" << std::endl;
            std::cin >> player_pick;
        }
        if(action_point[player_pick]<=0){
            std::cout << "该骰子行动点数为0，无法进行此操作" << std::endl;
            dice_work_flag = false;
        }
        else if(player_pick==6 && money_point[curr_player]<=0 && !((bonus_flag[curr_player] >> 13) & 0x1)){
            std::cout << "资金不足，无法进行此操作" << std::endl;
            dice_work_flag = false;
        }
        else dice_work_flag = true;
    } while(!dice_work_flag);
    switch(player_pick){
        case 0: return false;
        case 1:
            at_dice1(action_point[0], special_round);
            break;
        case 2: 
            at_dice2(action_point[1], special_round);
            break;
        case 3: 
            at_dice3(action_point[2], special_round);
            break;
        case 4: 
            at_dice4(action_point[3], special_round);
            break;
        case 5: 
            at_dice5(action_point[4], special_round);
            break;
        case 6: 
            at_dice6(action_point[5], special_round);
            break;
        default: break;
    }
    return true;
}

void AustriaHotel::at_dice1(int strength, bool special_round){
    int stren_plus = (bonus_flag[curr_player] >> 4) & 0x1;
    bool room_open_flag = (bonus_flag[curr_player] >> 5) & 0x1;
    int boost_flag = 0;
    if(money_point[curr_player] > 0){
        std::cout << "当前强度为" << strength << "，可支付1块钱将强度加1，输入数字1进行此操作：" << std::endl;
#if DEBUG
        boost_flag = rand() % 2;
#else
        std::cin >> boost_flag;
#endif
        if(boost_flag==1) stren_plus++;
    }
    else{
        std::cout << "资金不足，无法boost" << std::endl;
    }
    strength += stren_plus;

    std::cout << "可取棕饼干和白蛋糕共" << strength << "份，请选择白蛋糕总数，确保棕饼干数量大于等于白蛋糕：" << std::endl;
    int strength_cake;
    int strength_cake_max = strength >> 1;
#if DEBUG
    strength_cake = rand() % strength_cake_max;
#else
    std::cin >> strength_cake;
#endif
    while(strength_cake < 0 || strength_cake > strength_cake_max){
        std::cout << "白蛋糕总数不可超过" << strength_cake_max << std::endl;
        std::cin >> strength_cake;
    }
    int strength_cookie = strength - strength_cake;
    at_food_take(strength_cookie, FOOD_COOKIE);
    at_food_take(strength_cake, FOOD_CAKE);
    if(room_open_flag){
        at_room_open(1, 0, false);
    }
    if(!special_round) action_point[0]--;
}

void AustriaHotel::at_dice2(int strength, bool special_round){
    int stren_plus = (bonus_flag[curr_player] >> 4) & 0x1;
    bool room_open_flag = (bonus_flag[curr_player] >> 5) & 0x1;
    int boost_flag = 0;
    if(money_point[curr_player] > 0){
        std::cout << "当前强度为" << strength << "，可支付1块钱将强度加1，输入数字1进行此操作：" << std::endl;
#if DEBUG
        boost_flag = rand() % 2;
#else
        std::cin >> boost_flag;
#endif
        if(boost_flag==1) stren_plus++;
    }
    else{
        std::cout << "资金不足，无法boost" << std::endl;
    }
    strength += stren_plus;

    std::cout << "可取红酒和黑咖啡共" << strength << "份，请选择黑咖啡总数，确保红酒数量大于等于黑咖啡：" << std::endl;
    int strength_coffee;
    int strength_coffee_max = strength >> 1;
#if DEBUG
    strength_coffee = rand() % strength_coffee_max;
#else
    std::cin >> strength_coffee;
#endif
    while(strength_coffee < 0 || strength_coffee > strength_coffee_max){
        std::cout << "黑咖啡总数不可超过" << strength_coffee_max << std::endl;
        std::cin >> strength_coffee;
    }
    int strength_wine = strength - strength_coffee;
    at_food_take(strength_wine, FOOD_WINE);
    at_food_take(strength_coffee, FOOD_COFFEE);
    if(room_open_flag){
        at_room_open(1, 0, false);
    }
    if(!special_round) action_point[1]--;
}

void AustriaHotel::at_dice3(int strength, bool special_round){
    int game_point_plus = ((bonus_flag[curr_player] >> 6) & 0x1) ? 2 :
                          ((bonus_flag[curr_player] >> 8) & 0x1) ? 5 : 0;
    bool server_hire_flag = (bonus_flag[curr_player] >> 7) & 0x1;
    int boost_flag = 0;
    if(money_point[curr_player] > 0){
        std::cout << "当前强度为" << strength << "，可支付1块钱将强度加1，输入数字1进行此操作：" << std::endl;
#if DEBUG
        boost_flag = rand() % 2;
#else
        std::cin >> boost_flag;
#endif
        if(boost_flag==1) strength++;
    }
    else{
        std::cout << "资金不足，无法boost" << std::endl;
    }

    std::cout << "可开房间共" << strength << "个" << std::endl;
    at_room_open(strength, 0, false);
    if(game_point_plus) game_point[curr_player] += game_point_plus;
    if(server_hire_flag) at_server_hire(0, false);
    if(!special_round) action_point[2]--;
}

void AustriaHotel::at_dice4(int strength, bool special_round){
    bool royal_money_together_flag = (bonus_flag[curr_player] >> 9) & 0x1;
    int game_point_plus = ((bonus_flag[curr_player] >> 10) & 0x1) ? 4 : 0;
    int boost_flag = 0;
    if(money_point[curr_player] > 0){
        std::cout << "当前强度为" << strength << "，可支付1块钱将强度加1，输入数字1进行此操作：" << std::endl;
#if DEBUG
        boost_flag = rand() % 2;
#else
        std::cin >> boost_flag;
#endif
        if(boost_flag==1) strength++;
    }
    else{
        std::cout << "资金不足，无法boost" << std::endl;
    }

    if(royal_money_together_flag){
        std::cout << "员工效果，同时提高皇室点数和资金" << std::endl;
        money_point[curr_player] += strength;
        royal_point[curr_player] += strength;
    }
    else {
        std::cout << "可皇室点数和资金共" << strength << "，请选择皇室点数：" << std::endl;
        int strength_royal;
        int strength_royal_max = strength;
#if DEBUG
        strength_royal = rand() % strength_royal_max;
#else
        std::cin >> strength_royal;
#endif
        while(strength_royal < 0 || strength_royal > strength_royal_max){
            std::cout << "皇室点数总数不可超过" << strength_royal_max << std::endl;
            std::cin >> strength_royal;
        }
        int strength_money = strength - strength_royal;
        money_point[curr_player] += strength_money;
        royal_point[curr_player] += strength_royal;
    }

    if(game_point_plus) game_point[curr_player] += game_point_plus;
    if(!special_round) action_point[3]--;
}

void AustriaHotel::at_dice5(int strength, bool special_round){
    int stren_plus = ((bonus_flag[curr_player] >> 12) & 0x1) ? 2 : 0;
    int royal_point_plus = ((bonus_flag[curr_player] >> 11) & 0x1) ? 2 : 0;
    int boost_flag = 0;
    if(money_point[curr_player] > 0){
        std::cout << "当前强度为" << strength << "，可支付1块钱将强度加1，输入数字1进行此操作：" << std::endl;
#if DEBUG
        boost_flag = rand() % 2;
#else
        std::cin >> boost_flag;
#endif
        if(boost_flag==1) stren_plus++;
    }
    else{
        std::cout << "资金不足，无法boost" << std::endl;
    }
    strength += stren_plus;

    at_server_hire(strength, false);

    if(royal_point_plus) royal_point[curr_player] += royal_point_plus;
    if(!special_round) action_point[4]--;
}

void AustriaHotel::at_dice6(int strength, bool special_round){
    bool free_stren_plus_flag = (bonus_flag[curr_player] >> 13) & 0x1;
    if(!free_stren_plus_flag){
        std::cout << "支付1块钱进行骰子6镜像操作" << std::endl;
        money_point[curr_player]--;
    }
    else {
        strength++;
    }
    int boost_flag = 0;
    if(money_point[curr_player] > 0){
        std::cout << "当前强度为" << strength << "，可支付1块钱将强度加1，输入数字1进行此操作：" << std::endl;
#if DEBUG
        boost_flag = rand() % 2;
#else
        std::cin >> boost_flag;
#endif
        if(boost_flag==1) strength++;
    }
    else{
        std::cout << "资金不足，无法boost" << std::endl;
    }

    std::cout << "请输入1到5之间的数字来选择镜像操作" << std::endl;
    int player_pick;
    int pick_attempt = 0;
#if DEBUG
    player_pick = rand() % 6 + 1;
#else
    std::cin >> player_pick;
#endif
    while(player_pick < 1 || player_pick > 5){
        pick_attempt++;
        if(pick_attempt > 3) std::cout << "你个傻逼，数字1到5都看不懂么？数字1到5啊！！！" << std::endl;
        else std::cout << "请输入1到5之间的数字来选择操作" << std::endl;
        std::cin >> player_pick;
    }

    switch(player_pick){
        case 1:
            at_dice1(strength, true);
            break;
        case 2: 
            at_dice2(strength, true);
            break;
        case 3: 
            at_dice3(strength, true);
            break;
        case 4: 
            at_dice4(strength, true);
            break;
        case 5: 
            at_dice5(strength, true);
            break;
        default: break;
    }

    if(!special_round) action_point[5]--;
}

void AustriaHotel::at_food_take(int strength, int food_id){
    std::string food_name = (food_id == FOOD_COOKIE) ? "棕饼干" :
                            (food_id == FOOD_CAKE) ? "白蛋糕" :
                            (food_id == FOOD_WINE) ? "红酒" :
                            "黑咖啡";
    int num_customer_req = 0;
    int customer_req[3] = {0, 0, 0};
    for(int i=0; i<num_customer_on_table[curr_player]; i++){
        bool food_req_flag = false;
        for(int j=0; j<customer_on_table[curr_player][i].get_num_food_requirement(); j++){
            if(customer_on_table[curr_player][j].get_food_requirement(j)==food_id){
                food_req_flag = true;
                customer_req[i]++;
            }
        }
        if(food_req_flag) num_customer_req++;
    }

    if(num_customer_req==0){
        std::cout << "桌上客人中无人需要" << food_name << "，存入厨房" << std::endl;
        kicken_resource[curr_player][food_id] += strength;
        return;
    }

    while(strength > 0){
        std::cout << "桌上客人中ID ";
        if(customer_req[0]) std::cout << "0 需要" << customer_req[0] << "份 ";
        if(customer_req[1]) std::cout << "1 需要" << customer_req[1] << "份 ";
        if(customer_req[2]) std::cout << "2 需要" << customer_req[2] << "份 ";
        std::cout << food_name << "，可给他们上菜" << std::endl;
        std::cout << strength << "份" << food_name << "剩余，选择一位顾客来上菜，或输入3来存入厨房" << std::endl;
        int customer_id;
#if DEBUG
        customer_id = rand() % num_customer_on_table[curr_player];
#else
        std::cin >> customer_id;
#endif
        while(customer_id < 0 || customer_id > 3 || customer_req[customer_id]==0){
            std::cout << "请选择需要" << food_name << "的顾客来上菜，或选择3存入厨房" << std::endl;
            std::cin >> customer_id;
        }

        if(customer_id == 3){
            kicken_resource[curr_player][food_id]++;
        }
        else{
            for(int i=0; i<customer_on_table[curr_player][customer_id].get_num_food_requirement(); i++){
                if(customer_on_table[curr_player][customer_id].get_food_requirement(i)==food_id){
                    customer_on_table[curr_player][customer_id].update_food_requirement(i);
                    customer_req[customer_id]--;
                    break;
                }
            }
        }

        strength--;
    }
}

void AustriaHotel::at_room_open(int strength, int discount, bool free_open){
    bool blue_free_flag = (bonus_flag[curr_player] >> 15) & 0x1;
    bool red_free_flag = (bonus_flag[curr_player] >> 16) & 0x1;
    bool yellow_free_flag = (bonus_flag[curr_player] >> 17) & 0x1;
    while(strength > 0){
        if(num_room_opened[curr_player] + num_room_closed[curr_player] >= 20){
            std::cout << "宾馆全满，无法开新房间" << std::endl;
        }
        int open_room_floor, open_room_column;
        std::cout << "请选择楼层1到4" << std::endl;
#if DEBUG
        open_room_floor = rand() % 4 + 1;
#else
        std::cin >> open_room_floor;
#endif
        while(open_room_floor < 1 || open_room_floor > 4){
            std::cout << "无此楼层，请选择楼层1到4" << std::endl;
            std::cin >> open_room_floor;
        }

        std::cout << "请选择列数1到5" << std::endl;
#if DEBUG
        open_room_column = rand() % 5 + 1;
#else
        std::cin >> open_room_column;
#endif
        while(open_room_column < 1 || open_room_column > 5){
            std::cout << "无此楼层，请选择列数1到5" << std::endl;
            std::cin >> open_room_column;
        }

        open_room_floor = 4-open_room_floor;
        open_room_column--;

        // already opened or even closed
        if(room_status[curr_player][open_room_floor][open_room_column][0] != -1){
            std::cout << "此房间已被开" << std::endl;
            continue;
        }
        // not zero room and no opened room around
        if(!(open_room_floor==0 && open_room_column==0) &&
           !( (open_room_floor>0 && room_status[curr_player][open_room_floor-1][open_room_column][0] != -1) ||
              (open_room_floor<4 && room_status[curr_player][open_room_floor+1][open_room_column][0] != -1) ||
              (open_room_column>0 && room_status[curr_player][open_room_floor][open_room_column-1][0] != -1) ||
              (open_room_column<5 && room_status[curr_player][open_room_floor][open_room_column+1][0] != -1) )){
            std::cout << "周围没有已开的房间，无法开此房间" << std::endl; 
            continue;
        }
        // not enough money to open this room
        if((money_point[curr_player] < (open_room_floor - discount)) &&
           !free_open &&
           !((blue_free_flag && room_status[curr_player][open_room_floor][open_room_column][1]==ROOM_BLUE) ||
             (red_free_flag && room_status[curr_player][open_room_floor][open_room_column][1]==ROOM_RED) ||
             (yellow_free_flag && room_status[curr_player][open_room_floor][open_room_column][1]==ROOM_YELLOW))){
            std::cout << "没有足够的资金开这个房间" << std::endl;
            continue;
        }
        // room open success
        if((open_room_floor > discount) && !free_open)
            money_point[curr_player] -= (open_room_floor - discount);
        room_status[curr_player][open_room_floor][open_room_column][0] = 0;
        num_room_opened[curr_player]++;
    }
}

void AustriaHotel::at_server_hire(int strength, bool free_hire){
    if(num_server_on_hand[curr_player] == 0){
        std::cout << "手牌无员工可打" << std::endl;
        return;
    }
    int server_id;
    bool hire_fail;
    do{
        std::cout << "请选择手牌中的员工ID 0到" << num_server_on_hand[curr_player]-1 << std::endl;
#if DEBUG
        open_room_floor = rand() % num_server_on_hand[curr_player];
#else
        std::cin >> server_id;
#endif
        while(server_id < 0 || server_id >= num_server_on_hand[curr_player]){
            std::cout << "无此员工，请选择手牌中的员工ID 0到" << num_server_on_hand[curr_player]-1 << std::endl;
            std::cin >> server_id;
        }
        // not enough money
        if(money_point[curr_player] < (server_on_hand[curr_player][server_id].get_cost() - strength)){
            hire_fail = true;
            std::cout << "没有足够的资金雇佣此员工" << std::endl;
        }
    } while(hire_fail);

    // hire success
    if(!free_hire && strength > server_on_hand[curr_player][server_id].get_cost())
        money_point[curr_player] -= (strength - server_on_hand[curr_player][server_id].get_cost());
    num_server_hired[curr_player]++;
    server_hired[curr_player].push_back(server_on_hand[curr_player][server_id]);
    if(server_on_hand[curr_player][server_id].get_type() == 0){
        bonus_flag[curr_player] |= server_on_hand[curr_player][server_id].get_type_detail(0);
    } else if(server_on_hand[curr_player][server_id].get_type() == 1){
        int server_detail = server_on_hand[curr_player][server_id].get_type_detail(1);
        if((server_detail >> 0) & 0x1) {
            kicken_resource[curr_player][0]++;
            kicken_resource[curr_player][1]++;
            kicken_resource[curr_player][2]++;
            kicken_resource[curr_player][3]++;
        } else if((server_detail >> 1) & 0x1){
            kicken_resource[curr_player][FOOD_COFFEE]+=4;
        } else if((server_detail >> 2) & 0x1){
            kicken_resource[curr_player][FOOD_WINE]+=4;
        } else if((server_detail >> 3) & 0x1){
            kicken_resource[curr_player][FOOD_COOKIE]+=4;
        } else if((server_detail >> 4) & 0x1){
            kicken_resource[curr_player][FOOD_CAKE]+=4;
        } else if((server_detail >> 5) & 0x1){
            royal_point[curr_player] += 3;
        } else if((server_detail >> 6) & 0x1){
            at_room_close(2);
        } else if((server_detail >> 7) & 0x1){
            std::cout << "选择一位桌上的宾客ID 0到" << num_customer_on_table[curr_player]-1 << "满足其所有需求" << std::endl;
            int customer_id;
#if DEBUG
            customer_id = rand() % num_customer_on_table[curr_player];
#else
            std::cin >> customer_id;
#endif
            while(customer_id < 0 || customer_id >= num_customer_on_table[curr_player]){
                std::cout << "无此宾客，请选择桌上的宾客ID 0到" << num_customer_on_table[curr_player]-1 << std::endl;
                std::cin >> customer_id;
            }
            for(int i=0; i<customer_on_table[curr_player][customer_id].get_num_food_requirement(); i++){
                customer_on_table[curr_player][customer_id].update_food_requirement(0);
            }
        }
    } else if(server_on_hand[curr_player][server_id].get_type() == 2){
        bonus_flag[curr_player] |= (server_on_hand[curr_player][server_id].get_type_detail(2) << 4);
    } else if(server_on_hand[curr_player][server_id].get_type() == 3){
        final_flag[curr_player] |= server_on_hand[curr_player][server_id].get_type_detail(3);
    }
    num_server_on_hand[curr_player]--;
    server_on_hand[curr_player].erase(server_on_hand[curr_player].begin() + server_id);
}

void AustriaHotel::at_food_delivery(){
    if(kicken_resource[curr_player][0] + kicken_resource[curr_player][1] + kicken_resource[curr_player][2] + kicken_resource[curr_player][3] == 0){
        std::cout << "厨房没有食物可以用来上菜" << std::endl;
    }
    if(money_point[curr_player]<=0){
        std::cout << "资金不足无法上菜" << std::endl;
    }

    for(int food_idx=3; food_idx>0; food_idx--){
        std::cout << "上菜机会剩余" << food_idx << "次，厨房里有";
        if(kicken_resource[curr_player][0]) std::cout << kicken_resource[curr_player][0] << "份棕饼干 ";
        if(kicken_resource[curr_player][1]) std::cout << kicken_resource[curr_player][1] << "份白蛋糕 ";
        if(kicken_resource[curr_player][2]) std::cout << kicken_resource[curr_player][2] << "份红酒 ";
        if(kicken_resource[curr_player][3]) std::cout << kicken_resource[curr_player][3] << "份黑咖啡 ";
        std::cout << "可供上菜，请选择 0 棕饼干 1 白蛋糕 2 红酒 3 黑咖啡 进行上菜，选择4结束上菜" << std::endl;
        // choose food to deliver
        int food_id;
#if DEBUG
        food_id = rand() % 5;
#else
        std::cin >> food_id;
#endif
        while(food_id < 0 || food_id > 4 || kicken_resource[curr_player][food_id]==0){
            if(kicken_resource[curr_player][food_id]==0) std::cout << "厨房无该种类食物" << std::endl;
            else std::cout << "请选择食物种类0到3，或选4结束上菜" << num_server_on_hand[curr_player]-1 << std::endl;
            std::cin >> food_id;
        }

        if(food_id == 4){
            std::cout << "上菜结束" << std::endl;
            return;
        }

        std::string food_name = (food_id == FOOD_COOKIE) ? "棕饼干" :
                                (food_id == FOOD_CAKE) ? "白蛋糕" :
                                (food_id == FOOD_WINE) ? "红酒" :
                                "黑咖啡";
        int num_customer_req = 0;
        int customer_req[3] = {0, 0, 0};
        for(int i=0; i<num_customer_on_table[curr_player]; i++){
            bool food_req_flag = false;
            for(int j=0; j<customer_on_table[curr_player][i].get_num_food_requirement(); j++){
                if(customer_on_table[curr_player][j].get_food_requirement(j)==food_id){
                    food_req_flag = true;
                    customer_req[i]++;
                }
            }
            if(food_req_flag) num_customer_req++;
        }

        if(num_customer_req==0){
            std::cout << "无宾客需要此类食物" << std::endl;
            food_idx++;
            continue;
        }
        std::cout << "桌上客人中ID ";
        if(customer_req[0]) std::cout << "0 需要" << customer_req[0] << "份 ";
        if(customer_req[1]) std::cout << "1 需要" << customer_req[1] << "份 ";
        if(customer_req[2]) std::cout << "2 需要" << customer_req[2] << "份 ";
        std::cout << food_name << "，可给他们上菜，或者输入3结束上菜" << std::endl;
        int customer_id;
#if DEBUG
        customer_id = rand() % num_customer_on_table[curr_player];
#else
        std::cin >> customer_id;
#endif
        while(customer_id < 0 || customer_id > 3 || customer_req[customer_id]==0){
            std::cout << "请选择需要" << food_name << "的顾客来上菜，或选择3结束上菜" << std::endl;
            std::cin >> customer_id;
        }
        if(customer_id == 3){
            std::cout << "上菜结束" << std::endl;
            return;
        } else {
            for(int i=0; i<customer_on_table[curr_player][customer_id].get_num_food_requirement(); i++){
                if(customer_on_table[curr_player][customer_id].get_food_requirement(i)==food_id){
                    customer_on_table[curr_player][customer_id].update_food_requirement(i);
                    customer_req[customer_id]--;
                    kicken_resource[curr_player][food_id]--;
                    break;
                }
            }
        }
    }
}

void AustriaHotel::at_use_per_turn_server(){
    bool no_per_turn_server = !(bonus_per_turn[curr_player] & 0xf);
    if(no_per_turn_server){
        std::cout << "本轮没有每轮效果的员工可用" << std::endl;
        return;
    }
    for(int food_id=0; food_id<4; food_id++){
        bool per_turn_server_flag = (bonus_per_turn[curr_player] >> food_id) & 0x1;
        if(per_turn_server_flag){
            std::string food_name = (food_id == FOOD_COOKIE) ? "棕饼干" :
                                    (food_id == FOOD_CAKE) ? "白蛋糕" :
                                    (food_id == FOOD_WINE) ? "红酒" :
                                    "黑咖啡";
            std::cout << "可使用每轮员工效果获得一份" << food_name << "，输入数字1以获得，输入0以放弃操作" << std::endl;
            int action;
#if DEBUG
            action = rand() % 2;
#else
            std::cin >> action;
#endif
            while(action < 0 || action > 1){
                std::cout << "请选择数字0或1" << std::endl;
                std::cin >> action;
            }
            if(action){
                at_food_take(1, food_id);
                bonus_per_turn[curr_player] &= ~(0x1 << food_id);
            }
        }
    }
}

void AustriaHotel::at_customer_checkout(bool free_close){
    // TODO
    ;
}

int AustriaHotel::update_customer_waitlist(int picked_id, bool invite_free){
    // check if money is enough
    int invitation_cost = customer_waitlist[picked_id].get_invitation_cost();
    if(invite_free || money_point[curr_player] >= invitation_cost) {
        customer_on_table[curr_player].push_back(customer_waitlist[picked_id]);
        num_customer_on_table[curr_player]++;
    }
    else {
        std::cout << "资金不足，无法邀请该客人" << std::endl;
        return 1;
    }
        
    // calculate invitation cost
    if(!invite_free){
        money_point[curr_player] -= invitation_cost;
    }

    // shift customer and pick a new one
    for(int i=picked_id; i<5; i++){
        customer_waitlist[i+1].set_invitation_cost(customer_waitlist[i].get_invitation_cost());
        customer_waitlist[i] = customer_waitlist[i+1];
    }
    customer_waitlist[4] = customer_deck.back();
    customer_deck.pop_back();

    return 0;
}

void AustriaHotel::print_hotel(int player) {
    std::cout << "玩家" << player << "的旅馆状态（RYB为颜色，OC为开关房间状态）：" << std::endl;
    std::cout << " 列 ";
    for(int j=0; j<5; j++){
        std::cout << " " << j+1 << "   ";
    }
    std::cout << std::endl;
    for(int i=0; i<4; i++){
        std::cout << 4-i << "层 ";
        for(int j=0; j<5; j++){
            std::cout << " ";

            if(room_status[player][i][j][1]==ROOM_RED) std::cout << "R";
            else if(room_status[player][i][j][1]==ROOM_YELLOW) std::cout << "Y";
            else if(room_status[player][i][j][1]==ROOM_BLUE) std::cout << "B";

            if(room_status[player][i][j][0]==ROOM_OPEN) std::cout << "O";
            else if(room_status[player][i][j][0]==ROOM_CLOSE) std::cout << "C";
            else std::cout << " ";

            if(j<4){
                std::cout << " ";
                if(room_status[player][i][j][2]!=room_status[player][i][j+1][2]) std::cout << "|";
                else std::cout << " ";
            }
        }
        std::cout << std::endl;
        if(i<3){
            std::cout << "    ";
            for(int j=0; j<5; j++){
                if(room_status[player][i][j][2]!=room_status[player][i+1][j][2]) std::cout << "---- ";
                else std::cout << "     ";
            }
            std::cout << std::endl;
        }
    }
}

void AustriaHotel::print_status(bool first_pick) {
    system("clear");
    std::cout << "当前主回合：" << major_round << std::endl;
    std::cout << "当前轮次：" << mini_round << std::endl;
    std::cout << "当前玩家：" << curr_player << std::endl;
    std::cout << "当前玩家游戏点数：" << game_point[curr_player] << std::endl;
    std::cout << "当前玩家皇家点数：" << royal_point[curr_player] << std::endl;
    std::cout << "当前玩家资金：" << money_point[curr_player] << std::endl;
    std::cout << "全局任务描述：" << std::endl;
    for(int i=0; i<3; i++){
        std::cout << i+1 << "：" << major_tasks_description[i][major_task_id[i]] << std::endl;
    }
    std::cout << "皇室任务描述：" << std::endl;
    for(int i=0; i<3; i++){
        std::cout << i+1 << "：第" << i*2+3 << "轮末尾结算 " << royal_tasks_description[i][royal_task_id[i]] << std::endl;
    }
    std::cout << std::endl;
    std::cout << "当前酒店房间状态：" << std::endl;
    print_hotel(curr_player);
    std::cout << std::endl;
    std::cout << "当前排队客人状态：" << std::endl;
    for(int i=4; i>=0; i--){
        std::cout << i << " " << customer_waitlist[i].get_name() << "：";
        std::cout << "邀请费用 " << (first_pick ? 0 : customer_waitlist[i].get_invitation_cost()) << "，";
        std::cout << "客人颜色 " << customer_waitlist[i].get_color_string() << "，";
        std::cout << "游戏点数奖励 " << customer_waitlist[i].get_bonus_game_point() << std::endl;
        std::cout << "完成奖励：" << customer_waitlist[i].get_description() << std::endl;
    }
    std::cout << std::endl;
    std::cout << "当前行动点数状态：" << std::endl;
    std::cout << "获取食物（棕饼干大于等于白蛋糕） " << action_point[0] << std::endl;
    std::cout << "获取饮料（红酒大于等于黑咖啡） "   << action_point[1] << std::endl;
    std::cout << "开空房 " << action_point[2] << std::endl;
    std::cout << "收取钱或皇家点数 " << action_point[3] << std::endl;
    std::cout << "雇佣员工 " << action_point[4] << std::endl;
    std::cout << "万能选项 " << action_point[5] << std::endl;
    std::cout << "当前厨房食物状态：" << std::endl;
    std::cout << "棕饼干 " << kicken_resource[curr_player][0] << " 白蛋糕 " << kicken_resource[curr_player][1];
    std::cout << " 红酒 " << kicken_resource[curr_player][2] << " 黑咖啡 " << kicken_resource[curr_player][3] << std::endl;
    std::cout << std::endl;
    std::cout << "酒店内客人状态：" << std::endl;
    for(int i=0; i<num_customer_on_table[curr_player]; i++){
        std::cout << i << " " << customer_on_table[curr_player][i].get_name() << "：";
        std::cout << "客人颜色 " << customer_on_table[curr_player][i].get_color_string() << "，";
        std::cout << "游戏点数奖励 " << customer_on_table[curr_player][i].get_bonus_game_point() << std::endl;
        std::cout << "完成奖励：" << customer_on_table[curr_player][i].get_description() << std::endl;
        std::cout << "剩余食物需求：" << customer_on_table[curr_player][i].get_num_food_requirement() << std::endl;
        if(customer_on_table[curr_player][i].get_num_food_requirement()==0){
            std::cout << "该客人可结算！" << std::endl;
        }
        for(int j=0; j<customer_on_table[curr_player][i].get_num_food_requirement(); j++){
            std::cout << customer_on_table[curr_player][i].get_food_requirement_string(j) << " ";
        }
        std::cout << std::endl;
    }
    std::cout << std::endl;
    std::cout << "手中员工牌：" << std::endl;
    for(int i=0; i<num_server_on_hand[curr_player]; i++){
        std::cout << i << "： " << "费用 " << server_on_hand[curr_player][i].get_cost() << " " << server_on_hand[curr_player][i].get_name();
        std::cout << " " << server_on_hand[curr_player][i].get_type_string() << " " <<server_on_hand[curr_player][i].get_description();
        std::cout << std::endl;
    }
}

int main() {
    AustriaHotel game(2, true, true);
    game.play();

    return 0;
}