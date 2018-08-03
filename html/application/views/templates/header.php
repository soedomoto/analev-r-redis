<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>BPS Performa 360 <?php echo isset($title) ? '- ' . $title : '' ?></title>

    <!-- ================= Favicon ================== -->
    <!-- Standard -->
    <link rel="shortcut icon" href="<?php echo assets_url(); ?>/favicon.ico">
    <!-- Retina iPad Touch Icon-->
    <link rel="apple-touch-icon" sizes="144x144" href="<?php echo assets_url(); ?>/favicon.ico">
    <!-- Retina iPhone Touch Icon-->
    <link rel="apple-touch-icon" sizes="114x114" href="<?php echo assets_url(); ?>/favicon.ico">
    <!-- Standard iPad Touch Icon-->
    <link rel="apple-touch-icon" sizes="72x72" href="<?php echo assets_url(); ?>/favicon.ico">
    <!-- Standard iPhone Touch Icon-->
    <link rel="apple-touch-icon" sizes="57x57" href="<?php echo assets_url(); ?>/favicon.ico">

    <!-- Styles -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/gh/lykmapipo/themify-icons@0.1.2/css/themify-icons.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/datatables/1.10.16/css/dataTables.bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.datatables.net/fixedheader/3.1.4/css/fixedHeader.dataTables.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css" rel="stylesheet">
    <!-- WYSIWYG -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.9/summernote.css" rel="stylesheet">
    <link href="<?php echo assets_url() ?>/webstrotadmin/css/lib/barRating/barRating.css" rel="stylesheet">
    <link href="<?php echo assets_url() ?>/webstrotadmin/css/lib/menubar/sidebar.css" rel="stylesheet">
    <link href="<?php echo assets_url() ?>/webstrotadmin/css/lib/unix.css" rel="stylesheet">
    <link href="<?php echo assets_url() ?>/webstrotadmin/css/style.css" rel="stylesheet">
    
    <!-- JQuery -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/1.12.0/jquery.min.js"></script>
    
    <style type="text/css">
        html, body {
            height: 100%;
            min-height: 100%;
        }
        @media (min-width: 992px) {
            .modal-lg {
                max-width: 800px;
            }
        }
        .row .vcenter {
            display: inline-block;
            vertical-align: middle;
            float: none;
        }
        .bg-warning, .btn-default {
            margin-top: 0px !important; 
        }
        .alert-warning {
            color: #88570a;
        }
        .note-editable li {
            list-style: inherit;
        }
        .bg-warning {
            margin-top: 7.5px !important;
        }

        /* Header */
        .navbar-fixed-top {
            border-width: 0 0;
        }
        .navbar-brand {
            padding: 12px 15px;
        }
        .navbar-brand>img {
            display: inline;
            margin: 0 10px;
            height: 100%;
        }
        @media (min-width: 768px) {
            .navbar-header {
                width: 100%;
            }
            .navbar-right {
                margin-right: 0px;   
            }
        }
        @media (max-width: 767px) {
            .content-wrap {
                margin-top: 97px !important;
            }
            .modal-dialog {
                width: 95%;
            }
        }
        .navbar-nav-scroll {
            max-width: 100%;
            overflow: hidden;
        }
        .navbar-nav-scroll .navbar-nav {
            overflow-x: auto;
            white-space: nowrap;
            -webkit-overflow-scrolling: touch;
            margin-left: 0px;
            margin-right: 0px;
        }
        .flex-row {
            -ms-flex-direction: row;
            flex-direction: row;
            display: -ms-flexbox;
            display: flex;
            -ms-flex-direction: column;
            padding-left: 0;
            margin-bottom: 0;
            list-style: none;
            margin-top: 0px;
        }
        .navbar-toggle .icon-bar {
            background-color: black;
        }
        .navbar-container {
            border: 1px solid #337ab7;
            border-width: 1px 0;
        }

        /* Avatar */
        .avatar {
            width: 100%;
            padding-top: 100%;
            border-radius: 50%;
            background: url('<?php echo assets_url() ?>/loading-200px.gif');
            background-size: cover !important;
            background-position: center !important;
            background-repeat: no-repeat !important;
        }

        /* Page Loading */
        .loading-modal {
            width: 100%;
            height: 100%;
            min-height: 100%;
            position: absolute;
            background-color: #fff;
            display: table;
            z-index: 10;
        }
        .loading-modal .icon-wrapper {
            display: table-cell;
            vertical-align: middle;
            text-align: center;
        }

        /* Content */
        /*.content-wrap {
            margin-top: 0px 
        }*/


        /* Card */
        .card-no-padding {
            padding: 0px !important;
        }

        /* Rated list */
        .r-list {
            border-bottom: 1px solid #e7e7e7;
            margin-top: 15px;
            padding-bottom: 10px;
        }
        .r-list h4 {
            font-size: 16px;
            margin-bottom: 10px;
        }
        .r-list p {
            margin-bottom: 10px;
            line-height: 20px;
            color: #252525;
        }
        .r-list .r-action {
            text-align: right;
        }

        /* Progress bar color */
        .progress .progress-bar.red {
            background-color: #e74c3c !important;
        }
        .progress .progress-bar.orange {
            background-color: #f39c12 !important;
        }
        .progress .progress-bar.green {
            background-color: #1de9b6 !important;
        }

        /* Bar rating */
        .br-theme-bars-pill .br-widget a {
            background-color: #aae4ff;
            color: #0087c5;
        }
        .br-theme-bars-pill .br-widget a.br-active {
            background-color: #82d8ff;
            color: #0087c5;
        }
        .br-theme-bars-pill .br-widget a.br-selected {
            background-color: #03a9f5;
            color: white;
        }

        .br-widget.error a {
            background-color: #f1d9d9;
            color: #d86a6a;
        }

        /* Fancy radio checkbox */
        a.fancy-button:not(:last-child) {
            margin-right: 5px;
        }
        a.fancy-button {
            font-size: 15px;
            padding: 2px 4px;
            border-radius: 10px;
            height: 20px;
            width: 20px;
        }

        [type=checkbox]+label.fancy-label, 
        [type=radio]+label.fancy-label {
            position: relative;
            cursor: pointer;
            display: inline-block;
            font-size: 1rem;
            margin: 0;
            padding: 0;
            line-height: 15px;
            width: 20px;
            height: 15px;
            left: -7.5px;
        }
        [type=checkbox]+label.fancy-label:after, 
        [type=checkbox]+label.fancy-label:before, 
        [type=radio]+label.fancy-label:after, 
        [type=radio]+label.fancy-label:before {
            content: "";
            left: 0;
            position: absolute;
            -webkit-transition: border .25s,background-color .25s,width .2s .1s,height .2s .1s,top .2s .1s,left .2s .1s;
            transition: border .25s,background-color .25s,width .2s .1s,height .2s .1s,top .2s .1s,left .2s .1s;
            z-index: 1;
            border-style: solid;
            border-width: 2px;
        }
        [type=checkbox]+label.fancy-label:before, 
        [type=radio]+label.fancy-label:before {
            -webkit-transform: rotateZ(37deg);
            -ms-transform: rotate(37deg);
            transform: rotateZ(37deg);
            -webkit-transform-origin: 100% 100%;
            -ms-transform-origin: 100% 100%;
            transform-origin: 100% 100%;
        }
        [type=checkbox]+label.fancy-label:after, 
        [type=radio]+label.fancy-label:after {
            border-radius: 10px;
            height: 20px;
            width: 20px;
        }
        [type=checkbox]:not(:checked)+label.fancy-label:after, 
        [type=radio]:not(:checked)+label.fancy-label:after {
            background-color: transparent;
            border-color: #5a5a5a;
            top: 0;
            z-index: 0;
        }
        [type=checkbox]:not(:checked)+label.fancy-label:before, 
        [type=radio]:not(:checked)+label.fancy-label:before {
            width: 0;
            height: 0;
            border-style: 3px;
            border-color: transparent;
            left: 6px;
            top: 10px;
        }
        [type=checkbox]:checked+label.fancy-label:after, 
        [type=radio]:checked+label.fancy-label:after {
            top: 0;
            border-color: #50e3c2;
            background-color: #bef5e8;
            z-index: 0;
        }
        [type=checkbox]:checked+label.fancy-label:before, 
        [type=radio]:checked+label.fancy-label:before {
            top: 0;
            left: 1px;
            width: 8px;
            height: 13px;
            border-color: transparent #5a5a5a #5a5a5a transparent;
        }
        [type=checkbox].error+label.fancy-label:after, 
        [type=radio].error+label.fancy-label:after {
            border-color: red;
        }
        .secondary-label {
            padding: 0 10px 0 5px;
            cursor: pointer;
            font-weight: normal;
        }

        /* Remove highchart credit */
        .highcharts-credits {
            display: none;
        }
    </style>
    
    <script type="text/javascript">
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
        
        /**
         * jQuery.browser.mobile (http://detectmobilebrowser.com/)
         *
         * jQuery.browser.mobile will be true if the browser is a mobile device
         *
         **/
        (function(a){(jQuery.browser=jQuery.browser||{}).mobile=/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))})(navigator.userAgent||navigator.vendor||window.opera)
        
    </script>
</head>

<body>
    <div class="loading-modal fadeOut">
        <div class="icon-wrapper">
            <img src="<?php echo assets_url() ?>/loading-200px.gif" />
        </div>
    </div>
    