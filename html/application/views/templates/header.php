<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>AnalevR <?php echo isset($title) ? '- ' . $title : '' ?></title>

    <!-- ================= Favicon ================== -->
    <link rel="shortcut icon" href="<?php echo assets_url(); ?>/favicon.ico">
    <link rel="apple-touch-icon" sizes="144x144" href="<?php echo assets_url(); ?>/favicon.ico">
    <link rel="apple-touch-icon" sizes="114x114" href="<?php echo assets_url(); ?>/favicon.ico">
    <link rel="apple-touch-icon" sizes="72x72" href="<?php echo assets_url(); ?>/favicon.ico">
    <link rel="apple-touch-icon" sizes="57x57" href="<?php echo assets_url(); ?>/favicon.ico">

    <!-- Styles -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/gh/lykmapipo/themify-icons@0.1.2/css/themify-icons.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/datatables/1.10.16/css/dataTables.bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.datatables.net/fixedheader/3.1.4/css/fixedHeader.dataTables.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.9/summernote.css" rel="stylesheet">
    <link href="<?php echo assets_url() ?>/webstrotadmin/css/lib/menubar/sidebar.css" rel="stylesheet">
    <link href="<?php echo assets_url() ?>/webstrotadmin/css/style.css" rel="stylesheet">
    
    <!-- JQuery -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/1.12.0/jquery.min.js"></script>
    <script src="<?php echo assets_url() ?>/application/webdis-rpc.js"></script>
    
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
</head>

<body>
    <div class="loading-modal fadeOut">
        <div class="icon-wrapper">
            <img src="<?php echo assets_url() ?>/loading-200px.gif" />
        </div>
    </div>
    