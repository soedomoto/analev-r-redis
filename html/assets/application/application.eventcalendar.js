(function($) {
	$.fn.eventCalendar = function(params) {
		var cal = this;
		var defaultOpt = {
			events: params.calendar.allTask,
			loading: function(bool) {
				if (bool) $("#loading").show();
				else $("#loading").hide();
			},
			dayClick: function(date, jsEvent, view) {
				var $day = $(this);
				var taskDlg = $("#bubble").bubble($day, {
					content: $("#addTask").html(),
					refresh: function() {
					    $.get(opts.calendar.allUnit, {}, function(resp) {
                            $(taskDlg).find("#lbTargetUnit option").remove();
                            $("<option value=\"-1\">- Pilih Unit -</option>")
                                .appendTo(taskDlg.find("#lbTargetUnit"));
                            $.each(resp.data, function(i, unit) {
                                $("<option value=\""+ unit.id +"\">"+ unit.name +"</option>")
                                    .appendTo(taskDlg.find("#lbTargetUnit"));
                            });
                        });
					},
					onBeforeShow: function($dlg) {
					    $dlg.css("position", "fixed")
						$day.addClass("highlight");
						$dlg.find("#lbWhen span").html(date.format("dddd, D MMMM YYYY"));
					},
					onShow: function($dlg) {
						var bound = {
							left : $(cal).offset().left,
							right : $(cal).offset().left + $(cal).outerWidth()
						};
						
						if($dlg.offset().left + $dlg.outerWidth() > bound.right) {
							$(this).css("left", bound.right - $dlg.outerWidth());
						}
						if($dlg.offset().left < bound.left) {
							$(this).css("left", bound.left);
						}

						var $form = $dlg.find("form");

						$('[name=user_ids]', $form).tokenInput(params.calendar.searchUser, {theme: "facebook"});
						$(".token-input-dropdown-facebook").css("z-index",5);
						$('[name=event_id]', $form).autocompleteEvent(function(event) {
						    $dlg.data('event', event);
						});
						$form.find(".browse-unit").data('dialog', $dlg);

						$form.submit(function(event) {
                            event.preventDefault();

                            var url = $form.attr('action'), task = $form.dumpJSON(), day = $dlg.data();

                            if($dlg.data('event') != null) task["event_id"] = $dlg.data('event').id;
                            task['start'] = day.format("YYYY-MM-DD HH:mm:ss");

                            $.post(url, task, function() {
                                $("#calendar").fullCalendar( "refetchEvents" );
                                //refreshUserEvent();
                                $dlg.hide();
                            });
                        });
						
						$dlg.refresh();
					}, 
					onHide: function() {
						$day.removeClass("highlight");
					}
				}).data(date);
			},
			eventClick: function(task, jsEvent, view) {
				var $task = $(this);
				var taskDialog = $("#bubble").bubble($task, {
				    size: { width: 450 },
					content: $("#dlg_edit_task").html(),
					refresh: function() {
					    $.get(opts.calendar.allUnit, {}, function(resp) {
                            taskDialog.find("[name=unit_id] option").remove();
                            $("<option value=\"-1\">- Pilih Unit -</option>")
                                .appendTo(taskDialog.find("[name=unit_id]"));
                            $.each(resp.data, function(i, unit) {
                                $("<option value=\""+ unit.id +"\">"+ unit.name +"</option>")
                                    .appendTo(taskDialog.find("[name=unit_id]"));
                            });

                            taskDialog.find("[name=unit_id] option").filter(function(){
                                return $(this).val() == task.unit.id;
                            }).prop('selected', true);
                        });
					},
					onBeforeShow: function($dlg) {
					    $dlg.css("position", "fixed")
						$task.addClass("highlight");
					},
					onShow: function($dlg) {
					    var bound = {
							left : $(cal).offset().left,
							right : $(cal).offset().left + $(cal).outerWidth()
						};

						if($dlg.offset().left + $dlg.outerWidth() > bound.right) {
							$dlg.css("left", bound.right - $dlg.outerWidth());
						}

						if($dlg.offset().left < bound.left) {
							$dlg.css("left", bound.left);
						}

					    var $form = $dlg.find("form");

						$form.find(".browse-unit").data('dialog', $dlg);
						$form.find(".where span").html(task.where);
						$form.find(".what span").html(task.title);
						$form.find(".what .color").css("background-color", "#" + task.event.color);
						$form.find(".when span").html(task.start.format("dddd, D MMMM YYYY") +
							(task.end == null ? "" : " - " + task.end.subtract(1, 'minutes').format("dddd, D MMMM YYYY")));
						$form.find(".who span").html(task.user.fullname);
						$form.find(".who .color").css("background-color", "#" + task.user.color);
						$form.find("[name=target]").val(task.target);
						$form.find("[name=realization]").val(task.realization);
						$form.find("[name=quality]").val(task.quality);

						$form.submit(function(event) {
                            event.preventDefault();

                            var url = $form.attr('action'), formData = $form.dumpJSON();

                            $.post(url + '/' + task.id, formData, function() {
                                $("#calendar").fullCalendar( "refetchEvents" );
                                $dlg.hide();
                            });
                        });
						
						$form.find("button.delete").bind("click", function() {
							$.get(params.calendar.deleteTask + '/' + task.id, {}, function(resp) {
								cal.fullCalendar( "refetchEvents" );
								$dlg.hide();
							})
						});

						$dlg.refresh($dlg);
					}, 
					onHide: function() {
						$task.removeClass("highlight");
					}
				});
			},
			eventDrop: function(task, delta, revertFunc, jsEvent, ui, view) {
				if(!task.editable) return false;
				$.post(params.calendar.moveTask + '/' + task.id, {
					start: task.start.format("YYYY-MM-DD HH:mm:ss"),
					end: task.end ? task.end.format("YYYY-MM-DD HH:mm:ss") : null,
				});
				return false;
			},
			eventResize: function(task, delta, revertFunc, jsEvent, ui, view) {
				if(!task.editable) return false;
				$.post(params.calendar.resizeTask + '/' + task.id, {
					start: task.start.format("YYYY-MM-DD HH:mm:ss"),
					end: task.end.format("YYYY-MM-DD HH:mm:ss"),
				});
				return false;
			},
			eventRender: function(task, element, view) {
				$(element)
				    .attr('user-id', task.user.id)
				    .attr('event-id', task.event.id)
				    .css("background-color", "#" + task.user.color)
				    .css("border-color", "#" + task.event.color);
				
			},
			eventAfterAllRender: function(view) {
				$.get(opts.calendar.allUser, {}, function(resp) {
                    $('.nav#user-list .user').remove();
                    $.each(resp.data, function(i, user) {
                        $('<li class="user" style=""><a href="#" style="border-left-color: #'+ user.color +'; color: #'+
                            user.color +' !important;" title="'+ user.fullname +'"><i class="fa fa-user fa-lg"></i>'+
                            user.fullname +'</a></li>').appendTo($('.nav#user-list')).data(user);
                    });
                });

                $.get(opts.calendar.allEvent, {}, function(resp) {
                    $('.nav#event-list .event').remove();
                    $.each(resp.data, function(i, event) {
                        $('<li class="event"><a href="#" style="border-left-color: #'+ event.color +'; color: #'+
                            event.color +' !important;"title="'+ event.title +'"><i class="fa fa-pencil fa-lg"></i>'+
                            event.title +'</a></li>').appendTo($('.nav#event-list')).data(event);
                    });
                });
			}
		}
		
		params.calendar = $.extend(true, defaultOpt, params.calendar);
		var fc = $(this).fullCalendar(params.calendar);
		return $.extend($(this), fc);
	}
})(jQuery);