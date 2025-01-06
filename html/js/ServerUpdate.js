/*
(exercises in quantum mechanics)
functions for AJAX request

Author: Alexander V. Korovin [a.v.korovin73@gmail.com]
25/05/2019-30/04/2020
*/

$(document).ajaxStart(function() {
	console.log("ajax start");
	$(document.body).css({'cursor' : 'wait'});
//	$(document.body).css({'cursor' : 'progress'});
}).ajaxStop(function() {
	console.log("ajax stop");
	$(document.body).css({'cursor' : 'default'});
//	setTimeout($.unblockUI, 2000); 
	$.unblockUI();
});


$(document).ready(function() {
//	$("input:text").focusout(function() {
	$(".numinput").focusout(function() {
		if(isNaN($(this).val())) {
			$(this).css('background-color', 'red');
		}
		else {
			$(this).css('background-color', 'white');
		}
	}) .trigger("focusout");

	$(".expinput").focusout(function() {
		var str = $(this).val();
		if(isNaN(str)) {
			$(this).css('background-color', 'red');
		}
		else {
			$(this).css('background-color', 'white');
		}
	}) .trigger("focusout");

	// $("#SlideShow1").bootstrapcarousel({interval:0, ride: true});

});

