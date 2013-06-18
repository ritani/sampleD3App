define([], function() {
  return Backbone.Model.extend({
    idAttribute: '_id',
    urlRoot: '/api/v1/data',
  });
});
