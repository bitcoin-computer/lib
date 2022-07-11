"use strict";var t=require("bitcoin-computer-bitcore");var e=require("chai");var n=require("exponential-backoff");var r=require("axios");require("child_process");var o=require("crypto");var s=require("crypto-js");var i=require("eciesjs");require("ses");var a=require("http");var c=require("https");var u=require("url");var d=require("util");function l(t){return t&&"object"==typeof t&&"default"in t?t:{default:t}}function p(t){if(t&&t.__esModule)return t;var e=Object.create(null);return t&&Object.keys(t).forEach((function(n){if("default"!==n){var r=Object.getOwnPropertyDescriptor(t,n);Object.defineProperty(e,n,r.get?r:{enumerable:!0,get:function(){return t[n]}})}})),e.default=t,Object.freeze(e)}var h=l(r);var f=l(o);var g=l(s);var v=p(i);var y=l(a);var m=l(c);var b=l(u);var w=l(d);function S(t,e){var n={};for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&e.indexOf(r)<0&&(n[r]=t[r]);if(null!=t&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(r=Object.getOwnPropertySymbols(t);o<r.length;o++)e.indexOf(r[o])<0&&Object.prototype.propertyIsEnumerable.call(t,r[o])&&(n[r[o]]=t[r[o]])}return n}function x(t,e,n,r){var o,s=arguments.length,i=s<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(t,e,n,r);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(i=(s<3?o(i):s>3?o(e,n,i):o(e,n))||i);return s>3&&i&&Object.defineProperty(e,n,i),i}function _(t,e,n,r){return new(n||(n=Promise))((function(o,s){function i(t){try{c(r.next(t))}catch(t){s(t)}}function a(t){try{c(r.throw(t))}catch(t){s(t)}}function c(t){var e;t.done?o(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(i,a)}c((r=r.apply(t,e||[])).next())}))}const{crypto:O}=t.Bitcoin;const T=(t,e)=>{const n=Date.now();const r=O.Hash.sha256(Buffer.from(e+n));const o=[O.ECDSA.sign(r,t,"big").toString("hex"),t.publicKey.toString(),n];return`Bearer ${Buffer.from(o.join(":")).toString("base64")}`};class E{constructor(t,e,n={}){this.baseUrl=t,this.headers=n,this.privateKey=e}get(t){return _(this,void 0,void 0,(function*(){const e=this.privateKey?{Authentication:T(this.privateKey,this.baseUrl)}:{};return(yield h.default.get(`${this.baseUrl}${t}`,{headers:Object.assign(Object.assign({},this.headers),e)})).data}))}post(t,e){return _(this,void 0,void 0,(function*(){const n=this.privateKey?{Authentication:T(this.privateKey,this.baseUrl)}:{};return(yield h.default.post(`${this.baseUrl}${t}`,e,{headers:Object.assign(Object.assign({},this.headers),n)})).data}))}delete(t){return _(this,void 0,void 0,(function*(){const e=this.privateKey?{Authentication:T(this.privateKey,this.baseUrl)}:{};return(yield h.default.delete(`${this.baseUrl}${t}`,{headers:Object.assign(Object.assign({},this.headers),e)})).data}))}}var C={CHAIN:process.env.CHAIN||"LTC",NETWORK:process.env.NETWORK||"testnet",BCN_URL:process.env.BCN_URL||"https://node.bitcoincomputer.io",RPC_USER:process.env.RPC_USER||"bcn-admin",RPC_PASSWORD:process.env.RPC_PASSWORD||"kH4nU5Okm6-uyC0_mA5ztVNacJqZbYd_KGLl6mx722A=",TEST_MNEMONICS:"travel upgrade inside soda birth essence junk merit never twenty system opinion;toddler hockey salute wheel harvest video narrow riot guitar lake sea call;cannon hour begin test replace fury motion squirrel envelope announce neck culture"};class P extends class{constructor({chain:t=C.CHAIN,network:e=C.NETWORK}={}){this.chain=t,this.network=e}}{constructor({chain:t=C.CHAIN,network:e=C.NETWORK,url:n=C.BCN_URL}={}){super({chain:t,network:e}),this.url=n}}const{PrivateKey:A,Transaction:N}=t.Bitcoin;const{UnspentOutput:B}=N;function R(t){if(!/^[0-9A-Fa-f]{64}$/.test(t))throw new Error(`Invalid txId: ${t}`)}function I(t){if(!/^[0-9A-Fa-f]{64}\/\d+$/.test(t))throw new Error(`Invalid outId: ${t}`)}function K(t){I(t);const[e,n]=t.split("/");return{txId:e,outputIndex:parseInt(n,10)}}let k=class{constructor({nodeConfig:t=new P,privateKey:e=new A}={}){this.nodeConfig=t,this.bcn=new E(t.url,e)}get chain(){return this.nodeConfig.chain}get network(){return this.nodeConfig.network}get url(){return this.nodeConfig.url}getBalance(t){return _(this,void 0,void 0,(function*(){const{chain:e,network:n}=this;return yield this.bcn.get(`/v1/${e}/${n}/address/${t}/balance`)}))}getTransactions(t){return _(this,void 0,void 0,(function*(){return(yield this.getRawTxs(t)).map((t=>new N(t)))}))}getRawTxs(t){return _(this,void 0,void 0,(function*(){t.map(R);const{chain:e,network:n}=this;return this.bcn.post(`/v1/${e}/${n}/tx/bulk/`,{txIds:t})}))}sendTransaction(t){return _(this,void 0,void 0,(function*(){return this.bcn.post(`/v1/${this.chain}/${this.network}/tx/send`,{rawTx:t})}))}getUtxosByAddress(t){return _(this,void 0,void 0,(function*(){const{chain:e,network:n}=this;return(yield this.bcn.get(`/v1/${e}/${n}/wallet/${t.toString()}/utxos`)).map((({rev:t,scriptPubKey:e,satoshis:n})=>{const[r,o]=t.split("/");return new B({txId:r,outputIndex:parseInt(o,10),satoshis:n,script:e})}))}))}query({publicKey:t,classHash:e}){return _(this,void 0,void 0,(function*(){if(void 0===t&&void 0===e)throw new Error("Query parameters cannot be empty.");let n="";t&&(n+=`?publicKey=${t}`),e&&(n+=0===n.length?"?":"&",n+=`classHash=${e}`);const{chain:r,network:o}=this;return this.bcn.get(`/v1/${r}/${o}/non-standard-utxos${n}`)}))}idsToRevs(t){return _(this,void 0,void 0,(function*(){t.map(I);const{chain:e,network:n}=this;return this.bcn.post(`/v1/${e}/${n}/revs`,{ids:t})}))}callRPC(t,e){return _(this,void 0,void 0,(function*(){return this.bcn.post(`/v1/${this.chain}/${this.network}/rpc`,{method:t,params:e})}))}static getSecretOutput({_url:t,privateKey:e}){return _(this,void 0,void 0,(function*(){const n=t.split("/");const r=n[n.length-1];const o=n.slice(0,-2).join("/");const s=new E(o,e);return{host:o,data:yield s.get(`/v1/store/${r}`)}}))}static setSecretOutput({secretOutput:t,host:e,privateKey:n}){return _(this,void 0,void 0,(function*(){return new E(e,n).post("/v1/store/",t)}))}static deleteSecretOutput({_url:t,privateKey:e}){return _(this,void 0,void 0,(function*(){const n=t.split("/");const r=n[n.length-1];const o=n.slice(0,-2).join("/");const s=new E(o,e);yield s.delete(`/v1/store/${r}`)}))}};k=x([t=>t],k);const U=parseInt(process.env.BC_DUST_LIMIT||"",10)||1546;const j=parseInt(process.env.BC_DEFAULT_FEE||"",10)||2500;var H={MIN_NON_DUST_AMOUNT:U,SCRIPT_CHUNK_SIZE:parseInt(process.env.BC_SCRIPT_CHUNK_SIZE||"",10)||479,DEFAULT_FEE:j,SIGHASH_ALL:1,FEE_PER_KB:2e4,PUBLIC_KEY_SIZE:65,ANYONE_CAN_SPEND_MNEMONIC:"replace this seed",PASSPHRASE:"",ENCODING_LENGTH:3,ENCODING_NUMBER_LENGTH:3,MAX_PUBKEYS_PER_SCRIPT:3,OP_RETURN_SIZE:80,CHANGE_OUTPUT_MAX_SIZE:62};const{PublicKey:M,crypto:$}=t.Bitcoin;const{Point:D}=$;function L(t){return Buffer.from(t,"hex").toString().replace(/\0/g,"")}function F(t,e){return t.slice(e)+t.slice(0,e)}function q(t,e,n){if(t.length*Math.log2(e)>53)throw new Error(`Input too large ${t.length} ${Math.log2(e)}`);if(![2,10,16].includes(e)||![2,10,16].includes(n))throw new Error("ToBase or FromBase invalid in covertNumber.");if(2===e&&t.length%8!=0)throw new Error("Binary strings must be byte aligned.");if(16===e&&t.length%2!=0)throw new Error("Hex strings must be of even length.");const r=parseInt(t,e).toString(n);return 2===n?r.padStart(8*Math.ceil(r.length/8),"0"):16===n?r.padStart(2*Math.ceil(r.length/2),"0"):r}function W(t,e){const n=new RegExp(`.{1,${e}}`,"g");return t.match(n)||[]}function G(t){return W(t,2).map((t=>q(t,16,2))).join("")}function J(t){return W(t,8).map((t=>q(t,2,16))).join("")}function Y(t){return t.toString(16).padStart(H.ENCODING_NUMBER_LENGTH,"0")}function z(t){return parseInt(t,16)}function X(t){if(62!==t.length)throw new Error("Input to hexToPublicKey must be of length 62");let e=!1;let n=0;let r;for(;!e;){if(n>=256)throw new Error("Something went wrong storing data");const o=n.toString(16).padStart(2,"0")+J(F(G(t).padStart(64,"0"),n));try{r=D.fromX(!1,o),e=!0}catch(t){n+=1}}if(!r)throw new Error("Something went wrong storing data");return new M(r)}function Z(t){const e=t.point.getX().toString("hex").padStart(64,"0");const n=q(e.slice(0,2),16,10);return J((o=parseInt(n,10),(r=G(e.slice(2))).slice(-o)+r.slice(0,-o)));var r,o}function V(t){return new Promise((e=>{setTimeout(e,t)}))}function Q(t=C.CHAIN,e=C.NETWORK){if("testnet"===e||"regtest"===e)return 1;if("BTC"===t)return 0;if("LTC"===t)return 2;if("DOGE"===t)return 3;if("BCH"===t)return 145;if("BSV"===t)return 236;throw new Error(`Unsupported chain ${t}`)}function tt({purpose:t=44,coinType:e=2,account:n=0}={}){return`m/${t.toString()}'/${e.toString()}'/${n.toString()}'`}function et(t=C.CHAIN,e=C.NETWORK){return tt({coinType:Q(t,e)})}function nt(){return Math.round(Math.random()*Math.pow(2,31))}function rt({chain:t=C.CHAIN,network:e=C.NETWORK,account:n=nt()}={}){return tt({account:n,coinType:Q(t,e)})}const{PublicKey:ot,Script:st}=t.Bitcoin;function at(t){if(t.length>H.MAX_PUBKEYS_PER_SCRIPT)throw new Error("Too many owners");return function(t){const e=new st;return e.add("OP_1"),t.forEach((t=>{e.add(t)})),e.add(`OP_${t.length}`),e.add("OP_CHECKMULTISIG"),e}(t.map((t=>t.toBuffer())))}function ct(t){return function(t){return t.chunks.filter((t=>t.buf)).map((t=>t.buf))}(t).map((t=>ot.fromBuffer(t)))}function ut(t){return Buffer.from(g.default.SHA256(t).toString(),"hex").toString("hex").substr(0,4)}function dt(t){return`${ut(t)};${t}`}function lt(t){const e=t.substr(0,4);const n=t.substr(5);if(!function(t,e){return ut(t)===e}(n,e))throw new Error("Decryption failure");return n}function pt(t){if(void 0!==t._readers){const{_readers:e,_url:n,_owners:r,_amount:o}=t,s=S(t,["_readers","_url","_owners","_amount"]);const i=function(t,e){const n=f.default.randomBytes(32).toString("hex");const r=function(t,e){if(!/^[0-9a-f]{64}$/.test(e))throw new Error("Invalid secret");const n=Buffer.from(e,"hex").toString("binary");const r=dt(t);return g.default.AES.encrypt(r,n).toString()}(t,n);const o=e.map((t=>function(t,e){if(!/^0[2-3][0-9a-f]{64}|04[0-9a-f]{128}$/.test(e))throw new Error("Invalid publicKey");const n=dt(t);return v.encrypt(e,Buffer.from(n,"utf8")).toString("base64")}(n,t)));return{__cypher:r,__secrets:o}}(JSON.stringify(s),e);return void 0!==n&&(i._url=n),void 0!==r&&(i._owners=r),void 0!==o&&(i._amount=o),i}return t}const{Transaction:ht}=t.Bitcoin;const{Output:ft}=ht;const{UnspentOutput:gt}=ht;let vt=class{constructor(t,e,n){const r=new ht(n);r.feePerKb(H.FEE_PER_KB),this.nodeConfig=t,this.tx=r,this.outData=[],this.privateKey=e}get txId(){return this.tx.id}get chain(){return this.nodeConfig.chain}get network(){return this.nodeConfig.network}get restClient(){const{nodeConfig:t,privateKey:e}=this;return new k({nodeConfig:t,privateKey:e})}get inputs(){return this.tx.inputs.map((t=>`${t.prevTxId.toString("hex")}/${t.outputIndex}`))}get inRevs(){const{enc:t}=this;let[e]=t;return e=Number.isFinite(e)?e:0,this.tx.inputs.slice(0,e).map((({prevTxId:t,outputIndex:e})=>`${t.toString("hex")}/${e}`))}get outRevs(){const{enc:t}=this;let[,e]=t;return e=Number.isFinite(e)?e:0,Array.from(Array(e).keys()).map((t=>`${this.tx.id}/${t}`))}get opReturns(){try{const{outputs:t}=this.tx;return t.filter((({script:t})=>t.isDataOut())).map((({script:t})=>t.getData())).map((t=>t.toString())).join()}catch(t){return""}}get enc(){return W(this.opReturns.slice(0,H.ENCODING_LENGTH*H.ENCODING_NUMBER_LENGTH),H.ENCODING_NUMBER_LENGTH).map(z)}get dataPrefix(){return this.opReturns.slice(9)}isFullyFunded(){return this.tx._getInputAmount()-this.tx._getOutputAmount()>=this.tx.getFee()}getOwnerOutputs(){const{enc:t}=this;const[,e=0]=t;return this.tx.outputs.slice(0,e)}getDataOutputs(){const{enc:t}=this;const[,e,n]=t;return this.tx.outputs.slice(e,n)}getOutData(t){return _(this,void 0,void 0,(function*(){try{const e=this.getDataOutputs().map((t=>t.script)).map((t=>ct(t))).flat().map(Z).map(L).join("");const{dataPrefix:n}=this;const r=JSON.parse(n+e);const o=t.toBuffer().toString("hex");const s=this.getOwnerOutputs();if(s.length!==r.length)throw new Error("Inconsistent state");const i=s.map(((t,e)=>Object.assign(Object.assign({},r[e]),{_owners:ct(t.script).map((t=>t.toString())),_amount:t.satoshis})));return Promise.all(i.map((e=>_(this,void 0,void 0,(function*(){try{const n=yield function(t){return e=>_(this,void 0,void 0,(function*(){if(function(t){return void 0!==t._url}(e)){const{_url:n}=e,r=S(e,["_url"]);const{host:o,data:s}=yield k.getSecretOutput({_url:n,privateKey:t});return Object.assign(Object.assign(Object.assign({},r),JSON.parse(s)),{_url:o})}return e}))}(t)(e);return function(t,e){if(function(t){return void 0!==t.__cypher&&void 0!==t.__secrets}(t)){const{__cypher:n,__secrets:r}=t,o=S(t,["__cypher","__secrets"]);return Object.assign(Object.assign(Object.assign({},o),JSON.parse(function({__cypher:t,__secrets:e},n){let r="";if(n.forEach((n=>{e.forEach((e=>{try{const o=function(t,e){if(!/^[0-9a-f]{64}$/.test(e))throw new Error("Invalid privateKey");return lt(v.decrypt(e,Buffer.from(t,"base64")).toString("utf8"))}(e,n);r=function(t,e){if(!/^[0-9a-f]{64}$/.test(e))throw new Error("Invalid secret");const n=Buffer.from(e,"hex").toString("binary");return lt(g.default.AES.decrypt(t,n).toString(g.default.enc.Utf8))}(t,o)}catch(t){const e=["Decryption failure","Unsupported state or unable to authenticate data"];if(t instanceof Error&&!e.includes(t.message))throw t}}))})),r)return r;throw new Error("Decryption failure")}({__cypher:n,__secrets:r},e))),{_readers:[]})}return t}(n,[o])}catch(t){return null}})))))}catch(t){return[]}}))}getOwners(){return this.getOwnerOutputs().map((t=>ct(t.script).map((t=>t.toString()))))}getAmounts(){return this.getOwnerOutputs().map((t=>t.satoshis))}spendFromData(e){return _(this,void 0,void 0,(function*(){if(!e.length)return;const n=e.map(K);const r=n.map((t=>t.txId));const o=yield this.restClient.getTransactions(r);for(let e=0;e<n.length;e+=1){const{txId:r,outputIndex:s}=n[e];const{outputs:i}=o[e];const a=i[s];const c=Math.round(a.satoshis);const u=new t.Bitcoin.Script(a.script);const d=new gt({txId:r,outputIndex:s,satoshis:c,script:u});const l=ct(u).map((t=>t.toString()));this.tx.from([d],l,1)}}))}createDataOuts(e){e.forEach((({_amount:e,_owners:n=[]})=>{if(Array.isArray(n)&&n.length>H.MAX_PUBKEYS_PER_SCRIPT)throw new Error("Too many owners.");const r=n.map((e=>t.Bitcoin.PublicKey.fromString(e)));const o=e||H.MIN_NON_DUST_AMOUNT;const s=at(r);this.tx.addOutput(new ft({script:s,satoshis:o}))}));const n=e.map((t=>S(t,["_amount","_owners"])));const r=H.MIN_NON_DUST_AMOUNT;const o=JSON.stringify(n);const s=H.OP_RETURN_SIZE-H.ENCODING_LENGTH*H.ENCODING_NUMBER_LENGTH;const i=o.slice(0,s);const a=function(t){var e;return function(t,e){const n=[];for(let r=0;r<t.length;r+=e)n.push(t.slice(r,r+e));return n}(W((e=t,Buffer.from(e).toString("hex")),62).map((t=>t.padStart(62,"0"))).map(X),H.MAX_PUBKEYS_PER_SCRIPT).map((t=>at(t)))}(o.slice(s));const c=Y(this.tx.inputs.length)+Y(this.tx.outputs.length)+Y(this.tx.outputs.length+a.length);a.forEach((t=>{this.tx.addOutput(new ft({script:t,satoshis:r}))})),this.tx.addData(c+i)}static fromTxHex(t,e,n){return _(this,void 0,void 0,(function*(){let r=[];let o=[];let s=[];const i=new this(e,n);i.tx.fromString(t);try{r=yield i.getOutData(n)}catch(t){}try{o=i.getOwners()}catch(t){}try{s=i.getAmounts()}catch(t){}return i.outData=r.map(((t,e)=>Object.assign(Object.assign({},t),{_owners:o[e],_amount:s[e]}))),i}))}static fromTxId(t,e,n){return _(this,void 0,void 0,(function*(){const r=new k({nodeConfig:e,privateKey:n});const[o]=yield r.getRawTxs([t]);return this.fromTxHex(o,e,n)}))}};vt=x([t=>t],vt);const{CHAIN:yt="LTC",NETWORK:mt="regtest",RPC_USER:bt,RPC_PASSWORD:wt,RPC_HOST:St}=process.env;const xt="LTC"===process.env.CHAIN?19332:8332;var _t=Object.assign(Object.assign({},C),{CHAIN:yt,NETWORK:mt,BCN_URL:"http://127.0.0.1:3000",RPC_PROTOCOL:"http",RPC_USER:bt,RPC_PASSWORD:wt,RPC_HOST:St,RPC_PORT:xt,TEST_ADDRESSES:"mwADSUHvPCGrrX4ozP8Kcd5JCWK93rnc8h;moMoH1vTgCc2dkDfGSKYPnafxy22wSqgrr;mmQEk8VwtSehRryLF8jhVapYg553hJGhNa;miKQVhZbFKSsJcQZ8eXwBQ89xNyetpN34q;mzoGRNh55y9j57TPdwRGi3nt9X4CFwpqUS;n1X6JFDyxibtdhYrc7mrkuft6o168ELFNW;mjLcig6eTZVJkgRgJFMkwrYHpfMnZ1t4kk;mfYkMQAe7afeRSkgLxAtwnMVryjLTfr95Q"});class Ot{constructor({mnemonic:e=new t.Bitcoin.Mnemonic,nodeConfig:n=new P,path:r=et(),passphrase:o=""}={}){this.passphrase=o,this.mnemonic=e,this.path=r,this.nodeConfig=n}get chain(){return this.nodeConfig.chain}get network(){return this.nodeConfig.network}get url(){return this.nodeConfig.url}get restClient(){const{nodeConfig:t,privateKey:e}=this;return new k({nodeConfig:t,privateKey:e})}get address(){return this._address=this._address||this.publicKey.toAddress(this.nodeConfig.network),this._address}derive(t="0"){const e=`${this.path}${this.path.length>0?"/":""}${t}`;const{mnemonic:n,nodeConfig:r,passphrase:o}=this;return new Ot({mnemonic:n,nodeConfig:r,path:e,passphrase:o})}get hdPrivateKey(){return this._hdPrivateKey=this._hdPrivateKey||this.mnemonic.toHDPrivateKey(this.passphrase,this.network).deriveChild(this.path),this._hdPrivateKey}get privateKey(){return this.hdPrivateKey.privateKey}get publicKey(){return this.hdPrivateKey.publicKey}getBalance(){return _(this,void 0,void 0,(function*(){return this.restClient.getBalance(this.address)}))}getUtxosByAmount(t){return _(this,void 0,void 0,(function*(){const e=yield this.restClient.getUtxosByAddress(this.address);let n=0;const r=[];!function(t){const e=t;for(let t=e.length-1;t>0;t-=1){const n=Math.floor(Math.random()*(t+1));[e[t],e[n]]=[e[n],e[t]]}}(e);for(const o of e)if(n+=o.satoshis,r.push(o),n>=t)return r;const{network:o,chain:s}=this.restClient.nodeConfig;const i=this.address.toString();throw new Error(`Insufficient balance in address ${i} on ${o} ${s}. Found ${n}, required ${t}.`)}))}fundAndSendTx(e){return _(this,void 0,void 0,(function*(){e.tx.feePerKb(2*H.FEE_PER_KB);const n=e.tx.outputs.length;e.tx.to(function(t,e){const n={"any-testnet":"uTKUDCkpo12vstJBsMWmrTPz9wFE6DuzGH","BTC-mainnet":"igpnnoLziUyxtQuWYCP13gHYVhUru6iLaY","LTC-mainnet":"t77o829ngHnuUorwDkf129fL6ERLFNqKG8","DOGE-mainnet":"XfNRUdvrv6uCDbCF5xJ18UYwVkkefkXvEd","BCH-mainnet":"CSAkkS8Mro9mYRqhksS1FyYrsnSE5MVQ5m"};return F("testnet"===e||"regtest"===e?n["any-testnet"]:n[`${t}-${e}`],19)}(this.nodeConfig.chain,this.nodeConfig.network),0);const r=yield this.restClient.getUtxosByAddress(this.address);if(e.tx.change(this.address),0===r.length){const{address:t}=this;throw new Error(`Insufficient balance in address ${t}.`)}let o=0;let s=0;let i=0;do{const[n]=r.splice(0,1);e.tx.from([new t.Bitcoin.Transaction.UnspentOutput(n)]),e.tx.sign(this.privateKey,H.SIGHASH_ALL),s=e.tx.toString().length,e.tx.fee(s*H.FEE_PER_KB*2),e.tx._updateChangeOutput(),i=e.tx._getInputAmount()-e.tx._getOutputAmount(),o=i/s*1e3}while(0!==r.length&&o<2*H.FEE_PER_KB);if(o<2*H.FEE_PER_KB&&0===r.length){const{address:t}=this;throw new Error(`Insufficient balance in address ${t}. Current fee_per_kb ${o}`)}if(s=e.tx.toString().length,i=Math.ceil(s/1e3*H.FEE_PER_KB),e.tx.fee(i),e.tx.outputs[n].satoshis=i,e.tx._outputAmount=void 0,e.tx.feePerKb(H.FEE_PER_KB),e.tx._outputAmount=void 0,e.tx._updateChangeOutput(),!1===e.isFullyFunded()||!1===e.tx.verify())throw new Error(`Something went wrong. Address ${this.address}. Transaction: ${JSON.stringify(e.tx,null,2)}`);return e.tx.sign(this.privateKey,H.SIGHASH_ALL),this.restClient.sendTransaction(e.tx.toString())}))}send(t,e){return _(this,void 0,void 0,(function*(){const{privateKey:n,nodeConfig:r}=this;const o=new vt(r,n);return o.tx.to(e,t),this.fundAndSendTx(o)}))}}class Tt{constructor({wallet:t=new Ot}={}){this.wallet=t}get chain(){return this.wallet.chain}get network(){return this.wallet.network}get nodeConfig(){return this.wallet.nodeConfig}fromTxHex(t){return _(this,void 0,void 0,(function*(){const{wallet:e,nodeConfig:n}=this;const{privateKey:r}=e;return vt.fromTxHex(t,n,r)}))}fromTxId(t){return _(this,void 0,void 0,(function*(){const{wallet:e,nodeConfig:n}=this;const{privateKey:r}=e;const o=new k({nodeConfig:n,privateKey:r});const[s]=yield o.getRawTxs([t]);return this.fromTxHex(s)}))}get(t){return _(this,void 0,void 0,(function*(){const e=t.map(K);return Promise.all(e.map((({txId:t,outputIndex:e})=>_(this,void 0,void 0,(function*(){const{outData:n}=yield this.fromTxId(t);if(e>n.length)throw new Error("Index out of bounds");return n[e]})))))}))}put(t){return this.update([],t)}createTx(t,e){return _(this,void 0,void 0,(function*(){const{wallet:n,nodeConfig:r}=this;const{privateKey:o}=n;const s=new vt(r,o);const i=e.map((t=>{var{_owners:e}=t,n=S(t,["_owners"]);return Object.assign({_owners:e||[this.wallet.publicKey.toString()]},n)})).map(pt);const a=yield Promise.all(i.map(function(t){return e=>_(this,void 0,void 0,(function*(){if(void 0!==e._url){const{_url:n,_owners:r,_amount:o}=e,s=S(e,["_url","_owners","_amount"]);const i=yield k.setSecretOutput({host:n,secretOutput:{data:JSON.stringify(s)},privateKey:t});return void 0!==r&&(i._owners=r),void 0!==o&&(i._amount=o),i}return e}))}(o)));return yield s.spendFromData(t),yield s.createDataOuts(a),s}))}update(t,e){return _(this,void 0,void 0,(function*(){const n=yield this.createTx(t,e);return yield this.wallet.fundAndSendTx(n),n.outRevs}))}}var Et=y.default;var Ct=m.default;var Pt=b.default;function At(t){"string"==typeof t&&(t=function(t){var e=Pt.parse(t);var n=e.hostname;var r=parseInt(e.port,10);var o=e.protocol;o=o.substring(0,o.length-1);var s=e.auth.split(":");return{host:n,port:r,protocol:o,user:s[0]?decodeURIComponent(s[0]):null,pass:s[1]?decodeURIComponent(s[1]):null}}(t)),t=t||{},this.host=t.host||"127.0.0.1",this.port=t.port||8332,this.user=t.user||"user",this.pass=t.pass||"pass",this.protocol="http"===t.protocol?Et:Ct,this.batchedCalls=null,this.disableAgent=t.disableAgent||!1;var e=void 0!==t.rejectUnauthorized;this.rejectUnauthorized=!e||t.rejectUnauthorized,At.config.log?this.log=At.config.log:this.log=At.loggers[At.config.logger||"normal"]}var Nt=console.log.bind(console);var Bt=function(){};function Rt(t,e){var n=this;t=JSON.stringify(t);var r=this.user+":"+this.pass;var o=Buffer.from&&Buffer.from!==Uint8Array.from?Buffer.from(r):new Buffer(r);this.auth=o.toString("base64");var s={host:n.host,path:"/",method:"POST",port:n.port,rejectUnauthorized:n.rejectUnauthorized,agent:!n.disableAgent&&void 0};if(n.httpOptions)for(var i in n.httpOptions)s[i]=n.httpOptions[i];var a=!1;var c="Bitcoin JSON-RPC: ";var u=this.protocol.request(s,(function(t){var r="";t.on("data",(function(t){r+=t})),t.on("end",(function(){if(!a)if(a=!0,401!==t.statusCode)if(403!==t.statusCode){if(500===t.statusCode&&"Work queue depth exceeded"===r.toString("utf8")){var o=new Error("Bitcoin JSON-RPC: "+r.toString("utf8"));return o.code=429,void e(o)}var s;try{s=JSON.parse(r)}catch(o){n.log.err(o.stack),n.log.err(r),n.log.err("HTTP Status code:"+t.statusCode);var i=new Error(c+"Error Parsing JSON: "+o.message);return void e(i)}e(s.error,s)}else e(new Error(c+"Connection Rejected: 403 Forbidden"));else e(new Error(c+"Connection Rejected: 401 Unnauthorized"))}))}));u.on("error",(function(t){var n=new Error(c+"Request Error: "+t.message);a||(a=!0,e(n))})),u.setHeader("Content-Length",t.length),u.setHeader("Content-Type","application/json"),u.setHeader("Authorization","Basic "+n.auth),u.write(t),u.end()}At.loggers={none:{info:Bt,warn:Bt,err:Bt,debug:Bt},normal:{info:Nt,warn:Nt,err:Nt,debug:Bt},debug:{info:Nt,warn:Nt,err:Nt,debug:Nt}},At.config={logger:"normal"},At.prototype.batch=function(t,e){this.batchedCalls=[],t(),Rt.call(this,this.batchedCalls,e),this.batchedCalls=null},At.callspec={abandonTransaction:"str",abortRescan:"",addMultiSigAddress:"",addNode:"",analyzePSBT:"str",backupWallet:"",bumpFee:"str",clearBanned:"",combinePSBT:"obj",combineRawTransaction:"obj",convertToPSBT:"str",createMultiSig:"",createPSBT:"obj",createRawTransaction:"obj obj",createWallet:"str",decodePSBT:"str",decodeScript:"str",decodeRawTransaction:"",deriveAddresses:"str",disconnectNode:"",dumpPrivKey:"",dumpWallet:"str",encryptWallet:"",enumerateSigners:"",estimateFee:"",estimateSmartFee:"int str",estimatePriority:"int",generate:"int",generateBlock:"str obj",generateToAddress:"int str",generateToDescriptor:"int str",getAccount:"",getAccountAddress:"str",getAddedNodeInfo:"",getAddressMempool:"obj",getAddressUtxos:"obj",getAddressBalance:"obj",getAddressDeltas:"obj",getAddressesByLabel:"str",getAddressInfo:"str",getAddressTxids:"obj",getAddressesByAccount:"",getBalance:"str int",getBalances:"",getBestBlockHash:"",getBlockDeltas:"str",getBlock:"str int",getBlockchainInfo:"",getBlockCount:"",getBlockFilter:"str",getBlockHashes:"int int obj",getBlockHash:"int",getBlockHeader:"str",getBlockNumber:"",getBlockStats:"str",getBlockTemplate:"",getConnectionCount:"",getChainTips:"",getChainTxStats:"",getDescriptorInfo:"str",getDifficulty:"",getGenerate:"",getHashesPerSec:"",getIndexInfo:"",getInfo:"",getMemoryInfo:"",getMemoryPool:"",getMemPoolAncestors:"str",getMemPoolDescendants:"str",getMemPoolEntry:"str",getMemPoolInfo:"",getMiningInfo:"",getNetTotals:"",getNetworkHashPS:"",getNetworkInfo:"",getNewAddress:"str str",getNodeAddresses:"",getPeerInfo:"",getRawChangeAddress:"",getRawMemPool:"bool",getRawTransaction:"str int",getReceivedByAccount:"str int",getReceivedByAddress:"str int",getReceivedByLabel:"str",getRpcInfo:"",getSpentInfo:"obj",getTransaction:"",getTxOut:"str int bool",getTxOutProof:"",getTxOutSetInfo:"",getUnconfirmedBalance:"",getWalletInfo:"",getWork:"",getZmqNotifications:"",finalizePSBT:"str",fundRawTransaction:"str",help:"",importAddress:"str str bool",importDescriptors:"str",importMulti:"obj obj",importPrivKey:"str str bool",importPrunedFunds:"str, str",importPubKey:"str",importWallet:"str",invalidateBlock:"str",joinPSBTs:"obj",keyPoolRefill:"",listAccounts:"int",listAddressGroupings:"",listBanned:"",listDescriptors:"",listLabels:"",listLockUnspent:"bool",listReceivedByAccount:"int bool",listReceivedByAddress:"int bool",listReceivedByLabel:"",listSinceBlock:"str int",listTransactions:"str int int",listUnspent:"int int",listWalletDir:"",listWallets:"",loadWallet:"str",lockUnspent:"",logging:"",move:"str str float int str",ping:"",preciousBlock:"str",prioritiseTransaction:"str float int",pruneBlockChain:"int",psbtBumpFee:"str",removePrunedFunds:"str",reScanBlockChain:"",saveMemPool:"",send:"obj",setHDSeed:"",setLabel:"str str",setWalletFlag:"str",scanTxOutSet:"str",sendFrom:"str str float int str str",sendMany:"str obj int str",sendRawTransaction:"str",sendToAddress:"str float str str",setAccount:"",setBan:"str str",setNetworkActive:"bool",setGenerate:"bool int",setTxFee:"float",signMessage:"",signMessageWithPrivKey:"str str",signRawTransaction:"",signRawTransactionWithKey:"str obj",signRawTransactionWithWallet:"str",stop:"",submitBlock:"str",submitHeader:"str",testMemPoolAccept:"obj",unloadWallet:"",upgradeWallet:"",uptime:"",utxoUpdatePSBT:"str",validateAddress:"",verifyChain:"",verifyMessage:"",verifyTxOutProof:"str",walletCreateFundedPSBT:"",walletDisplayAddress:"str",walletLock:"",walletPassPhrase:"string int",walletPassphraseChange:"",walletProcessPSBT:"str"};var It=function(t,e,n){return Array.prototype.slice.call(t,e,n)};function Kt(){return parseInt(1e5*Math.random())}!function(t,e,n){function r(t,e){return function(){var r=arguments.length-1;this.batchedCalls&&(r=arguments.length);for(var o=0;o<r;o++)e[o]&&(arguments[o]=e[o](arguments[o]));this.batchedCalls?this.batchedCalls.push({jsonrpc:"2.0",method:t,params:It(arguments),id:Kt()}):n.call(this,{method:t,params:It(arguments,0,arguments.length-1),id:Kt()},arguments[arguments.length-1])}}var o={str:function(t){return t.toString()},int:function(t){return parseFloat(t)},float:function(t){return parseFloat(t)},bool:function(t){return!0===t||"1"==t||"true"==t||"true"==t.toString().toLowerCase()},obj:function(t){return"string"==typeof t?JSON.parse(t):t}};for(var s in e){var i=[];if(e[s].length){i=e[s].split(" ");for(var a=0;a<i.length;a++)o[i[a]]?i[a]=o[i[a]]:i[a]=o.str}var c=s.toLowerCase();t.prototype[s]=r(c,i),t.prototype[c]=t.prototype[s]}}(At,At.callspec,Rt);var kt=At;const Ut=new kt({protocol:process.env.RPC_PROTOCOL,user:process.env.RPC_USER,pass:process.env.RPC_PASSWORD,host:process.env.RPC_HOST,port:process.env.RPC_PORT});const jt={createwallet:w.default.promisify(kt.prototype.createwallet.bind(Ut)),getaddressinfo:w.default.promisify(kt.prototype.getaddressinfo.bind(Ut)),getBlock:w.default.promisify(kt.prototype.getBlock.bind(Ut)),getBlockchainInfo:w.default.promisify(kt.prototype.getBlockchainInfo.bind(Ut)),getBlockHash:w.default.promisify(kt.prototype.getBlockHash.bind(Ut)),generateToAddress:w.default.promisify(kt.prototype.generateToAddress.bind(Ut)),getRawTransaction:w.default.promisify(kt.prototype.getRawTransaction.bind(Ut)),importaddress:w.default.promisify(kt.prototype.importaddress.bind(Ut)),listunspent:w.default.promisify(kt.prototype.listunspent.bind(Ut)),sendRawTransaction:w.default.promisify(kt.prototype.sendRawTransaction.bind(Ut))};const{PrivateKey:Ht,Opcode:Mt,Script:$t,Mnemonic:Dt,crypto:Lt,Transaction:Ft,encoding:qt}=t.Bitcoin;const{CHAIN:Wt,NETWORK:Gt,TEST_MNEMONICS:Jt}=C;function Yt(t=0){return new Dt(function(t=0){return Jt.split(";")[t]}(t))}function zt(t=0){return function(t=0){return Yt().toHDPrivateKey("",Gt).derive(rt({account:t}))}(t).privateKey}function Xt(t=0){return function(t=0){return zt(t).toPublicKey()}(t).toAddress()}new P;const Zt=({path:t=et()}={})=>_(void 0,void 0,void 0,(function*(){const e=Yt();const n=new Ot({mnemonic:e,path:t});const r=new Tt({wallet:n});const[o]=yield r.put([{a:1}]);const[s]=o.split("/");return s}));const Vt=({random:t=!1}={})=>_(void 0,void 0,void 0,(function*(){const e=t?rt():et();const r=Yt();const o=new Ot({mnemonic:r,path:e});return yield n.backOff((()=>_(void 0,void 0,void 0,(function*(){return(t=>_(void 0,void 0,void 0,(function*(){const{result:e}=yield jt.generateToAddress(1,t.address);const{result:n}=yield jt.getBlock(e[0],2);if(n.confirmations<=0)throw new Error(`No confirmations on block mining: ${n.confirmations}`)})))(o)})))),e}));const{Transaction:Qt,Address:te,PrivateKey:ee,PublicKey:ne}=t.Bitcoin;const re=zt();const oe=new P;const se=new k;let ie=[];before("Before rest-client",(()=>_(void 0,void 0,void 0,(function*(){ie=yield function({n:t=1,random:e=!1}={}){return _(this,void 0,void 0,(function*(){const n=[];for(let r=0;r<t;r+=1)n.push(yield Vt({random:e}));return yield _(void 0,void 0,void 0,(function*(){let t=!1;do{try{const{result:e}=yield jt.generateToAddress(100,(new Dt).toHDPrivateKey("",Gt).derive(et(Wt,Gt)).privateKey.toPublicKey().toAddress());t=100===e.length}catch(t){V(500)}}while(!t)})),n}))}({n:20,random:!0})})))),describe("RestClient",(()=>{describe("getBalance",(()=>{it("Should retrieve the balance for a given address",(()=>_(void 0,void 0,void 0,(function*(){const t=yield se.getBalance(Xt().toString());e.expect(t).to.not.be.undefined}))))})),describe("getRawTxs",(()=>{it("Should retrieve the raw transaction for a given block id",(()=>_(void 0,void 0,void 0,(function*(){const t=yield Zt({path:ie.pop()});const[n]=yield se.getRawTxs([t]);e.expect(n).to.not.be.undefined,e.expect(typeof n).eq("string"),e.expect(n.length).to.be.greaterThan(5)}))))})),describe("getTransactions",(()=>{it("Should retrieve a transactions",(()=>_(void 0,void 0,void 0,(function*(){const t=yield Zt({path:ie.pop()});const n=yield se.getTransactions([t]);if(e.expect(n).to.not.be.undefined,e.expect(n.length).eq(1),e.expect(n[0].id).to.not.be.undefined,e.expect(n[0].id).eq(t),e.expect(n[0].outputs).to.not.be.undefined,e.expect(typeof n[0].outputs.length).eq("number"),n[0].outputs.length){const[t]=n[0].outputs;e.expect(t.script).to.not.be.undefined,e.expect(t.satoshis).to.not.be.undefined}})))),it("Should retrieve the transactions in the same order as the given ids",(()=>_(void 0,void 0,void 0,(function*(){const t=yield Zt({path:ie.pop()});const n=yield Zt({path:ie.pop()});const r=yield se.getTransactions([t,n]);if(e.expect(r).to.not.be.undefined,e.expect(r.length).eq(2),e.expect(r[0].id).to.not.be.undefined,e.expect(r[0].id).eq(t),e.expect(r[0].outputs).to.not.be.undefined,e.expect(typeof r[0].outputs.length).eq("number"),r[0].outputs.length){const[t]=r[0].outputs;e.expect(t.script).to.not.be.undefined,e.expect(t.satoshis).to.not.be.undefined}if(e.expect(r[1].id).to.not.be.undefined,e.expect(r[1].id).eq(n),e.expect(r[1].outputs).to.not.be.undefined,e.expect(typeof r[1].outputs.length).eq("number"),r[1].outputs.length){const[t]=r[1].outputs;e.expect(t.script).to.not.be.undefined,e.expect(t.satoshis).to.not.be.undefined}const o=yield se.getTransactions([n,t]);e.expect(o).to.not.be.undefined,e.expect(o.length).eq(2),e.expect(o[0].toString()).eq(r[1].toString()),e.expect(o[1].toString()).eq(r[0].toString())}))))})),describe("sendTransaction",(()=>{it("Should build and broadcast a transaction",(()=>_(void 0,void 0,void 0,(function*(){const t=new Ot({mnemonic:Yt(),path:ie.pop()});const r=new Ot({mnemonic:Yt(),path:ie.pop()});const o=new vt(oe,t.privateKey);o.tx.feePerKb(H.DEFAULT_FEE),o.tx.to(Xt(),H.MIN_NON_DUST_AMOUNT);const s=o.tx._estimateFee();const i=o.tx._getOutputAmount()-o.tx._getInputAmount()+s;(yield n.backOff((()=>r.getUtxosByAmount(i)))).forEach((t=>o.tx.from([new Qt.UnspentOutput(t)]))),o.tx.change(Xt()),o.tx.sign(r.privateKey,H.SIGHASH_ALL),yield r.restClient.sendTransaction(o.tx.toString()),e.expect(o.tx).to.not.be.undefined}))))})),describe("getUtxosFromAddress",(()=>{it("Should retrieve the utxo set of the first test address",(()=>_(void 0,void 0,void 0,(function*(){const t=new Ot({mnemonic:Yt(),path:ie.pop()});const n=yield se.getUtxosByAddress(t.address);e.expect(n).to.not.be.undefined,e.expect(typeof n).eq("object"),e.expect(typeof n.length).eq("number"),n.length>0&&(e.expect(n[0].txId).to.not.be.undefined,e.expect(n[0].outputIndex).to.not.be.undefined,e.expect(n[0].satoshis).to.not.be.undefined,e.expect(n[0].toObject().scriptPubKey).to.not.be.undefined,e.expect(n[0].toObject().vout).to.not.be.undefined,e.expect(n[0].toObject().amount).to.not.be.undefined)})))),it("should return the utxo for a p2pkh address",(()=>_(void 0,void 0,void 0,(function*(){const t=new Ot({mnemonic:Yt(),path:ie.pop()});const r=yield n.backOff((()=>t.getUtxosByAmount(2*H.MIN_NON_DUST_AMOUNT)));const o=new ee;const s=ne.fromPrivateKey(o);const i=new te(s,_t.NETWORK);const a=new ee;const c=ne.fromPrivateKey(a);const u=new te(c,_t.NETWORK);const d=new vt(oe,new ee);r.forEach((t=>{d.tx.from(t)})),d.tx.to(i.toString(),H.MIN_NON_DUST_AMOUNT),d.tx.change(u.toString()),d.tx.sign(t.privateKey,H.SIGHASH_ALL);const l=yield se.sendTransaction(d.tx.toString());e.expect(l).to.not.be.undefined;const p=yield se.getUtxosByAddress(i.toString());e.expect(p.length).to.be.greaterThan(0)})))),it("should not return the utxo for a (bare multisig) data utxo",(()=>_(void 0,void 0,void 0,(function*(){const t=new Ot({mnemonic:Yt(),path:ie.pop()});const r=yield n.backOff((()=>t.getUtxosByAmount(2*H.MIN_NON_DUST_AMOUNT)));const o=new ee;const s=ne.fromPrivateKey(o);const i=new te(s,_t.NETWORK);const a=new ee;const c=ne.fromPrivateKey(a);const u=new te(c,_t.NETWORK);const d=new vt(oe,new ee);r.forEach((t=>{d.tx.from(t)})),d.createDataOuts([{_owners:[s.toString()]}]),d.tx.change(u.toString()),d.tx.sign(t.privateKey,H.SIGHASH_ALL);const l=yield se.sendTransaction(d.tx.toString());e.expect(l).to.not.be.undefined;const p=yield se.getUtxosByAddress(i.toString());e.expect(p.length).eq(0)}))))})),describe("Secrets Store API",(()=>{const n={a:Math.random().toString()};const r=JSON.stringify(n);const o={data:r};const s="http://127.0.0.1:3000";const i=t.Bitcoin.crypto.Hash.sha256(Buffer.from(r)).toString("hex");afterEach((()=>_(void 0,void 0,void 0,(function*(){try{yield k.deleteSecretOutput({_url:`${s}/store/${i}`,privateKey:re})}catch(t){}})))),it("Should be able to store an object on the server",(()=>_(void 0,void 0,void 0,(function*(){const{_url:t}=yield k.setSecretOutput({host:s,privateKey:re,secretOutput:o});e.expect(t).eq(`${s}/store/${i}`)})))),it("Should not throw an error if the same object is stored twice",(()=>_(void 0,void 0,void 0,(function*(){yield k.setSecretOutput({host:s,privateKey:re,secretOutput:o});const{_url:t}=yield k.setSecretOutput({host:s,privateKey:re,secretOutput:o});e.expect(t).eq(`${s}/store/${i}`)})))),it("Should be able to retrieve an object on the server",(()=>_(void 0,void 0,void 0,(function*(){const{_url:t}=yield k.setSecretOutput({host:s,privateKey:re,secretOutput:o});const{host:r,data:i}=yield k.getSecretOutput({_url:t,privateKey:re});e.expect(JSON.parse(i)).to.deep.eq(n),e.expect(r).to.deep.eq(s)})))),it("Should be able to delete an object on the server",(()=>_(void 0,void 0,void 0,(function*(){const{_url:t}=yield k.setSecretOutput({host:s,privateKey:re,secretOutput:o});let n;yield k.deleteSecretOutput({_url:t,privateKey:re});try{n=yield k.getSecretOutput({_url:t,privateKey:re})}catch(t){n=t.response}e.expect(n.status).eq(403),e.expect(n.data.error).eq("No entry found.")}))))}))}));
