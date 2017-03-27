var storage = window.localStorage;
var carId = storage.getItem('carId');
var carAlertParam = JSON.parse(storage.getItem('carAlertParam'));
var allData = {};

bs.loadScript('../../', ['jroll', 'jroll-infinite', 'dt']);

mui.plusReady(function() {
	mui.init({
		beforeback: function() {
			var wobj = plus.webview.getWebviewById("obd/carAlert.html");
			wobj.reload();
			return true;
		}
	})
})

$(function() {

	if(mui.os.ios && mui.os.plus) {
		$('body').addClass('ios-body');
	}
	
	$('.x-title-bar').html(carAlertParam.alermName);

	getNotRead()
	addItemEvent();

})

var firstClick = true;

function addItemEvent() {
	$('.has-read').on('click', function() {
		au.hideCarTip();
		if(!$(this).hasClass('tap-checked')) {
			$('.not-read').removeClass('tap-checked');
			$(this).addClass('tap-checked');
			//初次点击，初始化上拉控件
			if(firstClick) {
				firstClick = false;
				$('.car-alert-read-list').show();
				getRead();
			}else{
			//在次点击，控制界面的显示隐藏	
				if($('.car-alert-read-list').find('.car-alert-detail').length==0) {
					au.showCarTip('','您的爱车没有告警');
				} else {
					au.hideCarTip();
					$('.car-alert-read-list').show();
				}
			}

			$('.car-alert-not-read-list').hide();
		}
	})
	$('.not-read').on('click', function() {
		au.hideCarTip();
		if(!$(this).hasClass('tap-checked')) {
			$('.has-read').removeClass('tap-checked');
			$(this).addClass('tap-checked');

			if($('.car-alert-not-read-list').find('.car-alert-detail').length==0) {
				au.showCarTip('','您的爱车没有告警');
			} else {
				au.hideCarTip();
			}

			$('.car-alert-read-list').hide();
			$('.car-alert-not-read-list').show();
		}
	})
}

function getRead() {
	var readUrl = au.api + 'alerm/alermHistory?carId=' + carId + '&alermType=' + carAlertParam.alermType + '&size=10'
	var jroll = new JRoll(".car-alert-read-list", {
		scrollBarY: true
	});
	jroll.infinite({
		size: 10,
		getData: function(page, callback) { //获取数据的函数，必须传递一个数组给callback
			$.ajax({
				url: readUrl + '&page=' + (page - 1),
				success: function(data) {
					//处理数组
					var tmpArr = [];
					for(var i = 0; i < data.content.length; i++) {
						var _a = data.content[i];
						allData[_a.serial] = _a;
						_a.alermTime = dt.changeDataStr(_a.alermTime, 'yyyymmddhhmmss', 'yyyymmddhhmmss');
						tmpArr.push(_a);
					}
					if(tmpArr.length==0){
						$('.car-alert-read-list').hide();
						au.showCarTip('','您的爱车没有告警');
					}
					callback(tmpArr);
					setTimeout(function(){
						bindDetailTap();
					},200)
				}
			});
		},
		template: $('.car-alert-read-detail-model').html() //每条数据模板
	});

}

function getNotRead() {
//	var dataUrl = '../../data/carAlertNotRead.json';
	au.showCarLoadingFull();
	var notReadUrl = au.api + 'alerm/alermDetail?carId=' + carId + '&alermType=' + carAlertParam.alermType;
	$.getJSON(notReadUrl, function(data) {
		au.hideCarLoadingFull();
		$('.car-alert-not-read-list').html('');
		if(data.length == 0) {
			au.showCarTip('','您的爱车没有告警');
		} else {
			au.hideCarTip();
		}
		var alertNotReadModel = $('.car-alert-not-read-detail-model').html();
		for(var i = 0; i < data.length; i++) {
			data[i].alermTime = dt.changeDataStr(data[i].alermTime, 'yyyymmddhhmmss', 'yyyymmddhhmmss');
			allData[data[i].serial] = data[i];
			$('.car-alert-not-read-list').append(alertNotReadModel);
			//赋值
			$('.car-alert-not-read-list .car-alert-detail:last .alert-serial').val(data[i].serial);
			$('.car-alert-not-read-list .car-alert-detail:last .alert-desc').html('检测到您的爱车' + data[i].alermName);
			$('.car-alert-not-read-list .car-alert-detail:last .alert-date').html(data[i].alermTime);
		}
		bindDetailTap();
	})
}

function bindDetailTap(){
	$('.car-alert-detail').off('tap').on('tap', function() {
		var alertSerial = $(this).find('.alert-serial').val();
		var params = allData[alertSerial];
		storage.setItem('alertDetail', JSON.stringify(params));
		au.toUrl("carAlertDetail.html");
	})
	
}
