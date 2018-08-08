<?php $this->load->view('templates/header'); ?>
<?php $this->load->view('home/menu'); ?>

<style type="text/css">
    .green {
        color: #008000;
    }
    .red {
        color: #ff0000;
    }
</style>

<div class="content-wrap">
    <div class="main">
        <div class="container">
            <div class="row">
                <div class="col-lg-12 col-md-12 col-sm-12">
                    <div class="page-header">
                        <div class="row">
                            <!-- Title -->
                            <div class="col-lg-8 col-md-8 col-sm-6">
                                <div class="page-title">
                                    <h1>Dashboard</h1>
                                </div>
                            </div>

                            <!-- Breadcrumb -->
                            <div class="col-lg-4 col-md-4 col-sm-6">
                                <div class="page-title">
                                    <ol class="breadcrumb text-right">
                                        <li><a href="<?php echo base_url() . 'user' ?>">Pengguna</a></li>
                                        <li class="active">Dashboard</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="main-content">
                <div class="row">
                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div class="card alert box-swot">
                            <div class="card-header">
                                <h4>Strengths and Weaknesses Anda selama <span class="session-name"></span></h4>
                                <div class="card-header-right-icon">
                                    <ul>
                                        <li><i class="ti-reload session-refresh"></i></li>
                                        <li class="card-option drop-menu">
                                            <i class="ti-split-v-alt" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" role="link"></i>
                                            <ul class="card-option-dropdown dropdown-menu session-selector"></ul>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-md-4">
                                        <div class="card card-no-padding">
                                            <h5 class="card-title">Keseluruhan</h5>
                                            <div id="table_overall_swot" class="table-responsive">
                                                <table class="table">
                                                    <tbody></tbody>
                                                    <tfoot>
                                                        <tr>
                                                            <td colspan="3" class="text-center">
                                                                <img src="<?php echo assets_url() ?>/loading-200px.gif">
                                                            </td>
                                                        </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="card card-no-padding">
                                            <h5 class="card-title">Menurut Diri Sendiri</h5>
                                            <div id="table_self_swot" class="table-responsive">
                                                <table class="table">
                                                    <tbody></tbody>
                                                    <tfoot>
                                                        <tr>
                                                            <td colspan="3" class="text-center">
                                                                <img src="<?php echo assets_url() ?>/loading-200px.gif">
                                                            </td>
                                                        </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="card card-no-padding">
                                            <h5 class="card-title">Menurut Orang Lain</h5>
                                            <div id="table_other_swot" class="table-responsive">
                                                <table class="table">
                                                    <tbody></tbody>
                                                    <tfoot>
                                                        <tr>
                                                            <td colspan="3" class="text-center">
                                                                <img src="<?php echo assets_url() ?>/loading-200px.gif">
                                                            </td>
                                                        </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div class="card alert box-performance">
                            <div class="card-header">
                                <h4>Performa Anda selama <span class="session-name"></span></h4>
                                <div class="card-header-right-icon">
                                    <ul>
                                        <li><i class="ti-reload session-refresh"></i></li>
                                        <li class="card-option drop-menu">
                                            <i class="ti-split-v-alt" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" role="link"></i>
                                            <ul class="card-option-dropdown dropdown-menu session-selector"></ul>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div class="card-body">
                                <div id="plot_performance" class="text-center">
                                    <img src="<?php echo assets_url() ?>/loading-200px.gif">
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div class="card alert box-performance-change">
                            <div class="card-header">
                                <h4>Perkembangan Performa antara <span class="session-start-name"></span> dan <span class="session-end-name"></span></h4>
                                <div class="card-header-right-icon">
                                    <ul>
                                        <li><i class="ti-reload session-refresh"></i></li>
                                        <li class="card-option drop-menu">
                                            <i class="ti-shift-left-alt" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" role="link"></i>
                                            <ul class="card-option-dropdown dropdown-menu session-end-selector"></ul>
                                        </li>
                                        <li class="card-option drop-menu">
                                            <i class="ti-shift-right-alt" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" role="link"></i>
                                            <ul class="card-option-dropdown dropdown-menu session-start-selector"></ul>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div class="card-body">
                                <div id="plot_performance_changes" class="text-center">
                                    <img src="<?php echo assets_url() ?>/loading-200px.gif">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script type="text/javascript">
    $(function() {
        // Hide loading page indicator
        $('.loading-modal').addClass('animated').css('z-index', -1);
    });
