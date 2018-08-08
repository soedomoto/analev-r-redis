function uuid() {
    var seed = Date.now();
    if (window.performance && typeof window.performance.now === "function") {
        seed += performance.now();
    }

    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (seed + Math.random() * 16) % 16 | 0;
        seed = Math.floor(seed/16);

        return (c === 'x' ? r : r & (0x3|0x8)).toString(16);
    });

    return uuid;
}

function ajax_get(url, success, fail) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = function() {
        if (xhr.status === 200) {
            resp = JSON.parse(xhr.responseText);
            if (success) success(resp, xhr.responseURL);
        } else {
            fail(xhr.responseText);
        }
    };
    xhr.send();
}

function ajax_post(url, json_data, success, fail) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function() {
        if (xhr.status === 200) {
            resp = JSON.parse(xhr.responseText);
            if (success) success(resp);
        } else {
            fail(xhr.responseText);
        }
    };
    xhr.send($.param(json_data));
}

function _send_cmd_request(req_id, cmd, callback) {
    message = JSON.stringify({
        'sess': window.session_id, 'id': req_id, 'cmd': cmd 
    });

    ajax_get(window.webdis_url + '/LPUSH/req/' + encodeURIComponent(message), function (j_resp, s_url) {
        var parts = s_url.split('/'), 
            data = parts[parts.length-1], 
            data = decodeURIComponent(data), 
            data = JSON.parse(data), 
            req_id = data.id;

        Object.keys(j_resp).forEach(function (op) {
            var val = parseInt(j_resp[op]);
            if (val <= 0) {
                console.log(req_id, 'Command failed to execute')
            } else {
                callback(req_id);
            }
        });
    });
}

function _send_rpc_request(req_id, func_name, params, callback) {
    message = JSON.stringify({
        'sess': window.session_id, 'id': req_id, 'func': func_name, 'args': params
    });

    ajax_get(window.webdis_url + '/LPUSH/req/' + encodeURIComponent(message), function (j_resp, s_url) {
        var parts = s_url.split('/'), 
            data = parts[parts.length-1], 
            data = decodeURIComponent(data), 
            data = JSON.parse(data), 
            req_id = data.id;

        Object.keys(j_resp).forEach(function (op) {
            var val = parseInt(j_resp[op]);
            if (val <= 0) {
                console.log(req_id, 'Command failed to execute')
            } else {
                callback(req_id);
            }
        });
    });
}

function _wait_for_response(req_id) {
    ajax_get(window.webdis_url + '/BRPOP/resp-' + req_id + '/timeout/30', function (j_resp, s_url) {
        var parts = s_url.split('/'), 
            req_id = parts.filter(function (part) {
                if (part.includes('resp-')) return true;
                return false;
            })[0].replace('resp-', '');

        Object.keys(j_resp).forEach(function (op) {
            var resp = j_resp[op];
            if (resp == null) {
                console.log(req_id, 'Timeout. Retrying...');
                _wait_for_response(req_id);
            } else {
                if(req_id in window.req_callbacks) {
                    window.req_callbacks[req_id](req_id, resp[1]);
                    delete window.req_callbacks[req_id];
                }
            }
        });
    });
}

function eval(cmd, callback) {
    req_id = uuid();

    if (! ('req_callbacks' in window)) window.req_callbacks = {};
    if (callback) window.req_callbacks[req_id] = callback;

    _send_cmd_request(req_id, cmd, function(_req_id) {
        _wait_for_response(_req_id);
    });
}

function call(func_name, json_params=[], callback) {
    req_id = uuid();

    if (! ('req_callbacks' in window)) window.req_callbacks = {};
    if (callback) window.req_callbacks[req_id] = callback;

    _send_rpc_request(req_id, func_name, json_params, function(_req_id) {
        _wait_for_response(_req_id);
    });
}