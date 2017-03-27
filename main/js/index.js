var storage = window.localStorage;

bs.loadScript('../', ['md5', 'swiper']);

mui.plusReady(function() {

	plus.navigator.setStatusBarStyle("UIStatusBarStyleBlackTranslucent");

	checkUpdate();

	if(mui.os.ios) {
		$(window).on('touchmove', function(e) {
			setBannerOpa();
		})
	}

	mui.init({
		preloadPages: [{
			url: 'my.html',
			id: 'my.html'
		}, {
			url: 'mallhome.html',
			id: 'mallhome.html'
		}, {
			url: 'community.html',
			id: 'community.html'
		}]
	})

})

$(function() {
	if(mui.os.ios && mui.os.plus) {
		$('body').addClass('ios-body');
	}
	setBannerOpa();
	loadBanner();
	loadMenu();
	loadCarInfo();
	loadWeather();
	$(window).scroll(function(e) {
		setBannerOpa();
	})

})

function loadBanner() {
	var menu_swiper = new Swiper('.banner-swiper', {
		pagination: '.banner-pager',
		paginationClickable: false,
		autoplay: 4000
	});
}

function loadCarInfo() {
	//模拟登陆
	var dataUrl = au.api + 'customerUser/login?mobile=18260061895&password=' + hex_md5('123456');
	$.post(dataUrl, function(d) {
		if(d && d.retCode == 200) {
			storage.setItem('userInfo', JSON.stringify(d));
		}
	})

	var dataUrl = au.api + 'getUserDefaultCar?userId=223';
	//	alert(dataUrl);
	$.getJSON(dataUrl, function(resp) {
		storage.setItem('defaultCar', JSON.stringify(resp));
		storage.setItem('carId', resp.carId);
		$('.car-no').html(resp.carNo);
		$('.car-type').html(resp.seriesName);
		$('.car-brand-img').css('background-image', 'url(' + resp.picUrl + ')');

		//		var dataUrl2 = './data/obd/carMessage.json';
		loadCarMessage();
	});　　

}

function loadCarMessage() {
	carId = storage.getItem('carId');
	var dataUrl2 = au.api + 'carMessage/' + carId;
	$.getJSON(dataUrl2, function(resp2) {
		storage.setItem('carMessage', JSON.stringify(resp2));

		//设置图标闪烁状态
		if(resp2.fault == 0) {
			setAnimation('fault-icon');
		}
		if(resp2.tempAnomaly == 0) {
			setAnimation('temp-icon');
		}
		if(resp2.idlingAnomaly == 0) {
			setAnimation('idling-icon');
		}
		if(resp2.alerm == 0) {
			setAnimation('all-alert-icon');
		}

		//设置图标点击事件
		$('.temp-icon,.idling-icon,.all-alert-icon').on('tap', function() {
			_tl.toUrl('obd/carAlert.html');
		})
	})
}

function loadWeather() {
	var city = '南京';
	var dataUrl = au.api + 'checkWeather?cityName=' + encodeURIComponent(city) + '&day=0';
	$.get(dataUrl, function(d) {
		$('.temp-value').html(d.temprature);
		$('.mui-icon-weather').css('backgroundImage', 'url(' + d.weatherPic + ')');
		$('.min-temp-value').html(d.minTemprature);
		$('.max-temp-value').html(d.maxTemprature);
		$('.air-qua').html(d.pm25VO.quality);
		$('.is-fit-wash').html(d.washCarPoint);
	})

	$('.detail-weather').on('tap', function() {
		if($('.temp-div').is(":hidden")) {
			$('.temp-div').fadeIn(500);
			$('.weather-icon').removeClass('mui-icon-arrowdown').addClass('mui-icon-arrowup');
		} else {
			$('.temp-div').fadeOut(500);
			$('.weather-icon').removeClass('mui-icon-arrowup').addClass('mui-icon-arrowdown');
		}
	})
}

function setAnimation(_class) {
	$("." + _class).fadeOut(500).fadeIn(500);
	setInterval(function() {
		$("." + _class).fadeOut(500).fadeIn(500);
	}, 1000);
}

function setBannerOpa() {
	var mh = parseInt($('.banner').css('height'));
	var opa = document.body.scrollTop / mh;
	$('.content-top-info').css({
		'background': 'rgba(252,52,52,' + opa + ')'
	});
}

