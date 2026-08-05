(() => {
  // get original variable
  const original_xhr = window.XMLHttpRequest;
  
  // potential request route
  // usually it's is "https://azt-testbank-api.azota.vn/api/FrontExam/InitData?hashId=&hasInfo=0&device=&practice=0&isWebDevice=1"
  const potential_route = "frontexam/initdata"

  // webpack name (azota changes the name very frequently)
  const azt_webpackname = Object.keys(window).find((el) => el?.toString().toLowerCase().replaceAll(" ", "").includes("webpack"));

  // Webpack require
  let wpRequire = window[azt_webpackname].push([[Symbol()], {}, (r) => r]); // Thanks to aamia's CompleteDiscordQuest.md script!!
  const gzipHelper = wpRequire(87941).f.prototype; // On the chunk #87941

  // resultContentSupport seems to miss the `this` variable, that's why it run the catch {} block and return the whole string instead of doing its job.
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
  // the solution to this error can be fixed by using the first class (yes and I found it, you can see that gzipHelper variable on the line above).

  const str_hashExtractTemplate =
    wpRequire(30598).R.prototype.getContentHashConfigSystem.bind(
      env_gzipHelper,
    )();

  // It seems like the above is a string, we need to use castJsonToObj function provided by Azota.
  /* There are way too many castJsonToObj functions.
    How did I know the right one? Well, take a look at line #49981 in main.js script (of Azota)
    this.hashExtractTemplate = this.commonService.castJsonToObj(this.commonService.getContentHashConfigSystem()) ?? []

    the getContentHashConfigSystem() makes me realize that castJsonToObj should be the same, because they are in the same `this.commonSerice`
  */
  const hashExtractTemplate =
    wpRequire(30598).R.prototype.castJsonToObj.bind(env_gzipHelper)(
      str_hashExtractTemplate,
    ) ?? []; // i need to make them all the same, and match original logic condition (so copy the "?? []" from their code)

  const env_hashExtractTemplate = {
    hashExtractTemplate: hashExtractTemplate,
    commonService: {
      castJsonToObj: (...args) =>
        wpRequire(30598).R.prototype.castJsonToObj.bind(env_gzipHelper)(
          ...args,
        ),
    },
  }; // Create a fake this.hashExtractTemplate for .bind(), .bind() function will read the variable inside and turn into "this" variable

  const azt_encode = (str) =>
    wpRequire(98230).w.prototype.encode.bind(env_hashExtractTemplate)(str);
  const azt_decode = (str) =>
    wpRequire(98230).w.prototype.decode.bind(env_hashExtractTemplate)(str);

  // from stackoverflow
  const isJson = (item) => {
    let value = typeof item !== "string" ? JSON.stringify(item) : item;
    try {
      value = JSON.parse(value);
    } catch (e) {
      return false;
    }

    return typeof value === "object" && value !== null;
  }

  // you need to capture the http request
  window.XMLHttpRequest = class extends original_xhr {
    xhr_url;
    open(method, url) {
      // change the params if in specific condition
      // changes isWebDevice=1 to isWebDevice=0
      if (url?.toString()?.toLowerCase().replaceAll(" ", "").includes(potential_route)) {
        try {
          const url_obj = new URL(url);
          url_obj.searchParams.set("isWebDevice", "0");

          // apply the modification
          url = url_obj?.toString();
        } catch (err) {
          console.log("something went wrong with the anti_app_restriction script, please read the error and fix the code or report it onto the github issues");
          console.log(err);
        }
      }

      // set xhr_url and return default open()
      this.xhr_url = url;
      return super.open(method, url);
    }
    send(body) {
      // make sure specific url matches
      if (this.xhr_url?.toString()?.toLowerCase().replaceAll(" ", "").includes(potential_route)) {
        // check for onload
        super.addEventListener("readystatechange", () => {
          // make sure readystate is 4 (=== onload() function)
          // uses readystatechange event watcher to avoid timing issues and race condition
          if (this.readyState !== 4) return;

          // spoofing response
          try {
            // decode the data
            const is_json_res = isJson(this.response);
            const server_resdata = is_json_res ? JSON.parse(this.response) : this.response;
            const decoded_data = azt_decode(server_resdata?.data?.content);

            // change the allow app only to 0 to set it to false
            decoded_data["examConfigObj"]["allowAppOnly"] = 0;

            // encode it back and set the value
            const encoded_data = azt_encode(decoded_data);
            server_resdata["data"]["content"] = encoded_data;
            Object.defineProperty(this, "response", { value: is_json_res ? JSON.stringify(server_resdata) : server_resdata });
            Object.defineProperty(this, "responseText", { value: is_json_res ? JSON.stringify(server_resdata) : server_resdata });
          } catch (err) {
            console.log("something went wrong with the anti_app_restriction script, please read the error and fix the code or report it onto the github issues");
            console.log(err)
          }
        })
      }

      // return the the original send(), the Object.defineProperty already locked the value so i guess it's ok
      return super.send(body);
    }
  }
})();