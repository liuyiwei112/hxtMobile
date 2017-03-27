var storage = window.localStorage;

bs.loadScript('../../',[]);

$(function() {
	if(mui.os.ios&&mui.os.plus) {
		$('body').addClass('ios-body');
	}
	$('.last-insurance-panel li').on('tap', function() {
		if(!$(this).hasClass('select')) {
			$(this).parent().find('.select').removeClass('select');
			$(this).addClass('select');
			calTotal();
		}
	})

	$('.insurance-serial').on('tap', function() {
		var relate = $(this).attr('relate');
		if(relate) {
			if(relate == 'car-person') {
				$('.pop-up-panel-title label').html('交强险');
			} else if(relate == 'third-party') {
				$('.pop-up-panel-title label').html('第三者责任险');
			} else if(relate == 'boli') {
				$('.pop-up-panel-title label').html('玻璃单独破碎险');
			} else if(relate == 'car-person2') {
				$('.pop-up-panel-title label').html('车上人员责任险');
			} else if(relate == 'cheshen') {
				$('.pop-up-panel-title label').html('车身划痕险');
			}
			$('.pop-up ul').hide();
			showPopup($('.pop-up'));
			$('.pop-up').find('.' + relate).show();
		}
	})

	$('.car-person,.third-party,.boli,.car-person2,.cheshen').find('li').on('tap', function() {
		var p = $(this).parent().attr('class');
		$('.insurance-serial[relate=' + p + ']').html($(this).html());
		$('.insurance-serial[relate=' + p + ']').attr('iden', $(this).attr('iden'));
		calTotal();
		hidePopup($('.pop-up'));
	})

	$('.item-check').on('tap', function() {
		if($(this).parent().hasClass('jiaoqiang')) {
			mui.alert('交强险为强制性保险');
			return;
		} else if($(this).parent().hasClass('third') && $(this).hasClass('item-checked')) {
			$(this).removeClass('item-checked');
			$('.bjmp').find('.item-check').removeClass('item-checked');
			$('.wgzr').find('.item-check').removeClass('item-checked');
		} else {
			$(this).toggleClass('item-checked');
			calTotal();
		}
	})

})

//计算保费
//计算规则：
//1.交强险  6座以下＝950  6座以上＝1100
//2.三责    
//	6座以上 5万 ＝685 10万＝831 20万＝958 50万＝1106 100万＝1208
//	6座以下 5万 ＝801 10万＝971 20万＝1120 50万＝1293 100万＝1412
//3.车辆损失险 现款购车价格×1.2%
//4.全车盗抢险 新车购置价×1.0%
//5.玻璃单独破碎险 进口新车购置价×0.25%，国产新车购置价×0.15%
//6.自燃损失险 新车购置价×0.15%
//7.不计免赔特约险 (车辆损失险+第三者责任险)×20%
//8.无过责任险 第三者责任险保险费×20%
//9.车上人员责任险 人数＊50
//10.车身划痕险 
//	0～299999 2千＝400 5千＝570 1万＝760 2万＝1140
//	300000～500000 2千＝585 5千＝900 1万＝1170 2万＝1780
//	500001～max 2千＝850 5千＝1100 1万＝1500 2万＝2250

function calTotal() {
	var buyMoney = $('#buy_money').val() * 1;

	if(!buyMoney || buyMoney == '' || buyMoney <= 0) {
		$('#buy_money').addClass('input-error');
		mui.toast('请输入新车购置价');
		return;
	} else {
		$('#buy_money').removeClass('input-error');
	}

	var insuranceNum = $('.last-insurance-panel').find('.select').attr('iden') * 1;

	var jq = calJiaoQ();
	var th = calThird();
	var cs = calChesun();
	var dq = calDaoQ();
	var bl = calBoliPs();
	var zr = calZiRan();
	var bjmp = calBjMp(cs, th);
	var wgzr = calWgzr(th);
	var csry = calCsry();
	var hh = calHuahen();

	var sy = parseInt((th + cs + dq + bl + zr + bjmp + wgzr + csry + hh) * insuranceNum / 100);
	$('.total-sum-sy').html(sy);
	$('.total-sum').html(parseInt(jq + sy));

}

