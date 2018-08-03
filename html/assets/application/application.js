(function($) {
    $.fn.dumpJSON = function() {
        var $form = this;

        var formArray = $form.serializeArray();
        var formJSON = {};

        $.map(formArray, function(n, i){
            console.log(n)
            if(! (n['name'] in formJSON)) {
                formJSON[n['name']] = n['value'];
            } else if (Array.isArray(formJSON[n['name']])) {
                formJSON[n['name']].push(n['value']);
            } else {
                v = formJSON[n['name']];
                formJSON[n['name']] = []
                formJSON[n['name']].push(v);
            }
        });

        return formJSON;
    }

    $.fn.loadJSON = function(data) {
        var frm = this;

        $.each(data, function(key, value){
            var $ctrl = $('[name='+key+']', frm);
            if($ctrl.is('select')) {
                $("option",$ctrl).each(function(){
                    if (this.value==value) { this.selected=true; }
                });
            }
            else {
                switch($ctrl.attr("type")) {
                    case "text" :   case "hidden":  case "textarea":
                        $ctrl.val(value);
                        break;
                    case "radio" : case "checkbox":
                        $ctrl.each(function(){
                           if($(this).attr('value') == value) {  $(this).attr("checked",value); } });
                        break;
                }
            }
        });

        return frm;
    }

    $.fn.colorPicker = function() {
        var $textbox = this;

        $textbox.colpick({
            layout: "hex",
            submit: 0,
            onShow: function() {
                $("#"+$(this).data("colpickId")).css("z-index", 4);
            },
            onChange: function(hsb, hex, rgb, el, bySetColor) {
                $(el).css("border-color", "#" + hex);
                if(!bySetColor) $(el).val(hex);
            }
        }).keyup(function() {
            $(this).colpickSetColor(lbColor.value);
        });

        return $textbox;
    }

    $.fn.autocompletePosition = function(onSelected) {
        var $textbox = this;

        $textbox.autocomplete({
            source: function(request, response) {
                $.getJSON(opts.calendar.searchPosition, {
                        q: request.term
                    }, function(resp) {
                        var evs = $.map(resp.data, function(item) {
                            return {
                                label: item.name,
                                id: item.id,
                                value: item.name,
                            }
                        });

                        response(evs);
                    });
            },
            select: function( event, ui ) {
                onSelected(ui.item);
            }
        });

        return $textbox;
    }

    $.fn.autocompleteRank = function(onSelected) {
        var $textbox = this;

        $textbox.autocomplete({
            source: function(request, response) {
                $.getJSON(opts.calendar.searchRank, {
                        q: request.term
                    }, function(resp) {
                        var evs = $.map(resp.data, function(item) {
                            return {
                                label: item.name,
                                id: item.id,
                                value: item.name,
                            }
                        });

                        response(evs);
                    });
            },
            select: function( event, ui ) {
                onSelected(ui.item);
            }
        });

        return $textbox;
    }

    $.fn.autocompleteUser = function(onSelected) {
        var $textbox = this;

        $textbox.autocomplete({
            source: function(request, response) {
                $.getJSON(opts.calendar.searchUser, {
                        q: request.term
                    }, function(resp) {
                        var evs = $.map(resp, function(item) {
                            return {
                                label: item.fullname,
                                id: item.id,
                                nip: item.nip,
                                value: item.fullname,
                            }
                        });

                        response(evs);
                    });
            },
            select: function( event, ui ) {
                onSelected(ui.item);
            }
        });

        return $textbox;
    }

    $.fn.autocompleteEvent = function(onSelected) {
        var $textbox = this;

        $textbox.autocomplete({
            source: function(request, response) {
                $.getJSON(opts.calendar.searchEvent, {
                        q: request.term
                    }, function(resp) {
                        var evs = $.map(resp.data, function(item) {
                            return {
                                label: item.title,
                                id: item.id,
                                value: item.title,
                            }
                        });

                        response(evs);
                    });
            },
            select: function( event, ui ) {
                onSelected(ui.item);
            }
        });

        return $textbox;
    }

    $.fn.dialogTaskLetter = function(trigger) {
        var self = this;

        $("#list").bubble(trigger, {
            position : {top: 0, left: 0},
            size : {width: 550},
            content: $("#dlg_task_letter_selector").html(),
            onBeforeShow: function($dlg) {
                $dlg.css("position", "fixed").css({
                    top: ($(window).innerHeight() - $dlg.outerHeight()) / 2,
                    left: ($(window).innerWidth() - $dlg.outerWidth()) / 2,
                });
            },
            onShow: function($dlg) {
                if($dlg.trigger.data('user') != undefined) {
                    user = $dlg.trigger.data('user');
                    $('<li><label style="font-weight: unset;"><input type="checkbox" name="users" value="'+
                        user.id +'" checked readonly /> '+ user.fullname +'</label></li>').appendTo($('td.user ul', $dlg));

                    $('.nav#event-list li.event').each(function(idx, eEvent) {
                        event = $(eEvent).data();
                        $('<li><label style="font-weight: unset;"><input type="checkbox" name="events" value="'+
                        event.id +'" /> '+ event.title +'</label></li>').appendTo($('td.event ul', $dlg));
                    });
                }

                else if($dlg.trigger.data('event') != undefined) {
                    event = $dlg.trigger.data('event');
                    $('<li><label style="font-weight: unset;"><input type="checkbox" name="events" value="'+
                        event.id +'" checked readonly /> '+ event.title +'</label></li>').appendTo($('td.event ul', $dlg));

                    $('.nav#user-list li.user').each(function(idx, eUser) {
                        user = $(eUser).data();
                        $('<li><label style="font-weight: unset;"><input type="checkbox" name="users" value="'+
                        user.id +'" /> '+ user.fullname +'</label></li>').appendTo($('td.user ul', $dlg));
                    });
                }

                $('.btn-print', $dlg).on('click', function() {
                    var users = [];
                    $('[name=users]').each(function(i, e) {
                        if(e.checked) users.push($(e).val());
                    });

                    var events = [];
                    $('[name=events]').each(function(i, e) {
                        if(e.checked) events.push($(e).val());
                    });

                    var urlParams = '';
                    if(users.length > 0) {
                        urlParams += '?users=' + users.join() + '&';
                    }
                    if(urlParams.length == 0) {
                        urlParams += '?';
                    }
                    if(events.length > 0) {
                        urlParams += 'events=' + events.join();
                    }

                    window.open(new URL("/api/task/task-letter" + urlParams, window.location), '_blank').focus()
                });
            },
            onHide: function($dlg) {}
        });

        return self;
    }

    $.fn.dialogCKPT = function(trigger) {
        var self = this;

        $("#list").bubble(trigger, {
            position : {top: 0, left: 0},
            size : {width: 330},
            content: $("#dlg_ckpt_option").html(),
            onBeforeShow: function($dlg) {
                $dlg.css("position", "fixed").css({
                    top: ($(window).innerHeight() - $dlg.outerHeight()) / 2,
                    left: ($(window).innerWidth() - $dlg.outerWidth()) / 2,
                });
            },
            onShow: function($dlg) {
                user = $dlg.trigger.data();
                $('[name=start]', $dlg).datepicker({ dateFormat: 'yy-mm-dd' });
                $('[name=end]', $dlg).datepicker({ dateFormat: 'yy-mm-dd' });

                $('.btn-print', $dlg).on('click', function() {
                    start = $('[name=start]', $dlg).val();
                    end = $('[name=end]', $dlg).val();

                    var urlParams = '?user=' + user.id + '&from=' + start + '&to=' + end;
                    window.open(new URL("/api/task/ckpt" + urlParams, window.location), '_blank').focus()
                });
            },
            onHide: function($dlg) {}
        });

        return self;
    }

    $.fn.dialogCKPR = function(trigger) {
        var self = this;

        $("#list").bubble(trigger, {
            position : {top: 0, left: 0},
            size : {width: 330},
            content: $("#dlg_ckpr_option").html(),
            onBeforeShow: function($dlg) {
                $dlg.css("position", "fixed").css({
                    top: ($(window).innerHeight() - $dlg.outerHeight()) / 2,
                    left: ($(window).innerWidth() - $dlg.outerWidth()) / 2,
                });
            },
            onShow: function($dlg) {
                user = $dlg.trigger.data();
                $('[name=start]', $dlg).datepicker({ dateFormat: 'yy-mm-dd' });
                $('[name=end]', $dlg).datepicker({ dateFormat: 'yy-mm-dd' });

                $('.btn-print', $dlg).on('click', function() {
                    start = $('[name=start]', $dlg).val();
                    end = $('[name=end]', $dlg).val();

                    var urlParams = '?user=' + user.id + '&from=' + start + '&to=' + end;
                    window.open(new URL("/api/task/ckpr" + urlParams, window.location), '_blank').focus()
                });
            },
            onHide: function($dlg) {}
        });

        return self;
    }

    $.validatePost = function(url, params, callback) {
        $.post(url, params, function(resp) {
            if('success' in resp) {
                if(resp.success) {
                    callback(resp);
                } else {
                    alert(resp.message);
                }
            }
        });
    }

    $.validateGet = function(url, params, callback) {
        $.post(url, params, function(resp) {
            if('success' in resp) {
                if(resp.success) {
                    callback(resp);
                } else {
                    alert(resp.message);
                }
            }
        });
    }
})(jQuery);

