# azota_cheat
konnichiwa!\
it took a little bit of time for me to reverse engineer this web application. They have secured it on the backend, so maybe a few things might be hard to reverse engineer.

## encryption
Azota has encrypted their API to confuse users or people who do reverse engineering by using the term `hash`, but it seems more like `encryption` to me.
You can read the full explanation of how I decrypted those data in the `azota_encode_decode_module.js` script,\
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

## no_timer
No timer actually works, but you must execute it right at the moment when the page is loaded (that's why you need to install `no_timer.user.js` into userscript extensions like tampermonkey).\
It also seems like they have secured the API from their backend too, so avoid submitting the test if you haven't done it yet.

## anti_fullscreen
This will block the client from sending APIs to the server and telling sensei that we have been using cheats.\
There's a **blue button** telling you that you are being tracked (by Azota), **just click `yes` and disable fullscreen by pressing F11**.
