import{Bitcoin as t}from"bitcoin-computer-bitcore";import"ses";import e from"axios";import n from"crypto";import r from"crypto-js";import*as s from"eciesjs";function o(t,e){var n={};for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&e.indexOf(r)<0&&(n[r]=t[r]);if(null!=t&&"function"==typeof Object.getOwnPropertySymbols){var s=0;for(r=Object.getOwnPropertySymbols(t);s<r.length;s++)e.indexOf(r[s])<0&&Object.prototype.propertyIsEnumerable.call(t,r[s])&&(n[r[s]]=t[r[s]])}return n}function i(t,e,n,r){var s,o=arguments.length,i=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(t,e,n,r);else for(var c=t.length-1;c>=0;c--)(s=t[c])&&(i=(o<3?s(i):o>3?s(e,n,i):s(e,n))||i);return o>3&&i&&Object.defineProperty(e,n,i),i}function c(t,e,n,r){return new(n||(n=Promise))((function(s,o){function i(t){try{a(r.next(t))}catch(t){o(t)}}function c(t){try{a(r.throw(t))}catch(t){o(t)}}function a(t){var e;t.done?s(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(i,c)}a((r=r.apply(t,e||[])).next())}))}const a=t=>new Compartment({}).evaluate(t);const u=(t,e,n)=>new Compartment({target:t,thisArgument:e,argumentsList:n}).evaluate("Reflect.apply(target, thisArgument, argumentsList)");const d=(t,e)=>new Compartment({target:t,argumentsList:e}).evaluate(`Reflect.construct(${t}, argumentsList)`);const{crypto:h}=t;const l=(t,e)=>{const n=Date.now();const r=h.Hash.sha256(Buffer.from(e+n));const s=[h.ECDSA.sign(r,t,"big").toString("hex"),t.publicKey.toString(),n];return`Bearer ${Buffer.from(s.join(":")).toString("base64")}`};const{Transaction:p}=t;function f(t){return c(this,void 0,void 0,(function*(){if(!function(t){return void 0!==t.config}(t))throw new Error("Unknown error");const{message:e,config:n,response:r}=t;const s=function(t){try{const e=JSON.parse(t);if("object"!=typeof e)throw new Error("Invalid object");if("string"!=typeof e.txhex)throw new Error("Invalid object");return new p(e.txhex)}catch(t){return null}}(null==n?void 0:n.data);const o=`message\t${e}`;const i=`request\t${null==n?void 0:n.method} ${null==n?void 0:n.url}`;const c=s?`transaction\t ${JSON.stringify(s.toJSON(),null,2)}`:"";const a="post"===(null==n?void 0:n.method)?`data\t${null==n?void 0:n.data}`:"";const u=r?`response\t${JSON.stringify(r.data)}`:"";const d=s?c:a;throw t.message=`\n    Communication Error\n    ${o}\n    ${i}\n    ${d}\n    ${u}`,t}))}class g{constructor(t,e,n={}){this.baseUrl=t,this.headers=n,this.privateKey=e}get(t){return c(this,void 0,void 0,(function*(){const n=`${this.baseUrl}${t}`;try{let t={};return this.privateKey&&(t={Authentication:l(this.privateKey,this.baseUrl)}),(yield e.get(n,{headers:Object.assign(Object.assign({},this.headers),t)})).data}catch(t){return f(t)}}))}post(t,n){return c(this,void 0,void 0,(function*(){const r=`${this.baseUrl}${t}`;try{let t={};return this.privateKey&&(t={Authentication:l(this.privateKey,this.baseUrl)}),(yield e.post(r,n,{headers:Object.assign(Object.assign({},this.headers),t)})).data}catch(t){return f(t)}}))}delete(t){return c(this,void 0,void 0,(function*(){const n=`${this.baseUrl}${t}`;try{let t={};return this.privateKey&&(t={Authentication:l(this.privateKey,this.baseUrl)}),(yield e.delete(n,{headers:Object.assign(Object.assign({},this.headers),t)})).data}catch(t){return f(t)}}))}}const{PrivateKey:v,Transaction:_}=t;const{UnspentOutput:w}=_;function m(t){if(!/^[0-9A-Fa-f]{64}$/.test(t))throw new Error(`Invalid txId: ${t}`)}function y(t){if(!/^[0-9A-Fa-f]{64}\/\d+$/.test(t))throw new Error(`Invalid outId: ${t}`)}function b(t){y(t);const[e,n]=t.split("/");return{txId:e,outputIndex:parseInt(n,10)}}let O=class{constructor(t,e=new v){this.nodeConfig=t,this.bcn=new g(t.url,e)}get chain(){return this.nodeConfig.chain}get network(){return this.nodeConfig.network}getBalance(t){return c(this,void 0,void 0,(function*(){const{chain:e,network:n}=this;return yield this.bcn.get(`/v1/${e}/${n}/address/${t}/balance`)}))}getTransaction(t){return c(this,void 0,void 0,(function*(){return new _(yield this.getRawTx(t))}))}getRawTx(t){return c(this,void 0,void 0,(function*(){m(t);const{chain:e,network:n}=this;return this.bcn.get(`/v1/${e}/${n}/tx/${t}`)}))}getTransactions(t){return c(this,void 0,void 0,(function*(){return(yield this.getRawTxs(t)).map((t=>new _(t)))}))}getRawTxs(t){return c(this,void 0,void 0,(function*(){t.map(m);const{chain:e,network:n}=this;return this.bcn.post(`/v1/${e}/${n}/tx/bulk/`,{txIds:t})}))}sendTransaction(t){return c(this,void 0,void 0,(function*(){return this.bcn.post(`/v1/${this.chain}/${this.network}/tx/send`,{rawTx:t})}))}getUtxosFromAddress(t){return c(this,void 0,void 0,(function*(){const{chain:e,network:n}=this;return(yield this.bcn.get(`/v1/${e}/${n}/wallet/${t.toString()}/utxos`)).map((({rev:t,scriptPubKey:e,satoshis:n})=>{const[r,s]=t.split("/");return new w({txId:r,outputIndex:parseInt(s,10),satoshis:n,script:e})}))}))}getOwnedRevs(t){return c(this,void 0,void 0,(function*(){const{chain:e,network:n}=this;return this.bcn.get(`/v1/${e}/${n}/wallet/${t.toString()}/non-standard-utxos`)}))}queryRevs(t){return c(this,void 0,void 0,(function*(){const{publicKey:e,contractName:n,contractHash:r}=t;if(void 0===e&&void 0===n&&void 0===r)throw new Error("Filter parameter for queryRevs endpoint cannot be empty.");let s="";e&&(s+=`?publicKey=${e}`),n&&(s+=0===s.length?"?":"&",s+=`contractName=${n}`),r&&(s+=0===s.length?"?":"&",s+=`contractHash=${r}`);const{chain:o,network:i}=this;return this.bcn.get(`/v1/${o}/${i}/non-standard-utxos${s}`)}))}getLatestRev(t){return c(this,void 0,void 0,(function*(){y(t);const{chain:e,network:n}=this;const[{rev:r}]=yield this.bcn.get(`/v1/${e}/${n}/rev/${t}`);return r}))}getLatestRevs(t){return c(this,void 0,void 0,(function*(){t.map(y),t.map(y);const{chain:e,network:n}=this;return yield this.bcn.post(`/v1/${e}/${n}/revs`,{ids:t})}))}static getSecretOutput({_url:t,privateKey:e}){return c(this,void 0,void 0,(function*(){const n=t.split("/");const r=n[n.length-1];const s=n.slice(0,-2).join("/");const o=new g(s,e);return{host:s,data:yield o.get(`/v1/store/${r}`)}}))}static setSecretOutput({secretOutput:t,host:e,privateKey:n}){return c(this,void 0,void 0,(function*(){return new g(e,n).post("/v1/store/",t)}))}static deleteSecretOutput({_url:t,privateKey:e}){return c(this,void 0,void 0,(function*(){const n=t.split("/");const r=n[n.length-1];const s=n.slice(0,-2).join("/");const o=new g(s,e);yield o.delete(`/v1/store/${r}`)}))}};O=i([t=>t],O);const x=["_id","_rev","_owners","_amount","_readers","_url","__vouts","__func","__index","__args"];const E=t=>(Object.prototype.toString.call(t).match(/\s([a-zA-Z]+)/)||[])[1];const S=t=>"object"==typeof t?E(t):E(t).toLowerCase();const j=t=>["number","string","boolean","undefined","Null"].includes(S(t));const $=t=>"Array"===S(t);const C=t=>"Object"===S(t);const N=t=>j(t)||["Array","Object"].includes(S(t));const I=(t,e)=>{if(!N(t)||!N(e))throw new Error(`Unsupported data types for deep equals: ${S(t)} & ${S(e)}`);if(S(t)!==S(e))return!1;if(j(t)&&j(e))return t===e;const n=(t,e)=>Object.entries(t).every((([t,n])=>I(e[t],n)));return t&&e&&n(t,e)&&n(e,t)};const T=t=>{if(j(t))return t;if($(t))return t.map(T);if(C(t)){const e=Object.keys(t).reduce(((e,n)=>(e[n]=T(t[n]),e)),{});const n=Object.create(Object.getPrototypeOf(t));return Object.assign(n,e)}throw new Error(`Unsupported data type for clone: ${S(t)}`)};const A=(t,e)=>Object.fromEntries(Object.entries(t).map((t=>e(t))));const P=(t,e)=>A(t,(([t,n])=>[t,e(n)]));const R=(t,e)=>Object.fromEntries(Object.entries(t).filter((t=>e(t))));const K=(t,e,n,r)=>{if(j(t))return t;if($(t))return t.map((t=>K(t,e,n,r)));if(C(t)){t._rev=`${r}/${n}`;const s=e[n];return Object.entries(t).forEach((([n,o])=>{"object"==typeof s&&Object.keys(s).includes(n)&&(t[n]=K(o,e,s[n],r))})),t}throw new Error(`Unsupported type ${S(t)} in deep.updateRev`)};const U=(t,e)=>{if(j(t))return t;if($(t))return t.map((t=>U(t,e)));if(C(t))return t._id=!t._id||t._id.startsWith("__temp__")?t._rev:t._id,t._root=t._root||e,Object.entries(t).forEach((([n,r])=>{t[n]=U(r,e)})),t;throw new Error(`Unsupported type ${S(t)} in deep.addId`)};const B=t=>{if(j(t))return t;if($(t))return t.map((t=>B(t)));if(C(t)){const e=`__temp__/${Math.random()}`;return t._id=t._id||e,t._rev=t._rev||e,Object.values(t).map((t=>B(t))),t}throw new Error(`Unsupported type ${S(t)} in addRandomId`)};const D=t=>{if(j(t))return t;if($(t))return t.map((t=>D(t)));if(C(t))return A(t,(([t,e])=>["_owners","_readers"].includes(t)?[t,JSON.stringify(e)]:j(e)?[t,e]:[t,D(e)]));throw new Error(`Unexpected type ${S(t)} in stringifyOwners`)};const L=t=>(t._owners&&(t._owners=JSON.parse(t._owners)),t._readers&&(t._readers=JSON.parse(t._readers)),t);const H=t=>{if(j(t))return t;if($(t)||C(t))return Object.entries(t).reduce(((t,[e,n])=>{const r=H(n);return(t=>"Object"===S(t)&&Object.keys(t).every((t=>!Number.isNaN(parseInt(t,10)))))(r)?Object.entries(r).forEach((([n,r])=>{t[`${e}_${n}`]=r})):t[e]=r,t}),{});throw new Error(`Unsupported type ${S(t)} in encodeArraysAsObjects`)};const k=t=>{const e={[t._id]:Object.entries(t).reduce(((t,[e,n])=>x.includes(e)?Object.assign(Object.assign({},t),{[e]:n}):j(n)?Object.assign(Object.assign({},t),{[`__basic__${e}`]:n}):Object.assign(Object.assign({},t),{[e]:n._id})),{})};return Object.values(t).filter((t=>!j(t))).reduce(((t,e)=>Object.assign(Object.assign({},t),k(e))),e)};const M=t=>R(t,(([t])=>!t.startsWith("__basic__")));const G=(t,e)=>{const n=t[e];return n.__contains=Object.entries(n).reduce(((e,[n,r])=>["__contains",...x].includes(n)?e:"__change"===n?"new"===r||"diff"===r||e:G(t,r)[r].__contains||e),!1),t};const F=(t,e)=>t.map((t=>Object.entries(t).reduce(((t,[n,r])=>{const s="string"==typeof r&&"undefined"!==S(e[r])?e[r]:r;return Object.assign(Object.assign({},t),{[n]:s})}),{})));class J{constructor(t){this.db=t}get(t){return c(this,void 0,void 0,(function*(){const{txId:e,outputIndex:n}=b(t);const{inRevs:r,outData:s}=yield this.db.fromTxId(e);if(!Array.isArray(r)||!Array.isArray(s)||0===s.length)return;const o=s[0].__index||{};const i=s[o.obj].__cls||"";const c=s[o.obj].__func||"";const h=s[o.obj].__args||[];const l=yield Promise.all(Object.values(o).map((t=>{const e=r[t];return e?this.get(e):Promise.resolve({})})));const p=Object.keys(o).map(((t,e)=>[t,l[e]]));const f=Object.fromEntries(p);let g=f.obj;delete f.obj;const v=Object.entries(f).reduce(((t,[e,n])=>{const r=parseInt(e,10);return Number.isNaN(r)||(t[r]=n),t}),[]);const _=function(t,e){let n=0;return e.map((e=>"__"===e?t[n++]:e))}(v,h);let w;if("constructor"===c){const t=a(`(${i})`);g=d(t,_)}else w=u(g[c].bind(g),g,_);Object.entries(o).forEach((([t,n])=>{const r=parseInt(t,10);let o=v[r];"obj"===t?o=g:"res"===t&&(o=w),K(o,s,n,e)}));const m=g._root||`${e}/${o.obj}`;return U([w,g,...v],m),[...v,g,w][n]}))}}function W(t){return{smartArgs:t.filter((t=>t._rev)),dumbArgs:t.map((t=>t._rev?"__":t))}}class q{constructor(t){this.db=t,q.proxyDepth=q.proxyDepth||0}static getUpdate(t){return c(this,void 0,void 0,(function*(){let e;let n;let r;let s;let i;let c;let a;if("Cls"in t){const{Cls:o}=t;const u=t.args||[];e=o.toString(),n=null,r=d(o,u),s=T(u),i=u,c=null,a=void 0}else{const{target:o,property:d,args:h}=t;e=null,n=T(o),r=o,s=T(h),i=h,c=d,this.proxyDepth+=1,a=u(o[d],o,i),this.proxyDepth-=1}const{smartArgs:h,dumbArgs:l}=W(s);const{smartArgs:p}=W(i);const f=Object.assign(Object.assign(Object.assign({},h),{obj:n}),{_id:"index"});const g=Object.assign(Object.assign(Object.assign({},p),{obj:r}),{_id:"index"});["Object","Array"].includes(S(a))&&(g.res=a);const[v,_,w]=((t,e)=>{const n=B(e);const r=n._id;const s=T(t);const i=T(n);const c=D(s);const a=D(i);const u=H(c);const d=H(a);const h=((t,e)=>A(e,(([e,n])=>{const r=t[e];var s;return n.__change=(s=r)?I(s,n)?"same":"diff":"new",[e,n]})))(k(u),k(d));const l=P(h,M);const p=G(l,r);const f=p[r];delete p[r];const g=P(p,(t=>t._rev));const v=(_=t=>t.__contains||Object.values(f).includes(t._id),R(p,(([,t])=>_(t))));var _;const w=Object.values(v);const[m,y]=(b=t=>"new"===t.__change,w.reduce((([t,e],n,r)=>b(n)?[[...t,n],e]:[t,[...e,n]]),[[],[]]));var b;const O=[...y,...m];const E=(t=>t.reduce(((t,e,n)=>Object.assign(Object.assign({},t),{[e._id]:n})),{}))(O);const S=F(O,E);const[j]=F([f],E);const $=y.map((t=>t._rev));const[C,...N]=((t,e)=>[e,...t].map((t=>{const e=o(t,["_id","_rev","__change","__contains"]);return R(e,(([t,e])=>x.includes(t)||"number"==typeof e))})))(S,j);return[$,N.map(L).map((t=>Object.entries(t).reduce(((t,[e,n])=>Object.assign(Object.assign({},t),{[e]:g[n]||n})),{}))),C]})(f,g);void 0!==_[0]&&(_[0].__index=w);const m=w.obj;void 0!==_[m]&&(null!==e&&(_[m].__cls=e),_[m].__func=null===c?"constructor":String(c),_[m].__args=l);const y=w.res;return void 0!==_[y]&&"function Object() { [native code] }"!==a.constructor.toString()&&(_[y].__cls=a.constructor.toString()),[v,_,r,p,a,w]}))}allocate(t,e){return c(this,void 0,void 0,(function*(){const[n,r,s,o,,i]=yield q.getUpdate({Cls:t,args:e});const[c]=yield this.db.update(n,r);const{txId:a}=b(c);Object.entries(i).forEach((([t,e])=>{const n=parseInt(t,10);let i=o[n];"obj"===t&&(i=s),K(i,r,e,a)}));const u=`${a}/${i.obj}`;return U([s,...o],u),s}))}update(t,e,n){return c(this,void 0,void 0,(function*(){const[r,s,,o,i,c]=yield q.getUpdate({target:t,property:e,args:n});const[a]=yield this.db.update(r,s);const{txId:u}=b(a);Object.entries(c).forEach((([e,n])=>{const r=parseInt(e,10);let c=o[r];"obj"===e?c=t:e.startsWith("res")&&(c=i),K(c,s,n,u)}));const d="string"==typeof t._root?t._root:`${u}/${c.obj}`;return U([i,t,...o],d),i}))}get(t,e){return q.proxyDepth>0||"function"!=typeof t[e]?Reflect.get(t,e):(...n)=>this.update(t,e,n)}}const Y=parseInt(process.env.BC_DUST_LIMIT||"",10)||1546;const X=parseInt(process.env.BC_DEFAULT_FEE||"",10)||2500;var Z={MIN_NON_DUST_AMOUNT:Y,SCRIPT_CHUNK_SIZE:parseInt(process.env.BC_SCRIPT_CHUNK_SIZE||"",10)||479,DEFAULT_FEE:X,SIGHASH_ALL:1,FEE_PER_KB:2e4,PUBLIC_KEY_SIZE:65,ANYONE_CAN_SPEND_SEED:"replace this seed",PASSPHRASE:"",ENCODING_LENGTH:3,ENCODING_NUMBER_LENGTH:3,MAX_PUBKEYS_PER_SCRIPT:3,OP_RETURN_SIZE:80};const{PublicKey:V,crypto:z}=t;const{Point:Q}=z;function tt(t){return Buffer.from(t,"hex").toString().replace(/\0/g,"")}function et(t,e){return t.slice(e)+t.slice(0,e)}function nt(t,e,n){if(t.length*Math.log2(e)>53)throw new Error(`Input too large ${t.length} ${Math.log2(e)}`);if(![2,10,16].includes(e)||![2,10,16].includes(n))throw new Error("ToBase or FromBase invalid in covertNumber.");if(2===e&&t.length%8!=0)throw new Error("Binary strings must be byte aligned.");if(16===e&&t.length%2!=0)throw new Error("Hex strings must be of even length.");const r=parseInt(t,e).toString(n);return 2===n?r.padStart(8*Math.ceil(r.length/8),"0"):16===n?r.padStart(2*Math.ceil(r.length/2),"0"):r}function rt(t,e){const n=new RegExp(`.{1,${e}}`,"g");return t.match(n)||[]}function st(t){return rt(t,2).map((t=>nt(t,16,2))).join("")}function ot(t){return rt(t,8).map((t=>nt(t,2,16))).join("")}function it(t){return t.toString(16).padStart(Z.ENCODING_NUMBER_LENGTH,"0")}function ct(t){return parseInt(t,16)}function at(t){if(62!==t.length)throw new Error("Input to hexToPublicKey must be of length 62");let e=!1;let n=0;let r;for(;!e;){if(n>=256)throw new Error("Something went wrong storing data");const s=n.toString(16).padStart(2,"0")+ot(et(st(t).padStart(64,"0"),n));try{r=Q.fromX(!1,s),e=!0}catch(t){n+=1}}if(!r)throw new Error("Something went wrong storing data");return new V(r)}function ut(t){const e=t.point.getX().toString("hex").padStart(64,"0");const n=nt(e.slice(0,2),16,10);return ot((s=parseInt(n,10),(r=st(e.slice(2))).slice(-s)+r.slice(0,-s)));var r,s}function dt(t,e){return`m/44'/${function(t,e){if("testnet"===e||"regtest"===e)return"1";if("BTC"===t)return"0";if("LTC"===t)return"2";if("DOGE"===t)return"3";if("BCH"===t)return"145";if("BSV"===t)return"236";throw new Error(`Unsupported chain ${t}`)}(t,e)}'/0'/0/0`}const{PublicKey:ht,Script:lt}=t;function pt(t){if(t.length>Z.MAX_PUBKEYS_PER_SCRIPT)throw new Error("Too many owners");return function(t){const e=new lt;return e.add("OP_1"),t.forEach((t=>{e.add(t)})),e.add(`OP_${t.length}`),e.add("OP_CHECKMULTISIG"),e}(t.map((t=>t.toBuffer())))}function ft(t){return function(t){return t.chunks.filter((t=>t.buf)).map((t=>t.buf))}(t).map((t=>ht.fromBuffer(t)))}function gt(t){return Buffer.from(r.SHA256(t).toString(),"hex").toString("hex").substr(0,4)}function vt(t){return`${gt(t)};${t}`}function _t(t){const e=t.substr(0,4);const n=t.substr(5);if(!function(t,e){return gt(t)===e}(n,e))throw new Error("Decryption failure");return n}function wt(t){if(void 0!==t._readers){const{_readers:e,_url:i,_owners:c,_amount:a}=t,u=o(t,["_readers","_url","_owners","_amount"]);const d=function(t,e){const o=n.randomBytes(32).toString("hex");const i=function(t,e){if(!/^[0-9a-f]{64}$/.test(e))throw new Error("Invalid secret");const n=Buffer.from(e,"hex").toString("binary");const s=vt(t);return r.AES.encrypt(s,n).toString()}(t,o);const c=e.map((t=>function(t,e){if(!/^0[2-3][0-9a-f]{64}|04[0-9a-f]{128}$/.test(e))throw new Error("Invalid publicKey");const n=vt(t);return s.encrypt(e,Buffer.from(n,"utf8")).toString("base64")}(o,t)));return{__cypher:i,__secrets:c}}(JSON.stringify(u),e);return void 0!==i&&(d._url=i),void 0!==c&&(d._owners=c),void 0!==a&&(d._amount=a),d}return t}const{Transaction:mt}=t;const{Output:yt}=mt;const{UnspentOutput:bt}=mt;let Ot=class{constructor(t,e,n){const r=new mt(n);r.feePerKb(Z.FEE_PER_KB),this.nodeConfig=t,this.tx=r,this.outData=[],this.privateKey=e}get txId(){return this.tx.id}get chain(){return this.nodeConfig.chain}get network(){return this.nodeConfig.network}get restClient(){return new O(this.nodeConfig,this.privateKey)}get inputs(){return this.tx.inputs.map((t=>`${t.prevTxId.toString("hex")}/${t.outputIndex}`))}get inRevs(){const{enc:t}=this;let[e]=t;return e=Number.isFinite(e)?e:0,this.tx.inputs.slice(0,e).map((({prevTxId:t,outputIndex:e})=>`${t.toString("hex")}/${e}`))}get outRevs(){const{enc:t}=this;let[,e]=t;return e=Number.isFinite(e)?e:0,Array.from(Array(e).keys()).map((t=>`${this.tx.id}/${t}`))}get opReturns(){try{const{outputs:t}=this.tx;return t.filter((({script:t})=>t.isDataOut())).map((({script:t})=>t.getData())).map((t=>t.toString())).join()}catch(t){return""}}get enc(){return rt(this.opReturns.slice(0,Z.ENCODING_LENGTH*Z.ENCODING_NUMBER_LENGTH),Z.ENCODING_NUMBER_LENGTH).map(ct)}get dataPrefix(){return this.opReturns.slice(9)}getOwnerOutputs(){const{enc:t}=this;const[,e=0]=t;return this.tx.outputs.slice(0,e)}getDataOutputs(){const{enc:t}=this;const[,e,n]=t;return this.tx.outputs.slice(e,n)}getOutData(t){return c(this,void 0,void 0,(function*(){try{const e=this.getDataOutputs().map((t=>t.script)).map((t=>ft(t))).flat().map(ut).map(tt).join("");const{dataPrefix:n}=this;const i=JSON.parse(n+e);const a=t.toBuffer().toString("hex");const u=this.getOwnerOutputs();if(u.length!==i.length)throw new Error("Inconsistent state");const d=u.map(((t,e)=>Object.assign(Object.assign({},i[e]),{_owners:ft(t.script).map((t=>t.toString())),_amount:t.satoshis})));return Promise.all(d.map((e=>c(this,void 0,void 0,(function*(){try{const n=yield function(t){return e=>c(this,void 0,void 0,(function*(){if(function(t){return void 0!==t._url}(e)){const{_url:n}=e,r=o(e,["_url"]);const{host:s,data:i}=yield O.getSecretOutput({_url:n,privateKey:t});return Object.assign(Object.assign(Object.assign({},r),JSON.parse(i)),{_url:s})}return e}))}(t)(e);return function(t,e){if(function(t){return void 0!==t.__cypher&&void 0!==t.__secrets}(t)){const{__cypher:n,__secrets:i}=t,c=o(t,["__cypher","__secrets"]);return Object.assign(Object.assign(Object.assign({},c),JSON.parse(function({__cypher:t,__secrets:e},n){let o="";if(n.forEach((n=>{e.forEach((e=>{try{const i=function(t,e){if(!/^[0-9a-f]{64}$/.test(e))throw new Error("Invalid privateKey");return _t(s.decrypt(e,Buffer.from(t,"base64")).toString("utf8"))}(e,n);o=function(t,e){if(!/^[0-9a-f]{64}$/.test(e))throw new Error("Invalid secret");const n=Buffer.from(e,"hex").toString("binary");return _t(r.AES.decrypt(t,n).toString(r.enc.Utf8))}(t,i)}catch(t){const e=["Decryption failure","Unsupported state or unable to authenticate data"];if(t instanceof Error&&!e.includes(t.message))throw t}}))})),o)return o;throw new Error("Decryption failure")}({__cypher:n,__secrets:i},e))),{_readers:[]})}return t}(n,[a])}catch(t){return null}})))))}catch(t){return[]}}))}getOwners(){return this.getOwnerOutputs().map((t=>ft(t.script).map((t=>t.toString()))))}getAmounts(){return this.getOwnerOutputs().map((t=>t.satoshis))}spendFromData(e){return c(this,void 0,void 0,(function*(){if(!e.length)return;const n=e.map(b);const r=n.map((t=>t.txId));const s=yield this.restClient.getTransactions(r);for(let e=0;e<n.length;e+=1){const{txId:r,outputIndex:o}=n[e];const{outputs:i}=s[e];const c=i[o];const a=Math.round(c.satoshis);const u=new t.Script(c.script);const d=new bt({txId:r,outputIndex:o,satoshis:a,script:u});const h=ft(u).map((t=>t.toString()));this.tx.from([d],h,1)}}))}createOpReturnOut(t){this.tx.addData(JSON.stringify(t))}createDataOuts(e){e.forEach((({_amount:e,_owners:n=[]})=>{if(Array.isArray(n)&&n.length>Z.MAX_PUBKEYS_PER_SCRIPT)throw new Error("Too many owners.");const r=n.map((e=>t.PublicKey.fromString(e)));const s=e||Z.MIN_NON_DUST_AMOUNT;const o=pt(r);this.tx.addOutput(new yt({script:o,satoshis:s}))}));const n=e.map((t=>o(t,["_amount","_owners"])));const r=Z.MIN_NON_DUST_AMOUNT;const s=JSON.stringify(n);const i=Z.OP_RETURN_SIZE-Z.ENCODING_LENGTH*Z.ENCODING_NUMBER_LENGTH;const c=s.slice(0,i);const a=function(t){var e;return function(t,e){const n=[];for(let r=0;r<t.length;r+=e)n.push(t.slice(r,r+e));return n}(rt((e=t,Buffer.from(e).toString("hex")),62).map((t=>t.padStart(62,"0"))).map(at),Z.MAX_PUBKEYS_PER_SCRIPT).map((t=>pt(t)))}(s.slice(i));const u=it(this.tx.inputs.length)+it(this.tx.outputs.length)+it(this.tx.outputs.length+a.length);a.forEach((t=>{this.tx.addOutput(new yt({script:t,satoshis:r}))})),this.tx.addData(u+c)}static fromTxHex(t,e,n){return c(this,void 0,void 0,(function*(){const r=new this(e,n);r.tx.fromString(t);let s=[];let o=[];let i=[];try{s=yield r.getOutData(n)}catch(t){}try{o=r.getOwners()}catch(t){}try{i=r.getAmounts()}catch(t){}return r.outData=s.map(((t,e)=>Object.assign(Object.assign({},t),{_owners:o[e],_amount:i[e]}))),r}))}static fromTxId(t,e,n){return c(this,void 0,void 0,(function*(){const r=new O(e,n);const s=yield r.getRawTx(t);return this.fromTxHex(s,e,n)}))}};Ot=i([t=>t],Ot);class xt{constructor(t){this.wallet=t}get chain(){return this.wallet.chain}get network(){return this.wallet.network}get nodeConfig(){return this.wallet.nodeConfig}fromTxHex(t){return c(this,void 0,void 0,(function*(){const{wallet:e,nodeConfig:n}=this;const r=e.getPrivateKey();return Ot.fromTxHex(t,n,r)}))}fromTxId(t){return c(this,void 0,void 0,(function*(){const{wallet:e,nodeConfig:n}=this;const r=new O(n,e.getPrivateKey());const s=yield r.getRawTx(t);return this.fromTxHex(s)}))}get(t){return c(this,void 0,void 0,(function*(){const e=t.map(b);return Promise.all(e.map((({txId:t,outputIndex:e})=>c(this,void 0,void 0,(function*(){const{outData:n}=yield this.fromTxId(t);if(e>n.length)throw new Error("Index out of bounds");return n[e]})))))}))}put(t){return this.update([],t)}createTx(t,e){return c(this,void 0,void 0,(function*(){const{wallet:n,nodeConfig:r}=this;const s=n.getPrivateKey();const i=new Ot(r,s);const a=e.map((t=>{var{_owners:e}=t,n=o(t,["_owners"]);return Object.assign({_owners:e||[this.wallet.getPublicKey().toString()]},n)})).map(wt);const u=yield Promise.all(a.map(function(t){return e=>c(this,void 0,void 0,(function*(){if(void 0!==e._url){const{_url:n,_owners:r,_amount:s}=e,i=o(e,["_url","_owners","_amount"]);const c=yield O.setSecretOutput({host:n,secretOutput:{data:JSON.stringify(i)},privateKey:t});return void 0!==r&&(c._owners=r),void 0!==s&&(c._amount=s),c}return e}))}(s)));return yield i.spendFromData(t),yield i.createDataOuts(u),i}))}update(t,e){return c(this,void 0,void 0,(function*(){const n=yield this.createTx(t,e);return yield this.wallet.fundAndSendTransaction(n),n.outRevs}))}}class Et{constructor(t,e,n={}){const{chain:r,network:s}=e;const{path:o=dt(r,s),passphrase:i=""}=n;let c=t.toHDPrivateKey(i,s);o&&(c=c.derive(o));const a=c.publicKey.toAddress(s);this.mnemonic=t,this.restClient=e,this.path=o,this.passphrase=i,this.hdPrivateKey=c,this.address=a}get chain(){return this.restClient.chain}get network(){return this.restClient.network}get nodeConfig(){return this.restClient.nodeConfig}getMnemonic(){return this.mnemonic}derive(t="0"){const e=`${this.path}${this.path.length>0?"/":""}${t}`;return new Et(this.mnemonic,this.restClient,{path:e})}getPrivateKey(){return this.hdPrivateKey.privateKey}getPublicKey(){return this.hdPrivateKey.publicKey}getAddress(){return this.address}getBalance(){return c(this,void 0,void 0,(function*(){return this.restClient.getBalance(this.getAddress())}))}getUtxos(t=this.getAddress()){return c(this,void 0,void 0,(function*(){return this.restClient.getUtxosFromAddress(t)}))}selectUtxos(t,e){let n=0;const r=[];!function(t){const e=t;for(let t=e.length-1;t>0;t-=1){const n=Math.floor(Math.random()*(t+1));[e[t],e[n]]=[e[n],e[t]]}}(t);for(let s=0;s<t.length;s+=1){const o=t[s];if(n+=o.satoshis,r.push(o),n>=e)return r}const{network:s,chain:o}=this.restClient.nodeConfig;throw new Error(`Insufficient balance in address ${this.getAddress().toString()} on ${s} ${o}. Found ${n}, required ${e}.`)}fundAndSendTransaction(e){return c(this,void 0,void 0,(function*(){e.tx.feePerKb(Z.FEE_PER_KB);const{chain:n,network:r}=this.nodeConfig;const{enc:s}=e;const[,o=0]=s;const i=o*function(t){if("LTC"===t)return 8e3;if("BTC"===t)return 22;if("DOGE"===t)return 7e6;if("BCH"===t)return 2700;throw new Error(`Unsupported chain ${t}`)}(n);const c=.001*e.tx._getOutputAmount();const a=Math.max(Z.MIN_NON_DUST_AMOUNT,i+c);e.tx.to(function(t,e){const n={"any-testnet":"gLjNGbKQzxqKA9bv2nhn1Ewf7rxYVXgrtR","BTC-mainnet":"84ZHRqRPTcUv6AFGMVC1KmSUeC9Y8SNfMm","LTC-mainnet":"mov5ivrsqWut5ffZhiz18uAkwy2D4y98iz","DOGE-mainnet":"1MVukPYmWdbEoxy3Sqq1ES4nYqDfpB5e68","BCH-mainnet":"P9CmJszhvARfQc8YjUW1K2oBnus1ZQWEqk","BSV-mainnet":"G2wxQ74zX48WMo7sfiX1faGGNQB8ebVth"};return et("testnet"===e||"regtest"===e?n["any-testnet"]:n[`${t}-${e}`],19)}(n,r),Math.round(a));let u=e.tx._getInputAmount();const d=e.tx._getOutputAmount();const h=e.tx._estimateFee();let l=d-u+Math.round(h);if(l>0){const n=yield this.getUtxos();this.selectUtxos(n,l).forEach((n=>{e.tx.from([new t.Transaction.UnspentOutput(n)])})),u=e.tx._getInputAmount(),l=d-u+Math.round(e.tx._estimateFee())}return e.tx.change(this.getAddress()),e.tx.sign(this.getPrivateKey(),Z.SIGHASH_ALL),yield this.restClient.sendTransaction(e.tx.toString())}))}send(t,e){return c(this,void 0,void 0,(function*(){const n=new Ot(this.restClient.nodeConfig,this.getPrivateKey());return n.tx.to(e,t),this.fundAndSendTransaction(n)}))}}class St extends class{constructor(t,e){this.chain=t,this.network=e}}{constructor(t,e,n){super(t,e),this.url=n}}var jt={CHAIN:process.env.CHAIN||"LTC",NETWORK:process.env.NETWORK||"testnet",BCN_URL:process.env.BCN_URL||"https://node.bitcoincomputer.io"};const{Mnemonic:$t,PublicKey:Ct}=t;class Nt{constructor(t={}){var e,n;const{seed:r}=t;const s=(null===(e=t.chain)||void 0===e?void 0:e.toUpperCase())||jt.CHAIN;const o=(null===(n=t.network)||void 0===n?void 0:n.toLowerCase())||jt.NETWORK;const i=t.url||jt.BCN_URL;const c=t.passphrase||Z.PASSPHRASE;const a=t.path||dt(s,o);const u=t.mnemonic||new $t(r);if(!s||!["BTC","LTC","DOGE","BCH","BSV"].includes(s.toUpperCase()))throw new Error("We currently only support LTC.");if("LTC"!==s.toUpperCase()&&console.log("We currently only support LTC. If you would like to add support for your favorite\nvariant of Bitcoin have a look at\n\nhttps://github.com/bitcoin-computer/bitcoin-computer-node/tree/master/chain-setup\n\nSend us a pr and your cv if you can figure it out."),!o||!["mainnet","testnet","regtest"].includes(o.toLowerCase()))throw new Error("Please set 'network' to 'regtest', 'testnet', or 'mainnet'");const d=((t,e,n={})=>{const{path:r,passphrase:s}=n;let o=t.toHDPrivateKey(s,e);return r&&(o=o.derive(r)),o.privateKey})(u,o,{path:a,passphrase:c});const h=new St(s,o,i);const l=new O(h,d);this.db=t.db||new xt(new Et(u,l,{path:a,passphrase:c}))}get chain(){return this.db.chain}get network(){return this.db.network}parseContract(t){const e=t.startsWith("export ")?t.slice(7):t;const n=e.startsWith("default ")?e.slice(8):e;return a(`(${n})`)}new(t,e){return c(this,void 0,void 0,(function*(){const n=t.toString();const r=yield this.parseContract(n);const s=new q(this.db);const o=yield s.allocate(r,e);return new Proxy(o,s)}))}sync(t){return c(this,void 0,void 0,(function*(){y(t);const e=new J(this.db);const n=new q(this.db);const r=yield e.get(t);return new Proxy(r,n)}))}getOwnedRevs(t=this.db.wallet.getPublicKey()){return this.db.wallet.restClient.getOwnedRevs(t)}queryRevs(t){return c(this,void 0,void 0,(function*(){const{publicKey:e,contractName:n,contractHash:r}=t;const s=e?new Ct(e):void 0;return this.db.wallet.restClient.queryRevs({publicKey:s,contractName:n,contractHash:r})}))}getRevs(t=this.db.wallet.getPublicKey()){return c(this,void 0,void 0,(function*(){return(yield this.getOwnedRevs(t)).map((({rev:t})=>t))}))}getLatestRev(t){return c(this,void 0,void 0,(function*(){return this.db.wallet.restClient.getLatestRev(t)}))}getLatestRevs(t){return c(this,void 0,void 0,(function*(){return this.db.wallet.restClient.getLatestRevs(t)}))}}export{Nt as Computer};
