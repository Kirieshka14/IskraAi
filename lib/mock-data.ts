import type { AuthorMetric, Bot, Message, UserProfile } from "./types";
import { subscriptionPlans } from "./subscription-plans";
export const genreLabels={fantasy:"Фэнтези",horror:"Хоррор",romance:"Романтика",sci_fi:"Научная фантастика",drama:"Драма",comedy:"Комедия",slice_of_life:"Повседневность",historical:"История",other:"Другое"} as const;
export const bots:Bot[]=[
{id:"mira",name:"Мира Вельская",description:"Хранительница старой обсерватории. Вместе вы расшифруете послание, которое меняет судьбу города.",openingLine:"В ночь, когда погас последний фонарь, телескоп поймал невозможный свет...",genre:"fantasy",author:"linnea",avatar:"МВ",likes:12480,conversations:32100,status:"approved"},
{id:"anton",name:"Антон, сосед сверху",description:"Ироничная история о знакомстве, неловких разговорах на лестнице и слишком громкой музыке.",openingLine:"Прости за музыку. Кажется, я опять выбрал не то время для джаза.",genre:"slice_of_life",author:"margo",avatar:"АС",likes:8930,conversations:18800,status:"approved"},
{id:"elias",name:"Доктор Элиас Грей",description:"Врач на полярной станции замечает, что ночь длится дольше положенного. Научная тайна и тревожная атмосфера.",openingLine:"Часы показывают полдень, но солнце не взошло. Ты тоже это видишь?",genre:"horror",author:"northwind",avatar:"ЭГ",likes:7260,conversations:14900,status:"approved"},
{id:"sonya",name:"Соня из книжного",description:"Тёплая романтическая история в независимом книжном магазине у моря.",openingLine:"Я отложила для тебя книгу. По правде говоря, хотелось, чтобы ты вернулся.",genre:"romance",author:"redfox",avatar:"СК",likes:15900,conversations:41300,status:"approved"},
{id:"kai",name:"Капитан Кай Реннер",description:"Контрабандист с принципами ведёт корабль через закрытый сектор. Решения принимаете вы.",openingLine:"У нас семь минут до блокады. Скажи, ты умеешь держать курс под огнём?",genre:"sci_fi",author:"orbit",avatar:"КР",likes:10420,conversations:27600,status:"approved"},
{id:"agnes",name:"Агнес де Рош",description:"Придворная интрига в Париже XVII века: союзы, письма и цена честности.",openingLine:"Это письмо не должно было попасть к тебе. Теперь нам обоим грозит опасность.",genre:"historical",author:"clio",avatar:"АР",likes:6120,conversations:9700,status:"approved"}
];
export const profile:UserProfile={id:"demo",displayName:"Оливер",email:"oliver@example.com",isAdultConfirmed:true,newsletterOptIn:false,plan:"Бесплатный",points:{remaining:73.6,total:100,resetsAt:"00:00 МСК"},isSelfEmployedVerified:false};
export const messages:Message[]=[
{id:"1",conversationId:"mira",sender:"assistant",content:`Ты поднимаешься по винтовой лестнице обсерватории. Пыль пахнет железом и старыми книгами. У телескопа стоит Мира — она не оборачивается, только протягивает тебе лист с рядом координат.

— Я ждала тебя. Сегодня звёзды написали наше имя.`,createdAt:"21:42",responseSize:"medium"},
{id:"2",conversationId:"mira",sender:"user",content:"Я подхожу ближе и смотрю на координаты. Что в них необычного?",createdAt:"21:44"},
{id:"3",conversationId:"mira",sender:"assistant",content:`Мира проводит ногтем по последней строке. Координаты образуют маршрут — но не на небе, а по улицам города. Каждая точка совпадает с местом, где за последний месяц остановились часы.

— А последняя точка, — тихо говорит она, — прямо под нами.`,createdAt:"21:44",responseSize:"medium"}
];
export const plans = subscriptionPlans;
export const authorMetrics:AuthorMetric[]=[{label:"Диалоги за месяц",value:"8 492",hint:"+14% к прошлому месяцу"},{label:"Платный вес",value:"12 806",hint:"Сообщения с коэффициентом"},{label:"Лайки",value:"1 284",hint:"+96 за неделю"},{label:"Ожидаемый доход",value:"3 740 ₽",hint:"Предварительная оценка"}];
