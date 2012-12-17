window.Works = function(){

	_.extend(this, Backbone.Events);

	this.models = {
		Piece: Backbone.Model.extend({
			defaults: {
				selected: false,
				index: -1
			}
		})
	};

	this.views = {
		listPanel: Backbone.View.extend({
			tagName: "li",
			initialize: function(options){
				_.bindAll(this, "render");
				this.model.bind('change', this.render);
			},
			events: {
			'click .thumb': 'onThumbClick'
			},
			render: function(){
				$(this.el).html(this.template(this.model.toJSON()));
				this.$('.year').toggle(this.options.showYear);
				$(this.el).toggleClass("selected", this.model.get("selected"));
				return this;
			},
			onThumbClick: function(){
			window.location.hash = '#'+this.model.id;
			}
		}),
		selectedItemPanel: Backbone.View.extend({
			render: function(){
				$(this.el).html(this.template(this.model.toJSON()));
				if(this.model.get('link')){
					this.$('img').wrap("<a href='"+this.model.get('link')+"' target='_blank' />");
				}

				var previouslySelected = this.model.collection.find(function(item){
					return item.get("selected");
				});
				if(previouslySelected){
					previouslySelected.set({selected: false});
				}
				this.model.set({selected: true});

				return this;
			}
		})
	};

	this.initialize = function(){
		this.setUpTemplates();

		var pieces = this.pieces = new Backbone.Collection();
		pieces.url = 'portfolio/data/portfolio.json';
		pieces.model = this.models.Piece;
		pieces.comparator = function(piece){
			return -1 * piece.get("year")
		}

		pieces.bind('refresh', _.bind(function(){
			this.setUpList();
			this.setUpSelectedItem();
			this.setUpController();
			this.setUpKeyboardShortcuts();
			this.trigger('refresh');
		}, this));

		pieces.fetch();
	};

	this.setUpList = function(){
		var listPane = $('#listPanel');
		var lastYear;
		this.pieces.each(function(item, index){
			item.set({'index': index});
			var view = new this.views.listPanel({
				model: item,
				showYear: item.get("year") != lastYear,
				id: "listItem-" + item.id
			});
			listPane.append(view.render().el);
			lastYear = item.get("year");
		}, this);
		this.setUpListScrolling(listPane);
	};

	this.setUpSelectedItem = function(){
		var selectedItemPane = $('#selectedItemPanel');
		var item = this.pieces.first();
		this.selectedItemView = new this.views.selectedItemPanel({
			model: item
		});
		selectedItemPane.empty().append(this.selectedItemView.render().el);
	};

	this.setUpController = function(){
		this.controller = new Backbone.Controller();
		
		this.controller.route(":pieceId", "changeSelectedPiece", _.bind(function(pieceId){
			var piece = this.pieces.get(pieceId);
			if(typeof piece != "undefined"){
				this.selectedItemView.model = piece;
			}
			this.selectedItemView.render();

			this.preloadPiece(this.getPieceByOffset(1));
			window.scrollTo(0,0);
		}, this));

		Backbone.history.start();
	};

	this.setUpKeyboardShortcuts = function(){
		$(document).keydown(_.bind(function(event){
			var piece = null
			switch(event.which){
				case 39: //Right arrow key
					piece = this.getPieceByOffset(1);
					break;
				case 37: //Left arrow key
					piece = this.getPieceByOffset(-1);
					break;
				case 36: //Home
					piece = this.getPieceByIndex(0);
					break;
				case 35: //End
					piece = this.getPieceByIndex(this.pieces.length - 1);
					break;
			}

			if(piece){
				this.goToPiece(piece);
				event.preventDefault();
				_.defer(this.scrollIfNecessary);
			}
		}, this));
	};

	this.getPieceByOffset = function(offset){
		var currentIndex = this.selectedItemView.model.get('index');
		var desiredIndex = currentIndex + offset;
		return this.getPieceByIndex(desiredIndex);
	};

	this.getPieceByIndex = function(index){
		return this.pieces.find(function(piece){
			return piece.get("index") == index;
		});
	};

	this.goToPiece = function(piece){
		window.location.hash = piece.id;
	};

	this.preloadPiece = function(piece){
		if(piece){
			var domId = "preload";
			var preloadContainer = $('#'+domId);
			if(!preloadContainer.length){
				preloadContainer = $("<div />").attr({id: domId}).css({'position': 'absolute', 'width': '1px', 'height': '1px', 'top': '0px', 'opacity': '0'});
				$(document.body).append(preloadContainer);
			}
			preloadContainer.css('background-image', 'url("portfolio/artwork/'+piece.get('src')+'")');
		}
	};

	this.setUpTemplates = function(){
		var views = this.views;
		$('.template').each(function(index, element){
			element = $(element);
			views[element.parent()[0].id].prototype.template = _.template(decodeURIComponent(element.remove().html()));
		});
	};

	this.scrollIfNecessary = function(){
		var listPanel = $('#listPanel');
		var activeListItem = listPanel.find('li.selected');
		var listItemWidth = activeListItem.width();
		var listItemGutter = window.parseInt(activeListItem.css('margin-right'), 10);
		
		var isActiveItemPastLeftEdge = (activeListItem[0].offsetLeft - listItemGutter < listPanel[0].scrollLeft);
		var isActiveItemPastRightEdge = (activeListItem[0].offsetLeft + listItemWidth + listItemGutter > listPanel[0].offsetWidth + listPanel[0].scrollLeft);

		var newScrollLeft = null;

		if(isActiveItemPastLeftEdge){
			console.log("active item is past left edge.");
			newScrollLeft = activeListItem[0].offsetLeft - listItemGutter /*- listPanel[0].offsetWidth*/;
		} else if(isActiveItemPastRightEdge){
			console.log("active item is past right edge");
			newScrollLeft = activeListItem[0].offsetLeft + listItemWidth + listItemGutter - listPanel[0].offsetWidth;
		} else {
			console.log("active item is visible");
		}
		
		if(newScrollLeft != null){
			listPanel.animate({
			scrollLeft: newScrollLeft
			}, 150);
		}

	};

	this.setUpListScrolling = function(listPane){
		var isMouseDown = false;
		var wasScrolledSinceMouseDown = false;
		var mouseDownX = 0;
		var mouseDownPanelScrollOffset = 0;
		listPane.bind('mousedown', function(event){
			isMouseDown = true;
			wasScrolledSinceMouseDown = false;
			mouseDownX = event.clientX;
			mouseDownPanelScrollOffset = listPane[0].scrollLeft;
		});
		var body = $('body');
		body.bind('mouseup click', function(event){
			if(wasScrolledSinceMouseDown){
			//alert('trying to prevent default');
			event.preventDefault();
			wasScrolledSinceMouseDown = false;
			}
			isMouseDown = false;
		});
		body.bind('mousemove', function(event){
			if(isMouseDown){
			wasScrolledSinceMouseDown = true;
			var offsetFromMouseDown = event.clientX - mouseDownX;
			event.target.scrollLeft = mouseDownPanelScrollOffset - offsetFromMouseDown;
			}
		});
		listPane.bind('mousewheel DOMMouseScroll', function(event){
			event.preventDefault();
			listPane[0].scrollLeft -= 30 * ((((event.wheelDelta || event.detail) > 0) ^ $.browser.mozilla) ? 1 : -1);
		});
	};

	this.initialize();
};
