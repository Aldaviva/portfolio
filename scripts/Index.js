window.Index = function(){

	var API_ROOT = "/portfolio/data/social/";

	this.initialize = function(){
		_.bindAll(this);

		this.fetchTwitterStatus();
		this.fetchThisIsMyJamStatus();
		this.fetchFlickrStatus();
	};

	this.fetchTwitterStatus = function(){
		$.getJSON(API_ROOT + "twitter/aldaviva", this.renderTwitterStatus);
	};

	this.renderTwitterStatus = function(twitterStatus){
		var message = twitterStatus.body;
		var spaces = message.match(/\s+/g);
		var words = (spaces === null) ? 1 : spaces.length + 1;
		$('#twitterMessage').text(message);
	};

	this.fetchThisIsMyJamStatus = function(){
		$.getJSON(API_ROOT + "thisismyjam/aldaviva", this.renderThisIsMyJamStatus);
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

	this.fetchFlickrStatus = function(){
		$.getJSON(API_ROOT + "flickr/26577740@N07/benhutchison", this.renderFlickrStatus);
	};

	this.renderFlickrStatus = function(flickrStatus){
		var title = flickrStatus.title;
		var thumbnailUrl = flickrStatus.thumbnailUrl;
		var thumbnailHref = flickrStatus.photoPageUrl;

		$('#flickrPicture').attr({
			src: thumbnailUrl,
			alt: title
		}).parent('a').attr({
			href: thumbnailHref,
			title: '"' + title + '" on Flickr'
		});
	};

	this.initialize();
};
