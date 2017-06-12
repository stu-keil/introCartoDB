(function() {
  'use strict';

  angular
    .module('introCartoDb')
    .controller('MapsController', MapsController);

  /** @ngInject */
  function MapsController($window) {
    var vm = this;

    //----------------------------------------------------------------------
    cartodb.createVis('map', 'http://documentation.cartodb.com/api/v2/viz/2b13c956-e7c1-11e2-806b-5404a6a683d5/viz.json')
    .done(function(vis, layers) {
            // layer 0 is the base layer, layer 1 is cartodb layer
            // when setInteraction is disabled featureOver is triggered
            layers[1].setInteraction(true);
            layers[1].on('featureOver', function(e, latlng, pos, data, layerNumber) {
              console.log(e, latlng, pos, data, layerNumber);
            });

            // you can get the native map to work with it
            var map1 = vis.getNativeMap();

            // now, perform any operations you need, e.g. assuming map is a L.Map object:
            // map.setZoom(3);
            // map.panTo([50.5, 30.5]);
          });

    //----------------------------------------------------------------------

    var map = new L.Map('map_canvas', {
            center: [0,0],
            zoom: 2
          });

    cartodb.createLayer(map, 'http://documentation.cartodb.com/api/v2/viz/2b13c956-e7c1-11e2-806b-5404a6a683d5/viz.json')
      .addTo(map)
      .on('done', function(layer) {
        //do stuff
      })
      .on('error', function(err) {
        alert("some error occurred: " + err);
      });


    //----------------------------------------------------------------------

    var mapRuntime = new L.Map('map_canvas_runtime', {
            center: [23.3843658,-111.5859758],
            zoom: 4
          });


    cartodb.createLayer(map, {
      user_name: 'edufierro',
      type: 'cartodb',
      sublayers: [{
        sql: "SELECT * FROM municspob",
        cartocss: '#municspob{ polygon-fill: #FFFFB2; polygon-opacity: 0.8; line-color: #FFF; line-width: 0.5; line-opacity: 1;}'
                  + '#municspob [ pobtot <= 1798074] { polygon-fill: #BD0026;}'
                  + '#municspob [ pobtot <= 45164] { polygon-fill: #F03B20;}'
                  + ' #municspob [ pobtot <= 19932] {polygon-fill: #FD8D3C;}'
                  + '#municspob [ pobtot <= 9596] {polygon-fill: #FECC5C;}'
                  + '#municspob [ pobtot <= 3665] {polygon-fill: #FFFFB2;}'
      }]
    })
    .addTo(mapRuntime) // add the layer to our map which already contains 1 sublayer
    .done(function(layer) {
      console.log(layer)

      createSelector(layer)
      // create and add a new sublayer
      /*layer.createSubLayer({
        sql: "SELECT * FROM table_name limit 200",
        cartocss: '#table_name {marker-fill: #F0F0F0;}'
      });

      // change the query for the first layer
      layer.getSubLayer(0).setSQL("SELECT * FROM table_name limit 10");*/
    });




    function createSelector(layer) {
      //var sql = new cartodb.SQL({ user: 'edufierro' });
      var $options = $('#layer_selector li');
      $options.click(function(e) {
        // get the area of the selected layer
        var $li = $(e.target);
        var pob = $li.attr('data');
        // deselect all and select the clicked one
        $options.removeClass('selected');
        $li.addClass('selected');
        // create query based on data from the layer
        var query = "select * from municspob";
        if(pob !== 'all') {
          query = "select * from municspob where  pobtot <= " + pob;
          layer.getSubLayer(0).setSQL(query);
          layer.getSubLayer(0).setCartoCSS( '#municspob{ polygon-fill: #FFFFB2; polygon-opacity: 0.8; line-color: #FFF; line-width: 0.5; line-opacity: 1;}'
                  + '#municspob [ pobtot <= 1798074] { polygon-fill: #BD0026;}'
                  + '#municspob [ pobtot <= 45164] { polygon-fill: #F03B20;}'
                  + ' #municspob [ pobtot <= 19932] {polygon-fill: #FD8D3C;}'
                  + '#municspob [ pobtot <= 9596] {polygon-fill: #FECC5C;}'
                  + '#municspob [ pobtot <= 3665] {polygon-fill: #FFFFB2;}');
        }

        if(pob == 'all') {
          query = "select * from escuelas;"
          layer.getSubLayer(0).setSQL(query);
          layer.getSubLayer(0).setCartoCSS("#escuelas {marker-fill-opacity: 0.9;}");
        }
        // change the query in the layer to update the map

        console.log('new layer', query , pob)
      });
    }


  }
})();
