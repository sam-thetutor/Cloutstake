export const idlFactory = ({ IDL }) => {
  const Result_1 = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const RewardHistory = IDL.Record({
    'rewardTime' : IDL.Int,
    'amount' : IDL.Nat,
  });
  const Result_3 = IDL.Variant({
    'ok' : IDL.Vec(RewardHistory),
    'err' : IDL.Text,
  });
  const Result_2 = IDL.Variant({
    'ok' : IDL.Record({
      'startTime' : IDL.Int,
      'rewards' : IDL.Nat,
      'amount' : IDL.Nat,
    }),
    'err' : IDL.Text,
  });
  const Result = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  return IDL.Service({
    'claim_rewards' : IDL.Func([], [Result_1], []),
    'get_reward_history' : IDL.Func([IDL.Principal], [Result_3], []),
    'get_user_stake_info' : IDL.Func([IDL.Principal], [Result_2], []),
    'stake_tokens' : IDL.Func([IDL.Nat], [Result_1], []),
    'unstake_tokens' : IDL.Func([IDL.Nat], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };