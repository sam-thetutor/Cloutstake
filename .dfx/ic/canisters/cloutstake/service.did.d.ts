import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface CLOUTSTAKING {
  'claim_rewards' : ActorMethod<[], Result>,
  'get_user_stake_info' : ActorMethod<[Principal], Result_1>,
  'stake_tokens' : ActorMethod<[bigint], Result>,
  'unstake_tokens' : ActorMethod<[], Result>,
}
export type Result = { 'ok' : null } |
  { 'err' : string };
export type Result_1 = {
    'ok' : { 'startTime' : bigint, 'rewards' : bigint, 'amount' : bigint }
  } |
  { 'err' : string };
export interface _SERVICE extends CLOUTSTAKING {}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
