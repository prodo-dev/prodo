\p 5001 
.z.ws:{value x};
.z.wc: {delete from `subs where handle=x};

/* table definitions */
trade:flip `time`sym`price`size!"nsfi"$\:();
quote:flip `time`sym`bid`ask!"nsff"$\:();
upd:insert;

/* subs table to keep track of current subscriptions */
subs:2!flip `handle`func`params!"is*"$\:();

/* functions to be called through WebSocket */
loadPage:{ getSyms[.z.w]; sub[`getQuotes;enlist `]; sub[`getTrades;enlist `]};
filterSyms:{ sub[`getQuotes;x];sub[`getTrades;x]};

getSyms:{ (neg[x]) .j.j `func`result!(`getSyms;distinct (quote`sym),trade`sym)};

getQuotes:{ 
	filter:$[all raze null x;distinct quote`sym;raze x];
	res: 0!select last bid,last ask by sym,last time from quote where sym in filter; 
	`func`result!(`getQuotes;res)};

getTrades:{ 
	filter:$[all raze null x;distinct trade`sym;raze x];
	res: 0!select last price,last size by sym,last time from trade where sym in filter;
	`func`result!(`getTrades;res)};

/*subscribe to something */
sub:{`subs upsert(.z.w;x;enlist y)};

/*publish data according to subs table */
pub:{ 
	row:(0!subs)[x]; 
	(neg row[`handle]) .j.j (value row[`func])[row[`params]]
 };

/* trigger refresh every 100ms */
.z.ts:{pub each til count subs};
\t 1000
