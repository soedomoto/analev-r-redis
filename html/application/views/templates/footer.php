    <!-- <style type="text/css">
        #alert_feedback {
            position: fixed;
            bottom: 0px;
            margin: 0 20px;
        }
        #btn_alert_feedback {
            position: fixed;
            bottom: 0px;
            right: 0px;
            margin-right: 30px;
            padding: 10px 10px 5px;
            background-color: #f9cf8b;
            border-radius: 10px 10px 0 0;
        }
        .ln-feedback {
            color: red;
            font-weight: bold;
        }
    </style>

    <div class="modal fade" id="feedback_dialog" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false" aria-labelledby="feedback_dialog_label">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <form method="post" action="<?php echo $submit_feedback_url ?>">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <h4 class="modal-title" id="feedback_dialog_label" style="padding-right: 50px;">
                            Laporan dan Masukan
                        </h4>
                    </div>
                    <div class="modal-body">
                        <div>Tuliskan dengan selengkap-lengkapnya laporan permasalahan serta saran dan masukan Anda</div>
                        <textarea name="feedback" class="form-control" rows="3"></textarea>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Batal</button>
                        <button type="submit" class="btn btn-primary">Simpan</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <div id="alert_feedback" class="animated">
        <div class="alert alert-warning alert-dismissable">
            <a href="#" class="close" aria-label="close"><i class="ti-arrow-circle-down"></i></a>
            <strong>Feedback</strong><br /> Kami berkomitmen untuk memberikan yang terbaik untuk Anda, untuk itu segala keluhan dan masukan dari Anda sangat kami perlukan. Silahkan akses <a href="#open-feedback" class="ln-feedback">link <i class="ti-help-alt"></i></a> berikut untuk memberikan masukan dan laporan permasalahan.
        </div>
    </div>

    <div id="btn_alert_feedback" class="pull-right animated slideOutDown">
        <a href="#" id="ln_alert_feedback">Feedback</a>
    </div> -->
    
    <script>
        $(function() {
            Pace.on('done', function() {});
        });
    </script>
    
    <script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.13.1/js/bootstrap-select.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.10/lodash.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js"></script>
    <!-- Loading indicator -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pace/1.0.2/pace.min.js"></script>
    <!-- Alert -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/2.1.0/sweetalert.min.js"></script>
    <!-- Datatables -->
    <!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/datatables/1.10.16/js/jquery.dataTables.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/datatables/1.10.16/js/dataTables.bootstrap.min.js"></script>
    <script src="https://cdn.datatables.net/fixedheader/3.1.4/js/dataTables.fixedHeader.min.js"></script> -->
    <!-- Highchart -->
    <!-- <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/highcharts-more.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script> -->
    <!-- Bar ratings -->
    <!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-bar-rating/1.2.2/jquery.barrating.min.js"></script> -->
    <!-- WYSIWYG -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.9/summernote.js"></script>
    <!-- sidebar -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.nanoscroller/0.8.4/javascripts/jquery.nanoscroller.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/4.6.0/papaparse.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.35.0/codemirror.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.39.0/addon/scroll/simplescrollbars.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.35.0/mode/javascript/javascript.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.35.0/mode/r/r.min.js"></script>
    <!-- LZW -->
    <script src="<?php echo assets_url() ?>/lzw/lzw.js"></script>
    <script src="<?php echo assets_url() ?>/application/webdis-rpc.js"></script>
</body>

</html>