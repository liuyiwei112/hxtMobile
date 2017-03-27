var storage = window.localStorage;
var carId = storage.getItem('carId');

bs.loadScript('../../', []);

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
	queryIllegal(0);
})

function queryIllegal(_handler) {
	$('.tap-checked').removeClass('tap-checked');
	$('.tap-not-checked:eq(' + _handler + ')').addClass('tap-checked');
	$('.illegal-panel').html('');
	au.hideCarTip();	
	au.showCarLoadingFull();
	
	var dataUrl = au.api + 'breakRules/' + carId + '?handled=' + _handler + '&page=0&size=10000';
	setTimeout(function() {
		var temp = JSON.parse(storage.getItem('illegalTemp' + _handler));
		if(temp) {
			setIllegal(temp);
		} else {
			$.get(dataUrl, function(d) {
				storage.setItem('illegalTemp' + _handler, JSON.stringify(d));
				setIllegal(d);
			})
		}
	}, 500)

}

function setIllegal(d) {
	au.hideCarLoadingFull();
	if(d.retCode == 200) {
		if(d.page.numberOfElements == 0) {
			au.showCarTip('您的爱车没有违章');
		} else {
			var model = '<div class="illegal-content">' + $('.illegal-content-model').html() + '</div>';
			var arr = d.page.content;
			for(var i = 0; i < arr.length; i++) {
				$('.illegal-panel').append(model);

				$('.illegal-content:last .car-no').html(arr[i].carNo);
				$('.illegal-content:last .illegal-date').html(arr[i].date);
				$('.illegal-content:last .illegal-address label').html(arr[i].address);
				$('.illegal-content:last .illegal-action label').html(arr[i].details);
				$('.illegal-content:last .score label').html(arr[i].score);
				$('.illegal-content:last .money label').html(arr[i].money);
			}
		}
	} else {
		au.showCarTip('Sorry,违章查询失败');
	}
}