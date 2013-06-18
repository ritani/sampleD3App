define(['routes'
, 'views/appview'
, 'collections/dataPoints'
],
function(Routes, AppView, DataPoints) {
    var App = function() {
        this.data = new DataPoints();
        this.initApp();
    };
    App.prototype = {
        views: {},
        collections: {},
        initApp: function() {
            var self = this;
            this.data.fetch({
                success: function() {
                    this.start();
                }.bind(this),
                error: function() {
                    alert("There was an issue fetching the data. Please try again.")
                }.bind(this)
            });
        },
        start: function() {
            this.appView = new AppView();
            this.appView.render();
            this.routes = new Routes(this.appView);
            Backbone.history.start({pushState: true});
        }
    };

    return App;
});