function loadMenu() {
	//加载菜单
	var menuUrl = '../data/homeMenu.json';
	$.getJSON(menuUrl, function(resp) {
		for(i = 0; i < resp.length; i++) {
			if(i % 8 == 0) {
				$('.menu-items .swiper-wrapper').append('<div class="swiper-slide">');
			}
			if(i % 4 == 0) {
				$('.menu-items .swiper-wrapper .swiper-slide:last').append('<div class="flex-div"></div>');
			}
			$('.menu-items .swiper-wrapper .flex-div:last').append('<div class="menu-item flex-element"><div class="menu-image"><img src="../images/homeloading.png" /> </div><div class="menu-text"></div>');
			au.loadImg(resp[i].menuPic, $('.menu-items .swiper-wrapper .menu-item:last').find('img'))
			$('.menu-items .swiper-wrapper .menu-item:last').find('.menu-text').html(resp[i].menuName);
			$('.menu-items .swiper-wrapper .menu-item:last').attr('page', resp[i].className);
			$('.menu-items .swiper-wrapper .menu-item:last').attr('m_name', resp[i].menuName);

		}
		//检查最后一个menu菜单是否满4个,如不满则补充空格
		while($('.menu-items .swiper-wrapper .flex-div:last').find('.menu-item').length < 4) {
			$('.menu-items .swiper-wrapper .flex-div:last').append('<div class="menu-item flex-element none"></div>');
		}
		$('.menu-items .swiper-wrapper .menu-item').on('tap', function() {
			if(!$(this).hasClass('none')) {
				var menuName = $(this).attr('m_name');
				if(menuName == '震动告警') {
					var params = {
						alermType: '61433',
						alermName: '驻车震动告警'
					}
					storage.setItem("carAlertParam", JSON.stringify(params));
				} else if(menuName.indexOf('周边') > -1) {
					var params = {
						title: menuName,
					}
					storage.setItem("mapUrlParam", JSON.stringify(params));
				} else if(menuName.indexOf('专家咨询') > -1) {
					au.phone('400-400-4000');
					return;
				}
				au.toUrl($(this).attr('page'));
			}
		})

		var menu_swiper = new Swiper('.menu', {
			pagination: '.menu-pager',
			paginationClickable: false
		});
	})
}

//检查更新操作,根据服务器获取更新版本,安装成功后删除更新包
function checkUpdate() {
	setTimeout(function() {
		// 获取本地应用资源版本号
		plus.runtime.getProperty(plus.runtime.appid, function(inf) {
			wgtVer = inf.version;
			console.log("当前应用版本：" + wgtVer);
			$.get(au.api + '/checkHuixtVersion?clientVersion=' + wgtVer, function(d) {
				if(d.new) {
					plus.nativeUI.showWaiting("正在检查更新...");
					setTimeout(function() {
						downWgt(d.appUrl);
					}, 1000)
				}
			})
		});
	}, 500)
}

// 下载wgt文件
//var wgtUrl="http://115.28.22.146:8090/ImageServer/APK_Version/woo-update-v1.1.wgt";
function downWgt(wgtUrl) {
	var options = {
		method: "GET",
		filename: "_doc/update/"
	};
	//	//检查文件是否已经下载
	//	var fileName = wgtUrl.substring(wgtUrl.lastIndexOf('/')+1,wgtUrl.length);
	//	console.log('fileName:'+fileName);

	var w = plus.nativeUI.showWaiting("开始下载...");
	var _d;

	dtask = plus.downloader.createDownload(wgtUrl, options, function(d, status) {
		if(status == 200) {
			w.setTitle('正在安装...');
			console.log("下载wgt成功：" + d.filename);
			installWgt(d.filename); // 安装wgt包
		} else {
			console.log("下载wgt失败！");
			plus.nativeUI.alert("更新失败,请检查网络！");
		}
	});
	dtask.start();
	dtask.addEventListener("statechanged", function(task, status) {
		switch(task.state) {
			case 1: // 开始
				w.setTitle("开始下载...");
				break;
			case 2: // 已连接到服务器
				w.setTitle("开始下载...");
				break;
			case 3:
				var a = task.downloadedSize / task.totalSize * 100;
				w.setTitle("已下载" + parseInt(a) + "%　　 ");
				break;
		}
	});

}

// 更新应用资源
function installWgt(path) {
	setTimeout(function() {
		plus.runtime.install(path, {}, function() {
			plus.nativeUI.closeWaiting();
			console.log("安装wgt文件成功！");
			//安装成功后删除安装包
			plus.io.requestFileSystem(plus.io.PRIVATE_DOC, function(fs) {
				fs.root.getDirectory('update', {}, function(entry) {
					entry.removeRecursively(function() {
						console.log('remove update package success');
					}, function() {
						console.log('remove update package error');
					});
				})
			})
			plus.runtime.restart();
		}, function(e) {
			plus.nativeUI.closeWaiting();
			console.log("安装wgt文件失败[" + e.code + "]：" + e.message);
			plus.nativeUI.alert("安装wgt文件失败[" + e.code + "]：" + e.message);
		});
	}, 1500)
}