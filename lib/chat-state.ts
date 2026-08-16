export function canSendMessage(remaining:number|null,busy:boolean,text:string){
  return remaining !== null && remaining > 0 && !busy && text.trim().length > 0;
}

export function remainingAfterSuccessfulReply(current:number,response:{assistantMessage?:{content?:string}|null;remaining?:number}){
  if(!response.assistantMessage?.content?.trim() || !Number.isFinite(response.remaining)) return current;
  return Math.max(0,Number(response.remaining));
}
