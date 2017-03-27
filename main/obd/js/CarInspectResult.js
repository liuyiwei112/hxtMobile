var storage = window.localStorage;
var inspectResult = JSON.parse(storage.getItem('inspectResult'));

bs.loadScript('../../', ['circle']);

mui.plusReady(function() {
	mui.init({
		beforeback: function() {
			var wobj = plus.webview.getWebviewById("index");
			mui.fire(wobj, 'refresh');  
			return true;
		}
	})
})

$(function() {
	
	if(mui.os.ios && mui.os.plus) {
		$('body').addClass('ios-body');
	}

	if(inspectResult) {
		$('.x-panel-checked').show();
		$('.x-panel-not-check').hide();

		//初始化
		var inspectFault = inspectResult['inspectFault'];
		$('.normal-num').html(6000 - inspectFault.length);
		$('.error-num').html(inspectFault.length);
		$('.inspect-time').html(inspectResult.inspectTime);

		//体检报告动画
		$('.avg_inspect strong').html(inspectResult.inspectScore);
		au.initCircle('avg_inspect', 110, parseInt(inspectResult.inspectScore), 100, {
			gradient: ["#2ecc71", "#3498db"]
		}, 18);

		if(inspectFault.length > 0) {
			$('.inspect-error-items').html('');
			var itemModel = $('.list-item-model').html();
			for(var i = 0; i < inspectFault.length; i++) {
				$('.inspect-error-items').append(itemModel);
				$('.inspect-error-items .list-item:last').find('.inspect-error').html(inspectFault[i].faultCode);
				$('.inspect-error-items .list-item:last').attr('faultId', inspectFault[i].faultId);
				$('.inspect-error-items .list-item:last').attr('faultCode', inspectFault[i].faultCode);
			}

			$('.inspect-error-items .list-item').on('tap', function() {
				var param = {
					'faultId': $(this).attr('faultId'),
					'faultCode': $(this).attr('faultCode')
				};
				storage.setItem('faultDetail', JSON.stringify(param));
				au.toUrl('CarInspectFaultDetail.html');
			})

			$('.common-title-has-error').show();
			$('.inspect-error-items').show();
			$('.common-title-no-error').hide();
		} else {
			$('.common-title-has-error').hide();
			$('.inspect-error-items').hide();
			$('.common-title-no-error').show();
		}

	}

	//体检按钮
	$('.inspect-button').click(function() {
		au.toUrl('CarInspectProcess.html');
	})

})