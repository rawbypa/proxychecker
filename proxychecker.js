/**** This script was made by Rawsilver (Saatoum) [ 24/12/2021 :: 18:12 PM ] ****/

const proxycheck = require('checker-proxy');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const path = require('path');

let proxylist = process.argv[2];
if (!proxylist) {
    console.log("\x1b[31m error\x1b[37m: proxylist missing.");
    console.log("\x1b[36m usage\x1b[37m: node "+ path.basename(__filename) +" <proxylist to check> <type of proxy> <output file> <timeout>\x1b[0m");
    process.exit();
}
let proxytype = process.argv[3];
if (!proxytype) {
    console.log("\x1b[31m error\x1b[37m: proxy type missing.");
    console.log("\x1b[36m usage\x1b[37m: node "+ path.basename(__filename) +" <proxylist to check> <type of proxy> <output file> <timeout>\x1b[0m");
    process.exit();
}
let validproxy = process.argv[4];
if (!validproxy) {
    console.log("\x1b[31m error\x1b[37m: output file missing.");
    console.log("\x1b[36m usage\x1b[37m: node "+ path.basename(__filename) +" <proxylist to check> <type of proxy> <output file> <timeout>\x1b[0m");
    process.exit();
}
let timeout = process.argv[5];
if (!validproxy) {
    console.log("\x1b[31m error\x1b[37m: output file missing.");
    console.log("\x1b[36m usage\x1b[37m: node "+ path.basename(__filename) +" <proxylist to check> <type of proxy> <output file> <timeout>\x1b[0m");
    process.exit();
}
if (process.argv.length < 5) {
    console.log("\x1b[31m error\x1b[37m: wrong usage!");
    console.log("\x1b[36m usage\x1b[37m: node "+ path.basename(__filename) +" <proxylist to check> <type of proxy> <output file> <timeout>\x1b[0m");
    process.exit(0);
}

var i = 0;
var p = 0;
var s = 0;

ignoreNames = ['RequestError', 
               'StatusCodeError', 
               'CaptchaError', 
               'CloudflareError', 
               'ParseError', 
               'ParserError', 
               'ReferenceError', 
               'AssertionError',
               'Error'
              ],

ignoreCodes = ['ECONNRESET', 
               'ERR_ASSERTION', 
               'ECONNREFUSED', 
               'EPIPE', 
               'EHOSTUNREACH', 
               'ETIMEDOUT', 
               'ESOCKETTIMEDOUT', 
               'EPROTO', 
               'ERR_ASSERTION'
              ];


process.on('uncaughtException', function (e) {
    if (e.code && ignoreCodes.includes(e.code) || e.name && ignoreNames.includes(e.name)) return !1;
    console.warn(e);
}).on('unhandledRejection', function (e) {
    if (e.code && ignoreCodes.includes(e.code) || e.name && ignoreNames.includes(e.name)) return !1;
    console.warn(e);
}).on('warning', e => {
    if (e.code && ignoreCodes.includes(e.code) || e.name && ignoreNames.includes(e.name)) return !1;
    console.warn(e);
}).setMaxListeners(0);

let config = {
    type: proxytype,
    url: 'https://google.com/',
    file: validproxy,
    timeout: timeout
}
  
let l = require('fs').readFileSync(proxylist, 'utf-8').replace(/\r|\"/gi, '').split("\n")

l.forEach(a => {
    proxycheck.check({
        url: config.url,
        type: config.type,
        proxy: a,
        timeout: timeout
    }).then(r => {
        i++ // AllProxyChecked++
        if (r.code !== 200) {
      s++ // BadProxy++
            console.info(`[\x1b[91mx\x1b[0m] \x1b[91mBroken proxy \x1b[0m: \x1b[91m${r.proxy.replace("http://", "")} \x1b[0m#${i} (Out checked: \x1b[95m${i}\x1b[0m/\x1b[95m${l.length} \x1b[0m- \x1b[91m${s}\x1b[0m/\x1b[91m${l.length} \x1b[0minvalid proxies)\x1b[0m`)
        } else if (r.code == 200) {
            require('fs').appendFileSync(config.file, a + '\n')
      p++ // GoodProxy++
      console.info(`[\x1b[92m!\x1b[0m] \x1b[92mValid  proxy \x1b[0m: \x1b[92m${r.proxy.replace("http://", "")} \x1b[0m#${i} (Out checked: \x1b[95m${i}\x1b[0m/\x1b[95m${l.length} \x1b[0m- \x1b[92m${p}\x1b[0m/\x1b[92m${l.length} \x1b[0mvalid proxies)\x1b[0m`)
        }
    }).catch(e => {
      //return error
        console.error(e)
        process.exit()
    })
})
  
return {
    proxy: String,
    type: String,
    code: Number
}
  
return {
    proxy: String,
    type: String,
    code: { type: Number, default: 500 },
    err: String
}
