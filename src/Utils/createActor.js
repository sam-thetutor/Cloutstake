import { Actor, HttpAgent } from '@dfinity/agent';


export const createActor = (canisterId, idlFactory,agent) => {
  return Actor.createActor(idlFactory, {
    agent,
    canisterId,
  });
};
