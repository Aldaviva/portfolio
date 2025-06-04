window.Index = function(){

	var API_ROOT = "/portfolio/data/social/";

	this.initialize = function(){
		_.bindAll(this);

		this.fetchTwitterStatus();
		this.fetchFlickrStatus();
		this.fetchGithubStatus();
	};

	this.fetchTwitterStatus = function(){
		$.getJSON(API_ROOT + "twitter/aldaviva", this.renderTwitterStatus);
	};

	this.renderTwitterStatus = function(twitterStatus){
		var messageEl = $('#twitterMessage');
		var message = twitterStatus.body;
		var messageLines = message.split(/\r?\n/g);

		messageEl.empty();
		_.each(messageLines, function(messageLine, lineNumber){
		    if(lineNumber > 0){
		        messageEl.append($("<br/>"));
		    }
		    messageEl.append(document.createTextNode(messageLine));
		});
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

	this.fetchGithubStatus = function(){
		$.getJSON(API_ROOT + "github/Aldaviva", this.renderGithubStatus);
	};

	this.renderGithubStatus = function(githubStatus){
		var messageEl = $('#commitMessage');
		var message = githubStatus.message;
		var webDiffUrl = githubStatus.webDiffUrl;

		messageEl.empty()
			.text(message)
			.closest('a')
			.attr("href", webDiffUrl);
	};

	this.initialize();
};
