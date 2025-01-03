import CloudTypes "Types/cloud.types";
import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Time "mo:base/Time";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Result "mo:base/Result";
import Buffer "mo:base/Buffer";

actor class CLOUTSTAKING() = this {

    let CLOUT_CANISTER_ID : Text = "2dw2h-gyaaa-aaaam-qcu3a-cai";

    let cloutActor = actor (CLOUT_CANISTER_ID) : CloudTypes.Self;

    //struct to store info about the user stake in the canister
    public type Stake = {
        amount : Nat;
        lastClaimTime : Int;
    };

    public type RewardHistory = {
        rewardTime:Int;
        amount:Nat;

    };

    let tokenFee : Nat = 10000;
    let totalTimeInAYear : Int = 31536000000000000;

    //arrays for data persistance
    private var usersArray : [(Principal, Stake)] = [];

    //triemap to store the platforms to monitor
    private var usersHashMap = HashMap.fromIter<Principal, Stake>(
        Iter.fromArray(usersArray),
        Iter.size(Iter.fromArray(usersArray)),
        Principal.equal,
        Principal.hash,
    );

    //store the staking reward info in the canister 
    private var rewardHistoryArray : [(Principal, [RewardHistory])] = [];
    
    //hashmap to store the reward history of the user
    private var rewardHistoryHashMap = HashMap.fromIter<Principal, [RewardHistory]>(
        Iter.fromArray(rewardHistoryArray),
        Iter.size(Iter.fromArray(rewardHistoryArray)),
        Principal.equal,
        Principal.hash,
    );

    //store the rewards history of the user
    private func store_reward_history(user : Principal, _amount : Nat) {
        switch (rewardHistoryHashMap.get(user)) {
            case (?data) {

                let tempData = Buffer.fromArray<RewardHistory>(data);
                
                let newRewardHistory:RewardHistory = {rewardTime = Time.now(); amount = _amount};
                tempData.add(newRewardHistory);
                rewardHistoryHashMap.put(user, Buffer.toArray(tempData));
            };
            
            case (null) {
                let newRewardHistory : RewardHistory ={rewardTime = Time.now(); amount = _amount};
                rewardHistoryHashMap.put(user, [newRewardHistory]);
            };
        };
    };

    //get the rewards history of the user
    public func get_reward_history(user : Principal) : async Result.Result<[RewardHistory], Text> {
        switch (rewardHistoryHashMap.get(user)) {
            case (?data) {
                return #ok(data);
            };
            case (null) {
                return #err("no reward history found");
            };
        };
    };


    //transfer the tokens from the user to the canister
    private func transfer_funds_from_user(user : Principal, _amount : Nat) : async Bool {

        let transferResults = await cloutActor.icrc2_transfer_from({
            spender_subaccount = null;
            from = {
                owner = user;
                subaccount = null;
            };
            to = {
                owner = Principal.fromActor(this);
                subaccount = null;
            };
            amount = _amount;
            fee = null;
            memo = null;
            created_at_time = null;

        });

        switch (transferResults) {
            case (#Ok(value)) { return true };
            case (#Err(error)) { return false };
        };

    };

    //transfer the tokens from the canister back to the user
    private func transfer_tokens_from_canister(_amount : Nat, user : Principal) : async Bool {

        let transferResults = await cloutActor.icrc1_transfer({
            from_subaccount = null;
            to = {
                owner = user;
                subaccount = null;
            };
            fee = null;
            amount = _amount;
            memo = null;
            created_at_time = null;
        });

        switch (transferResults) {
            case (#Ok(value)) { return true };
            case (#Err(error)) { return false };
        };

    };

    //calculate the rewards to be given to the user
    private func calculate_rewards(_amount : Nat, _startTime : Int) : async Nat {
        let timeElapsed = Time.now() - _startTime;
        let realElapsedTime = Float.div(Float.fromInt(timeElapsed), Float.fromInt(totalTimeInAYear));
        let rewards = Float.mul(Float.mul(Float.fromInt(_amount), 0.08), realElapsedTime);
        return Int.abs(Float.toInt(rewards));
    };

    ///allow the user to claim the rewards. it ican only be done once per day
    public shared ({ caller }) func claim_rewards() : async Result.Result<(), Text> {
        switch (usersHashMap.get(caller)) {
            case (null) {
                return #err("no user found");
            };
            case (?user) {
                if (Time.now() < user.lastClaimTime + 24 * 60 * 60 * 1000000000) {
                    return #err("claiming rewards is only allowed once every 24 hours");
                };
                let rewards = await calculate_rewards(user.amount, user.lastClaimTime);
                let transfer = await transfer_tokens_from_canister(rewards, caller);
                if (transfer) {
                    usersHashMap.put(caller, { user with lastClaimTime = Time.now() });
                    store_reward_history(caller, rewards);
                    return #ok();
                } else {
                    return #err("reward transfer failed");
                };
            };
        };
    };

    //allow the user to stake their tokens
    public shared ({ caller }) func stake_tokens(_amount : Nat) : async Result.Result<(), Text> {
        let results = await transfer_funds_from_user(caller, _amount);
        if (results) {
            //check if the user has previously staked tokens
            //id they are there, first calculate the rewards, transfer them and the increase their stake so that they start earning rewards
            switch (usersHashMap.get(caller)) {
                case (?data) {
                     let rewards = await calculate_rewards(data.amount, data.lastClaimTime);
                     let transferResults = await transfer_tokens_from_canister(rewards, caller);
                     if (transferResults) {
                        usersHashMap.put(caller, { amount = data.amount + _amount; lastClaimTime = Time.now() });
                        return #ok();
                    } else {
                        return #err("cant transfer rewards");
                    };
                };
                case (null) {
                    usersHashMap.put(caller, { amount = _amount; lastClaimTime = Time.now() });
                    return #ok();
                };
            };
            // usersHashMap.put(caller, { amount = _amount; lastClaimTime = Time.now() });
            // return #ok();
        } else {
            return #err("unable to transfer CLOUT tokens from the user for staking");
        };
    };

    //allow the user to unstake their tokens
    public shared ({ caller }) func unstake_tokens(_amount:Nat) : async Result.Result<Text, Text> {
        switch (usersHashMap.get(caller)) {
            case (?data) {

                //check if the user has the required amount to unstake
                if (data.amount < _amount + 10000) {
                    return #err("insufficient funds to unstake");
                };

                let rewards = await calculate_rewards(data.amount, data.lastClaimTime);
                let transferResults = await transfer_tokens_from_canister(rewards, caller);
                if (transferResults) {
                    let transferPrincipal = await transfer_tokens_from_canister( _amount, caller);
                    if (transferPrincipal) {
                        usersHashMap.put(caller,{data with amount = data.amount - _amount;lastClaimTime = Time.now()});
                        return #ok("tokens unstaked successfully");
                    } else {
                        return #err("cant transfer tokens to the user");
                    };
                } else {
                    return #err("cant transfer rewards");
                };
            };
            case (null) { return #err("no user found") };
        };
    };

    //get the user stake info
    public func get_user_stake_info(user : Principal) : async Result.Result<{ amount : Nat; rewards : Nat; startTime : Int }, Text> {
        switch (usersHashMap.get(user)) {
            case (?user) {
                let rewards = await calculate_rewards(user.amount, user.lastClaimTime);
                return #ok({
                    amount = user.amount;
                    rewards = rewards;
                    startTime = user.lastClaimTime;
                });
            };
            case (null) { return #err("no user found") };
        };
    };

    //data persistance
    system func preupgrade() {
        usersArray := Iter.toArray(usersHashMap.entries());
    };

    system func postupgrade() {
        usersArray := [];

    };

};
