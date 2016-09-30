geodash.controllers["SPARCControllerSidebar"] = function($scope, $element, $controller, $timeout, state, map_config, live)
{
  angular.extend(this, $controller('GeoDashControllerBase', {$element: $element, $scope: $scope}));
  //
  $scope.html5data = sparc2.api.html5data;
  $scope.ui = map_config.sidebar.ui;
  $scope.showOptions = geodash.ui.showOptions;

  $scope.maxValueFromSummary = geodash.initial_data.layers.popatrisk["data"]["summary"]["all"]["max"]["at_admin2_month"];

  $scope.updateVariables = function(){

    if("baselayers" in $scope.map_config && $scope.map_config.baselayers != undefined)
    {
      var baselayers = $.grep($scope.map_config.baselayers,function(x, i){ return $.inArray(x["id"], $scope.ui.layers) != -1; });
      baselayers.sort(function(a, b){ return $.inArray(a["id"], $scope.ui.layers) - $.inArray(b["id"], $scope.ui.layers); });
      $scope.baselayers = baselayers;
    }
    else
    {
      $scope.baselayers = [];
    }

    if("featurelayers" in $scope.map_config && $scope.map_config.featurelayers != undefined)
    {
      var featurelayers = $.grep($scope.map_config.featurelayers,function(x, i){ return $.inArray(x["id"], $scope.ui.layers) != -1; });
      featurelayers.sort(function(a, b){ return $.inArray(a["id"], $scope.ui.layers) - $.inArray(b["id"], $scope.ui.layers); });
      $scope.featurelayers = featurelayers;

      var visiblefeaturelayers = $.grep($scope.map_config.featurelayers,function(x, i){
        return $.inArray(x["id"], $scope.ui.layers) != -1 &&
          $.inArray(x["id"], $scope.state.view.featurelayers) != -1;
      });
      visiblefeaturelayers.sort(function(a, b){ return $.inArray(a["id"], $scope.state.view.featurelayers) - $.inArray(b["id"], $scope.state.view.featurelayers); });
      $scope.visiblefeaturelayers = visiblefeaturelayers;

      var featureLayersWithFilters = $.grep($scope.map_config.featurelayers, function(x, i){
        var filters = extract("filters", x);
        return Array.isArray(filters) && filters.length > 0;
      });
      featureLayersWithFilters.sort(function(a, b){
        var textA = a.title.toUpperCase();
        var textB = b.title.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
      $scope.featureLayersWithFilters = featureLayersWithFilters;

      $scope.groups = [];
      for(var i = 0; i < $scope.ui.groups.length; i++)
      {
        var g = $scope.ui.groups[i];
        var layers = $.grep($scope.map_config.featurelayers,function(x, i){ return $.inArray(x["id"], g.layers) != -1; });
        layers.sort(function(a, b){ return $.inArray(a["id"], g.layers) - $.inArray(b["id"], g.layers); });
        $scope.groups.push({
          'id': g.id,
          'label': g.label,
          'class': g.class,
          'layers': layers
        });
      }
    }
    else
    {
      $scope.featurelayers = [];
    }

  };
  $scope.updateVariables();
  //$scope.$watch('map_config.featurelayers', $scope.updateVariables);
  //$scope.$watch('map_config.legendlayers', $scope.updateVariables);
  $scope.$watch('state', $scope.updateVariables);

  $scope.$on("refreshMap", function(event, args) {
    if("state" in args)
    {
      $scope.state = args["state"];
      $scope.updateVariables();
      $timeout(function(){
        $scope.$digest();
      },0);
    }
  });

};
