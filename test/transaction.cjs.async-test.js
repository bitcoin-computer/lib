"use strict";var t=require("crypto");var e=require("chai");var n=require("bitcoin-computer-bitcore");var r=require("axios");require("child_process");var o=require("crypto-js");var s=require("eciesjs");var i=require("exponential-backoff");require("ses");var a=require("http");var c=require("https");var u=require("url");var d=require("util");function l(t){return t&&"object"==typeof t&&"default"in t?t:{default:t}}function p(t){if(t&&t.__esModule)return t;var e=Object.create(null);return t&&Object.keys(t).forEach((function(n){if("default"!==n){var r=Object.getOwnPropertyDescriptor(t,n);Object.defineProperty(e,n,r.get?r:{enumerable:!0,get:function(){return t[n]}})}})),e.default=t,Object.freeze(e)}var h=l(t);var f=l(r);var g=l(o);var v=p(s);var y=l(a);var m=l(c);var w=l(u);var b=l(d);function x(t,e){var n={};for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&e.indexOf(r)<0&&(n[r]=t[r]);if(null!=t&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(r=Object.getOwnPropertySymbols(t);o<r.length;o++)e.indexOf(r[o])<0&&Object.prototype.propertyIsEnumerable.call(t,r[o])&&(n[r[o]]=t[r[o]])}return n}function _(t,e,n,r){var o,s=arguments.length,i=s<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(t,e,n,r);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(i=(s<3?o(i):s>3?o(e,n,i):o(e,n))||i);return s>3&&i&&Object.defineProperty(e,n,i),i}function S(t,e,n,r){return new(n||(n=Promise))((function(o,s){function i(t){try{c(r.next(t))}catch(t){s(t)}}function a(t){try{c(r.throw(t))}catch(t){s(t)}}function c(t){var e;t.done?o(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(i,a)}c((r=r.apply(t,e||[])).next())}))}const{crypto:O}=n.Bitcoin;const T=(t,e)=>{const n=Date.now();const r=O.Hash.sha256(Buffer.from(e+n));const o=[O.ECDSA.sign(r,t,"big").toString("hex"),t.publicKey.toString(),n];return`Bearer ${Buffer.from(o.join(":")).toString("base64")}`};class E{constructor(t,e,n={}){this.baseUrl=t,this.headers=n,this.privateKey=e}get(t){return S(this,void 0,void 0,(function*(){const e=this.privateKey?{Authentication:T(this.privateKey,this.baseUrl)}:{};return(yield f.default.get(`${this.baseUrl}${t}`,{headers:Object.assign(Object.assign({},this.headers),e)})).data}))}post(t,e){return S(this,void 0,void 0,(function*(){const n=this.privateKey?{Authentication:T(this.privateKey,this.baseUrl)}:{};return(yield f.default.post(`${this.baseUrl}${t}`,e,{headers:Object.assign(Object.assign({},this.headers),n)})).data}))}delete(t){return S(this,void 0,void 0,(function*(){const e=this.privateKey?{Authentication:T(this.privateKey,this.baseUrl)}:{};return(yield f.default.delete(`${this.baseUrl}${t}`,{headers:Object.assign(Object.assign({},this.headers),e)})).data}))}}var C={CHAIN:process.env.CHAIN||"LTC",NETWORK:process.env.NETWORK||"testnet",BCN_URL:process.env.BCN_URL||"https://node.bitcoincomputer.io",RPC_USER:process.env.RPC_USER||"bcn-admin",RPC_PASSWORD:process.env.RPC_PASSWORD||"kH4nU5Okm6-uyC0_mA5ztVNacJqZbYd_KGLl6mx722A=",TEST_MNEMONICS:"travel upgrade inside soda birth essence junk merit never twenty system opinion;toddler hockey salute wheel harvest video narrow riot guitar lake sea call;cannon hour begin test replace fury motion squirrel envelope announce neck culture"};class A extends class{constructor({chain:t=C.CHAIN,network:e=C.NETWORK}={}){this.chain=t,this.network=e}}{constructor({chain:t=C.CHAIN,network:e=C.NETWORK,url:n=C.BCN_URL}={}){super({chain:t,network:e}),this.url=n}}const{PrivateKey:P,Transaction:B}=n.Bitcoin;const{UnspentOutput:I}=B;function N(t){if(!/^[0-9A-Fa-f]{64}$/.test(t))throw new Error(`Invalid txId: ${t}`)}function K(t){if(!/^[0-9A-Fa-f]{64}\/\d+$/.test(t))throw new Error(`Invalid outId: ${t}`)}function R(t){K(t);const[e,n]=t.split("/");return{txId:e,outputIndex:parseInt(n,10)}}let U=class{constructor({nodeConfig:t=new A,privateKey:e=new P}={}){this.nodeConfig=t,this.bcn=new E(t.url,e)}get chain(){return this.nodeConfig.chain}get network(){return this.nodeConfig.network}get url(){return this.nodeConfig.url}getBalance(t){return S(this,void 0,void 0,(function*(){const{chain:e,network:n}=this;return yield this.bcn.get(`/v1/${e}/${n}/address/${t}/balance`)}))}getTransactions(t){return S(this,void 0,void 0,(function*(){return(yield this.getRawTxs(t)).map((t=>new B(t)))}))}getRawTxs(t){return S(this,void 0,void 0,(function*(){t.map(N);const{chain:e,network:n}=this;return this.bcn.post(`/v1/${e}/${n}/tx/bulk/`,{txIds:t})}))}sendTransaction(t){return S(this,void 0,void 0,(function*(){return this.bcn.post(`/v1/${this.chain}/${this.network}/tx/send`,{rawTx:t})}))}getUtxosByAddress(t){return S(this,void 0,void 0,(function*(){const{chain:e,network:n}=this;return(yield this.bcn.get(`/v1/${e}/${n}/wallet/${t.toString()}/utxos`)).map((({rev:t,scriptPubKey:e,satoshis:n})=>{const[r,o]=t.split("/");return new I({txId:r,outputIndex:parseInt(o,10),satoshis:n,script:e})}))}))}query({publicKey:t,classHash:e}){return S(this,void 0,void 0,(function*(){if(void 0===t&&void 0===e)throw new Error("Query parameters cannot be empty.");let n="";t&&(n+=`?publicKey=${t}`),e&&(n+=0===n.length?"?":"&",n+=`classHash=${e}`);const{chain:r,network:o}=this;return this.bcn.get(`/v1/${r}/${o}/non-standard-utxos${n}`)}))}idsToRevs(t){return S(this,void 0,void 0,(function*(){t.map(K);const{chain:e,network:n}=this;return this.bcn.post(`/v1/${e}/${n}/revs`,{ids:t})}))}rpc(t,e){return S(this,void 0,void 0,(function*(){return this.bcn.post(`/v1/${this.chain}/${this.network}/rpc`,{method:t,params:e})}))}static getSecretOutput({_url:t,privateKey:e}){return S(this,void 0,void 0,(function*(){const n=t.split("/");const r=n[n.length-1];const o=n.slice(0,-2).join("/");const s=new E(o,e);return{host:o,data:yield s.get(`/v1/store/${r}`)}}))}static setSecretOutput({secretOutput:t,host:e,privateKey:n}){return S(this,void 0,void 0,(function*(){return new E(e,n).post("/v1/store/",t)}))}static deleteSecretOutput({_url:t,privateKey:e}){return S(this,void 0,void 0,(function*(){const n=t.split("/");const r=n[n.length-1];const o=n.slice(0,-2).join("/");const s=new E(o,e);yield s.delete(`/v1/store/${r}`)}))}};U=_([t=>t],U);const k=parseInt(process.env.BC_DUST_LIMIT||"",10)||1546;const j=parseInt(process.env.BC_DEFAULT_FEE||"",10)||2500;var M={MIN_NON_DUST_AMOUNT:k,SCRIPT_CHUNK_SIZE:parseInt(process.env.BC_SCRIPT_CHUNK_SIZE||"",10)||479,DEFAULT_FEE:j,SIGHASH_ALL:1,FEE_PER_KB:2e4,PUBLIC_KEY_SIZE:65,ANYONE_CAN_SPEND_MNEMONIC:"replace this seed",PASSPHRASE:"",ENCODING_LENGTH:3,ENCODING_NUMBER_LENGTH:3,MAX_PUBKEYS_PER_SCRIPT:3,OP_RETURN_SIZE:80,CHANGE_OUTPUT_MAX_SIZE:62};const{PublicKey:H,Mnemonic:$,crypto:D}=n.Bitcoin;const{Point:L}=D;function F(t){return Buffer.from(t,"hex").toString().replace(/\0/g,"")}function q(t,e){return t.slice(e)+t.slice(0,e)}function G(t,e,n){if(t.length*Math.log2(e)>53)throw new Error(`Input too large ${t.length} ${Math.log2(e)}`);if(![2,10,16].includes(e)||![2,10,16].includes(n))throw new Error("ToBase or FromBase invalid in covertNumber.");if(2===e&&t.length%8!=0)throw new Error("Binary strings must be byte aligned.");if(16===e&&t.length%2!=0)throw new Error("Hex strings must be of even length.");const r=parseInt(t,e).toString(n);return 2===n?r.padStart(8*Math.ceil(r.length/8),"0"):16===n?r.padStart(2*Math.ceil(r.length/2),"0"):r}function W(t,e){const n=new RegExp(`.{1,${e}}`,"g");return t.match(n)||[]}function J(t){return W(t,2).map((t=>G(t,16,2))).join("")}function z(t){return W(t,8).map((t=>G(t,2,16))).join("")}function Y(t){return t.toString(16).padStart(M.ENCODING_NUMBER_LENGTH,"0")}function X(t){return parseInt(t,16)}function Z(t){if(62!==t.length)throw new Error("Input to hexToPublicKey must be of length 62");let e=!1;let n=0;let r;for(;!e;){if(n>=256)throw new Error("Something went wrong storing data");const o=n.toString(16).padStart(2,"0")+z(q(J(t).padStart(64,"0"),n));try{r=L.fromX(!1,o),e=!0}catch(t){n+=1}}if(!r)throw new Error("Something went wrong storing data");return new H(r)}function V(t){const e=t.point.getX().toString("hex").padStart(64,"0");const n=G(e.slice(0,2),16,10);return z((o=parseInt(n,10),(r=J(e.slice(2))).slice(-o)+r.slice(0,-o)));var r,o}function Q(t){return new Promise((e=>{setTimeout(e,t)}))}function tt(t=C.CHAIN,e=C.NETWORK){if("testnet"===e||"regtest"===e)return 1;if("BTC"===t)return 0;if("LTC"===t)return 2;if("DOGE"===t)return 3;if("BCH"===t)return 145;if("BSV"===t)return 236;throw new Error(`Unsupported chain ${t}`)}function et({purpose:t=44,coinType:e=2,account:n=0}={}){return`m/${t.toString()}'/${e.toString()}'/${n.toString()}'`}function nt(t=C.CHAIN,e=C.NETWORK){return et({coinType:tt(t,e)})}function rt(){return Math.round(Math.random()*Math.pow(2,31))}function ot({chain:t=C.CHAIN,network:e=C.NETWORK,account:n=rt()}={}){return et({account:n,coinType:tt(t,e)})}function st(t,e){const n=function(t,e){return((t,e,n={})=>{const{path:r="m/44'/0'/0'/0",passphrase:o=""}=n;let s=t.toHDPrivateKey(o,e);return r&&(s=s.derive(r)),s.privateKey})(new $(M.ANYONE_CAN_SPEND_MNEMONIC),e,{path:nt(t,e),passphrase:""})}(t,e);return H.fromPrivateKey(n)}const{PublicKey:at,Script:ct}=n.Bitcoin;function ut(t,e,n,r){if(t.length>M.MAX_PUBKEYS_PER_SCRIPT)throw new Error("Too many owners");return function(t,e,n,r){const o=r?[...t,st(e,n).toBuffer()]:t;const s=new ct;return s.add("OP_1"),o.forEach((t=>{s.add(t)})),s.add(`OP_${o.length}`),s.add("OP_CHECKMULTISIG"),s}(t.map((t=>t.toBuffer())),e,n,r)}function dt(t,e){return function(t,e){const n=t.chunks.filter((t=>t.buf));return(e?n.slice(0,-1):n).map((t=>t.buf))}(t,e).map((t=>at.fromBuffer(t)))}function lt(t){return Buffer.from(g.default.SHA256(t).toString(),"hex").toString("hex").substr(0,4)}function pt(t){return`${lt(t)};${t}`}function ht(t){const e=t.substr(0,4);const n=t.substr(5);if(!function(t,e){return lt(t)===e}(n,e))throw new Error("Decryption failure");return n}function ft(t){if(void 0!==t._readers){const{_readers:e,_url:n,_owners:r,_amount:o}=t,s=x(t,["_readers","_url","_owners","_amount"]);const i=function(t,e){const n=h.default.randomBytes(32).toString("hex");const r=function(t,e){if(!/^[0-9a-f]{64}$/.test(e))throw new Error("Invalid secret");const n=Buffer.from(e,"hex").toString("binary");const r=pt(t);return g.default.AES.encrypt(r,n).toString()}(t,n);const o=e.map((t=>function(t,e){if(!/^0[2-3][0-9a-f]{64}|04[0-9a-f]{128}$/.test(e))throw new Error("Invalid publicKey");const n=pt(t);return v.encrypt(e,Buffer.from(n,"utf8")).toString("base64")}(n,t)));return{__cypher:r,__secrets:o}}(JSON.stringify(s),e);return void 0!==n&&(i._url=n),void 0!==r&&(i._owners=r),void 0!==o&&(i._amount=o),i}return t}const{Transaction:gt}=n.Bitcoin;const{Output:vt}=gt;const{UnspentOutput:yt}=gt;let mt=class{constructor(t,e,n){const r=new gt(n);r.feePerKb(M.FEE_PER_KB),this.nodeConfig=t,this.tx=r,this.outData=[],this.privateKey=e}get txId(){return this.tx.id}get chain(){return this.nodeConfig.chain}get network(){return this.nodeConfig.network}get restClient(){const{nodeConfig:t,privateKey:e}=this;return new U({nodeConfig:t,privateKey:e})}get inputs(){return this.tx.inputs.map((t=>`${t.prevTxId.toString("hex")}/${t.outputIndex}`))}get inRevs(){const{enc:t}=this;let[e]=t;return e=Number.isFinite(e)?e:0,this.tx.inputs.slice(0,e).map((({prevTxId:t,outputIndex:e})=>`${t.toString("hex")}/${e}`))}get outRevs(){const{enc:t}=this;let[,e]=t;return e=Number.isFinite(e)?e:0,Array.from(Array(e).keys()).map((t=>`${this.tx.id}/${t}`))}get opReturns(){try{const{outputs:t}=this.tx;return t.filter((({script:t})=>t.isDataOut())).map((({script:t})=>t.getData())).map((t=>t.toString())).join()}catch(t){return""}}get enc(){return W(this.opReturns.slice(0,M.ENCODING_LENGTH*M.ENCODING_NUMBER_LENGTH),M.ENCODING_NUMBER_LENGTH).map(X)}get dataPrefix(){return this.opReturns.slice(9)}isFullyFunded(){return this.tx._getInputAmount()-this.tx._getOutputAmount()>=this.tx.getFee()}getOwnerOutputs(){const{enc:t}=this;const[,e=0]=t;return this.tx.outputs.slice(0,e)}getDataOutputs(){const{enc:t}=this;const[,e,n]=t;return this.tx.outputs.slice(e,n)}getOutData(t){return S(this,void 0,void 0,(function*(){try{const e=this.getDataOutputs().map((t=>t.script)).map((t=>dt(t,!0))).flat().map(V).map(F).join("");const{dataPrefix:n}=this;const r=JSON.parse(n+e);const o=t.toBuffer().toString("hex");const s=this.getOwnerOutputs();if(s.length!==r.length)throw new Error("Inconsistent state");const i=s.map(((t,e)=>Object.assign(Object.assign({},r[e]),{_owners:dt(t.script,!1).map((t=>t.toString())),_amount:t.satoshis})));return Promise.all(i.map((e=>S(this,void 0,void 0,(function*(){try{const n=yield function(t){return e=>S(this,void 0,void 0,(function*(){if(function(t){return void 0!==t._url}(e)){const{_url:n}=e,r=x(e,["_url"]);const{host:o,data:s}=yield U.getSecretOutput({_url:n,privateKey:t});return Object.assign(Object.assign(Object.assign({},r),JSON.parse(s)),{_url:o})}return e}))}(t)(e);return function(t,e){if(function(t){return void 0!==t.__cypher&&void 0!==t.__secrets}(t)){const{__cypher:n,__secrets:r}=t,o=x(t,["__cypher","__secrets"]);return Object.assign(Object.assign(Object.assign({},o),JSON.parse(function({__cypher:t,__secrets:e},n){let r="";if(n.forEach((n=>{e.forEach((e=>{try{const o=function(t,e){if(!/^[0-9a-f]{64}$/.test(e))throw new Error("Invalid privateKey");return ht(v.decrypt(e,Buffer.from(t,"base64")).toString("utf8"))}(e,n);r=function(t,e){if(!/^[0-9a-f]{64}$/.test(e))throw new Error("Invalid secret");const n=Buffer.from(e,"hex").toString("binary");return ht(g.default.AES.decrypt(t,n).toString(g.default.enc.Utf8))}(t,o)}catch(t){const e=["Decryption failure","Unsupported state or unable to authenticate data"];if(t instanceof Error&&!e.includes(t.message))throw t}}))})),r)return r;throw new Error("Decryption failure")}({__cypher:n,__secrets:r},e))),{_readers:[]})}return t}(n,[o])}catch(t){return null}})))))}catch(t){return[]}}))}getOwners(){return this.getOwnerOutputs().map((t=>dt(t.script,!1).map((t=>t.toString()))))}getAmounts(){return this.getOwnerOutputs().map((t=>t.satoshis))}spendFromData(t){return S(this,void 0,void 0,(function*(){if(!t.length)return;const e=t.map(R);const r=e.map((t=>t.txId));const o=yield this.restClient.getTransactions(r);for(let t=0;t<e.length;t+=1){const{txId:r,outputIndex:s}=e[t];const{outputs:i}=o[t];const a=i[s];const c=Math.round(a.satoshis);const u=new n.Bitcoin.Script(a.script);const d=new yt({txId:r,outputIndex:s,satoshis:c,script:u});const l=dt(u,!1).map((t=>t.toString()));this.tx.from([d],l,1)}}))}createDataOuts(t){t.forEach((({_amount:t,_owners:e=[]})=>{if(Array.isArray(e)&&e.length>M.MAX_PUBKEYS_PER_SCRIPT)throw new Error("Too many owners.");const r=e.map((t=>n.Bitcoin.PublicKey.fromString(t)));const o=t||M.MIN_NON_DUST_AMOUNT;const s=ut(r,this.chain,this.network,!1);this.tx.addOutput(new vt({script:s,satoshis:o}))}));const e=t.map((t=>x(t,["_amount","_owners"])));const r=M.MIN_NON_DUST_AMOUNT;const o=JSON.stringify(e);const s=M.OP_RETURN_SIZE-M.ENCODING_LENGTH*M.ENCODING_NUMBER_LENGTH;const i=o.slice(0,s);const a=function(t,e,n,r){var o;return function(t,e){const n=[];for(let r=0;r<t.length;r+=e)n.push(t.slice(r,r+e));return n}(W((o=t,Buffer.from(o).toString("hex")),62).map((t=>t.padStart(62,"0"))).map(Z),M.MAX_PUBKEYS_PER_SCRIPT-1).map((t=>ut(t,e,n,!0)))}(o.slice(s),this.chain,this.network);const c=Y(this.tx.inputs.length)+Y(this.tx.outputs.length)+Y(this.tx.outputs.length+a.length);a.forEach((t=>{this.tx.addOutput(new vt({script:t,satoshis:r}))})),this.tx.addData(c+i)}static fromTxHex(t,e,n){return S(this,void 0,void 0,(function*(){let r=[];let o=[];let s=[];const i=new this(e,n);i.tx.fromString(t);try{r=yield i.getOutData(n)}catch(t){}try{o=i.getOwners()}catch(t){}try{s=i.getAmounts()}catch(t){}return i.outData=r.map(((t,e)=>Object.assign(Object.assign({},t),{_owners:o[e],_amount:s[e]}))),i}))}static fromTxId(t,e,n){return S(this,void 0,void 0,(function*(){const r=new U({nodeConfig:e,privateKey:n});const[o]=yield r.getRawTxs([t]);return this.fromTxHex(o,e,n)}))}};mt=_([t=>t],mt);class wt{constructor({mnemonic:t=new n.Bitcoin.Mnemonic,nodeConfig:e=new A,path:r=nt(),passphrase:o=""}={}){this.passphrase=o,this.mnemonic=t,this.path=r,this.nodeConfig=e}get chain(){return this.nodeConfig.chain}get network(){return this.nodeConfig.network}get url(){return this.nodeConfig.url}get restClient(){const{nodeConfig:t,privateKey:e}=this;return new U({nodeConfig:t,privateKey:e})}get address(){return this._address=this._address||this.publicKey.toAddress(this.nodeConfig.network),this._address}derive(t="0"){const e=`${this.path}${this.path.length>0?"/":""}${t}`;const{mnemonic:n,nodeConfig:r,passphrase:o}=this;return new wt({mnemonic:n,nodeConfig:r,path:e,passphrase:o})}get hdPrivateKey(){return this._hdPrivateKey=this._hdPrivateKey||this.mnemonic.toHDPrivateKey(this.passphrase,this.network).deriveChild(this.path),this._hdPrivateKey}get privateKey(){return this.hdPrivateKey.privateKey}get publicKey(){return this.hdPrivateKey.publicKey}getBalance(){return S(this,void 0,void 0,(function*(){return this.restClient.getBalance(this.address)}))}getUtxosByAmount(t){return S(this,void 0,void 0,(function*(){const e=yield this.restClient.getUtxosByAddress(this.address);let n=0;const r=[];!function(t){const e=t;for(let t=e.length-1;t>0;t-=1){const n=Math.floor(Math.random()*(t+1));[e[t],e[n]]=[e[n],e[t]]}}(e);for(const o of e)if(n+=o.satoshis,r.push(o),n>=t)return r;const{network:o,chain:s}=this.restClient.nodeConfig;const i=this.address.toString();throw new Error(`Insufficient balance in address ${i} on ${o} ${s}. Found ${n}, required ${t}.`)}))}fundAndSendTx(t){return S(this,void 0,void 0,(function*(){t.tx.feePerKb(2*M.FEE_PER_KB);const e=t.tx.outputs.length;t.tx.to(function(t,e){const n={"any-testnet":"uTKUDCkpo12vstJBsMWmrTPz9wFE6DuzGH","BTC-mainnet":"igpnnoLziUyxtQuWYCP13gHYVhUru6iLaY","LTC-mainnet":"t77o829ngHnuUorwDkf129fL6ERLFNqKG8","DOGE-mainnet":"XfNRUdvrv6uCDbCF5xJ18UYwVkkefkXvEd","BCH-mainnet":"CSAkkS8Mro9mYRqhksS1FyYrsnSE5MVQ5m"};return q("testnet"===e||"regtest"===e?n["any-testnet"]:n[`${t}-${e}`],19)}(this.nodeConfig.chain,this.nodeConfig.network),0);const r=yield this.restClient.getUtxosByAddress(this.address);if(t.tx.change(this.address),0===r.length){const{address:t}=this;throw new Error(`Insufficient balance in address ${t}.`)}let o=0;let s=0;let i=0;do{const[e]=r.splice(0,1);t.tx.from([new n.Bitcoin.Transaction.UnspentOutput(e)]),t.tx.sign(this.privateKey,M.SIGHASH_ALL),s=t.tx.toString().length,t.tx.fee(s*M.FEE_PER_KB*2),t.tx._updateChangeOutput(),i=t.tx._getInputAmount()-t.tx._getOutputAmount(),o=i/s*1e3}while(0!==r.length&&o<2*M.FEE_PER_KB);if(o<2*M.FEE_PER_KB&&0===r.length){const{address:e}=this;throw new Error(`Insufficient balance in address ${e}. Current fee_per_kb ${o}. Fee ${i}. Utxo set size ${r.length}. Transaction size ${s} Inputs ${JSON.stringify(t.tx.inputs,null,2)} Outpus ${JSON.stringify(t.tx.outputs,null,2)}`)}if(s=t.tx.toString().length,i=Math.ceil(s/1e3*M.FEE_PER_KB),t.tx.fee(i),t.tx.outputs[e].satoshis=i,t.tx._outputAmount=void 0,t.tx.feePerKb(M.FEE_PER_KB),t.tx._outputAmount=void 0,t.tx._updateChangeOutput(),!1===t.isFullyFunded()||!1===t.tx.verify())throw new Error(`Something went wrong. Address ${this.address}. Transaction: ${JSON.stringify(t.tx,null,2)}`);return t.tx.sign(this.privateKey,M.SIGHASH_ALL),this.restClient.sendTransaction(t.tx.toString())}))}send(t,e){return S(this,void 0,void 0,(function*(){const{privateKey:n,nodeConfig:r}=this;const o=new mt(r,n);return o.tx.to(e,t),this.fundAndSendTx(o)}))}}class bt{constructor({wallet:t=new wt}={}){this.wallet=t}get chain(){return this.wallet.chain}get network(){return this.wallet.network}get nodeConfig(){return this.wallet.nodeConfig}fromTxHex(t){return S(this,void 0,void 0,(function*(){const{wallet:e,nodeConfig:n}=this;const{privateKey:r}=e;return mt.fromTxHex(t,n,r)}))}fromTxId(t){return S(this,void 0,void 0,(function*(){const{wallet:e,nodeConfig:n}=this;const{privateKey:r}=e;const o=new U({nodeConfig:n,privateKey:r});const[s]=yield o.getRawTxs([t]);return this.fromTxHex(s)}))}get(t){return S(this,void 0,void 0,(function*(){const e=t.map(R);return Promise.all(e.map((({txId:t,outputIndex:e})=>S(this,void 0,void 0,(function*(){const{outData:n}=yield this.fromTxId(t);if(e>n.length)throw new Error("Index out of bounds");return n[e]})))))}))}put(t){return this.update([],t)}createTx(t,e){return S(this,void 0,void 0,(function*(){const{wallet:n,nodeConfig:r}=this;const{privateKey:o}=n;const s=new mt(r,o);const i=e.map((t=>{var{_owners:e}=t,n=x(t,["_owners"]);return Object.assign({_owners:e||[this.wallet.publicKey.toString()]},n)})).map(ft);const a=yield Promise.all(i.map(function(t){return e=>S(this,void 0,void 0,(function*(){if(void 0!==e._url){const{_url:n,_owners:r,_amount:o}=e,s=x(e,["_url","_owners","_amount"]);const i=yield U.setSecretOutput({host:n,secretOutput:{data:JSON.stringify(s)},privateKey:t});return void 0!==r&&(i._owners=r),void 0!==o&&(i._amount=o),i}return e}))}(o)));return yield s.spendFromData(t),yield s.createDataOuts(a),s}))}update(t,e){return S(this,void 0,void 0,(function*(){const n=yield this.createTx(t,e);return yield this.wallet.fundAndSendTx(n),n.outRevs}))}}const xt=t=>(Object.prototype.toString.call(t).match(/\s([a-zA-Z]+)/)||[])[1];const _t=t=>"object"==typeof t?xt(t):xt(t).toLowerCase();const St=t=>["number","string","boolean","undefined","Null"].includes(_t(t));const Ot=t=>St(t)||["Array","Object"].includes(_t(t));const Tt=(t,e)=>{if(!Ot(t)||!Ot(e))throw new Error(`Unsupported data types for deep equals: ${_t(t)} & ${_t(e)}`);if(_t(t)!==_t(e))return!1;if(St(t)&&St(e))return t===e;const n=(t,e)=>Object.entries(t).every((([t,n])=>Tt(e[t],n)));return t&&e&&n(t,e)&&n(e,t)};var Et=y.default;var Ct=m.default;var At=w.default;function Pt(t){"string"==typeof t&&(t=function(t){var e=At.parse(t);var n=e.hostname;var r=parseInt(e.port,10);var o=e.protocol;o=o.substring(0,o.length-1);var s=e.auth.split(":");return{host:n,port:r,protocol:o,user:s[0]?decodeURIComponent(s[0]):null,pass:s[1]?decodeURIComponent(s[1]):null}}(t)),t=t||{},this.host=t.host||"127.0.0.1",this.port=t.port||8332,this.user=t.user||"user",this.pass=t.pass||"pass",this.protocol="http"===t.protocol?Et:Ct,this.batchedCalls=null,this.disableAgent=t.disableAgent||!1;var e=void 0!==t.rejectUnauthorized;this.rejectUnauthorized=!e||t.rejectUnauthorized,Pt.config.log?this.log=Pt.config.log:this.log=Pt.loggers[Pt.config.logger||"normal"]}var Bt=console.log.bind(console);var It=function(){};function Nt(t,e){var n=this;t=JSON.stringify(t);var r=this.user+":"+this.pass;var o=Buffer.from&&Buffer.from!==Uint8Array.from?Buffer.from(r):new Buffer(r);this.auth=o.toString("base64");var s={host:n.host,path:"/",method:"POST",port:n.port,rejectUnauthorized:n.rejectUnauthorized,agent:!n.disableAgent&&void 0};if(n.httpOptions)for(var i in n.httpOptions)s[i]=n.httpOptions[i];var a=!1;var c="Bitcoin JSON-RPC: ";var u=this.protocol.request(s,(function(t){var r="";t.on("data",(function(t){r+=t})),t.on("end",(function(){if(!a)if(a=!0,401!==t.statusCode)if(403!==t.statusCode){if(500===t.statusCode&&"Work queue depth exceeded"===r.toString("utf8")){var o=new Error("Bitcoin JSON-RPC: "+r.toString("utf8"));return o.code=429,void e(o)}var s;try{s=JSON.parse(r)}catch(o){n.log.err(o.stack),n.log.err(r),n.log.err("HTTP Status code:"+t.statusCode);var i=new Error(c+"Error Parsing JSON: "+o.message);return void e(i)}e(s.error,s)}else e(new Error(c+"Connection Rejected: 403 Forbidden"));else e(new Error(c+"Connection Rejected: 401 Unnauthorized"))}))}));u.on("error",(function(t){var n=new Error(c+"Request Error: "+t.message);a||(a=!0,e(n))})),u.setHeader("Content-Length",t.length),u.setHeader("Content-Type","application/json"),u.setHeader("Authorization","Basic "+n.auth),u.write(t),u.end()}Pt.loggers={none:{info:It,warn:It,err:It,debug:It},normal:{info:Bt,warn:Bt,err:Bt,debug:It},debug:{info:Bt,warn:Bt,err:Bt,debug:Bt}},Pt.config={logger:"normal"},Pt.prototype.batch=function(t,e){this.batchedCalls=[],t(),Nt.call(this,this.batchedCalls,e),this.batchedCalls=null},Pt.callspec={abandonTransaction:"str",abortRescan:"",addMultiSigAddress:"",addNode:"",analyzePSBT:"str",backupWallet:"",bumpFee:"str",clearBanned:"",combinePSBT:"obj",combineRawTransaction:"obj",convertToPSBT:"str",createMultiSig:"",createPSBT:"obj",createRawTransaction:"obj obj",createWallet:"str",decodePSBT:"str",decodeScript:"str",decodeRawTransaction:"",deriveAddresses:"str",disconnectNode:"",dumpPrivKey:"",dumpWallet:"str",encryptWallet:"",enumerateSigners:"",estimateFee:"",estimateSmartFee:"int str",estimatePriority:"int",generate:"int",generateBlock:"str obj",generateToAddress:"int str",generateToDescriptor:"int str",getAccount:"",getAccountAddress:"str",getAddedNodeInfo:"",getAddressMempool:"obj",getAddressUtxos:"obj",getAddressBalance:"obj",getAddressDeltas:"obj",getAddressesByLabel:"str",getAddressInfo:"str",getAddressTxids:"obj",getAddressesByAccount:"",getBalance:"str int",getBalances:"",getBestBlockHash:"",getBlockDeltas:"str",getBlock:"str int",getBlockchainInfo:"",getBlockCount:"",getBlockFilter:"str",getBlockHashes:"int int obj",getBlockHash:"int",getBlockHeader:"str",getBlockNumber:"",getBlockStats:"str",getBlockTemplate:"",getConnectionCount:"",getChainTips:"",getChainTxStats:"",getDescriptorInfo:"str",getDifficulty:"",getGenerate:"",getHashesPerSec:"",getIndexInfo:"",getInfo:"",getMemoryInfo:"",getMemoryPool:"",getMemPoolAncestors:"str",getMemPoolDescendants:"str",getMemPoolEntry:"str",getMemPoolInfo:"",getMiningInfo:"",getNetTotals:"",getNetworkHashPS:"",getNetworkInfo:"",getNewAddress:"str str",getNodeAddresses:"",getPeerInfo:"",getRawChangeAddress:"",getRawMemPool:"bool",getRawTransaction:"str int",getReceivedByAccount:"str int",getReceivedByAddress:"str int",getReceivedByLabel:"str",getRpcInfo:"",getSpentInfo:"obj",getTransaction:"",getTxOut:"str int bool",getTxOutProof:"",getTxOutSetInfo:"",getUnconfirmedBalance:"",getWalletInfo:"",getWork:"",getZmqNotifications:"",finalizePSBT:"str",fundRawTransaction:"str",help:"",importAddress:"str str bool",importDescriptors:"str",importMulti:"obj obj",importPrivKey:"str str bool",importPrunedFunds:"str, str",importPubKey:"str",importWallet:"str",invalidateBlock:"str",joinPSBTs:"obj",keyPoolRefill:"",listAccounts:"int",listAddressGroupings:"",listBanned:"",listDescriptors:"",listLabels:"",listLockUnspent:"bool",listReceivedByAccount:"int bool",listReceivedByAddress:"int bool",listReceivedByLabel:"",listSinceBlock:"str int",listTransactions:"str int int",listUnspent:"int int",listWalletDir:"",listWallets:"",loadWallet:"str",lockUnspent:"",logging:"",move:"str str float int str",ping:"",preciousBlock:"str",prioritiseTransaction:"str float int",pruneBlockChain:"int",psbtBumpFee:"str",removePrunedFunds:"str",reScanBlockChain:"",saveMemPool:"",send:"obj",setHDSeed:"",setLabel:"str str",setWalletFlag:"str",scanTxOutSet:"str",sendFrom:"str str float int str str",sendMany:"str obj int str",sendRawTransaction:"str",sendToAddress:"str float str str",setAccount:"",setBan:"str str",setNetworkActive:"bool",setGenerate:"bool int",setTxFee:"float",signMessage:"",signMessageWithPrivKey:"str str",signRawTransaction:"",signRawTransactionWithKey:"str obj",signRawTransactionWithWallet:"str",stop:"",submitBlock:"str",submitHeader:"str",testMemPoolAccept:"obj",unloadWallet:"",upgradeWallet:"",uptime:"",utxoUpdatePSBT:"str",validateAddress:"",verifyChain:"",verifyMessage:"",verifyTxOutProof:"str",walletCreateFundedPSBT:"",walletDisplayAddress:"str",walletLock:"",walletPassPhrase:"string int",walletPassphraseChange:"",walletProcessPSBT:"str"};var Kt=function(t,e,n){return Array.prototype.slice.call(t,e,n)};function Rt(){return parseInt(1e5*Math.random())}!function(t,e,n){function r(t,e){return function(){var r=arguments.length-1;this.batchedCalls&&(r=arguments.length);for(var o=0;o<r;o++)e[o]&&(arguments[o]=e[o](arguments[o]));this.batchedCalls?this.batchedCalls.push({jsonrpc:"2.0",method:t,params:Kt(arguments),id:Rt()}):n.call(this,{method:t,params:Kt(arguments,0,arguments.length-1),id:Rt()},arguments[arguments.length-1])}}var o={str:function(t){return t.toString()},int:function(t){return parseFloat(t)},float:function(t){return parseFloat(t)},bool:function(t){return!0===t||"1"==t||"true"==t||"true"==t.toString().toLowerCase()},obj:function(t){return"string"==typeof t?JSON.parse(t):t}};for(var s in e){var i=[];if(e[s].length){i=e[s].split(" ");for(var a=0;a<i.length;a++)o[i[a]]?i[a]=o[i[a]]:i[a]=o.str}var c=s.toLowerCase();t.prototype[s]=r(c,i),t.prototype[c]=t.prototype[s]}}(Pt,Pt.callspec,Nt);var Ut=Pt;const kt=new Ut({protocol:process.env.RPC_PROTOCOL,user:process.env.RPC_USER,pass:process.env.RPC_PASSWORD,host:process.env.RPC_HOST,port:process.env.RPC_PORT});const jt={createwallet:b.default.promisify(Ut.prototype.createwallet.bind(kt)),getaddressinfo:b.default.promisify(Ut.prototype.getaddressinfo.bind(kt)),getBlock:b.default.promisify(Ut.prototype.getBlock.bind(kt)),getBlockchainInfo:b.default.promisify(Ut.prototype.getBlockchainInfo.bind(kt)),getBlockHash:b.default.promisify(Ut.prototype.getBlockHash.bind(kt)),generateToAddress:b.default.promisify(Ut.prototype.generateToAddress.bind(kt)),getRawTransaction:b.default.promisify(Ut.prototype.getRawTransaction.bind(kt)),importaddress:b.default.promisify(Ut.prototype.importaddress.bind(kt)),listunspent:b.default.promisify(Ut.prototype.listunspent.bind(kt)),sendRawTransaction:b.default.promisify(Ut.prototype.sendRawTransaction.bind(kt))};const{PrivateKey:Mt,Opcode:Ht,Script:$t,Mnemonic:Dt,crypto:Lt,Transaction:Ft,encoding:qt}=n.Bitcoin;const{CHAIN:Gt,NETWORK:Wt,TEST_MNEMONICS:Jt}=C;function zt(t=0){return new Dt(function(t=0){return Jt.split(";")[t]}(t))}function Yt(t=0){return function(t=0){return zt().toHDPrivateKey("",Wt).derive(ot({account:t}))}(t).privateKey}function Xt(t=0){return Yt(t).toPublicKey()}function Zt(t=0){return Xt(t).toAddress()}function Vt(t=1e5,e=0){const r=$t.buildPublicKeyHashOut(Zt(e));return{address:Zt(e),txId:"a477af6b2667c29670467e4e0728b685ee07b240235771862318e29ddbe58458",outputIndex:e,script:r,vout:0,amount:t/1e8,satoshis:t,scriptPubKey:"",inspect:()=>"",toObject:()=>new n.Bitcoin.Transaction.UnspentOutput({})}}new A;const Qt=({random:t=!1}={})=>S(void 0,void 0,void 0,(function*(){const e=t?ot():nt();const n=zt();const r=new wt({mnemonic:n,path:e});return yield i.backOff((()=>S(void 0,void 0,void 0,(function*(){return(t=>S(void 0,void 0,void 0,(function*(){const{result:e}=yield jt.generateToAddress(1,t.address);const{result:n}=yield jt.getBlock(e[0],2);if(n.confirmations<=0)throw new Error(`No confirmations on block mining: ${n.confirmations}`)})))(r)})))),e}));const{PrivateKey:te,Transaction:ee,Script:ne,PublicKey:re,crypto:{Point:oe}}=n.Bitcoin;const{Interpreter:se}=ne;const{Output:ie}=ee;const{MIN_NON_DUST_AMOUNT:ae}=M;const ce=new A;const ue=new U;const de=zt();const le=t=>({randomString:[...Array(Math.round(20*Math.random()))].map((()=>Math.random().toString(36)[2])).join(""),_owners:[t.publicKey.toString()],_amount:M.MIN_NON_DUST_AMOUNT,__cls:`class ${h.default.randomBytes(32).toString("hex")} {\n            constructor(n) {\n                this.n = n;\n            }\n            inc(n) {\n                this.n += n;\n                return this.n;\n            }\n        }`});let pe=[];before("transaction",(()=>S(void 0,void 0,void 0,(function*(){pe=yield function({n:t=1,random:e=!1}={}){return S(this,void 0,void 0,(function*(){const n=[];for(let r=0;r<t;r+=1)n.push(yield Qt({random:e}));return yield S(void 0,void 0,void 0,(function*(){let t=!1;do{try{const{result:e}=yield jt.generateToAddress(100,(new Dt).toHDPrivateKey("",Wt).derive(nt(Gt,Wt)).privateKey.toPublicKey().toAddress());t=100===e.length}catch(t){Q(500)}}while(!t)})),n}))}({n:8,random:!0})})))),describe("Transaction",(()=>{describe("constructor",(()=>{it("should create a new data transaction",(()=>{const t=new mt(ce,new te);e.expect(t).to.not.be.undefined;const n=t.tx.toJSON();e.expect(n.hash).eq(t.tx.id),e.expect(n.version).eq(1),e.expect(n.inputs.length).to.not.be.undefined,e.expect(n.inputs.length).eq(0),e.expect(n.outputs.length).to.not.be.undefined,e.expect(n.outputs.length).eq(0),e.expect(n.nLockTime).eq(0)}))})),describe("get inRevs",(()=>{it("Should work for put",(()=>S(void 0,void 0,void 0,(function*(){const t=new wt({mnemonic:de,path:pe.pop()});const n=new bt({wallet:t});const r=[le(t),le(t)];const{inRevs:o}=yield n.createTx([],r);e.expect(o).to.deep.eq([])})))),it("Should work for update",(()=>S(void 0,void 0,void 0,(function*(){const t=new wt({mnemonic:de,path:pe.pop()});const n=new bt({wallet:t});const r=yield n.put([le(t)]);const o=yield n.update(r,[le(t)]);e.expect(o).to.be.an("array").that.have.lengthOf(1),e.expect(o[0]).to.be.a("string");const s=o[0].split("/")[0];const{inRevs:i}=yield mt.fromTxId(s,ce,t.privateKey);e.expect(i).to.deep.eq(r)})))),it.skip("Should work for an update to two different puts",(()=>S(void 0,void 0,void 0,(function*(){const t=new wt({mnemonic:de,path:pe.pop()});const n=new bt({wallet:t});const r={a:"a".repeat(500)};const o=yield n.put([r,r]);const s=yield n.put([r]);const i=o.concat(...s);const a=(yield n.update(i,[le(t)]))[0].split("/")[0];const{inRevs:c}=yield mt.fromTxId(a,ce,t.privateKey);e.expect(Tt(c,i)).eq(!0)}))))})),describe("getOutData",(()=>{const t=new wt;const n=new bt({wallet:t});it("Should work for put",(()=>S(void 0,void 0,void 0,(function*(){const r=[le(t),le(t)];const o=yield n.createTx([],r);const s=yield o.getOutData(t.privateKey);e.expect(s).to.deep.eq(r)}))))})),describe("createDataOuts",(()=>{it("should broadcast a transaction using data",(()=>S(void 0,void 0,void 0,(function*(){const t=new wt({mnemonic:de,path:pe.pop()});const{address:n}=t;const r=yield t.restClient.getUtxosByAddress(t.address);const{privateKey:o}=t;const{publicKey:s}=t;const i={_owners:[s.toString()],_amount:ae,a:"a"};const a=new mt(ce,t.privateKey);r.forEach((t=>a.tx.from([new ee.UnspentOutput(t)]))),a.createDataOuts([i]),a.tx.change(n),a.tx.sign(o,M.SIGHASH_ALL);const{tx:c}=a;e.expect(c).to.not.be.undefined,e.expect(Array.isArray(c.inputs)).eq(!0),e.expect(c.inputs.length).to.be.greaterThan(0),e.expect(Array.isArray(c.outputs)).eq(!0),e.expect(a.tx.outputs.length).to.be.greaterThanOrEqual(2),e.expect(a.tx.outputs.length).to.be.lessThanOrEqual(3);const u=yield ue.sendTransaction(c.toString());e.expect(u).to.not.be.undefined})))),it("should broadcast a transaction with a lot of data",(()=>S(void 0,void 0,void 0,(function*(){const t=new wt({mnemonic:de,path:pe.pop()});const{address:n}=t;const r="a".repeat(500);const o=yield t.restClient.getUtxosByAddress(t.address);const{privateKey:s}=t;const{publicKey:i}=t;const a={_owners:[i.toString()],_amount:ae,a:r};const c=new mt(ce,t.privateKey);o.forEach((t=>c.tx.from([new ee.UnspentOutput(t)]))),c.createDataOuts([a]),c.tx.change(n),c.tx.sign(s,M.SIGHASH_ALL),e.expect(c).to.not.be.undefined,e.expect(Array.isArray(c.tx.inputs)).eq(!0),e.expect(c.tx.inputs.length).to.be.greaterThan(0),e.expect(Array.isArray(c.tx.outputs)).eq(!0),e.expect(c.tx.outputs.length).to.be.greaterThanOrEqual(3),e.expect(c.tx.outputs.length).to.be.lessThanOrEqual(24);const u=yield ue.sendTransaction(c.tx.toString());e.expect(u).to.not.be.undefined}))))})),describe("spendFromData",(()=>{it("should spend from an output",(()=>S(void 0,void 0,void 0,(function*(){const t=new te;const n=M.MIN_NON_DUST_AMOUNT;const r=M.SIGHASH_ALL;const o=[Xt(0),Xt(1),Xt(2)].map((t=>t.toString()));const s=new mt(ce,t);s.tx.from([new ee.UnspentOutput(Vt())]),s.createDataOuts([Object.assign({_owners:o,_amount:n},{a:1})]),s.tx.sign(Yt(),r);const i=new mt(ce,t);Object.defineProperty(i,"restClient",{get:()=>({getTransactions:()=>S(void 0,void 0,void 0,(function*(){return Promise.resolve([s.tx])}))})}),yield i.spendFromData([`${s.tx.id}/0`]),i.tx.to(Zt(),1e4),i.tx.sign(Yt(0),M.SIGHASH_ALL);const a=i.tx.inputs[0].script;const c=s.tx.outputs[0].script;const u=se.SCRIPT_VERIFY_P2SH;const d=(new se).verify(a,c,i.tx,0,u);e.expect(d).to.deep.eq(!0)}))))})),describe("from",(()=>{it("should spend from a transaction with data",(()=>S(void 0,void 0,void 0,(function*(){const t=M.SIGHASH_ALL;const n=new wt({mnemonic:de,path:pe.pop()});const{privateKey:r}=n;const o=new te("KwF9LjRraetZuEjR8VqEq539z137LW5anYDUnVK11vM3mNMHTWb4");const s=new te("L4PqnaPTCkYhAqH3YQmefjxQP6zRcF4EJbdGqR8v6adtG9XSsadY");const i=o.publicKey;const a=s.publicKey;const c="1".repeat(32);const u=oe.fromX(!1,c);const d=new re(u);e.expect(d.point.getX().toString("hex",32)).eq(c);const l=(new ne).add("OP_1").add(i.toBuffer()).add(a.toBuffer()).add(d.toBuffer()).add("OP_3").add("OP_CHECKMULTISIG");const p=yield n.restClient.getUtxosByAddress(n.address);const h=new mt(ce,n.privateKey);p.forEach((t=>h.tx.from([new ee.UnspentOutput(t)]))),h.tx.addOutput(new ie({script:l,satoshis:M.MIN_NON_DUST_AMOUNT})),h.tx.change(n.address),h.tx.sign(r,t);const f=yield ue.sendTransaction(h.tx.toString());e.expect(f).to.not.be.undefined}))))})),describe("fromTxId",(()=>{it("should return a data transaction from a random txId",(()=>S(void 0,void 0,void 0,(function*(){const t=new wt({mnemonic:de,path:pe.pop()});const n=yield t.restClient.getUtxosByAddress(t.address);const{publicKey:r}=t;const o={_owners:[r.toString()],_amount:ae};const s={data:{a:Math.random().toString()}};const i=new mt(ce,t.privateKey);n.forEach((t=>i.tx.from([new ee.UnspentOutput(t)]))),i.createDataOuts([Object.assign(Object.assign({},o),s)]);const a=yield t.fundAndSendTx(i);e.expect(a).to.not.be.undefined;const c=yield mt.fromTxId(a,ce,t.privateKey);e.expect(c).to.have.property("restClient"),e.expect(c).to.have.property("tx"),e.expect(c).to.have.property("outData")}))))}))}));
