(function() {
    'use strict';

    angular
        .module('myApp.shoppingCart', ['ngRoute'])
        .config(['$routeProvider', function($routeProvider) {
          $routeProvider.when('/shoppingCart', {
            templateUrl: 'shoppingCart/shoppingCart.html',
            controller: 'shoppingCartCtrl'
          });
        }])
        .controller('shoppingCartCtrl', shoppingCartCtrl);

    /* @ngInject */
    function shoppingCartCtrl($http, $scope) {
        var totalPrice = 0;
        var p_quantity = 1;
        var index = 1;
        activate();

        ////////////////

        function activate() {
            loadItems();
        }

        function loadItems() {
            $http({
              method: 'GET',
              url: 'assets/cart.json'
            }).then(function successCallback(response) {
                    // this callback will be called asynchronously
                    // when the response is available
                    $scope.productsInCart = response.data.productsInCart;
                    $scope.p_quantity = 1;
                    $scope.p_id = 1

                    // Update Cart Total as Items are added into basket
                    $scope.updateCartTotal(p_quantity, index);
                    $scope.discountedPrice();
              }, function errorCallback(response) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
              });
        }

        $scope.getCartTotalCount = function() {
            if($scope.productsInCart) {
                 return $scope.productsInCart.length;
            }
        }

        $scope.removeItemFromCart = function(index) {
            var currentList = $scope.productsInCart;
            currentList.splice( index, 1 );
            $scope.productsInCart = currentList;

            //update Cart Total as Item is removed from basket
             $scope.updateCartTotal();
        };

        $scope.updateCartTotal = function(p_quantity, index) {
            if ($scope.productsInCart && index && $scope.productsInCart.length > 0) {
                var currentList = $scope.productsInCart;
                currentList[index-1].p_quantity = p_quantity;
                var totalPrice = 0;
                var totalQty = 0;
                for (var i = currentList.length - 1; i >= 0; i--) {
                    totalQty += currentList[i].p_quantity;
                    totalPrice += currentList[i].p_price * currentList[i].p_quantity;
                }
                $scope.totalQty = totalQty;
                $scope.getCartTotal = totalPrice;
            }
        }

        $scope.discountedPrice = function() {
            if($scope.totalQty > 0) {
                if($scope.totalQty === 3) {
                    return calculateDiscount(5);
                } else if ($scope.totalQty > 3 && $scope.totalQty < 10) {
                    return calculateDiscount(10);
                } else if ($scope.totalQty >= 10) {
                    return calculateDiscount(25);
                } else {
                    return 0;
                }
            }
        }

        function calculateDiscount(percentage) {
            return -($scope.getCartTotal * percentage / 100).toFixed(2)
        }

    }
})();
