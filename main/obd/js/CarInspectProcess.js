var storage = window.localStorage;
var carId = storage.getItem('carId') + '';
var isRefresh = false;

bs.loadScript('../../', ['circle', 'rotate','dt']);

mui.plusReady(function() {

	mui.init({
		beforeback: function() {
			if(isRefresh) {
				var wobj = plus.webview.getWebviewById("obd/CarInspectResult.html");
				wobj.reload();
			}
			return true;
		}
	})

})

$(function() {
	if(mui.os.ios && mui.os.plus) {
		$('body').addClass('ios-body');
	}

	setTimeout(function() {
		au.rotateImg($('.inspect-check-point'), 1500);
		getFaultList();
		setProgressAnimate();
	}, 300)

})

var i = 0,
	faultData;

function getFaultList() {
	var dataUrl = '../../data/faultlist.json';
	$.getJSON(dataUrl, function(data) {
		faultData = data.row;
		setInterval(function() {
			$('.faults-items').html('');
			appendFaults(i);
			appendFaults(i + 1);
			appendFaults(i + 2);
			appendFaults(i + 3);
			appendFaults(i + 4);
			appendFaults(i + 5);
			i = i + 6;
		}, 150)
	})
}

function appendFaults(seq) {
	if(seq < faultData.length) {
		$('.faults-items').append('<div class="faults-item word-break">' + faultData[seq].c + '  ' + faultData[seq].d + '</div>')
	} else {
		$('.faults-items').append('<div class="faults-item word-break">' + faultData[0].c + '  ' + faultData[0].d + '</div>')
		i = 1;
	}
}

function setProgressAnimate() {

	//在开始执行时即可从服务端抓取诊断数据，在结束时将数据存于本地缓存中
	var stepObj = [{
		"stepName": "正在更新诊断数据",
		"stepArray": initStepArray(7)
	}, {
		"stepName": "Diagnose EOBD2",
		"stepArray": initStepArray(10)
	}, {
		"stepName": "Read DTC",
		"stepArray": initStepArray(5)
	}, {
		"stepName": "Diagnose OBD",
		"stepArray": initStepArray(12)
	}, {
		"stepName": "正在上传诊断数据",
		"stepArray": initStepArray(6)
	}]

	var flag1 = 0,
		flag2 = 0;
	var m = setInterval(function() {
		//该组的进度已循环完成
		if(flag2 > stepObj[flag1].stepArray.length - 1) {
			flag1++;
			flag2 = 0;
		}
		//进度已全部执行完成
		if(flag1 > stepObj.length - 1) {
			clearInterval(m);

			//获取当前未解决故障
			var inspectResult = {
				'inspectTime': dt.getNowStr('yyyymmddhhmmss'),
				'inspectScore': 100,
				'inspectFault': []
			}
			var dataUrl = au.api + 'getCarFaultInfo/' + carId;
			$.get(dataUrl, function(d) {
				if(d && d.length > 0) {
					inspectResult['inspectFault'] = d;
					inspectResult['inspectScore'] = 100 - 3 * d.length;
				}
				storage.setItem('inspectResult', JSON.stringify(inspectResult));
				isRefresh = true;
				mui.back();
			})

			return;
		}
		var progressValue = stepObj[flag1].stepArray[flag2];
		$('.progress-text').html(stepObj[flag1].stepName + '(' + progressValue + '%)');
		setProgressBar(progressValue);
		flag2++;
	}, 300)

}

//生成随机序列，用以表示加载进度
function initStepArray(num) {
	var stepArray = [];
	for(var i = 0; i < num; i++) {
		stepArray.push(parseInt(Math.random() * 99));
	}
	stepArray.push(100);
	return stepArray.sort(function(a, b) {
		return a - b;
	});
}

function setProgressBar(a) {
	mui(mui('.inspect-progress')).progressbar().setProgress(a);
}