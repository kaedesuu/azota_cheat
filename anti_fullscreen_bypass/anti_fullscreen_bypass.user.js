// ==UserScript==
// @name         azota_anti_fullscreen
// @namespace    https://github.com/kaedesuu/azota_cheat/
// @version      2025-12-19
// @description  Disable Azota's fullscreen force.
// @author       kaedesuu
// @include      /^https?:\/\/azota\.vn\/.*\/test\/take-test\/.*$/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=azota.vn
// @license      GPL-3.0
// @grant        none
// ==/UserScript==

(function () {
  "use strict";
  (() => {
    const original_xhr = window.XMLHttpRequest;

    class injected_xhr extends original_xhr {
      xhr_url;
      open(method, url) {
        this.xhr_url = url;
        return super.open(method, url);
      }
      send(body) {
        if (
          this.xhr_url
            ?.toString()
            .toLowerCase()
            .replaceAll(" ", "")
            .includes("frontexamtrack/saveobj")
        ) {
          if (body.includes("exit_full_screen") || body.includes("blur_window"))
            return;
        }
        return super.send(body);
      }
    }

    window.XMLHttpRequest = injected_xhr;
  })();
})();
