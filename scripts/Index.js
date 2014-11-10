window.Index = function(){

	this.initialize = function(){
		this.fetchAll().done(_.bind(this.renderAll, this));
	};

	this.fetchAll = function(){
		return $.getJSON("/portfolio/data/social");
	};

	this.renderAll = function(compoundSocialStatus){
		this.renderTwitterStatus(compoundSocialStatus.twitter);
		this.renderThisIsMyJamStatus(compoundSocialStatus.thisismyjam);
		this.renderFlickrStatus(compoundSocialStatus.flickr);
	};

	this.renderTwitterStatus = function(twitterStatus){
		var message = twitterStatus.body;
		var words = message.match(/\s+/g).length + 1;
		$('#twitterMessage').text(message);
	};

	this.renderThisIsMyJamStatus = function(thisIsMyJamStatus){
		if(thisIsMyJamStatus !== null){
			var artist = thisIsMyJamStatus.artist;
			var title = thisIsMyJamStatus.title;

			$('.thisismyjam')
				.find('a')
					.text(title + ' by ' + artist)
					.end()
				.show();
		} else {
		    $('.thisismyjam').remove();
		}
	};

	this.renderFlickrStatus = function(flickrStatus){
		var title = flickrStatus.title;
		var thumbnailUrl = flickrStatus.thumbnailUrl;
		var thumbnailHref = flickrStatus.photoPageUrl;

		$('#flickrPicture').attr({
			src: thumbnailUrl,
			alt: title
		}).parent('a').attr({
			href: thumbnailHref
		});
	};


// 	this.setUpFlickrPipe = function(){
// 		this.flickrPipe = _.extend(
// 			/* The currently installed PHP build can't file_get_contents to https:// urls.
// 			 * Flickr integration will break when they start requiring SSL in June.
// 			 * We should either upgrade PHP or replace this API client and caching strategy with something easier to deal with.
// 			 * 
// 			 * Making PHP file_get_contents work with HTTPS in Windows:
// 			 * http://us3.php.net/manual/en/openssl.installation.php
// 			 */
// 			new JsonRestApiPipe(
// 				"http://api.flickr.com/services/rest/",
// 				{
// 					'api_key': '95b66512ac43745bbfceacad93d0b85a',
// 					'format': 'json',
// 					'nojsoncallback': 1,
// 					'method': "flickr.people.getPublicPhotos",
// 					'user_id': "26577740@N07",
// 					'per_page': 1
// 				}
// 			), 
// 			{
// 				photoUrlTemplate: _.template('http://farm{{farm}}.static.flickr.com/{{server}}/{{id}}_{{secret}}_m.jpg'),
// 				photoHrefTemplate: _.template('http://www.flickr.com/photos/benhutchison/{{id}}'),
// 				getUrlFromPhoto: function(photo){
// 					return 'portfolio/scripts/cache.php?request='+this.photoUrlTemplate(photo);
// 				},
// 				getHrefFromPhoto: function(photo){
// 					return this.photoHrefTemplate(photo);
// 				}
// 			}
// 		);

// 		this.flickrPipe.getLatestMessage(_.bind(function(data){
// 			var photo = data.photos.photo[0];
// 			var title = photo.title;
// 			var thumbnailUrl = this.flickrPipe.getUrlFromPhoto(photo);
// 			var thumbnailHref = this.flickrPipe.getHrefFromPhoto(photo);

// 			$('#flickrPicture').attr({
// 				src: thumbnailUrl,
// 				alt: title
// 			}).parent('a').attr({
// 				href: thumbnailHref
// 			});
// 		}, this));
// 	};

// 	this.setUpTwitterPipe = function(){
// 		this.twitterPipe = new JsonRestApiPipe("http://aldaviva.com/portfolio/twitter.php", {});

// 		this.twitterPipe.getLatestMessage(_.bind(function(data){
// 			var message = data.status.text;
// 						var words = message.match(/\s+/g).length + 1;
// 						$('#twitterMessage').text(message);
						
// 						var location = data.location;
// 						$('#location a')
// 							.attr('href', 'http://maps.google.com/maps?'+$.param({'q': location}))
// 							.text(location);
// 		}, this));
// 	};

// 	this.setUpThisIsMyJamPipe = function(){
// 		this.thisIsMyJamPipe = new JsonRestApiPipe("http://api.thisismyjam.com/1/aldaviva.json");

// 		this.thisIsMyJamPipe.getLatestMessage(function(data){
// 			if(data.person.hasCurrentJam){
// 				var artist = data.jam.artist;
// 				var title = data.jam.title;

// 				$('.thisismyjam')
// 					.find('a')
// 						.text(title + ' by ' + artist)
// 						.end()
// 					.show();
// 			} else {
// 			    $('.thisismyjam').remove();
// 			}
// 		});
// 	};

// 	this.initialize();
// };


// function JsonRestApiPipe(apiUrl, params){
// 	this.apiUrl = apiUrl;
// 	this.params = params || {};
// };

// JsonRestApiPipe.prototype.getLatestMessage = function(onSuccess){
// 	var url = 'portfolio/scripts/cache.php?request='+encodeURIComponent(this.apiUrl + '?' + $.param(this.params));
// 	$.ajax({
// 		'url': url,
// 		'dataType': 'json',
// 		'success': onSuccess
// 	});
	this.initialize();
};
