/* q fh.q */ 
h:neg hopen `:localhost:5001; /* connect to rdb */
syms:`MSFT.O`IBM.N`GS.N`BA.N`VOD.L; /* stocks */
prices:syms!45.15 191.10 178.50 128.04 341.30 ; /* starting prices */
n:2;  /* number of rows per update */
flag:1; /* generate 10% of updates for trade and 90% for quote */
getmovement:{[s] rand[0.001]*prices[s]}; /* get a random price movement */

/* generate trade price */
getprice:{[s] prices[s]+:rand[1 -1]*getmovement[s]; prices[s]};
getbid:{[s] prices[s]-getmovement[s]}; /* generate bid price */
getask:{[s] prices[s]+getmovement[s]}; /* generate ask price */

/* timer function */
.z.ts:{
  s:n?syms;
  $[0<flag mod 10;
  h(`upd;`quote;(n#.z.N;s;getbid'[s];getask'[s]));
  h(`upd;`trade;(n#.z.N;s;getprice'[s];n?1000))
  ];
  flag+:1;
 };
 
/* trigger timer every 100ms */
\t 100
