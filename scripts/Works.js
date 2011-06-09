window.Works = function(){

	_.extend(this, Backbone.Events);

	this.models = {
		Piece: Backbone.Model.extend({
			defaults: {
				selected: false
			}
		})
	};

	this.views = {
		ListItemPanel: Backbone.View.extend({
			tagName: "li",
			initialize: function(options){
				_.bindAll(this, "render");
				this.model.bind('change', this.render);
			},
			render: function(){
				$(this.el).html(this.template(this.model.toJSON()));
				this.$('.year').toggle(this.options.showYear);
				$(this.el).toggleClass("selected", this.model.get("selected"));
				return this;
			}
		}),
		SelectedItemPanel: Backbone.View.extend({
			render: function(){
				$(this.el).html(this.template(this.model.toJSON()));

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
		pieces.url = 'data/portfolio.json';
		pieces.model = this.models.Piece;
		pieces.comparator = function(piece){
			return -1 * piece.get("year")
		}

		pieces.bind('refresh', _.bind(function(){
			this.setUpList();
			this.setUpSelectedItem();
			this.setUpController();
			this.trigger('refresh');
		}, this));

		pieces.fetch();
	};

	this.setUpList = function(){
		var listPane = $('#listPane');
		var lastYear;
		this.pieces.each(function(item){
			var view = new this.views.ListItemPanel({
				model: item,
				showYear: item.get("year") != lastYear,
				id: "listItem-" + item.id
			});
			listPane.append(view.render().el);
			lastYear = item.get("year");
		}, this);
	};

	this.setUpSelectedItem = function(){
		var selectedItemPane = $('#selectedItemPane');
		var item = this.pieces.first();
		this.selectedItemView = new this.views.SelectedItemPanel({
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
		}, this));

		Backbone.history.start();
	};

	this.setUpTemplates = function(){
		this.views.ListItemPanel.prototype.template = generateAndHideTemplate('listItemTemplate');
		this.views.SelectedItemPanel.prototype.template = generateAndHideTemplate('selectedItemTemplate');
	};

	function generateAndHideTemplate(id){
		return _.template(decodeURIComponent($('#'+id).remove().html()));
	}

	this.initialize();
};