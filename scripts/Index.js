window.Index = function(){

	this.initialize = function(){
		this.setUpTwitterPipe();
		this.setUpFlickrPipe();
	};

	this.setUpFlickrPipe = function(){
		this.flickrPipe = _.extend(
			new JsonpRestApiPipe(
				"http://api.flickr.com/services/rest/",
				{
					'api_key': '95b66512ac43745bbfceacad93d0b85a',
					'format': 'json',
					'method': "flickr.people.getPublicPhotos",
					'user_id': "26577740@N07",
					'per_page': 1
				},
				'jsoncallback'), 
			{
				photoUrlTemplate: _.template('http://farm{{farm}}.static.flickr.com/{{server}}/{{id}}_{{secret}}_m.jpg'),
				getUrlFromPhoto: function(photo){
					return this.photoUrlTemplate(photo);
				}
			}
		);

		this.flickrPipe.getLatestMessage(_.bind(function(data){
			var photo = data.photos.photo[0];
			var title = photo.title;
			var thumbnailUrl = this.flickrPipe.getUrlFromPhoto(photo);

			$('#flickrPicture').attr({
				src: thumbnailUrl,
				title: title
			});
		}, this));
	};

	this.setUpTwitterPipe = function(){
		this.twitterPipe = new JsonpRestApiPipe("http://api.twitter.com/1/statuses/user_timeline.json", {
			'screen_name': "aldaviva",
			'count': 1,
			'trim_user': true
		}, "callback");

		this.twitterPipe.getLatestMessage(_.bind(function(data){
			var message = data[0].text;
			var words = message.match(/\s+/g).length + 1;
			$('#twitterMessage').html(message);
			$('#twitterWordCount').html(words + " Words");
		}, this));
	};

	this.initialize();
};


function JsonpRestApiPipe(apiUrl, params, callbackParamName){
	this.apiUrl = apiUrl;
	this.params = params;
	this.callbackParamName = callbackParamName;
};

JsonpRestApiPipe.prototype.getLatestMessage = function(onSuccess){
	$.ajax({
		'url': this.apiUrl,
		'data': this.params,
		'crossDomain': true,
		'dataType': 'jsonp',
		'jsonp': this.callbackParamName,
		'success': onSuccess
	});
};