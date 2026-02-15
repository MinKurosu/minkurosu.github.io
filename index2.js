$(document).ready(function() {

	
	$("a#single_image").fancybox();
	
	
	$("a#inline").fancybox({
		'hideOnContentClick': true
	});

	
	$("a.group").fancybox({
		'transitionIn'	:	'elastic',
		'transitionOut'	:	'elastic',
		'speedIn'		:	600, 
		'speedOut'		:	200, 
		'overlayShow'	:	false
	});
	
});