var storage = window.localStorage;
var carId = storage.getItem('carId');

bs.loadScript('../../', []);

mui.plusReady(function() {
	if(mui.os.plus){
		$('body').addClass('ios-body');
	}
})

$(function() {

	$('.inspect-fault-items .list-item').click(function() {
		au.toUrl('CarInspectFaultDetail.html');
	})

})