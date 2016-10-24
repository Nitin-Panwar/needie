angular.module('sasaWebApp')
.directive('hideAdvancedSearchDiv', function($document){
      return {
        restrict: 'A',
        link: function(scope, elem, attr, ctrl) {
            elem.bind('click', function(e) {
              e.stopPropagation();
            });
            $document.bind('click', function() {
              scope.$apply(attr.hideAdvancedSearchDiv);
            })
        }
      }
  });
angular.module('sasaWebApp')
.directive('typeaheadLikeSelect', 
['$parse',function($parse) {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModel){

            var aux_modelValue, aux_viewValue,
                modelGetter = $parse(attr.ngModel),
                modelSetter = modelGetter.assign;

            var noViewValue = function(){
              return
              ngModel.$$lastCommittedViewValue === undefined ||
              !ngModel.$$lastCommittedViewValue.trim();
            };

            var forceEvent = function(){
              ngModel.$setViewValue();
              ngModel.$viewValue = ' ';
              ngModel.$setViewValue(' ');
              ngModel.$render();
              scope.$apply();
              element.val(element.val().trim());
            };

            element.on('mousedown', function(e){
              e.stopPropagation();
              forceEvent();
            });

            element.on('blur', function(e){
              e.stopPropagation();
              if(aux_modelValue){
                modelSetter(scope, aux_modelValue);
                scope.$apply();
              }
            });

            scope.$watch(function () {
              return ngModel.$modelValue;
            }, function(newValue, oldValue){
              if(newValue || (!newValue && !oldValue))
                aux_modelValue = newValue;
            });

        }
    };
}]);




