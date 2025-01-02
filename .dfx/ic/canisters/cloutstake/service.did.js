export const idlFactory = ({ IDL }) => {
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const Result_1 = IDL.Variant({
    'ok' : IDL.Record({
      'startTime' : IDL.Int,
      'rewards' : IDL.Nat,
      'amount' : IDL.Nat,
    }),
    'err' : IDL.Text,
  });
  const CLOUTSTAKING = IDL.Service({
    'claim_rewards' : IDL.Func([], [Result], []),
    'get_user_stake_info' : IDL.Func([IDL.Principal], [Result_1], []),
    'stake_tokens' : IDL.Func([IDL.Nat], [Result], []),
    'unstake_tokens' : IDL.Func([], [Result], []),
  });
  return CLOUTSTAKING;
};
export const init = ({ IDL }) => { return []; };