//1.交强险  6座以下＝950  6座以上＝1100
function calJiaoQ() {
	var iden = $('.jiaoqiang').find('.insurance-serial').attr('iden');
	if(iden == 1) {
		$('.jiaoqiang').find('.insurance-total label:first').html('950');
		return 950;
	} else {
		$('.jiaoqiang').find('.insurance-total label:first').html('1100');
		return 1100
	}
}

//2.三责    
function calThird() {
	if($('.third').find('.item-check').hasClass('item-checked')) {
		var jqIden = $('.jiaoqiang').find('.insurance-serial').attr('iden');
		var iden = $('.third').find('.insurance-serial').attr('iden');
		if(jqIden == 1) {
			//	6座以下 5万 ＝801 10万＝971 20万＝1120 50万＝1293 100万＝1412
			if(iden == 5) {
				$('.third').find('.insurance-total label:first').html('801');
				return 801;
			} else if(iden == 10) {
				$('.third').find('.insurance-total label:first').html('971');
				return 971;
			} else if(iden == 20) {
				$('.third').find('.insurance-total label:first').html('1120');
				return 1120;
			} else if(iden == 50) {
				$('.third').find('.insurance-total label:first').html('1293');
				return 1293;
			} else if(iden == 100) {
				$('.third').find('.insurance-total label:first').html('1412');
				return 1412;
			}
		} else {
			//	6座以上 5万 ＝685 10万＝831 20万＝958 50万＝1106 100万＝1208
			if(iden == 5) {
				$('.third').find('.insurance-total label:first').html('685');
				return 685;
			} else if(iden == 10) {
				$('.third').find('.insurance-total label:first').html('831');
				return 831;
			} else if(iden == 20) {
				$('.third').find('.insurance-total label:first').html('958');
				return 958;
			} else if(iden == 50) {
				$('.third').find('.insurance-total label:first').html('1106');
				return 1106;
			} else if(iden == 100) {
				$('.third').find('.insurance-total label:first').html('1208');
				return 1208;
			}
		}
	} else {
		$('.third').find('.insurance-total label:first').html('');
		return 0;
	}
}

//3.车辆损失险 现款购车价格×1.2%
function calChesun() {
	if($('.chesun').find('.item-check').hasClass('item-checked')) {
		var buyMoney = $('#buy_money').val() * 1;
		var price = parseInt(buyMoney * 1.2 / 100);
		$('.chesun').find('.insurance-total label:first').html(price);
		return price;
	} else {
		$('.chesun').find('.insurance-total label:first').html('');
		return 0;
	}
}

//4.全车盗抢险 新车购置价×1.0%
function calDaoQ() {
	if($('.daoqiang').find('.item-check').hasClass('item-checked')) {
		var buyMoney = $('#buy_money').val() * 1;
		var price = parseInt(buyMoney * 1 / 100);
		$('.daoqiang').find('.insurance-total label:first').html(price);
		return price;
	} else {
		$('.daoqiang').find('.insurance-total label:first').html('');
		return 0;
	}
}

//5.玻璃单独破碎险 进口新车购置价×0.25%，国产新车购置价×0.15%
function calBoliPs() {
	if($('.bolips').find('.item-check').hasClass('item-checked')) {
		var buyMoney = $('#buy_money').val() * 1;
		var price = 0;
		var iden = $('.bolips').find('.insurance-serial').attr('iden');
		if(iden == 1) {
			price = parseInt(buyMoney * 0.15 / 100);
		} else {
			price = parseInt(buyMoney * 0.25 / 100);
		}
		$('.bolips').find('.insurance-total label:first').html(price);
		return price;
	} else {
		$('.bolips').find('.insurance-total label:first').html('');
		return 0;
	}
}

