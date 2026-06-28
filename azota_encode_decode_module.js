// After spending days + hours, I finally understand how webpack work
// And reverse engineered this Azota thing.
// The decode process is not really hard, they require webpack knowledge and reverse logic. But It's hard if we don't get how the code work, but I believe by using simple reverse logic, you should be able to do something like this

(() => {
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
  window._encode_ = (str) =>
    wpRequire(98230).w.prototype.encode.bind(env_hashExtractTemplate)(str);
  window._decode_ = (str) =>
    wpRequire(98230).w.prototype.decode.bind(env_hashExtractTemplate)(str);
})();
