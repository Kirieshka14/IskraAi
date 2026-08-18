export type Genre = "fantasy"|"horror"|"romance"|"sci_fi"|"drama"|"comedy"|"slice_of_life"|"historical"|"other";
export type ResponseSize = "small"|"medium"|"large";
export type ModerationStatus = "pending"|"approved"|"rejected";
export interface Bot { id:string; name:string; description:string; openingLine:string; genre:Genre; author:string; avatar:string; likes:number; conversations:number; isLiked?:boolean; status:ModerationStatus; }
export interface UserProfile { id:string; displayName:string; email:string; isAdultConfirmed:boolean; newsletterOptIn:boolean; plan:string; points:{remaining:number;total:number;resetsAt:string}; isSelfEmployedVerified:boolean; }
export interface Message { id:string; conversationId:string; sender:"user"|"assistant"; content:string; createdAt:string; responseSize?:ResponseSize; isEdited?:boolean; }
export interface SubscriptionPlan { id:string; name:string; durationDays:number; priceRub:number; dailyPointAllowance:number|null; isFeatured:boolean; }
export interface AuthorMetric { label:string; value:string; hint:string; }
export interface StorySummary { id:string; title:string; subtitle:string; description:string; cover_url:string|null; genre:Genre; mode:"limited"|"infinite"; likes_count:number; created_at:string; }
export interface StoryCharacterDraft { key:string; name:string; subtitle:string; appearance:string; prompt:string; avatarUrl?:string|null; startsPresent:boolean; }
export interface StoryChoiceDraft { label:string; toSceneKey:string; condition:string; }
export interface StorySceneDraft { key:string; title:string; outline:string; requiredEvents:string[]; presentCharacterKeys:string[]; choices:StoryChoiceDraft[]; isEnding:boolean; }
export interface StoryDraft { title:string; subtitle:string; description:string; coverUrl?:string|null; genre:Genre; mode:"limited"|"infinite"; userRole:string; showChoicesDefault:boolean; allowEphemeralCharacters:boolean; characters:StoryCharacterDraft[]; scenes:StorySceneDraft[]; initialSceneKey:string; }
