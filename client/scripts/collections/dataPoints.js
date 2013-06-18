define(['models/dataPoint'],
function(Model) {
  var DataPoints = Backbone.Collection.extend({
    url: '/api/v1/data',
    model: Model
  });
  return DataPoints;
});
