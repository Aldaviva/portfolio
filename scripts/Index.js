window.Index = function(){

	this.initialize = function(){
		this.setUpTwitterPipe();
		this.setUpFlickrPipe();
		this.setUpThisIsMyJamPipe();
	};

	this.setUpFlickrPipe = function(){
		this.flickrPipe = _.extend(
			new JsonRestApiPipe(
				"http://api.flickr.com/services/rest/",
				{
					'api_key': '95b66512ac43745bbfceacad93d0b85a',
					'format': 'json',
					'nojsoncallback': 1,
					'method': "flickr.people.getPublicPhotos",
					'user_id': "26577740@N07",
					'per_page': 1
				}
			), 
			{
				photoUrlTemplate: _.template('http://farm{{farm}}.static.flickr.com/{{server}}/{{id}}_{{secret}}_m.jpg'),
				photoHrefTemplate: _.template('http://www.flickr.com/photos/benhutchison/{{id}}'),
				getUrlFromPhoto: function(photo){
					return 'portfolio/scripts/cache.php?request='+this.photoUrlTemplate(photo);
				},
				getHrefFromPhoto: function(photo){
					return this.photoHrefTemplate(photo);
				}
			}
		);

		this.flickrPipe.getLatestMessage(_.bind(function(data){
			var photo = data.photos.photo[0];
			var title = photo.title;
			var thumbnailUrl = this.flickrPipe.getUrlFromPhoto(photo);
			var thumbnailHref = this.flickrPipe.getHrefFromPhoto(photo);

			$('#flickrPicture').attr({
				src: thumbnailUrl,
				alt: title
			}).parent('a').attr({
				href: thumbnailHref
			});
		}, this));
	};

	this.setUpTwitterPipe = function(){
		this.twitterPipe = new JsonRestApiPipe("http://api.twitter.com/1/users/show.json", {
			'screen_name': "aldaviva"
		});

		this.twitterPipe.getLatestMessage(_.bind(function(data){
			var message = data.status.text;
			var words = message.match(/\s+/g).length + 1;
			$('#twitterMessage').text(message);
			
			var location = data.location;
			$('#location a')
				.attr('href', 'http://maps.google.com/maps?'+$.param({'q': location}))
				.text(location);
		}, this));
	};

	this.setUpThisIsMyJamPipe = function(){
		this.thisIsMyJamPipe = new JsonRestApiPipe("http://api.thisismyjam.com/1/aldaviva.json");

		this.thisIsMyJamPipe.getLatestMessage(function(data){
			if(data.person.hasCurrentJam){
				var artist = data.jam.artist;
				var title = data.jam.title;

				$('.thisismyjam')
					.find('a')
						.text(title + ' by ' + artist)
						.end()
					.show();
			}
		});
	};

	this.initialize();
};


function JsonRestApiPipe(apiUrl, params){
	this.apiUrl = apiUrl;
	this.params = params || {};
};

JsonRestApiPipe.prototype.getLatestMessage = function(onSuccess){
	var url = 'portfolio/scripts/cache.php?request='+encodeURIComponent(this.apiUrl + '?' + $.param(this.params));
	$.ajax({
		'url': url,
		'dataType': 'json',
		'success': onSuccess
	});
};