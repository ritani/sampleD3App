define(['text!templates/app.html'],
function(template) {
    var AppView = Backbone.View.extend({
        template: Handlebars.compile(template),
        tagName: 'div',
        el: '#main',
        initialize: function(options) {
        },
        events: {
            'click a': 'navigate'
        },
        render: function(){
            this.$el.html(this.template());
        },
        navigate: function(e) {
            var el = $(e.currentTarget);
            if(el.data('external')) return ;
            e.preventDefault();
            var link = el.attr('href');
            Backbone.history.navigate(link, {trigger: true});
        },
        renderContent: function(View, options) {
            var previousView = this.contentView;
            this.contentView = new View(options);
            this.renderContentView();
            if (previousView) {
                previousView.remove();
            }
        },
        renderContentView: function() {
            this.$("#content").html(this.contentView.el);
        }
    });
    return AppView;
});
