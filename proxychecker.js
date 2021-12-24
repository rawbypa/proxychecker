/**** This script was made by Jas [ 23/12/2021 :: 19:42 PM ] ****/

const proxycheck = require('checker-proxy');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

let proxylist = process.argv[2];
let proxytype = process.argv[3]
let validproxy = process.argv[4];

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
    timeout: 10000
}
	
let l = require('fs').readFileSync(proxylist, 'utf-8').replace(/\r|\"/gi, '').split("\n")

l.forEach(a => {
    proxycheck.check({
        url: config.url,
        type: config.type,
        proxy: a,
        timeout: 10000
    }).then(r => {
        i++ // AllProxyChecked++
        if (r.code !== 200) {
	    s++ // BadProxy++
            console.info(`\x1b[0m</ \x1b[37;101mJASPWN\x1b[0m > [\x1b[91mx\x1b[0m] \x1b[91mBroken proxy \x1b[0m: \x1b[91m${r.proxy.replace("http://", "")} \x1b[0m#${i} (Out checked: \x1b[95m${i}\x1b[0m/\x1b[95m${l.length} \x1b[0m- \x1b[91m${s}\x1b[0m/\x1b[91m${l.length} \x1b[0minvalid proxies)\x1b[0m`)
        } else if (r.code == 200) {
            require('fs').appendFileSync(config.file, a + '\n')
	    p++ // GoodProxy++
	    console.info(`\x1b[0m</ \x1b[37;101mJASPWN\x1b[0m > [\x1b[92m!\x1b[0m] \x1b[92mValid  proxy \x1b[0m: \x1b[92m${r.proxy.replace("http://", "")} \x1b[0m#${i} (Out checked: \x1b[95m${i}\x1b[0m/\x1b[95m${l.length} \x1b[0m- \x1b[92m${p}\x1b[0m/\x1b[92m${l.length} \x1b[0mvalid proxies)\x1b[0m`)
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
