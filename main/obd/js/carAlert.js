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
		var dataUrl = '../../data/carAlert.json';
//	var dataUrl = au.api + 'alerm/alermCount?carId=' + carId;
	$.getJSON(dataUrl, function(data) {
		//objData.loadData(data);
		//alert(data);
		$('.car-alert-items').html('');
		var alertModel = $('.car-alert-item-model').html();
		for(i = 0; i < data.length; i++) {
			$('.car-alert-items').append(alertModel);
			//赋值
			$('.car-alert-items .car-alert-item:last').attr('alertType', data[i].alermType);
			au.loadBgImg(data[i].alermPhoto, $('.car-alert-items .car-alert-item:last').find('.icon-left'));
			$('.car-alert-items .car-alert-item:last .text-left').html(data[i].alermName);
			if(data[i].alermCount == 0) {
				$('.car-alert-items .car-alert-item:last .num-circle').hide();
			} else {
				$('.car-alert-items .car-alert-item:last .num-circle').html(data[i].alermCount);
			}
		}

		$('.car-alert-item').on('tap', function() {
			var alertType = $(this).attr('alertType');
			var alertName = $(this).find('.text-left').html();
			var params = {
				alermType: alertType,
				alermName: alertName
			}
			storage.setItem("carAlertParam", JSON.stringify(params));
			au.toUrl("carAlertList.html");
		})

	});
})