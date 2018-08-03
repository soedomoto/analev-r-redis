(function($) {
	$.fn.bubble = function(trigger, conf) {
        var $bbl = this;

        conf = $.extend({}, {
			position: null,
			size: null,
			content: '',
			trigger: trigger,
			onBeforeShow: function(bbl, cnf) {},
			onShow: function(bbl, cnf) {},
			onBeforeHide: function(bbl, cnf) {},
			onHide: function() {bbl, cnf},
			_show: function(bbl, cnf) {
				if(cnf.content != undefined || cnf.content != '') {
                    $(".content", bbl).html(cnf.content);
                }

                $(".close", bbl).off("click").click(function() {
                    cnf._hide(bbl);
                });

                $(document).keyup(function(e) {
                    if (e.keyCode == 27) { // escape key maps to keycode `27`
                        cnf._hide(bbl);
                    }
                });

				if(cnf.position == null) {
					var left = cnf.trigger.offset().left + ((cnf.trigger.width() - bbl.outerWidth(true)) / 2);
					var top = cnf.trigger.parents("table").offset().top - bbl.outerHeight(true);
					var bottom = cnf.trigger.parents("table").offset().top + cnf.trigger.parents("table").outerHeight(true) + bbl.outerHeight(true);

					var isTopHidden = top - $(window).scrollTop() < 0 ? true : false;
					var isBottomHidden = bottom - $(window).scrollTop() < 0 ? true : false;
					if(isTopHidden) {
						if(!isBottomHidden) top = cnf.trigger.parents("table").offset().top + cnf.trigger.parents("table").outerHeight(true);
					}
				} else {
					var left = cnf.position.left;
					var top = cnf.position.top;
				}

				bbl.css("left",left).css("top",top);
				if(cnf.size !== null) {
					if(cnf.size.width !== null) bbl.css("width", cnf.size.width);
					if(cnf.size.height !== null) bbl.css("height", cnf.size.height);
				}

				bbl.trigger.addClass('active');
				bbl.onBeforeShow(bbl, cnf);
				bbl.show();
				bbl.onShow(bbl, cnf);
			},
			_hide: function(bbl, cnf) {
				bbl.onBeforeHide(bbl, cnf);
				bbl.hide();
				bbl.onHide(bbl, cnf);
				bbl.trigger.removeClass('active');
                $(".content", bbl).html('');
			}
		}, conf);

		if($bbl.is(":visible")) {
            pConf = $bbl.data();
            $.extend($bbl, pConf);
            fnHide = pConf._hide;
            fnHide($bbl, pConf);
            if(conf.trigger.get(0) !== pConf.trigger.get(0)) {
                $.extend($bbl, conf);
                $bbl.data(conf);
                fnShow = conf._show;
                fnShow($bbl, conf);
            }
		} else {
		    $.extend($bbl, conf);
		    $bbl.data(conf);
            fnShow = conf._show;
            fnShow($bbl, conf);
        }

        return $bbl;
	}
})(jQuery);