//6.自燃损失险 新车购置价×0.15%
function calZiRan() {
	if($('.ziran').find('.item-check').hasClass('item-checked')) {
		var buyMoney = $('#buy_money').val() * 1;
		var price = parseInt(buyMoney * 0.15 / 100);
		$('.ziran').find('.insurance-total label:first').html(price);
		return price;
	} else {
		$('.ziran').find('.insurance-total label:first').html('');
		return 0;
	}

}

//7.不计免赔特约险 (车辆损失险+第三者责任险)×20%
function calBjMp(cs, th) {
	if($('.bjmp').find('.item-check').hasClass('item-checked')) {
		var price = parseInt((cs + th) * 0.2);
		$('.bjmp').find('.insurance-total label:first').html(price);
		return price;
	} else {
		$('.bjmp').find('.insurance-total label:first').html('');
		return 0;
	}
}

//8.无过责任险 第三者责任险保险费×20%
function calWgzr(th) {
	if($('.wgzr').find('.item-check').hasClass('item-checked')) {
		var price = parseInt(th * 0.2);
		$('.wgzr').find('.insurance-total label:first').html(price);
		return price;
	} else {
		$('.wgzr').find('.insurance-total label:first').html('');
		return 0;
	}
}

//9.车上人员责任险 人数＊50
function calCsry() {
	if($('.csry').find('.item-check').hasClass('item-checked')) {
		var iden = $('.csry').find('.insurance-serial').attr('iden') * 1;
		var price = parseInt(iden * 50);
		$('.csry').find('.insurance-total label:first').html(price);
		return price;
	} else {
		$('.csry').find('.insurance-total label:first').html('');
		return 0;
	}

}

//10.车身划痕险 
function calHuahen() {
	if($('.huahen').find('.item-check').hasClass('item-checked')) {
		var buyMoney = $('#buy_money').val() * 1;
		var iden = $('.huahen').find('.insurance-serial').attr('iden');
		if(buyMoney < 300000) {
			//	0～299999 2千＝400 5千＝570 1万＝760 2万＝1140
			if(iden == 2) {
				$('.huahen').find('.insurance-total label:first').html('400');
				return 400;
			} else if(iden == 5) {
				$('.huahen').find('.insurance-total label:first').html('570');
				return 570;
			} else if(iden == 10) {
				$('.huahen').find('.insurance-total label:first').html('760');
				return 760;
			} else if(iden == 20) {
				$('.huahen').find('.insurance-total label:first').html('1140');
				return 1140;
			}
		} else if(buyMoney >= 300000 && buyMoney <= 500000) {
			//	300000～500000 2千＝585 5千＝900 1万＝1170 2万＝1780
			if(iden == 2) {
				$('.huahen').find('.insurance-total label:first').html('585');
				return 585;
			} else if(iden == 5) {
				$('.huahen').find('.insurance-total label:first').html('900');
				return 900;
			} else if(iden == 10) {
				$('.huahen').find('.insurance-total label:first').html('1170');
				return 1170;
			} else if(iden == 20) {
				$('.huahen').find('.insurance-total label:first').html('1780');
				return 1780;
			}
		} else if(buyMoney > 500000) {
			//	500001～max 2千＝850 5千＝1100 1万＝1500 2万＝2250
			if(iden == 2) {
				$('.huahen').find('.insurance-total label:first').html('850');
				return 850;
			} else if(iden == 5) {
				$('.huahen').find('.insurance-total label:first').html('1100');
				return 1100;
			} else if(iden == 10) {
				$('.huahen').find('.insurance-total label:first').html('1500');
				return 1500;
			} else if(iden == 20) {
				$('.huahen').find('.insurance-total label:first').html('2250');
				return 2250;
			}
		}
	} else {
		$('.huahen').find('.insurance-total label:first').html('');
		return 0;
	}
}

function showPopup(_obj) {
	_obj.show();
	$('body').css('overflow', 'hidden');

}

function hidePopup(_obj) {
	_obj.hide();
	$('body').css('overflow', 'auto');

}