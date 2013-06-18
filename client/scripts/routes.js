define(['views/dataPoint/d3Anim'],
function(D3AnimView)
{
    return Backbone.Router.extend({
        routes: {
            '': 'd3Anim'
        },
        initialize: function(AppView) {
            this.AppView = AppView;
        },
        d3Anim: function() {
            this.AppView.renderContent(D3AnimView, {collection: Main.data});
        }
    });
});