jQuery(function($) {
	$(document).on("mouseenter", ".fc-button", function() {
		$(this).addClass("fc-state-hover");
	}).on("mouseleave", ".fc-button", function() {
		$(this).removeClass("fc-state-hover");
	});

	$(document).on("mouseenter", ".button", function() {
		$(this).addClass("hover");
	}).on("mouseleave", ".button", function() {
		$(this).removeClass("hover");
	});

	$(document).on("click", ".list .header", function() {
		var ul = $(this).parent().find("ul,.ul");
		if(ul.is(":hidden")) $(ul).slideDown();
		else $(ul).slideUp();
	});

	$(document).on("click", ".collapsible .button", function() {
		var thus = $(this);
		var ul = $(this).parent().find(".content");
		if(ul.is(":hidden")) {
			$(ul).slideDown(function() {
				thus.find("span").attr("class", "icon-chevron-up");
			});
		} else {
			$(ul).slideUp(function() {
				thus.find("span").attr("class", "icon-chevron-down");
			});
		}
	});

	$(document).on("click", ".browse-menu", function() {
		var menu = $(this).find(".menu");
		if(menu.attr("position") == "right") {
			menu.css("left", -1-menu.outerWidth()+$(this).outerWidth());
		} else if(menu.attr("position") == "left") {
			menu.css("left", -1);
		}

		if(menu.is(":hidden")) {
		    $(menu).show();

            height = menu.outerHeight(true);
		    bottom = menu.offset().top + height;
            wBottom = $(window).outerHeight(true);
            if(bottom - wBottom > 0) {
                menu.css('top', -height-1 + 'px')
            }
		} else {
		    $(menu).hide();
		    menu.css('top', '')
		}
	});

    $(document).on("click", ".browse-rank", function() {
        var btn = $(this), taskDlg = $(this).data('dialog');

        $("#list").bubble(btn, {
            position : {top: 0, left: 0},
            content: $("#listRanks").html(),
            onBeforeShow: function($dlg) {
                $dlg.css("position", "fixed").css({
                    top: ($(window).innerHeight() - $dlg.outerHeight()) / 2,
                    left: ($(window).innerWidth() - $dlg.outerWidth()) / 2,
                });
            },
            onShow: function($dlg, conf) {
                $dlg = $(this);
                $.extend($dlg, {
                    refresh: function() {
                        $(".tablesorter tbody", $dlg).empty();
                        $.get(opts.calendar.allRank, {}, function(resp) {
                            $.each(resp.data, function(i, rank) {
                                $("<tr rid=\""+ rank.id +"\"><td><span>"+ rank.id +"</span></td><td><span>" +
                                    rank.name + "</span>" +
                                    "<div class=\"action\">" +
                                        "<div class=\"edit\">Edit</div>" +
                                        "<div class=\"delete\">Delete</div>" +
                                    "</div>" +
                                "</td</tr>").appendTo($(".tablesorter tbody", $dlg));

                                if(i == resp.data.length-1) {
                                    $dlg.css({
                                        top: ($(window).innerHeight() - $dlg.outerHeight()) / 2,
                                        left: ($(window).innerWidth() - $dlg.outerWidth()) / 2,
                                    });
                                }
                            });
                        });
                    }
                })

                $dlg.refresh();
                $('[name=id]', $dlg).focus();

                $dlg.on("mouseenter", "tr", function() {
                    $(this).addClass("hover");
                }).on("mouseleave", "tr", function() {
                    $(this).removeClass("hover");
                }).on("click", "tr .action .delete", function() {
                    var id = $(this).parents("tr").attr("rid");
                    $.get(opts.calendar.deleteRank + "/" + id, {}, function() {
                        $dlg.refresh();
                    });
                }).on("click", "tr .action .edit", function() {
                    var tr = $(this).parents("tr");
                    var tds = tr.find("td span");
                    $('[name=id]', $dlg).val($(tds[0]).html()).attr('readonly', true);
                    $('[name=name]', $dlg).val($(tds[1]).html()).focus();
                });
                //$(".tablesorter").tablesorter();

                $('form', $dlg).submit(function(e) {
                    e.preventDefault();

                    var url = $(this).attr('action'), params = $(this).dumpJSON();
                    $.post(url, params, function() {
                        $("#calendar").fullCalendar( "refetchEvents" );

                        $('[name=id]', $dlg).val('');
                        $('[name=name]', $dlg).val('');
                        $dlg.refresh();
                    });
                });
            },
            onHide: function() {}
        });
	});

	$(document).on("click", ".browse-position", function() {
        var btn = $(this), taskDlg = $(this).data('dialog');

        $("#list").bubble(btn, {
            position : {top: 0, left: 0},
            size : {width: 550},
            content: $("#listPositions").html(),
            onBeforeShow: function($dlg) {
                $dlg.css("position", "fixed").css({
                    top: ($(window).innerHeight() - $dlg.outerHeight()) / 2,
                    left: ($(window).innerWidth() - $dlg.outerWidth()) / 2,
                });
            },
            onShow: function($dlg) {
                $dlg = $(this);
                $.extend($dlg, {
                    refresh: function() {
                        $(".tablesorter tbody", $dlg).empty();
                        $.get(opts.calendar.allPosition, {}, function(resp) {
                            $.each(resp.data, function(i, rank) {
                                $("<tr pid=\""+ rank.id +"\"><td><span>"+ rank.id +"</span></td><td><span>" +
                                    rank.name + "</span>" +
                                    "<div class=\"action\">" +
                                        "<div class=\"edit\">Edit</div>" +
                                        "<div class=\"delete\">Delete</div>" +
                                    "</div>" +
                                "</td</tr>").appendTo($(".tablesorter tbody", $dlg));

                                if(i == resp.data.length-1) {
                                    $dlg.css({
                                        top: ($(window).innerHeight() - $dlg.outerHeight()) / 2,
                                        left: ($(window).innerWidth() - $dlg.outerWidth()) / 2,
                                    });
                                }
                            });
                        });
                    }
                })

                $dlg.refresh();
                $('[name=name]', $dlg).focus();

                $dlg.on("mouseenter", "tr", function() {
                    $(this).addClass("hover");
                }).on("mouseleave", "tr", function() {
                    $(this).removeClass("hover");
                }).on("click", "tr .action .delete", function() {
                    var id = $(this).parents("tr").attr("pid");
                    $.get(opts.calendar.deletePosition + "/" + id, {}, function() {
                        $dlg.refresh();
                    });
                }).on("click", "tr .action .edit", function() {
                    var tr = $(this).parents("tr");
                    var tds = tr.find("td span");
                    $('[name=id]', $dlg).val(tr.attr("pid"));
                    $('[name=name]', $dlg).val($(tds[1]).html()).focus();
                });
                //$(".tablesorter").tablesorter();

                $('form', $dlg).submit(function(e) {
                    e.preventDefault();

                    var url = $(this).attr('action'), params = $(this).dumpJSON();
                    $.post(url, params, function() {
                        $("#calendar").fullCalendar( "refetchEvents" );

                        $('[name=id]', $dlg).val('');
                        $('[name=name]', $dlg).val('');
                        $dlg.refresh();
                    });
                });
            },
            onHide: function() {}
        });
	});

    $(document).on("click", ".browse-unit", function() {
        var btn = $(this), taskDlg = $(this).data('dialog');

        $("#list").bubble(btn, {
            position : {top: 0, left: 0},
            size : {width: 550},
            content: $("#dlg_unit").html(),
            onBeforeShow: function($dlg) {
                $dlg.css("position", "fixed").css({
                    top: ($(window).innerHeight() - $dlg.outerHeight()) / 2,
                    left: ($(window).innerWidth() - $dlg.outerWidth()) / 2,
                });
            },
            onShow: function($dlg) {
                var $dlg = $(this);
                $.extend($dlg, {
                    refresh: function() {
                        $dlg.find(".tablesorter tbody", $dlg).empty();
                        $.get(opts.calendar.allUnit, {}, function(resp) {
                            $.each(resp.data, function(i, unit) {
                                $("<tr uid=\""+ unit.id +"\"><td><span>"+ unit.id +"</span></td><td><span>" +
                                        unit.name + "</span>" +
                                    "<div class=\"action\">" +
                                        "<div class=\"edit\">Edit</div>" +
                                        "<div class=\"delete\">Delete</div>" +
                                    "</div>" +
                                "</td</tr>").appendTo($dlg.find(".tablesorter tbody", $dlg));

                                if(i == resp.data.length-1) {
                                    $dlg.css({
                                        top: ($(window).innerHeight() - $dlg.outerHeight()) / 2,
                                        left: ($(window).innerWidth() - $dlg.outerWidth()) / 2,
                                    });
                                }
                            });
                        });
                    }
                })

                $dlg.refresh();
                $('[name=name]', $dlg).focus();

                $dlg.on("mouseenter", "tr", function() {
                    $(this).addClass("hover");
                }).on("mouseleave", "tr", function() {
                    $(this).removeClass("hover");
                }).on("click", "tr .action .delete", function() {
                    var id = $(this).parents("tr").attr("uid");
                    $.get(opts.calendar.deleteUnit + "/" + id, {}, function() {
                        $dlg.refresh();
                    });
                }).on("click", "tr .action .edit", function() {
                    var tr = $(this).parents("tr");
                    var tds = tr.find("td span");
                    $('[name=id]', $dlg).val(tr.attr("uid"));
                    $('[name=name]', $dlg).val($(tds[1]).html()).focus();
                });
                //$(".tablesorter").tablesorter();

                $('form', $dlg).submit(function(e) {
                    e.preventDefault();

                    var url = $(this).attr('action'), params = $(this).dumpJSON();
                    $.post(url, params, function() {
                        $("#calendar").fullCalendar( "refetchEvents" );

                        $('[name=id]', $dlg).val('');
                        $('[name=name]', $dlg).val('');
                        $dlg.refresh();
                    });
                });
            },
            onHide: function() {
                taskDlg.refresh();
            }
        });
	});
	
	
	//	Onload
	$(document).ready(function() {
		$("#calendar").eventCalendar(opts);
		
		$(document).on("click", "ul.nav#user-list li.user", function() {
			var t = $(this).offset().top;
			var l = $(this).offset().left + $(this).outerWidth();

			var list = $(this).parent().parent();
			var ls = $(this);
			$("#bubble").bubble(ls, {
				content: $("#editUser").html(),
				position: { top: t, left: l },
				onBeforeShow: function($dlg, conf) {
					$dlg.css("position", "fixed").css("width", "auto");
					$dlg.trigger.addClass('active');
					$('.fc-event:not([user-id='+ $dlg.trigger.data().id +'])').addClass('disabled')
				},
				onShow: function($dlg, conf) {
				    var user = $dlg.trigger.data();

					$(".title .color", $dlg).css("background-color", "#" + user.color);
					$(".title span", $dlg).html(user.fullname);

                    $dlg.find("#edit_user_detail").on('shown.bs.collapse', function() {
                        bottom = $dlg.offset().top + $dlg.outerHeight(true);
                        wBottom = $(window).outerHeight(true);
                        delta = bottom - wBottom;
                        if(delta > 0) {
                            $dlg.offset({top: $dlg.offset().top - delta})
                        }
                    }).on('hidden.bs.collapse', function() {
                        if($dlg.offset().top != $dlg.trigger.offset().top) {
                            $dlg.offset({top: $dlg.trigger.offset().top})
                        }
                    });

					var $form = $dlg.find("form");
					$form.loadJSON(user);

					$('[name=color]', $form).css({
						"width":"70px",
						"border":"1px solid #" + user.color,
						"border-right":"20px solid #" + user.color,
					}).colorPicker();

                    $('[name=position_id]', $form).autocompletePosition(function(position) {
                        $dlg.data('position', position);
                    });

                    if(user.position) {
                        $dlg.data('position', user.position);
                        $('[name=position_id]', $form).val(user.position.name);
                    }

                    $('[name=rank_id]', $form).autocompleteRank(function(rank) {
                        $dlg.data('rank', rank);
                    });

                    if(user.rank) {
                        $dlg.data('rank', user.rank);
                        $('[name=rank_id]', $form).val(user.rank.name);
                    }

                    $('[name=supervisor_id]', $form).autocompleteUser(function(supervisor) {
                        $dlg.data('supervisor', supervisor);
                    });

                    if(user.supervisor) {
                        $dlg.data('supervisor', user.supervisor);
                        $('[name=supervisor_id]', $form).val(user.supervisor.fullname);
                    }

                    $form.submit(function(event) {
                        event.preventDefault();

                        var url = $form.attr('action'), params = $form.dumpJSON();
                        if($dlg.data('supervisor') != null) params["supervisor_id"] = $dlg.data('supervisor').id;
                        if($dlg.data('position') != null) params["position_id"] = $dlg.data('position').id;
                        if($dlg.data('rank') != null) params["rank_id"] = $dlg.data('rank').id;

                        $.post(url + '/' + user.id, params, function() {
							$("#calendar").fullCalendar( "refetchEvents" );
							$dlg.hide();
						});
                    });
					
					$(".btn-delete", $dlg).click(function() {
						$.get(opts.calendar.delUser + '/' + user.id, {}, function() {
							$("#calendar").fullCalendar( "refetchEvents" );
							$dlg.hide();
						});
					});

					$('.btn-task-letter', $dlg).data('user', user).on('click', function() {
                        $('#list').dialogTaskLetter($(this))
					});

                    $('.btn-ckpt', $dlg).data(user).on('click', function() {
					    $('#list').dialogCKPT($(this));
                    });

                    $('.btn-ckpr', $dlg).data(user).on('click', function() {
					    $('#list').dialogCKPR($(this));
                    });

					bottom = $dlg.offset().top + $dlg.outerHeight(true);
                    wBottom = $(window).outerHeight(true);
                    delta = bottom - wBottom;
                    if(delta > 0) {
                        $dlg.offset({top: $dlg.offset().top - delta})
                    }
				}, 
				onHide: function($dlg, conf) {
					$dlg.trigger.removeClass('active');
					$('.fc-event:not([user-id='+ $dlg.trigger.data().id +'])').removeClass('disabled')
				}
			});
		}).on("click", "ul.nav#user-list li.add", function() {
			var t = $(this).offset().top;
			var l = $(this).offset().left + $(this).outerWidth();

			var list = $(this).parent();
			$("#bubble").bubble($(this), {
				content: $("#addUser").html(),
				position: { top: t, left: l },
				onBeforeShow: function($dlg, conf) {
					$dlg.css("position", "fixed").css("min-height", list.height()).css("width", "auto");
					$dlg.trigger.addClass('active');
				},
				onShow: function($dlg, conf) {
					$dlg.find("[name=color]").css({
						"width":"70px",
						"border":"1px solid green",
						"border-right":"20px solid green",
					}).colorPicker();

					$dlg.data('supervisor', null);
                    $dlg.data('rank', null);
                    $dlg.data('position', null);

					$("[name=supervisor_id]", $dlg).autocompleteUser(function(supervisor) {
					    $dlg.data('supervisor', supervisor);
                    });

					$("[name=rank_id]", $dlg).autocompleteRank(function(rank) {
					    $dlg.data('rank', rank);
                    });

					$("[name=position_id]", $dlg).autocompletePosition(function(position) {
					    $dlg.data('position', position);
                    });

					$form = $("form", $dlg);
					$form.submit(function(event) {
                        event.preventDefault();

                        var url = $form.attr('action'), params = $form.dumpJSON();
                        if($dlg.data('supervisor') != null) params["supervisor_id"] = $dlg.data('supervisor').id;
                        if($dlg.data('position') != null) params["position_id"] = $dlg.data('position').id;
                        if($dlg.data('rank') != null) params["rank_id"] = $dlg.data('rank').id;

                        $.validatePost(url, params, function() {
							$("#calendar").fullCalendar( "refetchEvents" );

							$dlg.hide();
						});
                    });

                    bottom = $dlg.offset().top + $dlg.outerHeight(true);
                    wBottom = $(window).outerHeight(true);
                    delta = bottom - wBottom;
                    if(delta > 0) {
                        $dlg.offset({top: $dlg.offset().top - delta})
                    }
				},
				onHide: function($dlg, conf) {
				    $dlg.trigger.removeClass('active');
					$dlg.css("width", "").css("position", "").css("min-height", "").css("width", "");
				}
			});
		});

		$(document).on("click", "ul.nav#event-list li.event", function() {
		    var t = $(this).offset().top;
			var l = $(this).offset().left + $(this).outerWidth();

			var list = $(this).parent().parent();
			var ls = $(this);
			$("#bubble").bubble(ls, {
				content: $("#editEvent").html(),
				position: { top: t, left: l },
				onBeforeShow: function($dlg, conf) {
					$dlg.css("position", "fixed").css("width", "auto");
					$dlg.trigger.addClass('active');
					$('.fc-event:not([event-id='+ $dlg.trigger.data().id +'])').addClass('disabled')
				},
				onShow: function($dlg, conf) {
				    var event = $dlg.trigger.data();
				    event.start = event.start.split('T')[0]
				    event.end = event.end.split('T')[0]

					$dlg.find(".title .color").css("background-color", "#" + event.color);
					$dlg.find(".title span").html(event.title);

					$dlg.find("#edit_event_detail").on('shown.bs.collapse', function() {
                        bottom = $dlg.offset().top + $dlg.outerHeight(true);
                        wBottom = $(window).outerHeight(true);
                        delta = bottom - wBottom;
                        if(delta > 0) {
                            $dlg.offset({top: $dlg.offset().top - delta})
                        }
                    }).on('hidden.bs.collapse', function() {
                        if($dlg.offset().top != $dlg.trigger.offset().top) {
                            $dlg.offset({top: $dlg.trigger.offset().top})
                        }
                    });

                    var $form = $dlg.find("form");
					$form.loadJSON(event);

					$('[name=start]', $dlg).datepicker({ dateFormat: 'yy-mm-dd' });
                    $('[name=end]', $dlg).datepicker({ dateFormat: 'yy-mm-dd' });
                    $('[name=color]', $dlg).css({
						"width":"70px",
						"border":"1px solid #" + event.color,
						"border-right":"20px solid #" + event.color,
					}).html(event.color).colorPicker();

                    $form.submit(function(e) {
                        e.preventDefault();

                        var $form = $(this), url = $form.attr('action'), params = $form.dumpJSON();

                        $.post(url + '/' + event.id, params, function() {
							$("#calendar").fullCalendar( "refetchEvents" );
							$dlg.hide();
						});
                    });

                    $dlg.find("#btnDelEvent").click(function() {
						$.get(opts.calendar.delEvent + '/' + event.id, {}, function() {
							$("#calendar").fullCalendar( "refetchEvents" );
							$dlg.hide();
						});
					});

					$('.btn-task-letter', $dlg).data('event', event).on('click', function() {
                        $('#list').dialogTaskLetter($(this))
					});

//					$dlg.find("#lnEntrySPJDetail").attr("href", "/api/event/spj/" + event.id + "/entry");
//					$dlg.find("#lnPrintSPJ").attr("href", "/api/event/spj/" + event.id + "/pdf");

					bottom = $dlg.offset().top + $dlg.outerHeight(true);
                    wBottom = $(window).outerHeight(true);
                    delta = bottom - wBottom;
                    if(delta > 0) {
                        $dlg.offset({top: $dlg.offset().top - delta})
                    }
				}, 
				onHide: function($dlg, conf) {
				    $dlg.trigger.removeClass('active');
					$('.fc-event:not([event-id='+ $dlg.trigger.data().id +'])').removeClass('disabled')
				}
			});
		}).on("click", "ul.nav#event-list li.add", function() {
			var t = $(this).offset().top;
			var l = $(this).offset().left + $(this).outerWidth();

			var list = $(this).parent();
			$("#bubble").bubble($(this), {
				content: $("#addEvent").html(),
				position: { top: t, left: l },
				onBeforeShow: function($dlg, conf) {
				    $dlg.trigger.addClass('active');
					$dlg.css("position", "fixed").css("min-height", list.height()).css("width", "auto");
				}, 
				onShow: function($dlg, conf) {
					$('[name=start]', $dlg).datepicker({ dateFormat: 'yy-mm-dd' });
                    $('[name=end]', $dlg).datepicker({ dateFormat: 'yy-mm-dd' });
                    $('[name=color]', $dlg).css({
						"width":"70px",
						"border":"1px solid green",
						"border-right":"20px solid green",
					}).colorPicker();

                    $dlg.find("form").submit(function(event) {
                        event.preventDefault();

                        var $form = $(this), url = $form.attr('action'), params = $form.dumpJSON();

                        $.post(url, params, function() {
							$("#calendar").fullCalendar( "refetchEvents" );
							$dlg.hide();
						});
                    });

                    bottom = $dlg.offset().top + $dlg.outerHeight(true);
                    wBottom = $(window).outerHeight(true);
                    delta = bottom - wBottom;
                    if(delta > 0) {
                        $dlg.offset({top: $dlg.offset().top - delta})
                    }
				},
				onHide: function($dlg, conf) {
					$dlg.trigger.removeClass('active');
				}
			});
		});

		$(document).on("click", "ul.nav.menu li.setting", function() {
		    var t = $(this).offset().top;
			var l = $(this).offset().left + $(this).outerWidth();

			var list = $(this).parent();
			$("#bubble").bubble($(this), {
				content: $("#setting").html(),
				position: { top: t, left: l },
				onBeforeShow: function($dlg, conf) {
				    $dlg.trigger.addClass('active');
					$dlg.css("position", "fixed").css("width", "auto");
				},
				onShow: function($dlg, conf) {
				    $('input', $dlg).css('width', '200px');
				    $('.notes', $dlg).css('width', '200px');

				    $.get(opts.calendar.allSetting, {}, function(resp) {
				        setting = resp.data;
                        $('[name=geographic_name]', $dlg).val(setting.geographic_name);
                        $('[name=address]', $dlg).val(setting.address);
                        $('[name=phone]', $dlg).val(setting.phone);
                        $('[name=fax]', $dlg).val(setting.fax);
                        $('[name=website]', $dlg).val(setting.website);
                        $('[name=email]', $dlg).val(setting.email);
                        $('[name=tl_format]', $dlg).val(setting.tl_format);
                        $('[name=capital]', $dlg).val(setting.capital);

                        $('[name=chief_id]', $dlg).autocompleteUser(function(chief) {
                            $dlg.data('chief', chief);
                        });

                        if(setting.chief) {
                            $dlg.data('chief', setting.chief);
                            $('[name=chief_id]', $dlg).val(setting.chief.fullname);
                        }
                    });

                    $dlg.find("form").submit(function(event) {
                        event.preventDefault();

                        var $form = $(this), url = $form.attr('action'), params = $form.dumpJSON();
                        if($dlg.data('chief') != null) params["chief_id"] = $dlg.data('chief').id;

                        $.post(url, params, function() {
//							$("#calendar").fullCalendar( "refetchEvents" );
							$dlg.hide();
						});
                    });

                    bottom = $dlg.offset().top + $dlg.outerHeight(true);
                    wBottom = $(window).outerHeight(true);
                    delta = bottom - wBottom;
                    if(delta > 0) {
                        $dlg.offset({top: $dlg.offset().top - delta})
                    }
				},
				onHide: function($dlg, conf) {
					$dlg.trigger.removeClass('active');
				}
			});
		});
		
		$(".notifications").on("click", ".login", function() {
			var btn = $(this);
			$("#list").bubble(btn, {
				position : {top: 0, left: 0},
				content: $("#loginUser").html(),
				onBeforeShow: function() {},
				onShow: function() {
					var $dlg = $(this);					
					$dlg.find("#btnLogin").click(function() {
						$.post(opts.calendar.login, {
							username: $dlg.find("#lbWho").val(),
							password: $dlg.find("#lbPass").val(),
						}, function(resp) {
							if(resp.success) {
								$dlg.find("#status").html("Login sukses. Halaman akan di-reload!").show();
								setTimeout( function() { location.reload(); }, 1000);
							}
						});
					});
					
					$(this).css({
						top: ($(window).innerHeight() - $(this).outerHeight()) / 2,
						left: ($(window).innerWidth() - $(this).outerWidth()) / 2,
					});
				}, 
				onHide: function() {}
			});
		}).on("click", ".logout", function() {
			$.post(opts.calendar.logout, {}, function(success) {
				if(success) {
					location.reload();
				}
			});
		});
	});
});