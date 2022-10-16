const fs = require('fs');

const hkkk = "ｱｲｳｴｵｶｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｵﾝｧｨｩｪｫｯｬｭｮﾞﾟｰ";
const hkkks = hkkk.split("");

//console.log(hkkks);


const d = fs.readFileSync(`./ame.txt`, 'utf8');

let ft = d.replace(/\s/g, "");

ft = ft.replace(/度分/g, "\n度分\n");
ft = ft.replace(/都府県/g, "\n都府県\n");
ft = ft.replace(/台管理/g, "台管理\n");
ft = ft.replace(/所在地/g, "\n所在地\n");


//const hkkkreg = `[${hkkks}]+`;
//ft = ft.replace(hkkkreg, "\n");
//console.log(ft);

//fs.writeFileSync(`./ftconcat.txt`, ft);

ft = ft.replace(/#/g, "(昭49.11.1)");
ft = ft.replace(/[令平昭]([0-9]|[0-9][0-9]|元)\.\d\d?\.\d\d?/g, "$&\n");

const arr = ft.split("\n");

const geojson = {
  "type": "FeatureCollection",
  "features": []
};

const tmp = {};
const tmp2 = {};

arr.forEach( el => {
  
  const m = el.match(/([^0-9]+)(\d\d\d\d\d)([四三官雨雪])(.*[^0-9])([234]\d)(\d\d?\.\d)(1\d\d)(\d\d?\.\d)(.*)([令平昭]([0-9]|[0-9][0-9]|元)\.\d\d?\.\d\d?)/);
  //ダメそう→const m = el.match(/([^0-9]+)(\d\d\d\d\d)([四三官雨雪])([^.]+)([234]\d)(\d\d?\.\d)(1\d\d)(\d\d?\.\d)(.*)/);
  
  if(!m){
    if(el.match(/\d\d\d\d\d/)) console.log(el);
    return;
  }
  
  //console.log(m);
  
  const namer = m[4].split(/[ｱｲｳｴｵｶｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｵﾝｧｨｩｪｫｯｬｭｮﾞﾟｰ]/);
  
  const kanam = m[4].match(/([ｱｲｳｴｵｶｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｵﾝｧｨｩｪｫｯｬｭｮﾞﾟｰ]+)/);
  
  const prefr = m[1].split(/[－く温雨風照所]/);
  //備考に書かれる可能性があり、なおかつ都府県・振興局の名前に含まれない文字
  
  const lng = +m[7] + (+m[8]/60);
  const lat = +m[5] + (+m[6]/60);
  
  const d = {
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [ lng, lat ]
    },
    "properties": {
      "pref": prefr[prefr.length-1],
      "code": m[2],
      "type": m[3],
      "name": namer[0],
      "kana": kanam[1],
      "addr": namer[namer.length-1],
      "start": m[10], //降水量のみ抽出。ほかの観測開始日は無視（「降水量...を除く」はないはず）
      "name_kana_addr": m[4],
      "lat_n": m[5],
      "lat_d": m[6],
      "lng_n": m[7],
      "lng_d": m[8]
    }
  };
  
  geojson.features.push(d);
  
  if(!tmp[d.properties.pref]){
     tmp[d.properties.pref] = 1;
  }else{
    tmp[d.properties.pref] += 1;
  }
  
  if(!tmp2[d.properties.name]){
     tmp2[d.properties.name] = [d.properties.type];
  }else{
    tmp2[d.properties.name].push(d.properties.type);
  }
  
});

console.log("------------------------------------------------");
console.log(tmp);
console.log("------------------------------------------------");
console.log(tmp2);
console.log("------------------------------------------------");

//例外処理（経緯度の分に「.」が入っていない場合）
const exception = [
{
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [
      134 + (34.3/60),
      34 + (4/60),
    ]
  },
  "properties": {
    "pref": "徳島",
    "code": "71106",
    "type": "官",
    "name": "徳島",
    "kana": "ﾄｸｼﾏ",
    "addr": "徳島市大和町徳島地方気象台",
    "start": "昭49.11.1",
    "name_kana_addr": "徳島ﾄｸｼﾏ徳島市大和町徳島地方気象台",
    "lat_n": "34",
    "lat_d": "4",
    "lng_n": "134",
    "lng_d": "34.4",
  }
},
{
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [
      134 + (34.3/60),
      34 + (4/60),
    ]
  },
  "properties": {
    "pref": "徳島",
    "code": "71106",
    "type": "官",
    "name": "徳島",
    "kana": "ﾄｸｼﾏ",
    "addr": "徳島市大和町",
    "start": "昭49.11.1",
    "name_kana_addr": "徳島ﾄｸｼﾏ徳島市大和町",
    "lat_n": "34",
    "lat_d": "4",
    "lng_n": "134",
    "lng_d": "34.3",
  }
}
];

exception.forEach( el => {
  geojson.features.push(el);

});


let csv = "pref,code,type,name,kana,addr,lat,lng,start,name_kana_addr,lat_n,lat_d,lng_n,lng_d";
geojson.features.forEach( f=> {
  const lng = f.geometry.coordinates[0];
  const lat = f.geometry.coordinates[1];
  const p = f.properties;
  csv += "\n" + `${p.pref},${p.code},${p.type},${p.name},${p.kana},${p.addr},${lat},${lng},${p.start},${p.name_kana_addr},${p.lat_n},${p.lat_d},${p.lng_n},${p.lng_d}`;  
});

fs.writeFileSync(`./kansokujo.geojson`, JSON.stringify(geojson, null, 2));
fs.writeFileSync(`./kansokujo.csv`, csv);

