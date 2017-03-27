var storage = window.localStorage;

bs.loadScript('../', ['swiper', 'mt']);

$(function() {
	if(mui.os.ios&&mui.os.plus) {
		$('body').addClass('ios-body');
	}
	loadMap();
	bindRescue();
})

function bindRescue() {
	$('.menu-item').on('tap', function() {
		$('.pop-up').show();
	})

	$('.button-area').on('tap', function() {
		$('.pop-up').hide();
	})
}

function loadMap() {
	mt.loadMap(function() {
		$('.loading-tip').hide();
		console.log('amap init');
		mapObj = new AMap.Map('rescue_map', {
			zoom: 16,
			dragEnable: true,
			resizeEnable: true
		});

		mapObj.plugin(['AMap.ToolBar'], function() {
			//设置地位标记为自定义标记
			var toolBar = new AMap.ToolBar();
			mapObj.addControl(toolBar);
		});

		mapObj.plugin('AMap.Geolocation', function() {
			geolocation = new AMap.Geolocation({
				enableHighAccuracy: true, //是否使用高精度定位，默认:true
				timeout: 10000, //超过10秒后停止定位，默认：无穷大
				maximumAge: 0, //定位结果缓存0毫秒，默认：0
				convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
				showButton: true, //显示定位按钮，默认：true
				buttonPosition: 'RT', //定位按钮停靠位置，默认：'LB'，左下角
				buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
				showMarker: false, //定位成功后在定位到的位置显示点标记，默认：true
				showCircle: false, //定位成功后用圆圈表示定位精度范围，默认：true
				panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
				zoomToAccuracy: false //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
			});
			mapObj.addControl(geolocation);
			AMap.event.addListener(geolocation, 'complete', onComplete); //返回定位信息
			AMap.event.addListener(geolocation, 'error', onError); //返回定位出错信息
		})

		//			获取车辆定位
		var dataUrl = au.api + 'rescueService/getCarLocation?carId=961238391800869';
		$.get(dataUrl, function(d) {
			if(d) {
				var param = {
					'position': new AMap.LngLat(d.longitude, d.latitude)
				}
				onComplete(param);
			} else {
				geolocation.getCurrentPosition();
			}
		})
	})
}

//定位成功或者查询上次坐标点成功
function onComplete(e) {
	center = e.position;

	var marker = new AMap.Marker({
		position: e.position,
		icon: new AMap.Icon({
			image: '../images/obd/obd_safe_icon4.png'
		})
	});
	marker.setMap(mapObj);

	circle = new AMap.Circle({
		center: e.position, // 圆心位置
		radius: 1000, //半径
		strokeColor: "#fc3434", //线颜色
		strokeOpacity: 1, //线透明度
		strokeWeight: 1, //线粗细度
		fillOpacity: 0
	});
	circle.setMap(mapObj);

	var infoWindow = new AMap.InfoWindow({});

	marker.content = '<div class="info-content-large">' + $('.info-content').html() + '</div>';
	infoWindow.setContent(marker.content);
	infoWindow.open(mapObj, marker.getPosition());

	//	setRadiusButton(initRadius);
	mapObj.setFitView();

}

function onError(e) {
	alert(e.info)
}