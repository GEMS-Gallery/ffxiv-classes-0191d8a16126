import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Class {
  'id' : string,
  'name' : string,
  'role' : string,
  'description' : string,
  'image' : string,
}
export type Result = { 'ok' : null } |
  { 'err' : string };
export type Result_1 = { 'ok' : [bigint, bigint] } |
  { 'err' : string };
export type Result_2 = { 'ok' : Class } |
  { 'err' : string };
export interface _SERVICE {
  'addClass' : ActorMethod<[string, string, string, string, string], Result>,
  'dislikeClass' : ActorMethod<[string], Result>,
  'getClassDetails' : ActorMethod<[string], Result_2>,
  'getClasses' : ActorMethod<[], Array<Class>>,
  'getLikesDislikes' : ActorMethod<[string], Result_1>,
  'likeClass' : ActorMethod<[string], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
