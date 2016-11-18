(function (doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function () {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            if(clientWidth>=640){
                docEl.style.fontSize = '100px';
            }else{
                docEl.style.fontSize = 100 * (clientWidth / 640) + 'px';
            }
        };

    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);


// 默认开始加载图片
window.onload = function() {
	var imgArray = [];
	var imgList = {
			'img': {
				"img_1": "page1_logo.png",
				"img_2": "page1_star.png",
				"img_3": "page1_mid.png",
				"img_4": "page1_left.png",
				"img_5": "page1_right.png",
				"img_6": "page1_footer.png",
				"img_7": "page1_bg.png"
			}
		}
		// 获得图片的地址
	for (var i in imgList) {
		if (typeof(imgList[i]) === "object") {
			for (var j in imgList[i]) {
				imgArray.push(i + "/" + imgList[i][j]);
			}
		}
	}

	var imgNum = imgArray.length;
	var imgLoaded = 0;
	for (var i = 0; i < imgNum; i++) {
		var img = new Image();
		img.src = imgArray[i];
		img.onload = function() {
			imgLoaded++;
			if (imgLoaded === 7) {
				// 去掉遮罩
				$('.loading').hide();
				setTimeout(function() {
					$(".img_animate").addClass('img_move');
					$(".eagle_img").addClass('eagle_img_move');
					$(".page_1_title").addClass('page_1_title_move');
					$(".video_link").addClass('video_link_move');
					$(".page1_pot_flash").addClass('page1_pot_flash_move');
				}, 200);
			}
		}
	}
	window.Slide && (new window.Slide());
}

//阻止上下滚动
window.ontouchmove = function(e) {
	e.preventDefault();
}

var Slide = function() {
	this.$wrap = $("#slide_wrap");
	this.$itemWrap = this.$wrap.find(".item_wrap");
	this.$slides = this.$wrap.find('.slide_item');

	this.winHeight = $(window).height();
	this.winWidth = $(window).width();
	this.minDis = 0.2 * this.winHeight;
	this._slideLen = this.$slides.length;
	this._prevIndex = -1;
	this._curIndex = 0;
	this.$slides.css('height', this.winHeight);

	this.currentPage = 0;

	this.init();
}

Slide.prototype = {
	init: function() {
		var self = this;
		this.bindEvent();
	},
	bindEvent: function() {
		var self = this;
		var _curY = 0;

		var ham = new Hammer(this.$wrap[0]);

		var onStart = function(e) {
			var ret = self.$itemWrap.css('transform');
			_curY = parseInt(ret.split(',').pop());
		}

		var onMove = function(e) {
			var deltaY = e.deltaY;
			var curIndex = self._curIndex;

			//第一页
			if (deltaY > 0 && curIndex == 0) {
				return;
			}

			//最后一页
			if (deltaY < 0 && curIndex == self._slideLen - 1) {
				return;
			}
			//滑动动作
			var _distanY = Math.abs(_curY + deltaY);
			self.toPosition(_distanY);

		}

		var onEnd = function(e) {
			var deltaY = e.deltaY;

			//滑动Y轴偏移量少于一定最少距离 ，保留在当前页
			if (Math.abs(deltaY) < self.minDis) {
				// debugger;
				self.toNext(e);
			} else {
				if (deltaY < 0) {
					self.toNext(e);
				} else {
					self.toPrev();
				}
			}

			//停止动作
			var _distanY = self.winHeight * (self._curIndex);
			self.toPosition(_distanY);
		}


		//调用pan拖动,只允许垂直拖动
		ham.get('pan').set({
			direction: Hammer.DIRECTION_VERTICAL,
			threshold: 0,
		});

		ham.on('panstart', function(e) {
			onStart(e);
		});

		ham.on('panmove', function(e) {
			onMove(e);

		});

		ham.on('panend', function(e) {
			onEnd(e);

		});

		//第四页，弹出遮罩层
		this.$wrap.on('click', '.page4_people_more_com', function() {
			var $commentCover = $('.page4_comment_cover');
			$commentCover.find('.page4_people_name').html($(this).siblings('.page4_people_name').html());
			$commentCover.find('.page4_people_say').html($(this).siblings('.page4_people_say').html());
			$('.page4_comment_cover').show();
		});
		//第四页，关闭遮罩层
		this.$wrap.on('click', '.page4_close_btn', function() {
			$('.page4_comment_cover').hide();
		});
	},

	toNext: function(e) {
		var self = this;
		var deltaY = e.deltaY;
		this._prevIndex = this._curIndex;
		var $curPage = this.$slides.eq(this._curIndex);

		this._curIndex++;

		if (this._curIndex > this._slideLen - 1) {
			this._curIndex = this._slideLen - 1;
			return;
		}
	},
	toPrev: function() {
		this._prevIndex = this._curIndex;
		this._curIndex--;

		if (this._curIndex < 0) {
			this._curIndex = 0;
			return;
		}

	},
	toPosition: function(_distanY) {
		var self = this;
		//进行动画
		var _v = 'translate3d(0, -' + _distanY + 'px, 0)';
		this.$itemWrap.css({
			'transform': _v,
			'-webkit-transform': _v,
			'-ms-transform': _v,
			'-moz-transform': _v,
		});
		//第三页，需要画线
		if (this._curIndex == 2) {
			setTimeout(function() {
				$(".page3_line1_div").addClass('page3_line1_div_move');
				$(".page3_midstar").addClass('page3_midstar_move');
				$(".page3_line_div").addClass('page3_line1_div_move');
				$(".page3_smallstar").addClass('page3_midstar_move');
				$('.page3_txt1').addClass('txtleft_animate');
				$('.page3_home').addClass('page3_home_move');
				$('.page3_point').addClass('page3_point_move');
				$('.page3_line2_div').addClass('page3_line2_div_move');
				$('.page3_point2').addClass('page3_point2_move');
				$('.page3_prostar').addClass('page3_prostar_move');
				$('.page3_line3_div').addClass('page3_line3_div_move');
				$('.page3_txt2').addClass('txtleft_animate');
				$('.page3_point3').addClass('page3_point3_move');
				$('.page3_fly').addClass('page3_fly_move');
				$('.page3_txt3').addClass('txtleft_animate');
				$('.page3_line4_div').addClass('page3_line4_div_move');
				$('.page3_point4').addClass('page3_point4_move');
				$('.page3_q').addClass('page3_stamp_move');
				$('.page3_stamp').addClass('page3_stamp_move');
			}, 500);
		}
	}
}