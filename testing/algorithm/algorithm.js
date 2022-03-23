const topicsIlike = ['TP1', 'TP2', 'TP3', 'TP5', 'TP7']
const MY_TUITS = [
  {tuit: 'T1', topic: 'TP1', old: '12', likes: 123},
  {tuit: 'T2', topic: 'TP2', old: '23', likes: 234},
  {tuit: 'T3', topic: 'TP3', old: '34', likes: 345},
];
const REPLIED = [
  {tuit: 'R1', topic: 'TP2', old: '21', likes: 234},
  {tuit: 'R2', topic: 'TP3', old: '32', likes: 345},
  {tuit: 'R3', topic: 'TP4', old: '43', likes: 456},
];
const RETUITED = [
  {tuit: 'RT1', topic: 'TP3', old: '11', likes: 345},
  {tuit: 'RT2', topic: 'TP4', old: '22', likes: 456},
  {tuit: 'RT3', topic: 'TP5', old: '33', likes: 567},
];
const BOOKMARKED = [
  {tuit: 'B1', topic: 'TP4', old: '44', likes: 456},
  {tuit: 'B2', topic: 'TP5', old: '33', likes: 567},
  {tuit: 'B3', topic: 'TP6', old: '22', likes: 678},
];
const LIKED = [
  {tuit: 'L1', topic: 'TP5', old: '13', likes: 567},
  {tuit: 'L2', topic: 'TP6', old: '24', likes: 678},
  {tuit: 'L3', topic: 'TP7', old: '35', likes: 789},
];
const I_FOLLOW = [
  {tuit: 'F1', topic: 'TP6', old: '53', likes: 987},
  {tuit: 'F2', topic: 'TP7', old: '42', likes: 876},
  {tuit: 'F3', topic: 'TP8', old: '31', likes: 765},
];
const FOLLOW_ME = [
  {tuit: 'FU1', topic: 'TP7', old: '32', likes: 654},
  {tuit: 'FU2', topic: 'TP8', old: '43', likes: 543},
  {tuit: 'FU3', topic: 'TP9', old: '54', likes: 432},
];

// retrieve all tuits by category
const All_TUITS = [
  ...MY_TUITS, ...REPLIED, ...RETUITED, ...BOOKMARKED,
  ...LIKED, ...I_FOLLOW, ...FOLLOW_ME
];

console.log(All_TUITS)

const oldest = All_TUITS.reduce((max, tuit)=>{
  if(tuit.old > max) {return tuit.old;}
  else {return max;}
}, 0);
const youngest = All_TUITS.reduce((min, tuit)=>{
  if(tuit.old < min) {return tuit.old;}
  else {return min;}
}, 10000);
const oldRange = oldest - youngest;

console.log(oldest)
console.log(youngest)
console.log(oldRange)

const mostPopular = All_TUITS.reduce((max, tuit)=>{
  if(tuit.likes > max) {return tuit.likes;}
  else {return max;}
}, 0);
const leastPopular = All_TUITS.reduce((min, tuit)=>{
  if(tuit.likes < min) {return tuit.likes;}
  else {return min;}
}, 10000);
const likesRange = mostPopular - leastPopular;

console.log(mostPopular)
console.log(leastPopular)
console.log(likesRange)

const NORMALIZED_TUITS = All_TUITS.map(tuit => {
  return({
    ...tuit,
    normalizedOld: (tuit.old - youngest) / oldRange,
    normalizedLikes: (tuit.likes - leastPopular) / likesRange
  })
})

console.log(NORMALIZED_TUITS)