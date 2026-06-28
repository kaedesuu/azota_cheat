# azota_cheat
konnichiwa!\
it took a little bit of time for me to reverse engineering this web application. They have secured on the backend, so maybe a little bit of things might be hard to reverse engineering.

# encryption
To talk about `encryption`, Azota has encrypted their API and confuse users or people who do reverse engineering by saying `hash`, it's more like `encryption` to me.
You can read the full explanation how I decrypted those data in the `azota_encode_decode_module.js` script,\
If you are confused at those random number like `wpRequire(87941)` or `wpRequire(30598)`, that's the chunk number of where the function is stored inside the azota's web application code.

By using these functions below, you can read encrypted content:
```js
window._encode_(str)
window._decode_(str)
```

How to know if it's encrypted? Well, if the string is long and doesn't make any sense. (If you can't decrypt it using `window._decode_` then it's not encrypted but a key to something, like cookie, or some token).\
How do we find those strings? Check the Network Tab in Developer Tools.

# no_timer
No timer actually work, but you must execute it right at the moment when the page is loaded (that's why you need to install `no_timer.user.js` into userscript extensions).\
It also seems like they have secured the API from backend too, so avoid submit the test if you haven't done it yet.

# anti_fullscreen
This will block the client from sending API to server and telling sensei that we have cheated.\
There's a **blue button** telling you that you are being tracked (by Azota), if yes then click it and disable fullscreen by pressing F11.
