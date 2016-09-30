geodash.directives["sparcSidebar"] = function(){
  return {
    controller: geodash.controllers.SPARCControllerSidebar,
    restrict: 'EA',
    replace: true,
    //scope: {
    //  layer: "=layer"
    //},
    scope: true,  // Inherit exact scope from parent controller
    //scope: {},
    templateUrl: 'sparc_sidebar.tpl.html',
    link: function ($scope, element, attrs, controllers)
    {
      setTimeout(function(){

        var $interpolate = angular.element(document.body).injector().get('$interpolate');

        $('[data-toggle="tooltip"]', element).tooltip();

        geodash.init.typeahead(
          element,
          undefined,
          undefined,
          undefined,
          geodash.config.search.datasets,
          geodash.config.search.codecs
        );

        var jqe = $(element);
        if(Array.isArray($scope.ui.charts))
        {
          for(var i = 0; i < $scope.ui.charts.length; i++)
          {
            var chart = $scope.ui.charts[i];
            var chartOptions = {};
            sparc2.charts.buildHazardChart(chart, geodash.initial_data.layers.popatrisk, chartOptions);
          }
        }

        $(element).on('shown.bs.tab', 'a[data-toggle="tab"]', geodash.ui.update_tab);

        $(element).on('change', 'input:checkbox', function(event) {
          console.log(event);
          var that = this;
          var output = $(that).data('output');
          var filter = {};

          var btngroup = $(that).parents('.btn-group:first');
          var output = btngroup.data('output');
          if(filter[output] == undefined)
          {
            filter[output] = [];
          }
          btngroup.find('input').each(function(){
            if($(this).is(':checked'))
            {
              filter[output].push($(this).data('value'))
              $(this).parent('label').removeClass('btn-default').addClass('btn-primary');
            }
            else
            {
              $(this).parent('label').addClass('btn-default').removeClass('btn-primary');
            }
          });
          geodash.api.intend("filterChanged", {"layer": "popatrisk", "filter": filter}, $scope);
        });

        // Initialize Radio Filters
        $(element).on('change', 'input:radio[name="cat"]', function(event) {
          console.log(event);
          var output = $(this).data('output');
          var filter = {};
          filter[output] = this.value;
          geodash.api.intend("filterChanged", {"layer": "popatrisk", "filter": filter}, $scope);
        });

        // Initialize Slider Filters
        $(".geodash-filter-slider", $(element)).each(function(){

          var slider = $(this).find(".geodash-filter-slider-slider");
          var label = $(this).find(".geodash-filter-slider-label");

          var type = slider.data('type');
          var output = slider.data('output');

          if(type=="ordinal")
          {
            var range = slider.data('range');
            //var value = slider.data('value');
            var value = $scope.state["filters"]["popatrisk"][output];
            var options = slider.data('options');

            slider.data('label', label);
            geodash.ui.init_slider_label($interpolate, slider, type, range, value);
            geodash.ui.init_slider_slider($interpolate, $scope, slider, type, range, options.indexOf(value), 0, options.length - 1, 1);
          }
          else
          {
            var range = slider.data('range');
            //var value = slider.data('value');
            var minValue = geodash.normalize.float(slider.data('min-value'), 0);
            var step = slider.data('step');
            //var label_template = slider.data('label');

            if(($.type(range) == "boolean" && range ) || (range.toLowerCase() == "true"))
            {
              var maxValue = ($scope.maxValueFromSummary != undefined && slider.data('max-value') == "summary") ?
                  $scope.maxValueFromSummary :
                  geodash.normalize.float(slider.data('max-value'), undefined);
              //
              var values = $scope.state["filters"]["popatrisk"][output];
              values = geodash.assert.array_length(values, 2, [minValue, maxValue]);
              var values_n = [Math.floor(values[0]), Math.floor(values[1])];
              var min_n = Math.floor(minValue);
              var max_n = Math.floor(maxValue);
              var step_n = Math.floor(step);

              slider.data('label', label);
              geodash.ui.init_slider_label($interpolate, slider, type, range, values);
              geodash.ui.init_slider_slider($interpolate, $scope, slider, type, range, values_n, min_n, max_n, step_n);
              console.log(value_n, min_n, max_n, step_n, range);
            }
            else
            {
              var maxValue = geodash.normalize.float(slider.data('max-value'), undefined);
              var value = $scope.state["filters"]["popatrisk"][output];
              var value_n = Math.floor(value * 100);
              var min_n = Math.floor(minValue * 100);
              var max_n = Math.floor(maxValue * 100);
              var step_n = Math.floor(step * 100);

              slider.data('label', label);
              geodash.ui.init_slider_label($interpolate, slider, type, range, value);
              geodash.ui.init_slider_slider($interpolate, $scope, slider, type, range, values_n, min_n, max_n, step_n);
              console.log(value_n, min_n, max_n, step_n, range);
            }
          }

        });


      }, 10);
    }
  };
};
