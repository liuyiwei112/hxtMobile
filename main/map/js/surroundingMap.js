var storage = window.localStorage;
var carId = storage.getItem('carId');
var mapUrlParam = JSON.parse(storage.getItem('mapUrlParam'));
var mapObj, circle, center, placeSearch, swiper, sKey, nowIndex, initRadius = 3000;
var markerArray = [];

bs.loadScript('../../', ['swiper','mt']);

$(function() {
	if(mui.os.ios && mui.os.plus) {
		$('body').addClass('ios-body');
	}
	var title = mapUrlParam.title;
	if(title.indexOf('加油') > -1) {
		sKey = '加油站';
	} else if(title.indexOf('停车') > -1) {
		sKey = '停车场';
		initRadius = 1000;
	}
	$('.x-title-bar').html(title);

	swiper = new Swiper('.swiper-container', {
		onSlideChangeEnd: function(_swiper) {
			changeIconStatus(_swiper.activeIndex);
		}
	});

	loadMap();

	$('.distance-area span').on('tap', function() {
		setRadiusButton($(this).attr('mile'));
	})

});

function loadMap() {
	mt.loadMap(function() {
		console.log('amap init');
		mapObj = new AMap.Map('map_area', {
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
			//				mapObj.addControl(geolocation);
			AMap.event.addListener(geolocation, 'complete', onComplete); //返回定位信息
			AMap.event.addListener(geolocation, 'error', onError); //返回定位出错信息
		})

		//搜索服务
		AMap.service(["AMap.PlaceSearch"], function() {
			placeSearch = new AMap.PlaceSearch({ //构造地点查询类
				pageSize: 50,
				pageIndex: 1,
				map: mapObj
			});
		});

		AMap.plugin(["AMap.Driving"], function() {
			var drivingOption = {
				policy: AMap.DrivingPolicy.LEAST_TIME,
				map: mapObj
			};
			driving = new AMap.Driving(drivingOption); //构造驾车导航类
		});

		//获取车辆定位
		var dataUrl = au.api + 'rescueService/getCarLocation?carId=' + carId;
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

function setRadiusButton(_radius) {
	$('.distance-area .check').removeClass('check');
	$('.distance-area span[mile="' + _radius + '"]').addClass('check');
	circle.setRadius(_radius);
	doSearch(_radius);
}

//定位成功或者查询上次坐标点成功
function onComplete(e) {
	center = e.position;

	var marker = new AMap.Marker({
		position: e.position,
		icon: new AMap.Icon({
			image: '../../images/obd/obd_safe_icon4.png'
		})
	});
	marker.setMap(mapObj);

	circle = new AMap.Circle({
		center: e.position, // 圆心位置
		radius: initRadius, //半径
		strokeColor: "#fc3434", //线颜色
		strokeOpacity: 1, //线透明度
		strokeWeight: 1, //线粗细度
		fillOpacity: 0
	});
	circle.setMap(mapObj);

	setRadiusButton(initRadius);

}

function onError(e) {
	alert(e.info)
}

//POI兴趣点查询展示方法
function doSearch(distance) {
	//关键字查询
	mapObj.remove(markerArray);
	markerArray.splice(0, markerArray.length);;
	//POI搜索及marker展示
	placeSearch.searchNearBy(sKey, center, distance, function(status, result) {
		placeSearch.clear();
		var poiList = result.poiList.pois;
		var poiModel = '<div class="swiper-slide"><div class="poi-detal">' + $('.poi-detal-model').html() + '</div></div>';
		swiper.removeAllSlides();
		nowIndex = 0;
		for(var i = 0; i < poiList.length; i++) {
			swiper.appendSlide(poiModel);
			$('.swiper-slide:last').find('.poi-name').html((i + 1) + '. ' + poiList[i].name);
			$('.swiper-slide:last').find('.poi-address').html(poiList[i].address);
			if(poiList[i].tel) {
				$('.swiper-slide:last').find('.poi-tel').html(poiList[i].tel);
			}
			$('.swiper-slide:last').find('.tel-phone').on('tap', function(e) {
				var phone = $(this).parent().prev().html();
				if(phone != '暂无联系方式') {
					_tl.phone(phone.replace('-', ''));
				} else {
					mui.toast('该商家暂无联系方式');
				}
			})
			$('.swiper-slide:last').find('.poi-button-go').html('到这去(' + mt.toKm(poiList[i].distance) + ')');

			var markContent = '<div class="amap-icon marker-not-check">' + (i + 1) + '</div>';
			if(i == 0) {
				markContent = '<div class="amap-icon marker-not-check marker-checked">' + (i + 1) + '</div>';
			}
			//添加自定义marker
			var marker = new AMap.Marker({
				position: poiList[i].location,
				content: markContent
			});
			marker.extData = {
				'id': i,
				'poiName': poiList[i].name
			};
			marker.on('click', function(e) {
				changeIconStatus(e.target.extData.id);
			})
			marker.setMap(mapObj);
			markerArray.push(marker);
		}
		mapObj.setFitView();
	})
}

//查询点变更
function changeIconStatus(_toIndex) {
	markerArray[nowIndex].setContent('<div class="amap-icon marker-not-check">' + (nowIndex + 1) + '</div>');
	nowIndex = _toIndex;
	markerArray[nowIndex].setContent('<div class="amap-icon marker-not-check marker-checked">' + (nowIndex + 1) + '</div>');
	swiper.slideTo(nowIndex, 100, false);
}

//路径规划及APP跳转实现
function doRouterDesign() {
	//根据起终点坐标规划驾车路线
	var des = markerArray[nowIndex].getPosition();
	var extra = markerArray[nowIndex].extData;
	var start = '我的位置';
	if(mui.os.ios && mui.os.plus) {
		//判断用户是否已经安装 高德 或者 百度地图
		var UIApplication = plus.ios.importClass("UIApplication");
		var NSURL = plus.ios.importClass("NSURL");
		var app = UIApplication.sharedApplication();
		var gdSchemeInspect = NSURL.URLWithString("iosamap://");
		var bdSchemeInspect = NSURL.URLWithString("baidumap://")
		var gdInstall = app.canOpenURL(gdSchemeInspect);
		var bdInstall = app.canOpenURL(bdSchemeInspect);

		if(gdInstall == 1) {
			var gdScheme = NSURL.URLWithString("iosamap://path?sourceApplication=applicationName&sid=BGVIS1&slat=" + center.getLat() + "&slon=" + center.getLng() + "&sname=" + encodeURIComponent(start) + "&did=BGVIS2&dlat=" + des.getLat() + "&dlon=" + des.getLng() + "&dname=" + encodeURIComponent(extra.poiName) + "&dev=0&m=0&t=0");
			app.openURL(gdScheme);
			return;
		} else if(bdInstall == 1) {
			var bdCenter = _tl.bd_decrypt(center.getLat(), center.getLng());
			var dbDes = _tl.bd_decrypt(des.getLat(), des.getLng());
			var url = "baidumap://map/direction?origin=" + bdCenter[0] + "," + bdCenter[1] + "&destination=" + dbDes[0] + "," + dbDes[1] + "&mode=driving";
			var bdScheme = NSURL.URLWithString(url);
			app.openURL(bdScheme);
			return;
		} else {
			mui.alert('检测到您尚未安装高德或者百度地图');
		}
	} else if(mui.os.android && mui.os.plus) {
		var main = plus.android.runtimeMainActivity();
		var packageManager = main.getPackageManager();
		var PackageManager = plus.android.importClass(packageManager);
		var bdName = 'com.baidu.BaiduMap';
		var gdName = 'com.autonavi.minimap';
		try {
			var context = main.getContext();
			var Intent = plus.android.importClass("android.content.Intent");
			if(packageManager.getPackageInfo(gdName, PackageManager.GET_ACTIVITIES)) {
				//				var _url = "androidamap://navi?sourceApplication=siovpoiname="+encodeURIComponent(extra.poiName)+"&lat="+des.getLat()+"&lon="+des.getLng()+"&dev=0";
				var _url = "androidamap://path?sourceApplication=applicationName&sid=BGVIS1&slat=" + center.getLat() + "&slon=" + center.getLng() + "&sname=" + encodeURIComponent(start) + "&did=BGVIS2&dlat=" + des.getLat() + "&dlon=" + des.getLng() + "&dname=" + encodeURIComponent(extra.poiName) + "&dev=0&m=0&t=0";
				intent = Intent.getIntent(_url);
				context.startActivity(intent);
			} else {

			}
		} catch(e) {
			try {
				if(packageManager.getPackageInfo(bdName, PackageManager.GET_ACTIVITIES)) {
					var bdCenter = _tl.bd_decrypt(center.getLat(), center.getLng());
					var dbDes = _tl.bd_decrypt(des.getLat(), des.getLng());
					var main = plus.android.runtimeMainActivity();
					var _url = "intent://map/direction?" +
						"origin=latlng:" + bdCenter[0] + "," + bdCenter[1] + "|name:" + encodeURIComponent(start) + //起点  此处不传值默认选择当前位置
						"&destination=latlng:" + dbDes[0] + "," + dbDes[1] + "|name:" + encodeURIComponent(extra.poiName) + //终点
						"&mode=driving" + //导航路线方式
						"&src=siov#Intent;scheme=bdapp;package=com.baidu.BaiduMap;end";
					var intent = Intent.getIntent(_url);
					context.startActivity(intent); //启动调用
				} else {
					mui.alert('检测到您尚未安装高德或者百度地图');
				}
			} catch(e) {
				mui.alert('检测到您尚未安装高德或者百度地图');
			}
		}
	} else {
		mui.alert('Web端暂不支持路径规划导航，请使用APP');
	}
}