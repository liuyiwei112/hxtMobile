var storage = window.localStorage;
var faultDetail = JSON.parse(storage.getItem('faultDetail'));

bs.loadScript('../../', []);

$(function(){
	
	if(mui.os.ios && mui.os.plus) {
		$('body').addClass('ios-body');
	}
	
	var faultCode = faultDetail.faultCode;
	var faultId = faultDetail.faultId;
	
	var dataUrl = au.api + 'terminals/check/getSysFaultsVO?dtcId='+faultId+'&dtcCode='+faultCode;
	
	$.get(dataUrl,function(d){
		
		$('.fault-code').html(faultCode);
		$('.fault-desc').html(d.dtcDesc);
		$('.fault-express').html(d.goloDtcHelp.replace(/(\r\n)|(\n)/g,'<br/>'));
		$('.fault-reason').html(d.goloDtcAdvice.replace(/(\r\n)|(\n)/g,'<br/>'));
		
	})
	

})