</script>

<script type="text/javascript">
    window.sess_id = uuid();

    function _send_cmd_request(req_id, cmd, callback) {
        message = JSON.stringify({
            'sess': window.sess_id, 'id': req_id, 'cmd': cmd 
        });

        ajax_get('http://127.0.0.1:7379/LPUSH/req/' + encodeURIComponent(message), function (j_resp, s_url) {
            var parts = s_url.split('/'), 
                data = parts[parts.length-1], 
                data = decodeURIComponent(data), 
                data = JSON.parse(data), 
                req_id = data.id;

            Object.keys(j_resp).forEach(function (op) {
                var val = parseInt(j_resp[op]);
                if (val <= 0) {
                    console.log('Command failed to execute')
                } else {
                    callback(req_id);
                }
            });
        });
    }

    function _send_rpc_request(req_id, func_name, params, callback) {
        message = JSON.stringify({
            'sess': window.sess_id, 'id': req_id, 'func': func_name, 'args': params
        });

        ajax_get('http://127.0.0.1:7379/LPUSH/req/' + encodeURIComponent(message), function (j_resp, s_url) {
            var parts = s_url.split('/'), 
                data = parts[parts.length-1], 
                data = decodeURIComponent(data), 
                data = JSON.parse(data), 
                req_id = data.id;

            Object.keys(j_resp).forEach(function (op) {
                var val = parseInt(j_resp[op]);
                if (val <= 0) {
                    console.log('Command failed to execute')
                } else {
                    callback(req_id);
                }
            });
        });
    }

    function _wait_for_response(req_id) {
        ajax_get('http://127.0.0.1:7379/BRPOP/resp-' + req_id + '/timeout/30', function (j_resp, s_url) {
            var parts = s_url.split('/'), 
                req_id = parts.filter(function (part) {
                    if (part.includes('resp-')) return true;
                    return false;
                })[0].replace('resp-', '');

            Object.keys(j_resp).forEach(function (op) {
                var resp = j_resp[op];
                if (resp == null) {
                    console.log('Timeout. Retrying...');
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



    // function capture_result(url) {
    //     ajax_get(url, function (j_resp, retry_url) {
    //         Object.keys(j_resp).forEach(function (op) {
    //             var resp = j_resp[op];
    //             if (resp == null) {
    //                 console.log('Timeout. Retrying...');
    //                 capture_result(retry_url);
    //             } else {
    //                 var resp = resp[1], 
    //                     resp = JSON.parse(resp), 
    //                     _sess = resp.session, 
    //                     _id = resp.id, 
    //                     _data = resp.data, 
    //                     _is_err = resp.error;

    //                 console.log(_sess, _id, _data, _is_err);
    //             }
    //         });
    //     });
    // }

    // function cmd_eval(cmd) {
    //     id = uuid();
    //     cmd = encodeURI(cmd);
    //     req = JSON.stringify({
    //         'sess': window.sess_id, 'id': id, 'cmd': cmd
    //     });

    //     // if (! ('sessions' in window)) window.sess_idions = {};
    //     // if (! (sess in window.sess_idions)) window.sess_idions[window.sess_id] = {};
    //     // window.sess_idions[window.sess_id]['req'] = req;
    //     // window.sess_idions[window.sess_id]['resp'] = function(sess, val) {
    //     //     console.log(window.sess_id, val)
    //     // };

    //     capture_result('http://127.0.0.1:7379/BLPOP/resp.' + id + '/timeout/30');

    //     ajax_get('http://127.0.0.1:7379/RPUSH/inp/' + req, function (j_resp, s_url) {
    //         Object.keys(j_resp).forEach(function (op) {
    //             var val = parseInt(j_resp[op]);
    //             if (val <= 0) {
    //                 console.log('Command failed to execute')
    //             }
    //         });
    //     });
    // }

    $(function () {
        
    });
</script>

<?php $this->load->view('templates/footer'); ?>
    