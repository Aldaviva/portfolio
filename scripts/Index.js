dojo.provide("portfolio.Index");

dojo.require('dojo.io.script');

dojo.declare("Index", null,{
	constructor: function(){
		this.setUpTwitterPipe();
		this.setUpFlickrPipe();
	},

	setUpFlickrPipe: function(){
		this.flickrPipe = new JsonpRestApiPipe("http://api.flickr.com/services/rest/", {
			'api_key': '95b66512ac43745bbfceacad93d0b85a',
			'format': 'json',
			'method': "flickr.people.getPublicPhotos",
			'user_id': "26577740@N07",
			'per_page': 1},
		'jsoncallback');

		dojo.mixin(this.flickrPipe, {
			photoUrlTemplate: 'http://farm{farm}.static.flickr.com/{server}/{id}_{secret}_m.jpg',
			getUrlFromPhoto: function(photo){
				return dojo.replace(this.photoUrlTemplate, photo);
			}
		});

		this.flickrPipe.getLatestMessage(dojo.hitch(this, function(data){
			var photo = data.photos.photo[0];
			var title = photo.title;
			var thumbnailUrl = this.flickrPipe.getUrlFromPhoto(photo);

			var img = dojo.byId('flickrPicture');
			img.src = thumbnailUrl;
			img.title = title;
		}));
	},

	setUpTwitterPipe: function(){
		this.twitterPipe = new JsonpRestApiPipe("http://api.twitter.com/1/statuses/user_timeline.json", {
			'screen_name': "aldaviva",
			'count': 1,
			'trim_user': true
		}, 'callback');

		this.twitterPipe.getLatestMessage(dojo.hitch(this, function(data){
			var message = data[0].text;
			var words = message.match(/\s+/g).length + 1;
			dojo.byId('twitterMessage').innerHTML = message;
			dojo.byId('twitterWordCount').innerHTML = words + " Words";
			Cufon.refresh();
		}));
	}
});

/*dojo.declare("TwitterPipe", null, {
	apiUrl: 'http://api.twitter.com/1/statuses/user_timeline.json',

	constructor: function(userId){
		this.userId = userId;
		this.defaultParams = {};
	},

	getMostRecentMessage: function(onLoad) {
		var params = {
			'screen_name': this.userId,
			'count': 1,
			'trim_user': true
		};

		dojo.io.script.get({
			'url': this.apiUrl,
			'content': dojo.mixin(params, this.defaultParams),
			'callbackParamName': 'callback',
			load: function(data){
				onLoad(data);
			}
		});
	}
});*/

dojo.declare("JsonpRestApiPipe", null, {

	constructor: function(apiUrl, params, callbackParamName){
		this.apiUrl = apiUrl;
		this.params = params;
		this.callbackParamName = callbackParamName;
	},

	getLatestMessage: function(onLoad){
		var params = this.params;

		dojo.io.script.get({
			'url': this.apiUrl,
			'content': dojo.mixin(params, this.params),
			'callbackParamName': this.callbackParamName,
			load: onLoad
		});
	}

})