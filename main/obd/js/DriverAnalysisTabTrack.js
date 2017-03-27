var storage = window.localStorage;
var markerReplay, pointList, pointDList, pointSpList, nowLocation = 0,
	progressBar;
var carId = storage.getItem('carId');
var params = JSON.parse(storage.getItem('driverTrackParam'));
var autoEvent;

bs.loadScript('../../', ['picker', 'mt','dt']);

$(function() {

	if(mui.os.ios && mui.os.plus) {
		$('body').addClass('ios-body');
	}

	au.showCarLoadingFull();

	if(params.from == 0) {
		$('.x-title-bar').html('轨迹分析');

		pointList = eval('(' + storage['driverPointList'] + ')');
		pointDList = eval('(' + storage['driverDetailPointList'] + ')');
		pointSpList = eval('(' + storage['driverSpecialPointList'] + ')');

		setTimeout(function() {
			pageLoad();
		}, 500)
	} else {
		$('.x-title-bar').html('每日足迹(' + params.nowDate + ')');
		//		var dataUrl = require.toUrl('../data/dailyAllTrack.json');
		var dataUrl = au.api + 'getSomeDayDetailsDrivingReport?carId=' + carId + '&date=' + dt.changeDataStr(params.nowDate,'yyyy-mm-dd','yyyymmdd');
		$.getJSON(dataUrl, function(data) {
			pointList = mt.changeLatLng(data[0].pointList);
			pointDList = data[0].pointDetailsList;
			pointSpList = data[0].specialPointList;
			pageLoad();
		})
	}

})

function pageLoad() {

	loadGaodeMap();
	//回放按钮点击事件
	$('.replay-button').click(function() {
		if($(this).hasClass('replay-button-stop')) {
			$(this).removeClass('replay-button-stop');
			clearInterval(autoEvent);
		} else {
			$(this).addClass('replay-button-stop');
			autoEvent = setInterval(function() {
				if(nowLocation == pointDList.length - 1) {
					setProgress(-1);
				} else {
					setProgress(nowLocation / pointDList.length * 100, pointDList[nowLocation]);
					nowLocation++;
				}
			}, 300)
		}
	})

	var start
		//指针拖拽事件
	$('.progress-point').on('touchstart', function(e) {
		//清除自动事件
		clearInterval(autoEvent);
		$('.replay-button').removeClass('replay-button-stop');
		// 记录开始按下时的点
		var touches = e.originalEvent.targetTouches[0];
		start = {
			x: touches.pageX, // 横坐标
			y: touches.pageY // 纵坐标
		};
		e.preventDefault();
	});

	$('.progress-point').on('touchmove', function(e) {
		// 计算划动过程中x和y的变化量
		var touches = e.originalEvent.changedTouches[0];
		changePosition(touches);
	})

	$('.progress-point').on('touchend', function(e) {
		// 计算划动过程中x和y的变化量
		var touches = e.originalEvent.changedTouches[0];
		changePosition(touches);
	})

	progressBar = mui('#demo1')
	mui(progressBar).progressbar({
		progress: 0
	}).show();

}

function changePosition(touches) {
	var maxWidth = parseInt($('#demo1').css('width'));
	var pointLineLeft = $('#demo1').position().left;
	var panelLeft = $('.replay-progress-area').position().left;
	//指针未到最末位
	if(touches.pageX < (pointLineLeft + panelLeft)) {
		setProgress(-1);
	} else {
		var offsetX = Math.abs(touches.pageX - pointLineLeft - panelLeft);
		if(offsetX < maxWidth) {
			var offsetPercent = parseInt(offsetX / maxWidth * 100)
			var arrayLocation = parseInt(offsetPercent / 100 * pointDList.length);
			nowLocation = arrayLocation
			setProgress(offsetPercent, pointDList[arrayLocation]);
			//			$('.a').html(touches.pageX+'@@'+maxWidth+'@@'+offsetPercent);
		} else {
			setProgress(100);
		}
	}
}

function setProgress(pro, point) {
	if(pro == -1) {
		//		mui(progressBar).progressbar().setProgress(pro);

		var span = document.querySelector('#demo1').querySelector('span');
		var style = span.style;
		style.webkitTransform = 'translate3d(' + (-100 + pro) + '%,0,0)';
		style.webkitTransitionDuration = '0ms';
		markerReplay.hide();
		$('.text-replay-area').addClass('hide');
		nowLocation = 0;
		clearInterval(autoEvent);
		$('.replay-button').removeClass('replay-button-stop');
		$('.progress-point').css('left', pro + '%')
	} else {
		markerReplay.show();
		$('.text-replay-area').removeClass('hide');
		//		mui(progressBar).progressbar().setProgress(pro);

		var span = document.querySelector('#demo1').querySelector('span');
		var style = span.style;
		style.webkitTransform = 'translate3d(' + (-100 + pro) + '%,0,0)';
		style.webkitTransitionDuration = '0ms';
		markerReplay.setPosition([point[1], point[0]]);
		$('.replay-date').html(dt.getDateStr(dt.toDate(point[3],'yyyymmddhhmmss'),'yyyymmddhhmmss'));
		$('.replay-speed').html(point[2]);

		$('.progress-point').css('left', pro - 1 + '%');

	}
}

function loadGaodeMap() {
	mt.loadMap(function() {
		au.hideCarLoadingFull();
		$('.replay-progress-area').show();
		mapObj = new AMap.Map('map_track_div', {
			dragEnable: true
		});

		//加载缩放工具栏
		AMap.plugin(['AMap.ToolBar', 'AMap.Scale'], function() {
			mapObj.addControl(new AMap.ToolBar());
			mapObj.addControl(new AMap.Scale());
		})

		//画轨迹
		var polyline = new AMap.Polyline({
			path: pointList, //设置线覆盖物路径
			strokeColor: "#00FF00", //线颜色
			strokeOpacity: 1, //线透明度
			strokeWeight: 2, //线宽
			strokeStyle: "solid" //线样式
		});
		polyline.setMap(mapObj);

		//标记起止点
		var markerStart = new AMap.Marker({
			position: pointList[0],
			icon: new AMap.Icon({
				image: '../../images/obd/obd_hxz_health_sha_kai.png'
			})
		});
		markerStart.setMap(mapObj)
		var markerEnd = new AMap.Marker({
			position: pointList[pointList.length - 1],
			icon: new AMap.Icon({
				image: '../../images/obd/obd_hxz_health_sha_stop.png'
			})
		});
		markerEnd.setMap(mapObj)

		//标记回放点
		markerReplay = new AMap.Marker({
			map: mapObj,
			position: pointList[0],
			icon: new AMap.Icon({
				image: '../../images/obd/obd_safe_icon4.png'
			})
		});
		markerReplay.hide();

		if(pointSpList) {
			//标记特殊点
			for(var j = 0; j < pointSpList.length; j++) {
				var icon = {},
					spPoint = pointSpList[j];
				if(spPoint.sharpSlow == 1) {
					icon = new AMap.Icon({
						image: '../../images/obd/obd_hxz_health_sha.png'
					})
				} else if(spPoint.sharpSpeedup == 1) {
					icon = new AMap.Icon({
						image: '../../images/obd/obd_hxz_health_jia.png'
					})
				}

				var specialMarker = new AMap.Marker({
					position: [spPoint.trackLng, spPoint.trackLat],
					icon: icon
				});
				specialMarker.setMap(mapObj);

			}
		}
		mapObj.setFitView();

	})
}