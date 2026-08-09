import {describe,expect,it} from "vitest";
import {canSendMessage,remainingAfterSuccessfulReply} from "../lib/chat-state";
describe("chat quota state",()=>{
  it("uses authoritative remaining after a successful meaningful reply",()=>expect(remainingAfterSuccessfulReply(100,{assistantMessage:{content:"Ответ"},remaining:99})).toBe(99));
  it("does not decrement after failure or empty reply",()=>{expect(remainingAfterSuccessfulReply(100,{remaining:99})).toBe(100);expect(remainingAfterSuccessfulReply(100,{assistantMessage:{content:"  "},remaining:99})).toBe(100)});
  it("disables sending at zero",()=>expect(canSendMessage(0,false,"Привет")).toBe(false));
});
