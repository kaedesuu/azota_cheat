// ==UserScript==
// @name         azota_notimer
/
// @version      2025-12-19
// @description  Disable Azota's timer.
// @author       kaede
// @match        https://azota.vn/vi/test/take-test/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=azota.vn
// @grant        none
// ==/UserScript==

(function () {
  "use strict";
  // line 43238: this.currentTakeTestStepData.countDownSecond = Infinity; (could lead to Infinity time)
  // but that method is not possible since they are wrapped in a function (so you can't access inner scope's variable). So inject into API.
  // the line 43238 is in 140.8682c63b1b18e3bf.js

  (() => {
    const original_xhr = window.XMLHttpRequest;
    const original_fetch = window.fetch;

    // Webpack require
    let wpRequire = window.webpackChunkCoreMod.push([[Symbol()], {}, (r) => r]); // Thanks to aamia's CompleteDiscordQuest.md script!!
    const gzipHelper = wpRequire(87941).f.prototype; // On the chunk #87941

    // resultContentSupport seems to miss the `this` variable, that's why it run the catch {} block, and return the whole string instead of doing its job.
    const o_resultContentSupport = gzipHelper.resultContentSupport;
    gzipHelper.resultContentSupport = (...args) =>
      o_resultContentSupport.bind({ stringFirst: "<z>:" })(...args);

    // create fake "this" environment for hashExtractTemplate
    const env_gzipHelper = {
      gzipHelper: gzipHelper,
      stringFirst: "<z>:",
      sAztCommonReplaceService: {
        castJsonToObj: wpRequire(54450).Z.prototype.castJsonToObj,
      },
    };

    // wpRequire(30598).R.prototype.getContentHashConfigSystem()
    // ERROR: can't access property "resultContentSupport", this.gzipHelper is undefined
    // I found solution to this error, is by finding the first class (yes and I found it, right now you can see that gzipHelper variable is up there).

    const str_hashExtractTemplate =
      wpRequire(30598).R.prototype.getContentHashConfigSystem.bind(
        env_gzipHelper,
      )();

    // It seems like the above is a string, we need to use castJsonToObj function provided by Azota.
    /* There are way too many castJsonToObj functions.
    How did I know the right one? Well, take a look at line #49981 in main.js script (of Azota)
    this.hashExtractTemplate = this.commonService.castJsonToObj(this.commonService.getContentHashConfigSystem()) ?? []

    the getContentHashConfigSystem() make me realize that castJsonToObj should be the same, because they are in the same `this.commonSerice`
  */
    const hashExtractTemplate =
      wpRequire(30598).R.prototype.castJsonToObj.bind(env_gzipHelper)(
        str_hashExtractTemplate,
      ) ?? []; // i need to make them all the same, and matches logic (so copy the "?? []")

    const env_hashExtractTemplate = {
      hashExtractTemplate: hashExtractTemplate,
      commonService: {
        castJsonToObj: (...args) =>
          wpRequire(30598).R.prototype.castJsonToObj.bind(env_gzipHelper)(
            ...args,
          ),
      },
    }; // Create a fake this.hashExtractTemplate for .bind(), .bind() function will read the variable inside and turn into "this variable

    // Now you can encode and decode the content, you can use `window._encode_` and `window._decode_` in your browser's console now!!!
    const _encode = (str) =>
      wpRequire(98230).w.prototype.encode.bind(env_hashExtractTemplate)(str);
    const _decode = (str) =>
      wpRequire(98230).w.prototype.decode.bind(env_hashExtractTemplate)(str);

    class injected_xhr extends original_xhr {
      xhr_url;
      open(method, url) {
        this.xhr_url = url;
        return super.open(method, url);
      }
      addEventListener(...data) {
        return super.addEventListener(data[0], (...req) => {
          if (
            this.xhr_url
              ?.toString()
              .toLowerCase()
              .replaceAll(" ", "")
              .includes("api/frontexam/initdata") &&
            (data[0].includes("readystatechange") || data[0].includes("load"))
          ) {
            const _json = JSON.parse(this.response);
            const data = _decode(_json?.data?.content);
            data.examObj.minutes = Infinity;
            _json.data.content = _encode(data);

            let new_res = JSON.stringify(_json);
            Object.defineProperty(this, "responseText", {
              writable: true,
              value: new_res,
            });
            Object.defineProperty(this, "response", {
              writable: true,
              value: new_res,
            });
          }

          return data[1](...req);
        });
      }
      onload(...data) {
        if (
          this.xhr_url
            ?.toString()
            .toLowerCase()
            .replaceAll(" ", "")
            .includes("api/frontexam/initdata")
        ) {
          const _json = JSON.parse(this.response);
          const data = _decode(_json?.data?.content);
          data.examObj.minutes = Infinity;
          _json.data.content = _encode(data);

          let new_res = JSON.stringify(_json);
          Object.defineProperty(this, "responseText", {
            writable: true,
            value: new_res,
          });
          Object.defineProperty(this, "response", {
            writable: true,
            value: new_res,
          });
        }

        return super.onload(...data);
      }
      onreadystatechange(...data) {
        console.log(...data);
        if (
          this.xhr_url
            ?.toString()
            .toLowerCase()
            .replaceAll(" ", "")
            .includes("api/frontexam/initdata") &&
          this.readyState === XMLHttpRequest.DONE
        ) {
          const _json = JSON.parse(this.response);
          const data = _decode(_json?.data?.content);
          data.examObj.minutes = Infinity;
          _json.data.content = _encode(data);

          let new_res = JSON.stringify(_json);
          Object.defineProperty(this, "responseText", {
            writable: true,
            value: new_res,
          });
          Object.defineProperty(this, "response", {
            writable: true,
            value: new_res,
          });
        }

        return super.onreadystatechange(...data);
      }
    }

    window.XMLHttpRequest = injected_xhr;
    window.fetch = async (...arg) => {
      const _fetch = await original_fetch(...arg);
      if (
        !arg[0]
          ?.toString()
          .toLowerCase()
          .replaceAll(" ", "")
          .includes("api/frontexam/initdata")
      )
        return _fetch;

      // Spoof minutes data
      const _json = await _fetch.json();
      const data = _decode(_json?.data?.content);
      data.examObj.minutes = Infinity;
      _json.data.content = _encode(data);

      // Tamper json() and text() function.
      _fetch.json = () => Promise.resolve(_json);
      _fetch.text = () => Promise.resolve(JSON.stringify(_json));

      // return the new spoofed function
      return Promise.resolve(_fetch);
    };
  })(); // line 43238: this.currentTakeTestStepData.countDownSecond = Infinity; (could lead to Infinity time)
  // but that method is not possible since they are wrapped in a function (so you can't access inner scope's variable). So inject into API.
  // the line 43238 is in 140.8682c63b1b18e3bf.js

  (() => {
    const original_xhr = window.XMLHttpRequest;
    const original_fetch = window.fetch;

    // Webpack require
    let wpRequire = window.webpackChunkCoreMod.push([[Symbol()], {}, (r) => r]); // Thanks to aamia's CompleteDiscordQuest.md script!!
    const gzipHelper = wpRequire(87941).f.prototype; // On the chunk #87941

    // resultContentSupport seems to miss the `this` variable, that's why it run the catch {} block, and return the whole string instead of doing its job.
    const o_resultContentSupport = gzipHelper.resultContentSupport;
    gzipHelper.resultContentSupport = (...args) =>
      o_resultContentSupport.bind({ stringFirst: "<z>:" })(...args);

    // create fake "this" environment for hashExtractTemplate
    const env_gzipHelper = {
      gzipHelper: gzipHelper,
      stringFirst: "<z>:",
      sAztCommonReplaceService: {
        castJsonToObj: wpRequire(54450).Z.prototype.castJsonToObj,
      },
    };

    // wpRequire(30598).R.prototype.getContentHashConfigSystem()
    // ERROR: can't access property "resultContentSupport", this.gzipHelper is undefined
    // I found solution to this error, is by finding the first class (yes and I found it, right now you can see that gzipHelper variable is up there).

    const str_hashExtractTemplate =
      wpRequire(30598).R.prototype.getContentHashConfigSystem.bind(
        env_gzipHelper,
      )();

    // It seems like the above is a string, we need to use castJsonToObj function provided by Azota.
    /* They are way too many castJsonToObj functions.
    How did I know the right one? Well, take a look at line #49981 in main.js script (of Azota)
    this.hashExtractTemplate = this.commonService.castJsonToObj(this.commonService.getContentHashConfigSystem()) ?? []

    the getContentHashConfigSystem() make me realize that castJsonToObj should be the same, because they are in the same `this.commonSerice`
  */
    const hashExtractTemplate =
      wpRequire(30598).R.prototype.castJsonToObj.bind(env_gzipHelper)(
        str_hashExtractTemplate,
      ) ?? []; // i need to make them all the same, and matches logic (so copy the "?? []")

    const env_hashExtractTemplate = {
      hashExtractTemplate: hashExtractTemplate,
      commonService: {
        castJsonToObj: (...args) =>
          wpRequire(30598).R.prototype.castJsonToObj.bind(env_gzipHelper)(
            ...args,
          ),
      },
    }; // Create a fake this.hashExtractTemplate for .bind(), .bind() function will read the variable inside and turn into "this variable

    // Now you can encode and decode the content, you can use `window._encode_` and `window._decode_` in your browser's console now!!!
    const _encode = (str) =>
      wpRequire(98230).w.prototype.encode.bind(env_hashExtractTemplate)(str);
    const _decode = (str) =>
      wpRequire(98230).w.prototype.decode.bind(env_hashExtractTemplate)(str);

    class injected_xhr extends original_xhr {
      xhr_url;
      open(method, url) {
        this.xhr_url = url;
        return super.open(method, url);
      }
      addEventListener(...data) {
        return super.addEventListener(data[0], (...req) => {
          if (
            this.xhr_url
              ?.toString()
              .toLowerCase()
              .replaceAll(" ", "")
              .includes("api/frontexam/initdata") &&
            (data[0].includes("readystatechange") || data[0].includes("load"))
          ) {
            const _json = JSON.parse(this.response);
            const data = _decode(_json?.data?.content);
            data.examObj.minutes = Infinity;
            _json.data.content = _encode(data);

            let new_res = JSON.stringify(_json);
            Object.defineProperty(this, "responseText", {
              writable: true,
              value: new_res,
            });
            Object.defineProperty(this, "response", {
              writable: true,
              value: new_res,
            });
          }

          return data[1](...req);
        });
      }
      onload(...data) {
        if (
          this.xhr_url
            ?.toString()
            .toLowerCase()
            .replaceAll(" ", "")
            .includes("api/frontexam/initdata")
        ) {
          const _json = JSON.parse(this.response);
          const data = _decode(_json?.data?.content);
          data.examObj.minutes = Infinity;
          _json.data.content = _encode(data);

          let new_res = JSON.stringify(_json);
          Object.defineProperty(this, "responseText", {
            writable: true,
            value: new_res,
          });
          Object.defineProperty(this, "response", {
            writable: true,
            value: new_res,
          });
        }

        return super.onload(...data);
      }
      onreadystatechange(...data) {
        console.log(...data);
        if (
          this.xhr_url
            ?.toString()
            .toLowerCase()
            .replaceAll(" ", "")
            .includes("api/frontexam/initdata") &&
          this.readyState === XMLHttpRequest.DONE
        ) {
          const _json = JSON.parse(this.response);
          const data = _decode(_json?.data?.content);
          data.examObj.minutes = Infinity;
          _json.data.content = _encode(data);

          let new_res = JSON.stringify(_json);
          Object.defineProperty(this, "responseText", {
            writable: true,
            value: new_res,
          });
          Object.defineProperty(this, "response", {
            writable: true,
            value: new_res,
          });
        }

        return super.onreadystatechange(...data);
      }
    }

    window.XMLHttpRequest = injected_xhr;
    window.fetch = async (...arg) => {
      const _fetch = await original_fetch(...arg);
      if (
        !arg[0]
          ?.toString()
          .toLowerCase()
          .replaceAll(" ", "")
          .includes("api/frontexam/initdata")
      )
        return _fetch;

      // Spoof minutes data
      const _json = await _fetch.json();
      const data = _decode(_json?.data?.content);
      data.examObj.minutes = Infinity;
      _json.data.content = _encode(data);

      // Tamper json() and text() function.
      _fetch.json = () => Promise.resolve(_json);
      _fetch.text = () => Promise.resolve(JSON.stringify(_json));

      // return the new spoofed function
      return Promise.resolve(_fetch);
    };
  })();
})();
