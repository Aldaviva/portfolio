dojo.provide("portfolio.Works");

dojo.require("dojo.hash");
dojo.require("dojo.parser");
dojo.require("dojo.data.ItemFileReadStore");
// dojo.require("dojox.data.XmlStore");
dojo.require("dojox.dtl.DomInline");

dojo.declare("Works", null, {
	attributes: ['title', 'year', 'client', 'medium', 'description', 'src'],
	defaultSort: [{attribute: "year", descending: true}, {attribute: "title", descending: false}],

	constructor: function(){
		this.setUpDataStore();

		dojo.addOnLoad(this, this.setUpList);
		dojo.addOnLoad(this, this.setUpSelectedPane);
	},

	setUpDataStore: function(){
		this.store = new dojo.data.ItemFileReadStore({
			url: 'data/portfolio.json'
		});
	},

	setUpList: function(){
		this.listPiecesByYearDesc().then(function(items){
			var listRepeater = dijit.byId("listRepeater");
			listRepeater.context = {items: items};
			listRepeater.render();
		});
	},

	setUpSelectedPane: function(){
		if(dojo.hash() == ""){
			this.findMostRecentPiece().then(dojo.hitch(this, function(mostRecentPiece){
				this.swapSelectedPaneContextToPiece(mostRecentPiece);
			}));
		} else {
			this.swapSelectedPaneContextByHashId();
		}

		dojo.subscribe("/dojo/hashchange", this, this.swapSelectedPaneContextByHashId);
	},

	swapSelectedPaneContextToPiece: function(selectedPiece){
		var selectedPane = dijit.byId("selectedPane");
		selectedPane.context = {item: selectedPiece};
		selectedPane.render();
	},

	swapSelectedPaneContextByHashId: function(){
		this.store.fetchItemByIdentity({
			identity: dojo.hash(), 
			onItem: this.swapSelectedPaneContextToPiece,
			onError: alert
		});
	},

	listPiecesByYearDesc: function(){
		var deferred = new dojo.Deferred();
		this.store.fetch({
			sort: this.defaultSort,
			scope: this,
			onComplete: function(results){
				//var fullItems = this.getValuesForFetchedItems(this.store, this.attributes, results);
				deferred.callback(results);
			},
			onError: function(error, request){
				console.error("error: "+error+", request: "+request);
			}
		});
		return deferred;
	},

	findMostRecentPiece: function(){
		var deferred = new dojo.Deferred();
		this.store.fetch({
			sort: this.defaultSort,
			count: 1,
			scope: this,
			onComplete: function(results){
				deferred.callback(results[0]);
			}
		});
		return deferred;
	}

	/*getValuesForFetchedItems: function(store, attributes, items){
		return dojo.map(items, dojo.hitch(this, function(item){
			var fullItem = new Object();
			dojo.forEach(attributes, function(attr){
				fullItem[attr] = store.getValue(item, attr).element.textContent;
			});
			return fullItem;
		}));
	}*/
});