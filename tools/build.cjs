// usage: node build.cjs <simplifyPct> <quantization> <outDir>
const fs=require("fs"),path=require("path"),zl=require("zlib"),cp=require("child_process");
const [pct,q,out]=[process.argv[2]||"12",process.argv[3]||"20000",process.argv[4]||"out"];
const MS=path.resolve("../zipgeo/node_modules/mapshaper/bin/mapshaper");
const nat=path.join(out,"_nat.json");fs.mkdirSync(out,{recursive:true});fs.mkdirSync(path.join(out,"_tmp"),{recursive:true});
cp.execFileSync("node",[MS,"-i","../zipgeo/shp/cb_2020_us_zcta520_500k.shp","-filter-fields","ZCTA5CE20","-simplify",pct+"%","keep-shapes","-o",nat,"format=geojson","precision=0.00001"],{stdio:"pipe"});
const zs=JSON.parse(fs.readFileSync("src/zipstates.json","utf8"));
const fc=JSON.parse(fs.readFileSync(nat,"utf8"));const by={};let nogeom=0,unassigned=0;
for(const f of fc.features){const z=f.properties.ZCTA5CE20;const sts=zs[z];if(!f.geometry){nogeom++;continue}if(!sts){unassigned++;continue}for(const s of sts)(by[s]??=[]).push(f)}
let tot=0,totraw=0;const rows=[];
for(const s of Object.keys(by).sort()){const tmp=path.join(out,"_tmp",s+".json");fs.writeFileSync(tmp,JSON.stringify({type:"FeatureCollection",features:by[s]}));
 const dst=path.join(out,"zip_"+s.toLowerCase()+".topo.json");
 cp.execFileSync("node",[MS,"-i",tmp,"-rename-layers","zips","-o",dst,"format=topojson","quantization="+q],{stdio:"pipe"});
 const b=fs.readFileSync(dst);const gz=zl.gzipSync(b,{level:9}).length;tot+=gz;totraw+=b.length;rows.push([s,by[s].length,b.length,gz])}
fs.rmSync(path.join(out,"_tmp"),{recursive:true});
console.log(`pct=${pct} q=${q}: states ${rows.length}, total raw ${(totraw/1e6).toFixed(1)} MB, total gz ${(tot/1e6).toFixed(1)} MB, no-geom (dropped by simplify) ${nogeom}, unassigned ${unassigned}`);
for(const r of rows.filter(r=>["TX","CA","NY","RI","DC","AK"].includes(r[0])||r[3]>1.4e6))console.log(r[0],"zips",r[1],"raw",(r[2]/1e3).toFixed(0)+"KB","gz",(r[3]/1e3).toFixed(0)+"KB");
const mx=rows.reduce((a,b)=>b[3]>a[3]?b:a);console.log("largest",mx[0],(mx[3]/1e3).toFixed(0)+"KB gz");
