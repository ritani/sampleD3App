var config = require('../lib/config');

var dataSet = require('../../' + config.dataFile);

var dataAPI = {

    init : function(app, auth) {
        /* ITEMS */
        console.log(dataSet);
        //GET all items
        app.get(config.api + '/data', this.getAll);
    },

    //GET all items
    getAll : function(req, res){
        res.send(dataSet);
    }
};
 
module.exports = dataAPI;
