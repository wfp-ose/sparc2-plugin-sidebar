geodash.directives.sparcModalLayer = function(){
  return {
    controller: geodash.controllers.SPARCControllerModalLayer,
    restrict: 'EA',
    replace: true,
    scope: {},
    templateUrl: 'sparc_modal_layer.tpl.html',
    link: function ($scope, element, attrs){

      setTimeout(function(){

        //var datasets = [sparc2.typeahead.datasets, geodash.typeahead.datasets];
        //var codecs = [sparc2.bloodhound.codec, geodash.bloodhound.codec];

        geodash.init.typeahead(
          element,
          undefined,
          undefined,
          undefined,
          geodash.config.search.datasets,
          geodash.config.search.codecs
        );

      }, 10);

    }
  };
};
