var storage = window.localStorage;
var carId = storage.getItem('carId');
var selectDate, selectDateStr;

bs.loadScript('../../', ['picker','dt']);

$(function() {
	
	if(mui.os.ios && mui.os.plus) {
		$('body').addClass('ios-body');
	}

	selectDate = dt.getNowStr('yyyymmdd');
	selectDateStr = dt.getNowStr('yyyy-mm-dd');
	loadData();

	//初始化时间控件
	var dtpicker = new mui.DtPicker({
		"type": "date"
	})

	$('.now-date').click(function() {
		dtpicker.show(function(e) {
//					    console.log(e);
			selectDate = dt.changeDataStr(e+'','yyyy-mm-dd','yyyymmdd');
			selectDateStr = e+'';
			loadData();
		})
	})

	$('.btn-date-left').click(function() {
		var pre = dt.getPreDayStr(dt.toDate(selectDate,'yyyymmdd'),'yyyymmdd');
		var preStr = dt.getPreDayStr(dt.toDate(selectDate,'yyyymmdd'),'yyyy-mm-dd');
		selectDate = pre;
		selectDateStr = preStr;
		loadData();
	})

	$('.btn-date-right').click(function() {
		var next = dt.getNextDayStr(dt.toDate(selectDate,'yyyymmdd'),'yyyymmdd');
		var nextStr = dt.getNextDayStr(dt.toDate(selectDate,'yyyymmdd'),'yyyy-mm-dd');
		selectDate = next;
		selectDateStr = nextStr;
		loadData();
	})

	$('.button-daily-track').click(function() {
		var params = {
			'from': 1,
			'nowDate': selectDateStr
		}
		storage.setItem('driverTrackParam', JSON.stringify(params));
		au.toUrl('DriverAnalysisTabTrack.html');

	})
	
	doOther();

})

function loadData() {
	au.hideCarTip();
	$('.driver-list').hide();
	au.hideCarLoading();
	$('.now-date').html(selectDateStr);
	getDailyTotal(selectDate);
	getDailyList(selectDate);
}

function getDailyTotal() {
	//		var dataUrl = '../../data/obd/dailyTotal.json';
	var dataUrl = au.api + 'dailyDrivingReport/' + carId + '?date=' + selectDate;
	$.get(dataUrl, function(data) {
		if(data) {
			$('.total-area-mile-text').html(data.driverMile);
			$('.total-area-speedup-text').html(data.sharpSpeedup);
			$('.total-area-time-text').html(data.driverTime);
			$('.total-area-speeddown-text').html(data.sharpSlow);
			$('.total-area-oil-text').html(data.totalOil);
			$('.total-area-turn-text').html(data.sharpChange);
		} else {
			$('.total-area-mile-text').html('0');
			$('.total-area-speedup-text').html('0');
			$('.total-area-time-text').html('0');
			$('.total-area-speeddown-text').html('0');
			$('.total-area-oil-text').html('0');
			$('.total-area-turn-text').html('0');
		}

	})

}

function getDailyList() {
	//		var dataUrl = '../../data/obd/dailyTripList.json';
	au.showCarLoading(8);
	var dataUrl = au.api + 'drivingReports/' + carId + '?date=' + selectDate + '&page=0&size=10000'
	$.get(dataUrl, function(data) {
		$('.driver-list').html('');
		if(data.content.length == 0) {
			au.showCarTip(8,'当日暂无驾驶数据')
		} else {
			au.hideCarTip();
		}
		var model = '<div class="driver-item">' + $('.driver-item-model').html() + '</div>';
		for(var i = 0; i < data.content.length; i++) {
			var trip = data.content[i];
			$('.driver-list').append(model);

			//赋值
			$('.driver-list .driver-item:last').find('.start-time').html(dt.getDateStr(dt.toDate(trip.startTime,'yyyymmddhhmmss'),'hh:mm:ss'));
			$('.driver-list .driver-item:last').find('.st-value').val(trip.startTime);
			$('.driver-list .driver-item:last').find('.start-address').html(trip.startPoint);
			$('.driver-list .driver-item:last').find('.driver-detail-time .detail-text').html(trip.driverTime);
			$('.driver-list .driver-item:last').find('.driver-detail-mile .detail-text').html(trip.driverMile);
			$('.driver-list .driver-item:last').find('.driver-detail-speed .detail-text').html(trip.averageSpeed);
			$('.driver-list .driver-item:last').find('.driver-detail-oil .detail-text').html(trip.totalOil);
			$('.driver-list .driver-item:last').find('.driver-detail-cost .detail-text').html(trip.totalCost);
			$('.driver-list .driver-item:last').find('.driver-detail-max-speed .detail-text').html(trip.maxVelocity);
			$('.driver-list .driver-item:last').find('.end-time').html(dt.getDateStr(dt.toDate(trip.endTime,'yyyymmddhhmmss'),'hh:mm:ss'));
			$('.driver-list .driver-item:last').find('.end-address').html(trip.endPoint);
		}

		$('.driver-item').click(function() {
			//var alertSerial = $(this).find('.alert-serial').val();

			storage.setItem('tripSerial', $(this).find('.st-value').val() + '-' + carId);
			//				justep.Shell.showPage(require.toUrl('./DriverAnalysisTabFrame.w'),params);
			au.toUrl('DriverAnalysisTabFrame.html');
		})
		$('.driver-list').show();
		au.hideCarLoading();

	})
}

window.addEventListener('initParam', function(e) {
	doOther();
})
//回到驾驶分析列表后需处理的事项
function doOther(){
	//删除单次行程的缓存数据
	storage.removeItem('driverDetailCenter');
	storage.removeItem('driverDetailPointList');
	storage.removeItem('driverPointList');
	storage.removeItem('driverSpecialPointList');
	storage.removeItem('driverTrackParam');
	storage.removeItem('tripSerial');
}