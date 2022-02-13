
var request = require('request');
class user {
	constructor(token, mess, page, time) {

		// تحديد خصائص اساسية
		this.token = token;
		this.mess = mess;
		this.t = time || 5;
		this.times = 1000;
		this.post = {};
		this.run = false;
		this.cn = 0;
		this.status = 'stop';
		this.page = page;
		this.cm = 1;



		//  delete token,mess,page,time;
	}

	comment() {

	}
	// خاصية دالة تقوم بالتحقق اذا كان يوجد منشور جديد في الصفحة
	check() {
		// start check

		//---------------

		// متغيير يحوي ايدي الصفحة
		var page = this.page;
		// متغيير يحوي رابط لارسال طلب جلب منشورات الصفحة
		var url = "https://graph.facebook.com/v13.0/" + (page) + "/feed";
		// اضافة كود token الى الرابط
		url += '?access_token=' + this.token;
		url += '&limit=3';

		// self => this
		var self = this;

		// ارسال البيانات الى الرابط
		request.get({
			headers: { 'content-type': 'text/json' },
			url: url,

			// on comple comment
		}, function(error, req, body) {

			// استلام النتائج

			// في حال وجود خطأ بالاتصال
			if (error) {
				console.log(error);

				// اعادة المحاولة
				self.check();

				return;
			}


			// محاولة تحويل البيانات الى كائن
			try {

				body = JSON.parse(body);
			}

			// في حال لم تنجح عملية التحويل
			catch (e) {
				// طباعة معلومات الارسال في السجل
				console.log(req.headers);
			}

			// console.log(body);
			if (body.error) {

				console.error(body.error);

				if (body.error.code == '368') {
					setTimeout(function() {
						console.log('status: Runing');
					}, 600000);

					console.log('status: Bloking wait 10 min');
				}

				return;
			}




			// تعرف متغيير يحوي على البيانات المطلوبة
			var data = body.data;
			// يحتوي متغيير data منشورات الصفحة

			//  عمل تكرار على جميع المنشورات للتحقق من وقت انشاء المنشور
			for (var i in data) {
				// تعريف متغيير يحوي زمن تكوين المنشور
				var d = data[i].created_time;
				// متغيير فترة تكوين المنشور
				var time = new Date().getTime() - Date.parse(d);
				// تعريف متغيير يوحوي زمن تكوين المنشور بالدقائق
				var min = getMin(time);
				console.log('------------------------------');
				console.log('post time :' + min);
				// اذا كان زمن تكوين المنشور بالدقائق اكبر او يساوي الزمن المحدد في العملية المطلوبة
				if (min <= self.t) {


					// متغيير يحتوي على قيمة اي دي المنشور
					var post_id = data[i].id;

					// اذا كان لم يتم التعليق على المنشور
					if (!(post_id in self.post)) {
						console.log('----------------------------');
						console.log('found new post !');
						console.log('working in comment ...');
						// console.log(data[i].message);
						var mess = self.mess.replace(/<post>/gi, data[i].message + '').replace(/<n>/g, '\n');



						// اضافة اي دي المنشور الى القائمة ليتعرف عليه في حال تم العمل عليه مسيقا
						self.post[post_id] = 1;
						setTimeout(function() {
							(self.post[post_id] = undefined);
							delete self.post[post_id];
						}, self.t + 1 * 60 * 1000);

						//console.log(self.post);

						// تنفيذ دالة التعليق على المنشور
						self.comment(post_id, mess, self.id);
						return;
					}

				}


			}

			// اذا كانت العملية تعمل اعادة التحقق
			if (self.run) {
				setTimeout(function() {
					self.check();
				}, getRandomInt(60000,120000));

			}

		});
	}

	//--------------
	// end check






	// دالة لبدأ العملية
	start() {

		// جعل خاصية العملية رن صائبة
		this.run = true;
		// بدأ التنصت على المنشورات الجديدة
		this.check(this.id);
		// تحديد حالة العملية تعمل
		this.status = "running";
	}

	// دالة لايقاف العملية
	stop() {

		// جعل خاصية العملية رن غير مفعلة
		this.run = false;
		// تحديد حالة العملية متوقفة
		this.status = 'stop';




	}



}



function getMin(millis) {
	var minutes = Math.floor(millis / 60000);
	return minutes;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



module.exports = user;