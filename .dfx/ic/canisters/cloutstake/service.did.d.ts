import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface CLOUTSTAKING {
  'claim_rewards' : ActorMethod<[], Result_1>,
  'get_reward_history' : ActorMethod<[Principal], Result_3>,
  'get_user_stake_info' : ActorMethod<[Principal], Result_2>,
  'stake_tokens' : ActorMethod<[bigint], Result_1>,
  'unstake_tokens' : ActorMethod<[bigint], Result>,
}
export type Result = { 'ok' : string } |
  { 'err' : string };
export type Result_1 = { 'ok' : null } |
  { 'err' : string };
export type Result_2 = {
    'ok' : { 'startTime' : bigint, 'rewards' : bigint, 'amount' : bigint }
  } |
  { 'err' : string };
export type Result_3 = { 'ok' : Array<RewardHistory> } |
  { 'err' : string };
export interface RewardHistory { 'rewardTime' : bigint, 'amount' : bigint }
export interface _SERVICE extends CLOUTSTAKING {}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
