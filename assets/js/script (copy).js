var screenApp = angular.module('screenApp', ['odoo', 'ngAnimate', 'ngRoute', 'signature', 'angularSpinner', 'ui.bootstrap']);

screenApp.controller('mainController', [
	'$scope', '$http', '$window', '$timeout', '$rootScope', '$location', 'jsonRpc', 
	function($scope, $http, $window, $timeout, $rootScope, $location, jsonRpc, data){  

    // Date today
    $scope.date_today = new Date();
    //SET URL
    $scope.parser = document.createElement('a');
    $scope.parser.href = $location.absUrl();
    var url = $scope.parser.protocol + "//" + $scope.parser.hostname;
    if ($scope.parser.port)
        var url = url + ":" + $scope.parser.port;

    jsonRpc.odoo_server = url;

    //GET SESSION USER, UID, OR LOGIN
    jsonRpc.getSessionInfo().then(function (result) {
        if (result.uid){
            $scope.set_current_user(result.uid);
            $scope.database = result.db;
        }else{
            $window.location.href = url + '/web/login';
        }
    });

    $scope.showloader = true;
    $scope.showpartdetailsdiv = false;
    $scope.showsodetailsdiv = false;
	$rootScope.bodyclass = 'login-layout light-login';
    $rootScope.include_page = 'partfinder';

    $scope.logout = function(){
        jsonRpc.logout();
        $window.location.href = url + '/web/login';
    }

    $scope.today = new Date();


    $scope.goTo = function(page, args){
        if (args){
            if (args.includes('hashlink')){
                $scope.hashlink = true;
            }else{
                $scope.hashlink = false;
            } 
        }
        $scope.clear_filters();
        $rootScope.include_page = page;
    }

    $scope.set_current_user = function(id){
        $rootScope.user = false;
        $scope.model = 'res.users';
        $scope.domain = [['id', '=', id]];
        $scope.fields = ['display_name'];
        jsonRpc.searchRead($scope.model, $scope.domain, $scope.fields)
        .then(function(response) {
            $rootScope.user = response.records[0];
            $rootScope.bodyclass = 'no-skin';
            $rootScope.loggedin = true;
            $.when(
                $scope.load_work_orders(),
                $scope.load_parts()
            ).done(function() {
                $scope.hide_loader();
            });
        },function(response){
            $scope.odoo_error = {
                'title': response.fullTrace.message,
                'type': response.fullTrace.data.exception_type,
                'message': response.fullTrace.data.message
            }
            $scope.errorModal();
        });
    }

    $scope.login = function(username, password) {
        jsonRpc.login($scope.database, username, password, session_id=null)
        .then(function(response) {
            $scope.set_current_user(response.uid);
            $location.url('/home');  
            
        },function(response){
            if (response.title == 'wrong_login'){
                console.log('login details incorrect');
            }else{
                console.log('Connection Error');
            }
        });

    }

    // FILTERS
    $scope.searchPart = '';

    // THICKNESS
    $scope.select_thickness = function (thickness) {
        $scope.selected_thickness = thickness;
    }

    // EMPLOYEE
    $scope.select_employee = function (employee) {
        $scope.selected_employee = employee.name;
    }

    // MATERIAL
    $scope.select_material = function (material) {
        $scope.selected_material = material;
    }
    // CUSTOMER
    $scope.select_customer = function (customer) {
        $scope.selected_customer = customer;
    }

    // SALEORDER
    $scope.select_saleorder = function (saleorder) {
        $scope.selected_saleorder = saleorder.name;
        $scope.show_saleorder_details(saleorder);
    }

    // WORKCENTER
    $scope.select_workcenter = function (workcenter) {
        $scope.selected_workcenter = workcenter;
    }

    //CLEAR ALL FILTERS
    $scope.clear_filters = function(){
        $scope.selected_thickness = '';
        $scope.selected_customer = '';
        $scope.selected_saleorder = '';
        $scope.selected_workcenter = '';
        $scope.selected_material = '';
        $scope.selected_employee = '';
    }

    //CLEAR ALL FILTERS WHEN SWITCHING SCREENS
    // $scope.$watch('include_page', function () {
        // $scope.selected_thickness = '';
        // $scope.selected_customer = '';
        // $scope.selected_saleorder = '';
        // $scope.selected_workcenter = '';
        // $scope.selected_material = '';
        // $scope.selected_employee = '';
    // });
    $scope.clear_employee_filter = function(){
        $scope.selected_employee = '';
    }
    $scope.clear_thickness_filter = function(){
        $scope.selected_thickness = '';
    }
    $scope.clear_material_filter = function(){
        $scope.selected_material = '';
    }
    $scope.clear_customer_filter = function(){
        $scope.selected_customer = '';
    }
    $scope.clear_saleorder_filter = function(){
        $scope.selected_saleorder = '';
    }
    $scope.clear_workcenter_filter = function(){
        $scope.selected_workcenter = '';
    }

    function search_work_orders() {
        // search work orders
        var model = 'mrp.production.workcenter.line';
        var domain = [['state', 'not in', ['done', 'cancel']]];
        var fields = [
            'name',
            'state',
            'state_name',
            'partner_id',
            'production_state',
            'production_id',
            'part_id',
            'saleorder_id',
            'saleorder_date',
            'saleorder_production_status',
            'saleorder_shipping_status',
            'saleorder_amount_total',
            'product',
            'qty',
            'part_image_medium',
            'commitment_date',
            'part_thickness',
            'material_id',
            'materials',
            'workcenter_id',
            'workcenter_employee_names',
            'workcenter_employee_ids',
            'next_workcenter',
            'part_attachments',
            'date_planned',
            'production_order_date',
            'is_overdue',
        ];
        return jsonRpc.searchRead(
            model,
            domain,
            fields
        );
    }

    // check if customer is in $scope.customers, else add
    $scope.add_customer = function(partner) {
        if (partner){
            if($scope.customers.indexOf(partner[1]) === -1) {
                $scope.customers.push(partner[1]);
            }
        }
    };

    // check if thickness is in $scope.thickness, else add
    $scope.add_thickness = function(thickness) {
        var _thickness = +thickness.toFixed(1);
        if($scope.thickness.indexOf(_thickness) === -1) {
            $scope.thickness.push(_thickness);
        }
    };

    // check if saleorder is in $scope.saleorders, else add
    $scope.add_sale_order = function(work_order, sale_order) {
        if (sale_order) {
            function findSo(so) {
                return so['id'] === sale_order[0];
            }
            if (!$scope.saleorders.find(findSo)){
                $scope.so_parts = [];
                $scope.soparts = $scope.work_orders.filter(workorder => workorder.saleorder_id[0] == sale_order[0]);

                angular.forEach($scope.soparts, function (sopart) {
                    function findSoPart(part) {
                        return part['id'] === sopart.part_id[0];
                    }
                    // function countParts(part){
                    //     $scope.soparts1 = $scope.soparts.filter(part1 => part1.part_id == part );
                    //     console.log('$scope.soparts1', $scope.soparts1.length);
                    //     num = 1;
                    //     return num
                    // }
                    if (!$scope.so_parts.find(findSoPart)){
                        var so_part = {
                            'id': sopart.part_id[0],
                            'name': sopart.part_id[1],
                            'qty': work_order.qty

                        }
                        $scope.so_parts.push(so_part);
                    }
                 });
                // var  count = {};
                // $scope.so_parts.forEach(function(i) { count[i] = (count[i]||0) + 1;});
                // console.log('count', count);
                var so_info = {
                    'id': sale_order[0],
                    'name': sale_order[1],
                    'part': $scope.so_parts,
                    'part_image_medium': work_order.part_image_medium,
                    'commitment_date': work_order.commitment_date,
                    'date' : work_order.saleorder_date,
                    'partner': work_order.partner_id[1],
                    'production_status': work_order.saleorder_production_status,
                    'shipping_status': work_order.saleorder_shipping_status
                }

                $scope.saleorders.push(so_info);
            }
        }
    }

    // check if workcenter is in $scope.workcenter, else add
    $scope.add_workcenter = function(workcenter) {
        if (workcenter) {
            if($scope.workcenters.indexOf(workcenter[1]) === -1) {
                $scope.workcenters.push(workcenter[1]);
            }
        }
    }

    // check if materials is in $scope.materials, else add
    $scope.add_materials = function(materials) {
        if (materials){
            // materials come in string
            // split into parts and update $scope.materials
            var single_materials = materials.split(",");
            angular.forEach(single_materials, function (material) {
                if($scope.materials.indexOf(material) === -1) {
                    $scope.materials.push(material);
                }
            });
        }
    }

    // check if employees are in $scope.employees, else add
    $scope.add_employees = function(employees) {
        angular.forEach(employees, function (employee) {
            function findEmployee(searchemployee) {
                return searchemployee['id'] === employee[0];
            }
            if (!$scope.employees.find(findEmployee)){
                var employee_info = {
                    'id': employee[0],
                    'name': employee[1],
                }
                $scope.employees.push(employee_info);
            }
        });
    }

    function process_work_orders(response, deferred) {
        // initialize variables to empty
        $scope.work_orders = [];
        $scope.thickness = [];
        $scope.materials = [];
        $scope.customers = [];
        $scope.workcenters = [];
        $rootScope.all_employees = [];
        $scope.employees = [];
        $scope.saleorders = [];

        // start by setting work orders equal to response records.
        $scope.work_orders = response.records;

        // then modify work order records one by one
        angular.forEach($scope.work_orders, function (work_order) {

            // change date(string) to js newdate
            work_order.commitment_date = new Date(
                work_order.commitment_date);
            work_order.saleorder_date = new Date(
                work_order.saleorder_date);
            work_order.production_order_date = new Date(
                work_order.production_order_date);
            work_order.date_planned = new Date(
                work_order.date_planned);

            // split employees
            work_order.employee_ids = work_order.workcenter_employee_ids.split(",");
            work_order.employee_names = work_order.workcenter_employee_names.split(",");
            work_order.employee_dict = work_order.employee_ids.map(function(e, i) {
                return [e, work_order.employee_names[i]];
            });

            // fill some collections (for filters)
            $scope.add_customer(work_order.partner_id);
            $scope.add_thickness(work_order.part_thickness);
            $scope.add_sale_order(work_order, work_order.sale_order_id);
            $scope.add_workcenter(work_order.workcenter_id);
            $scope.add_materials(work_order.materials);
            $scope.add_employees(work_order.employee_dict);

        });
        deferred.resolve();
    }

    function process_parts(response, deferred) {
        // initialize variables to empty
        $scope.parts = [];

        // process part records one by one
        angular.forEach(response, function (part) {
            part.due_date = new Date(part.due_date);
            $scope.parts.push(part);
        });
        deferred.resolve();

        console.log("$scope.parts", $scope.parts);
    }

    //LOAD WORK ORDERS
    $scope.load_work_orders = function () {
        var deferred = new $.Deferred();

        search_work_orders().then(
            // success
            function(response) {
                process_work_orders(response, deferred);
            },
            // fail
            function(response) {
                $scope.odoo_error = {
                    'title': response.fullTrace.message,
                    'type': response.fullTrace.data.exception_type,
                    'message': response.fullTrace.data.message
                }
                $scope.errorModal();
            }
        );
        return deferred;
    }

    $scope.hide_loader = function(){
        // Hide the loader, after all stuff is done.
        $scope.showloader = false;
    }

    $scope.show_part_details = function (part) {
        if ($scope.selectedworkordersmulti.includes(part)){
            $scope.selectedworkordersmulti.splice(part, 1);
        }
		$scope.selected_part = part;
        $scope.showpartdetailsdiv=true;
        $scope.showsodetailsdiv=true;
	}

	$scope.show_part_work_orders = function (part) {
        $scope.searchPart = part.name;
        $scope.goTo('worklist');
    }

    $scope.show_saleorder_details = function (so) {
        $scope.showpartdetailsdiv = false;
        // FIND ONE WORKORDER WITH CURRENT SO, AND TAKE SO DETAILS
        function findSo(saleorder) { 
            return saleorder.id === so.id;
        }
        $scope.selected_saleorder = $scope.saleorders.find(findSo);
    }

    // SIGN OFF SO
    $scope.signoff_saleorder = function (so) {
        //POPUP SIGNAGE
        $scope.showsignoffcustomer = !$scope.showsignoffcustomer;
    }
    $scope.load_parts = function(){
        var deferred = new $.Deferred();
        $scope.model = 'mrp.production';
        $scope.method = 'get_screen_parts';
        $scope.domain = [];
        $scope.args = {};
        $scope.kwargs = {};
        jsonRpc.call($scope.model, $scope.method, $scope.args, $scope.kwargs)
        .then(function(response) {
            // update part
            process_parts(response, deferred);
        },function(response){
            $scope.odoo_error = {
                'title': response.fullTrace.message,
                'type': response.fullTrace.data.exception_type,
                'message': response.fullTrace.data.message
            }
            $scope.errorModal();
        });
        return deferred;
    }

    $scope.accept_saleorder_signage = function(signature){
        $scope.model = 'sale.order';
        $scope.method = 'sign_off_saleorder';
        $scope.domain = [];
        $scope.fields = [];
        $scope.args = [{
            'id': $scope.selected_saleorder.id,
            'signature': signature.dataUrl
        }];
        $scope.kwargs = {}; 
        jsonRpc.call($scope.model, $scope.method, $scope.args, $scope.kwargs)
        .then(function(response) {
            // Do Something

        },function(response){
            $scope.odoo_error = {
                'title': response.fullTrace.message,
                'type': response.fullTrace.data.exception_type,
                'message': response.fullTrace.data.message
            }
            $scope.errorModal();
        }); 
        // Clear signature
        $scope.signature = false;
        delete $scope.saleorders.splice($scope.selected_saleorder, 1);
        $scope.showsignoffcustomer = false;
        $scope.clear_saleorder_filter();
    }

    //CLEAR SIGNATURE ON SALEORDER SIGNOFF
    $scope.clear_sign_canvas = function (){
        var canvas = document.querySelectorAll("canvas");
        if (canvas){
            canvas.forEach(function(canvas) {
                var context = canvas.getContext("2d");
                context.clearRect(0, 0, canvas.width, canvas.height);
            });
        }
    }

    //CLEAR SIGNATURE ON SALEORDER & WORKORDER SIGNOFF
    $scope.$watchCollection('selectedworkordersmulti', function () {
        $scope.clear_sign_canvas();
    });

    $scope.$watchGroup(['selected_saleorder', 'include_page', 'showsignoffcustomer', 'showsignoffworkorder'], function() {
        $scope.clear_sign_canvas();
    });

    //CLEAR SIGNATURE ON SIGNOFF
    //modal
    $scope.error_showModal = {};
    $scope.errorModal = function(){
        $scope.error_showModal[1] = !$scope.error_showModal[1];
    }
    $scope.error_cancel = function(){
        $scope.error_showModal = {};
    }
    $scope.closepartdetailsdiv = function(){
        $scope.showpartdetailsdiv = !$scope.showpartdetailsdiv;
    }
    $scope.closesaleorderdetailsdiv = function(){
        $scope.selected_saleorder = !$scope.selected_saleorder;
    }
    $scope.closesignoffcustomerdiv = function(){
        $scope.showsignoffcustomer = !$scope.showsignoffcustomer;
    }
    $scope.closesignoffworkorderdiv = function(){
        $scope.showsignoffworkorder = !$scope.showsignoffworkorder;
    }

    //
    $scope.hash_show_saleorder_parts = function(so){
        $scope.goTo('partfinder', 'hashedlink');
        $scope.selected_saleorder = so;
    }
    
    // SIGN OFF WORK ORDER
    $scope.selectedworkordersmulti = [];
    // Multi select workorder by double clicking
    $scope.selectworkordermulti = function(wo) {
        $scope.selectedworkordersmulti.push(wo);
    }
    $scope.signoff_workorders = function () {
        //POPUP SIGNAGE
        $scope.signature = false;
        $scope.showsignoffworkorder = !$scope.showsignoffworkorder;
    }
    $scope.accept_workorder_signage = function(signature){
        $scope.model = 'mrp.production.workcenter.line';
        $scope.method = 'sign_off_workorder';
        $scope.domain = [];
        $scope.fields = [];
        $scope.args = [{
            'workorders': $scope.selectedworkordersmulti,
            'signature': signature.dataUrl
        }];
        $scope.kwargs = {}; 
        jsonRpc.call($scope.model, $scope.method, $scope.args, $scope.kwargs)
        .then(function(response) {
            // Do Something
            angular.forEach(response, function (id) {
                function findWo(workorder) { 
                    return workorder.id === id;
                }
                delete $scope.work_orders.splice($scope.work_orders.find(findWo), 1);
                $scope.signature = false;
                $scope.showsignoffworkorder = false;
            });
        },function(response){
            $scope.odoo_error = {
                'title': response.fullTrace.message,
                'type': response.fullTrace.data.exception_type,
                'message': response.fullTrace.data.message
            }
            $scope.errorModal();
        }); 
        // Clear signature
        $scope.signature = false;
        $scope.showsignoffworkorder = false;
        
    }

    $scope.process_workorder = function(wo, workorderprocess){
        $scope.model = 'mrp.production.workcenter.line';
        $scope.method = 'process_workorder';
        $scope.domain = [];
        $scope.fields = [];
        $scope.args = [{
            'workorder': wo,
            'process': workorderprocess,
        }];
        $scope.kwargs = {}; 
        jsonRpc.call($scope.model, $scope.method, $scope.args, $scope.kwargs)
        .then(function(response) {
            // Do Something
            wo.state = response;
        },function(response){
            $scope.odoo_error = {
                'title': response.fullTrace.message,
                'type': response.fullTrace.data.exception_type,
                'message': response.fullTrace.data.message
            }
            $scope.errorModal();
        });
    }

}]);

