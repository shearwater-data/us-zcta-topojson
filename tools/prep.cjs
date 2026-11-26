// Builds src/zipstates.json: zip -> list of state abbrs (land-overlap >= 2% of the ZCTA, or its largest state)
const fs=require("fs");
const F={"01":"AL","02":"AK","04":"AZ","05":"AR","06":"CA","08":"CO","09":"CT","10":"DE","11":"DC","12":"FL","13":"GA","15":"HI","16":"ID","17":"IL","18":"IN","19":"IA","20":"KS","21":"KY","22":"LA","23":"ME","24":"MD","25":"MA","26":"MI","27":"MN","28":"MS","29":"MO","30":"MT","31":"NE","32":"NV","33":"NH","34":"NJ","35":"NM","36":"NY","37":"NC","38":"ND","39":"OH","40":"OK","41":"OR","42":"PA","44":"RI","45":"SC","46":"SD","47":"TN","48":"TX","49":"UT","50":"VT","51":"VA","53":"WA","54":"WV","55":"WI","56":"WY","72":"PR"};
const lines=fs.readFileSync("rel.txt","utf8").replace(/^﻿/,"").split(/\r?\n/);const h=lines[0].split("|");
const iz=h.indexOf("GEOID_ZCTA5_20"),ic=h.indexOf("GEOID_COUNTY_20"),ia=h.indexOf("AREALAND_PART"),iz2=h.indexOf("AREALAND_ZCTA5_20");
const acc={};
for(const l of lines.slice(1)){if(!l)continue;const c=l.split("|");const z=c[iz];if(!z)continue;const st=F[c[ic].slice(0,2)];if(!st)continue;const a=+c[ia]||0;(acc[z]??={})[st]=((acc[z]||{})[st]||0)+a;}
const out={};let multi=0,tot=0;
for(const z in acc){const e=Object.entries(acc[z]).sort((a,b)=>b[1]-a[1]);const sum=e.reduce((s,x)=>s+x[1],0)||1;const keep=e.filter((x,i)=>i===0||x[1]/sum>=0.02).map(x=>x[0]);out[z]=keep;tot++;if(keep.length>1)multi++}
fs.writeFileSync("zipstates.json",JSON.stringify(out));console.log("zips",tot,"multi-state",multi);
