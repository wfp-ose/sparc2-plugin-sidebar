geodash.controllers.SPARCControllerModalLayer = function($scope, $element, $controller, $interpolate, $timeout)
{
  angular.extend(this, $controller('GeoDashControllerModal', {$element: $element, $scope: $scope}));

  var m = $.grep(geodash.meta.modals, function(x, i){ return x['name'] == 'sparc_modal_layer';})[0];
  $scope.config = m.config;
  $scope.ui = m.ui;
  $scope.showOptions = geodash.ui.showOptions;
  $scope.updateValue = geodash.util.updateValue;

  var mainScope = $element.parents(".geodash-dashboard:first").isolateScope();
  $scope.dashboard = geodash.util.deepCopy(mainScope.dashboard);
  $scope.dashboard_flat = geodash.util.deepCopy(mainScope.dashboard_flat);
  $scope.state = geodash.util.deepCopy(mainScope.state);
  $scope.country = mainScope.state.iso3;
  $scope.hazard = mainScope.state.hazard;

  $scope.clearSelection = function(id)
  {
    $("#"+id).val(null);
    $("#"+id).typeahead("close");
  };

  $scope.$on("refreshMap", function(event, args)
  {
    if(angular.isDefined(extract("state", args)))
    {
      $scope.newState = geodash.util.deepCopy(extract("state", args));
      $timeout(function(){ $scope.$apply(function(){$scope.state = $scope.newState;}); }, 0);
    }
  });

  $scope.render_link = function(layer, link, view)
  {
    var url = "#";
    if(angular.isDefined(link))
    {
      if(view == "current")
      {
        var currentValues = extract(["filters", layer.id], $scope.state);
        var schema = extract(["filters", layer.id], $scope.stateschema);
        var filters = extract("filters", layer);
        if(Array.isArray(filters))
        {
          var params = [];
          for(var i = 0; i < filters.length; i++)
          {
            var filter = filters[i];
            if(angular.isDefined(extract("api", filter)))
            {
              var param = extract("api.type", filter)+"="+extract("api.path", filter);
              if(extract("api.operand", filter) == "between" || extract("api.operand", filter) == "btwn")
              {
                var value = extract(["filters", layer.id, filter.output], $scope.state);
                var modifier = extract("modifier", filter, 1);
                param = param + "%20between%20" + (value[0] / modifier) +"%20and%20" + (value[1] / modifier);
              }
              else
              {
                param = param + "%20%3D%20"+ extract(["filters", layer.id, filter.output], $scope.state);
              }
              params.push(param);
            }
          }
          url = $interpolate(link.baseurl)({layer: layer, link: link}) + "?" + params.join("&");
        }
      }
      else
      {
        url = link.baseurl;
      }
    }
    return url;
  };
};
