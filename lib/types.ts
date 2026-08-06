export type Genre = "fantasy"|"horror"|"romance"|"sci_fi"|"drama"|"comedy"|"slice_of_life"|"historical"|"other";
export type ResponseSize = "small"|"medium"|"large";
export type ModerationStatus = "pending"|"approved"|"rejected";
export interface Bot { id:string; name:string; description:string; openingLine:string; genre:Genre; author:string; avatar:string; likes:number; conversations:number; isLiked?:boolean; status:ModerationStatus; }
export interface UserProfile { id:string; displayName:string; email:string; isAdultConfirmed:boolean; newsletterOptIn:boolean; plan:string; points:{remaining:number;total:number;resetsAt:string}; isSelfEmployedVerified:boolean; }
export interface Message { id:string; conversationId:string; sender:"user"|"assistant"; content:string; createdAt:string; responseSize?:ResponseSize; isEdited?:boolean; }
export interface SubscriptionPlan { id:string; name:string; durationDays:number; priceRub:number; dailyPointAllowance:number|null; isFeatured:boolean; }
export interface AuthorMetric { label:string; value:string; hint:string; }
