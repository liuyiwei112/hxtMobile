var storage = window.localStorage;
var alertDetail = JSON.parse(storage.getItem('alertDetail'));
var carAlertParam = JSON.parse(storage.getItem('carAlertParam'));
var defaultCar = JSON.parse(storage.getItem('defaultCar'));

bs.loadScript('../../', ['mt','dt']);

$(function() {

	if(mui.os.ios && mui.os.plus) {
		$('body').addClass('ios-body');
	}
	
	au.showCarLoadingFull();

	//初始化告警详细窗体及标题
	$('.x-title-bar').html(carAlertParam.alermName);
	$('.text-car-no').html(defaultCar.carNo);
	$('.text-date').html(alertDetail.alermTime);
	$('.text-address').html(alertDetail.alermAddress);

	mt.loadMap(function() {
		var mapObj = new AMap.Map('alert_map', {
			zoom: 15,
			center: [alertDetail.longitude, alertDetail.latitude],
			dragEnable: true,
			resizeEnable: true
		});

		mapObj.plugin(['AMap.ToolBar'], function() {
			//设置地位标记为自定义标记
			var toolBar = new AMap.ToolBar();
			mapObj.addControl(toolBar);
		});

		var marker = new AMap.Marker({
			map: mapObj,
			position: [alertDetail.longitude, alertDetail.latitude],
			icon: new AMap.Icon({
				image: '../../images/obd/obd_safe_icon4.png',
				size: new AMap.Size(45, 62)
			})
		});

		var infoWindow = new AMap.InfoWindow({});

		marker.content = '<div class="info-content-large">' + $('.info-content').html() + '</div>';
		infoWindow.setContent(marker.content);
		infoWindow.open(mapObj, marker.getPosition());

		au.hideCarLoadingFull();
	})
})