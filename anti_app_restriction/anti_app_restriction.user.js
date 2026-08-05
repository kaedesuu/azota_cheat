// ==UserScript==
// @name         anti_app_restriction
// @namespace    https://github.com/kaedesuu/azota_cheat/
// @version      2026-08-05
// @description  bypass azota's app restriction and allow you to take the test on web without installing their app
// @author       kaedesuu
// @match        https://azota.vn/*/test/take-test/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=azota.vn
// @license      GPL-3.0
// @grant        none
// ==/UserScript==

// if you want to see original version which is not minifed
;(()=>{const t=window.XMLHttpRequest,e="frontexam/initdata",o=Object.keys(window).find(t=>t?.toString().toLowerCase().replaceAll(" ","").includes("webpack"));let r=window[o].push([[Symbol()],{},t=>t]);const n=r(87941).f.prototype,s=n.resultContentSupport;n.resultContentSupport=(...t)=>s.bind({stringFirst:"<z>:"})(...t);const i={gzipHelper:n,stringFirst:"<z>:",sAztCommonReplaceService:{castJsonToObj:r(54450).Z.prototype.castJsonToObj}},p=r(30598).R.prototype.getContentHashConfigSystem.bind(i)(),a={hashExtractTemplate:r(30598).R.prototype.castJsonToObj.bind(i)(p)??[],commonService:{castJsonToObj:(...t)=>r(30598).R.prototype.castJsonToObj.bind(i)(...t)}};window.XMLHttpRequest=class extends t{xhr_url;open(t,o){if(o?.toString()?.toLowerCase().replaceAll(" ","").includes(e))try{const t=new URL(o);t.searchParams.set("isWebDevice","0"),o=t?.toString()}catch(t){console.log("something went wrong with the anti_app_restriction script, please read the error and fix the code or report it onto the github issues"),console.log(t)}return this.xhr_url=o,super.open(t,o)}send(t){return this.xhr_url?.toString()?.toLowerCase().replaceAll(" ","").includes(e)&&super.addEventListener("readystatechange",()=>{var t;if(4===this.readyState)try{const e=(t=>{let e="string"!=typeof t?JSON.stringify(t):t;try{e=JSON.parse(e)}catch(t){return!1}return"object"==typeof e&&null!==e})(this.response),o=e?JSON.parse(this.response):this.response,n=(t=o?.data?.content,r(98230).w.prototype.decode.bind(a)(t));n.examConfigObj.allowAppOnly=0;const s=(t=>r(98230).w.prototype.encode.bind(a)(t))(n);o.data.content=s,Object.defineProperty(this,"response",{value:e?JSON.stringify(o):o}),Object.defineProperty(this,"responseText",{value:e?JSON.stringify(o):o})}catch(t){console.log("something went wrong with the anti_app_restriction script, please read the error and fix the code or report it onto the github issues"),console.log(t)}}),super.send(t)}}})();