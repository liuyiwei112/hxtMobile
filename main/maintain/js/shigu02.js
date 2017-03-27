var storage = window.localStorage;

bs.loadScript('../../',[]);

$(function(){
	if(mui.os.ios&&mui.os.plus){
		$('body').addClass('ios-body');
	}
	
	
})


function showPhoto(){
	var photoArray = [{'value':'take','text':'拍照'},{'value':'gallary','text':'从相册库选取'}];
	au.showSelect(photoArray,function(selected){
//		alert(selected.value);
	})
}