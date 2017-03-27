var storage = window.localStorage;
var carId = storage.getItem('carId');

bs.loadScript('../../', ['picker','dt']);

mui.plusReady(function() {
	mui.init({
		beforeback: function() {
			var wobj = plus.webview.getWebviewById("index");
			mui.fire(wobj, 'initParam');
			return true;
		}
	})
})

$(function() {
	if(mui.os.ios && mui.os.plus) {
		$('body').addClass('ios-body');
	}
	querySummary(0);
	//初始化时间控件
	var dtpicker = new mui.DtPicker({
		"type": "date"
	})
	
	$('.start-date,.end-date').on('tap',function(){
		var that = $(this);
		dtpicker.show(function(e) {
			that.val(e+'');
		})
	})
	$('.end-date').val(dt.getNowStr('yyyy-mm-dd'));
	
	$('.query-order-date').on('tap',function(){
		$('.input-error').removeClass('input-error');
		var sd = $.trim($('.start-date').val());
		var ed = $.trim($('.end-date').val());
		if(!sd){
			$('.start-date').addClass('input-error');
		}
		if(!ed){
			$('.end-date').addClass('input-error');
			return;
		}
		querySummary(2,dt.changeDataStr(sd,'yyyy-mm-dd','yyyymmdd'),dt.changeDataStr(ed,'yyyy-mm-dd','yyyymmdd'))
	})
})

function querySummary(_index,startDate,endDate) {
	$('.tap-checked').removeClass('tap-checked');
	if(_index==3){
		$('.tap-not-checked:eq(' + (_index-1) + ')').addClass('tap-checked');
	}else{
		$('.tap-not-checked:eq(' + _index + ')').addClass('tap-checked');
	}
	$('.summary-panel').html('');

	if(_index == 0||_index == 1||_index == 2){
		if(_index == 0||_index == 1){
			$('.order-date').hide();
			au.showCarLoadingFull();
		}else{
			au.showCarLoading(9);
		}
//		_tl.hide($('.error-tip'));
		
		var dataUrl = au.api + 'listTripStatisticByMonth?carId=' + carId;
		if(_index == 1) {
			dataUrl = au.api + 'listTripStatisticByWeek?carId=' + carId;
		}else if(_index == 2){
			dataUrl = au.api + 'getPageTripStatisticByDay?carId=' + carId+'&startTime='+startDate+'&endTime='+endDate;
		}
		setTimeout(function() {
			var temp = JSON.parse(storage.getItem('summaryTemp' + _index));
			if(temp) {
				setSummary(temp);
			} else {
				$.get(dataUrl, function(d) {
					if(_index==2){
						var _a = [];
						_a.push(d);
						storage.setItem('summaryTemp' + _index, JSON.stringify(_a));
						setSummary(_a);
					}else{
						storage.setItem('summaryTemp' + _index, JSON.stringify(d));
						setSummary(d);
					}
				})
			}
		}, 500)
	}else{
		$('.order-date').show();
	}

}

function setSummary(d) {
	au.hideCarLoadingFull();
	au.hideCarLoading();
	var model = '<div class="total-area bg1 width100">' + $('.total-area-model').html() + '</div>';
	for(var i = d.length-1; i > -1; i--) {
		if(d[i].totleMile > 0){
			$('.summary-panel').append(model);
			//按月的日期处理
			if(d[i].tripDate.indexOf('-')==2){
				var now = new Date();
				var tripD = d[i].tripDate.split('-');
				var tripDObj = new Date(now.getFullYear(),tripD[0]-1,tripD[1]);
				//获取7天前的日期
				var preDate = new Date(tripDObj.getTime() - 7*24 * 60 * 60 * 1000);
				$('.total-area:last .summary-top').html(dt.getDateStr(preDate,'mm-dd')+' ~ '+dt.getDateStr(tripDObj,'mm-dd'));
			}else{
				$('.total-area:last .summary-top').html(d[i].tripDate);
			}
			$('.total-area:last .total-area-mile-text').html(d[i].totleMile);
			$('.total-area:last .total-area-time-text').html(d[i].totleTime);
			$('.total-area:last .total-area-oil-text').html(d[i].totalOil);
			$('.total-area:last .total-area-speedup-text').html(d[i].totleSharpSpeedup);
			$('.total-area:last .total-area-speeddown-text').html(d[i].sharpSlow);
			$('.total-area:last .total-area-turn-text').html(d[i].sharpTurn);
		}
	}
}