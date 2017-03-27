var storage = window.localStorage;
var _tl = getTLInstance();
var pageIndex = 0;

mui.plusReady(function() {
	if(mui.os.plus){
		$('body').addClass('ios-body');
	}
})

$(function() {

	mui.init({
		pullRefresh: {
			container: '#pullrefresh',
			up: {
				contentrefresh: '正在加载...',
				callback: pullupRefresh
			}
		}
	});

	if(mui.os.plus) {
		mui.plusReady(function() {
			setTimeout(function() {
				mui('#pullrefresh').pullRefresh().pullupLoading();
				alert($('html',window.parent.document).html());
			}, 1000);

		});
	} else {
		mui.ready(function() {
			mui('#pullrefresh').pullRefresh().pullupLoading();
		});
	}
})

/**
 * 上拉加载具体业务实现
 */
function pullupRefresh() {
	setTimeout(function() {
		var carId = storage.getItem('carId');
		var carAlertParam = JSON.parse(storage.getItem('carAlertParam'));
		var readUrl = _tl.api + 'alerm/alermHistory?carId=' + carId + '&alermType=' + carAlertParam.alermType + '&page=' + pageIndex + '&size=10';
		$.getJSON(readUrl, function(data) {
			var content = data.content;
			if(data.content.length == 0) {
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
			} else {
				var alertReadModel = '<li> <div class="car-alert-detail">' + $('.car-alert-read-detail-model').html() + '</div></li>';
				for(var i = 0; i < content.length; i++) {
					//					readData[content[i].serial] = content[i];
					$('.car-alert-read-list .mui-table-view').append(alertReadModel);
					//赋值
					$('.car-alert-read-list .car-alert-detail:last .alert-serial').val(content[i].serial);
					$('.car-alert-read-list .car-alert-detail:last .alert-desc').html('检测到您的爱车' + content[i].alermName);
					$('.car-alert-read-list .car-alert-detail:last .alert-date').html(_tl.getYMD(content[i].alermTime) + ' ' + _tl.getHMS(content[i].alermTime));
				}
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
				pageIndex++;
			}
		})

	}, 500);
}