screenApp.directive('sfRepeatMatchHeight', ['$timeout', function($timeout) {
    return function(scope, element, attrs) {
        if (scope.$last){
            elements_to_match_selector = attrs.sfRepeatMatchHeight;
            $timeout(function () {
                //DOM has finished rendering
                $(elements_to_match_selector).matchHeight();
            }, 100);
        }
    };
}]);

screenApp.directive('modal', function () {
    return {
      template: 
        '<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' + 
          '<div class="modal-dialog">' + 
            '<div class="modal-content">' + 

              '<div class="modal-header ">' + 
                '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' + 
                '<h4 class="modal-title">{{title}}</h4>' +
              '</div>' + 

              '<div class="modal-body" ng-transclude></div>' +
                
          '</div>' + 
        '</div>',
      restrict: 'E',
      transclude: true,
      replace:true,
      scope:true,
      size: 'lg',
      link: function postLink(scope, element, attrs) {
        scope.title = attrs.title;

      scope.$watch(attrs.visible, function(value){
        if(value == true)
          $(element).modal('show');
        else
          $(element).modal('hide');
      });

      $(element).on('shown.bs.modal', function(){
        scope.$apply(function(){
          scope.$parent[attrs.visible] = true;
        });
      });

      $(element).on('hidden.bs.modal', function(){
        scope.$apply(function(){
          scope.$parent[attrs.visible] = false;
        });
      });
      }
    };
  });
