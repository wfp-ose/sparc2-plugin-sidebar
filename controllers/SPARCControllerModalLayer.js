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
      if(view == "export")
      {
        var params = [];
        url = $interpolate(link.baseurl)({state: $scope.state, layer: layer, link: link}) + "?" + params.join("&");
      }
      else if(view == "export_month")
      {
        var params = [];
        params.push("month="+$scope.state.month);

        if($scope.state.hazard == "cyclone")
        {
          var cat = extract("filters.popatrisk.category", $scope.state);
          if(angular.isDefined(cat))
          {
            params.push("cat="+cat);
          }
          var prob_class_max = extract("filters.popatrisk.prob_class_max", $scope.state);
          if(angular.isDefined(prob_class_max))
          {
            params.push("prob_class_max="+prob_class_max);
          }
        }
        else if($scope.state.hazard == "drought")
        {
          var prob_class_max = extract("filters.popatrisk.prob_class_max", $scope.state);
          if(angular.isDefined(prob_class_max))
          {
            params.push("prob_class_max="+prob_class_max);
          }
        }
        else if($scope.state.hazard == "flood")
        {
          var rp = extract("filters.popatrisk.rp", $scope.state);
          if(angular.isDefined(rp))
          {
            params.push("rp="+rp);
          }
        }
        else if($scope.state.hazard == "landslide")
        {
          var prob_class_max = extract("filters.popatrisk.prob_class_max", $scope.state);
          if(angular.isDefined(prob_class_max))
          {
            params.push("prob_class_max="+prob_class_max);
          }
        }

        url = $interpolate(link.baseurl)({state: $scope.state, layer: layer, link: link}) + "?" + params.join("&");
      }
      else if(view == "export_month_filters")
      {
        var filters = extract("filters", layer);
        if(Array.isArray(filters))
        {
          var currentValues = extract(["filters", layer.id], $scope.state);
          var schema = extract(["filters", layer.id], $scope.stateschema);
          var params = [];

          var special = [
            {"path": "month", "name": "month"},
            {"path": "filters.popatrisk.fcs", "name": "fcs"},
            {"path": "filters.popatrisk.csi", "name": "csi"},
            {"path": "filters.popatrisk.popatrisk_range", "name": "popatrisk"}
          ];

          for(var i = 0; i < special.length; i++)
          {
            var value = extract(special[i].path, $scope.state);
            if(angular.isDefined(value))
            {
              params.push(special[i].name+"="+value);
            }
          }

          if($scope.state.hazard == "cyclone")
          {
            var cat = extract("filters.popatrisk.category", $scope.state);
            if(angular.isDefined(cat))
            {
              params.push("cat="+cat);
            }
            var prob_class_max = extract("filters.popatrisk.prob_class_max", $scope.state);
            if(angular.isDefined(prob_class_max))
            {
              params.push("prob_class_max="+prob_class_max);
            }
          }
          else if($scope.state.hazard == "drought")
          {
            var prob_class_max = extract("filters.popatrisk.prob_class_max", $scope.state);
            if(angular.isDefined(prob_class_max))
            {
              params.push("prob_class_max="+prob_class_max);
            }
          }
          else if($scope.state.hazard == "flood")
          {
            var rp = extract("filters.popatrisk.rp", $scope.state);
            if(angular.isDefined(rp))
            {
              params.push("rp="+rp);
            }
          }
          else if($scope.state.hazard == "landslide")
          {
            var prob_class_max = extract("filters.popatrisk.prob_class_max", $scope.state);
            if(angular.isDefined(prob_class_max))
            {
              params.push("prob_class_max="+prob_class_max);
            }
          }

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

          url = $interpolate(link.baseurl)({state: $scope.state, layer: layer, link: link}) + "?" + params.join("&");
        }
        else
        {
          url = link.baseurl;
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
