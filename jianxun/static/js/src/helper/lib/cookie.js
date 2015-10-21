/**
 * @name cookie.js
 * @author: jialezhang  
 */
function generateCookieString(count) {
    var name = "name",
        stringParts = [],
        array = new Array(6);
    for(var j = 1; j <= count; j++)
    {
        stringParts.push(name + j + '=' + array.join(name+j));
    }
    return stringParts.join(';');
}
// 稍慢

function string(name, cookie) {
    setPos = cookie.indexOf(name + '='), stopPos = cookie.indexOf(';', setPos);

    // Dataset does not exist, attempt to register default
    return !~setPos ? null : cookie.substring(
        setPos, ~stopPos ? stopPos : undefined).split('=')[1];
}
// 最快
function regexp(name, cookie) {
    var regex = new RegExp(name + '=([^;]*)', 'g'),
        result = regex.exec(cookie);

    return result[1] || null;
}
function getStrCookie(name) {
    var regex = new RegExp("(^" + name + "=([a-zA-Z-_0-9]+);?.*)|(.*;\\s?" + name + "=([a-zA-Z-_0-9]+);?.*)"),
        cookie = document.cookie;
    return cookie.match(regex) ? cookie.replace(regex, "$2$4") : '';
}

function lawnchair(name, cookie) {
    var nameEQ = name + '=',
        ca = cookie.split(';'),
        len = ca.length,
        i = 0,
        c;

    for (; i < len; i++) {
        c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEQ) == 0) {
            return c.substring(nameEQ.length, c.length);
        }
    }
    return null;

}

function simplesplits(name, cookie) {

    var parts = cookie.split(name);

    return parts.length === 0 ? null : parts[1].split('=')[1].split(';')[0];

}

function CookieHandler() {
    function CookieParser() {
        var kvs = document.cookie.split(";");

        function trim(stringToTrim) { return stringToTrim.replace(/^\s+|\s+$/g,""); }

        function parseCookies() {
            var result = {};
            $.each(kvs, function(i, v) {
                var kvp = v.split("=");
                result[trim(kvp[0])] = kvp[1];
            });
            return result;
        }
        return { cookies : function() { return parseCookies(); } };
    }

    return {
        getCookies  : CookieParser().cookies,
        getCookie   : function(cookieName) { return CookieParser().cookies()[cookieName] || null; }  };
}
