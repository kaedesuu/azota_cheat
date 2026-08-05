# azota_cheat
konnichiwa!\
it took a little bit of time for me to reverse engineer this web application. They have secured it on the backend, so maybe a few things might be hard to reverse engineer.

# installation
1. install userscripts extension. I recommend using tampermonkey.
2. install the scripts:
- [anti_app_restriction](./anti_app_restriction/README.md): bypass azota's app restriction, and allow you to take a test on web without requiring the azota student app.
- [anti_fullscreen_bypass](./anti_fullscreen_bypass/README.md): bypass Azota's force fullscreen feature, and this script allows you to bypass that feature. Even if you switch between tabs or windows, teacher **will NOT notice that you are cheating**.
- [no_timer](./no_timer/README.md): makes time infinite so you can submit the answer at anytime. **(NOTE: if teacher stops the test or close it, you won't be able to submit the answer, so DON'T USE this in a serious test/exam).**
3. you can take a test or do homework on azota after the installation.

# disclaimer
The content and code in this repository are provided solely for **educational and research purposes**.\
**You're 100% responsible for your own actions.** By downloading, viewing, or utilizing any code or information provided in this repository, you acknowledge and agree that the creator/author of this project is in no way liable for damages, bans, or legal consequences that may arise from misuse or misapplication.

## behind azota's encryption
Azota has encrypted their API to confuse users or people who do reverse engineering by using the term `hash`, but it seems more like `encryption` to me.
You can read the full explanation of how I decrypted those data in the [azota_encode_decode_module.js](./modules/azota_encode_decode_module.js) script,\
If you are confused at those random numbers like `wpRequire(87941)` or `wpRequire(30598)`, that's the chunk number of where the function is stored inside the azota's web application code.

By using these functions below, you can read the encrypted content:
```js
window._encode_(str)
window._decode_(str)
```

How to know if it's encrypted?
- If the string is long and doesn't make any sense. (If you can't decrypt it using `window._decode_` then it's not encrypted but a key to something, like cookies, or some token).

How do we find those strings?
- Check the Network Tab in Developer Tools.
