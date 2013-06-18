require.config({
    baseUrl: '/scripts',
    paths: {
        backbone: 'vendor/backbone/backbone',
        underscore: 'vendor/underscore/underscore',
        jquery: 'vendor/jquery/jquery',
        text: 'vendor/requirejs-text/text',
        handlebars: 'vendor/handlebars/handlebars',
        handlebarshelers: 'helpers/helpers',
        d3: 'vendor/d3/d3.v2'
    },
    shim: {
        underscore: {
            exports: '_',
            path: 'vendor/underscore/underscore.min'
    },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        handlebars: {
            exports: "Handlebars"
        },
        handlebarshelers: {
            deps: [
                'handlebars'
            ],
            exports: "Handlebars"
        },
        d3: {
            exports: "d3",
            path: 'vendor/d3/d3.v2.min'
        },
        app: {
            deps: ['jquery',
                            'underscore',
                            'backbone',
                            'handlebarshelers',
                            'd3'
                            ]
        }
    }
})

require(['app'],
function(Main) {
    window.Main = new Main();
});
