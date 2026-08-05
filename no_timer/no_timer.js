// line 43238: this.currentTakeTestStepData.countDownSecond = Infinity; (could lead to Infinity time)
// but that method is not possible since they are wrapped in a function (since you can't access inner scope's variable)... so hook into the API instead
// the line 43238 is in 140.8682c63b1b18e3bf.js

(() => {
  const original_xhr = window.XMLHttpRequest;
  const original_fetch = window.fetch;

  // webpack name (azota changes the name very frequently)
  const azt_webpackname = Object.keys(window).find((el) => el?.toString().toLowerCase().replaceAll(" ", "").includes("webpack"));

  // Webpack require
  let wpRequire = window[azt_webpackname].push([[Symbol()], {}, (r) => r]); // Thanks to aamia's CompleteDiscordQuest.md script!! 
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
  // the solution to this error can be fixed by finding the first class (yes and I found it, you can see that gzipHelper on the line above).

  const str_hashExtractTemplate =
    wpRequire(30598).R.prototype.getContentHashConfigSystem.bind(
      env_gzipHelper,
    )();

  // It seems like the above is a string, we need to use castJsonToObj function provided by Azota.
  /* They are way too many castJsonToObj functions.
    How did I know the right one? Well, take a look at line #49981 in main.js script (of Azota)
    this.hashExtractTemplate = this.commonService.castJsonToObj(this.commonService.getContentHashConfigSystem()) ?? []

    the getContentHashConfigSystem() makes me realize that castJsonToObj should be the same, because they are in the same `this.commonSerice`
  */
  const hashExtractTemplate =
    wpRequire(30598).R.prototype.castJsonToObj.bind(env_gzipHelper)(
      str_hashExtractTemplate,
    ) ?? []; // i need to make them all the same, and match the original logic condition (so copy the "?? []" from their code)

  const env_hashExtractTemplate = {
    hashExtractTemplate: hashExtractTemplate,
    commonService: {
      castJsonToObj: (...args) =>
        wpRequire(30598).R.prototype.castJsonToObj.bind(env_gzipHelper)(
          ...args,
        ),
    },
  }; // Create a fake this.hashExtractTemplate for .bind(), .bind() function will read the variable inside and turn into "this variable

  // a private function for encode and decode
  const _encode = (str) =>
    wpRequire(98230).w.prototype.encode.bind(env_hashExtractTemplate)(str);
  const _decode = (str) =>
    wpRequire(98230).w.prototype.decode.bind(env_hashExtractTemplate)(str);

  // Sample xhr injection
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
