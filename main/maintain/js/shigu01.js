var storage = window.localStorage;

bs.loadScript('../../',[]);

$(function(){
	if(mui.os.ios&&mui.os.plus){
		$('body').addClass('ios-body');
	}
	
	$('.car-body-party').on('tap',function(){
		au.toUrl('shigu02.html');
	})
	
})

