localStorage['serviceURL'] = 'http://medicor.azurewebsites.net/';
angular.module('starter.controllers', [])


.controller('SignInCtrl', function($scope, $state, $ionicPopup, $timeout) {
   

   $scope.signIn = function(user) {
  	var serviceURL = localStorage['serviceURL'];
    console.log('Sign-In', user);
    dni = user.username;
	habitacion = user.password;
    
        
    $.getJSON(serviceURL + 'login.php?dni='+dni+'&habitacion='+habitacion+'&format=json', function(data) {
    	var datos = 0;
		cursos = data.items;
		$.each(cursos, function(index, curso) {
			localStorage['numHab'] = habitacion;
			localStorage['dniUsu'] = dni;
			$state.go('tab.evotasaspa');
			datos = 1;
			return true;	
		}); 
		if (datos == 0) {
			var alertPopup = $ionicPopup.alert({
			     title: 'Campos vacios',
			     template: 'Usuario o clave incorrectas'
			});
				//alert("Usuario o clave incorrectas");
				//showAlert();		
				return false;
		} 
	});
    
  };
})

.controller('HomeTabCtrl', function($scope) {
  console.log('HomeTabCtrl');
  	var codusu = localStorage['codUsu'];
	var serviceURL = localStorage['serviceURL'];
	var employees;

	$('#busy').show();
	$.getJSON(serviceURL + 'getnombres.php?codigo='+codusu+'&format=json', function(data) {
		$('#busy').hide();
		
		nombres = data.items;
		$.each(nombres, function(index, nombre) {
			
			localStorage['nombre'] = nombre.post.nombreusu + ' ' + nombre.post.apellidousu;
			$('#employeeList').append(	
					'<p>' + decodeURIComponent(nombre.post.nombreusu) + ' ' + decodeURIComponent(nombre.post.apellidousu)  + '</p>');
					
		
		});
		setTimeout(function(){
			scroll.refresh();
		});
	});

})


.controller('LGraphCtrl', function($scope) { // Add a simple controller
  var serviceURL = localStorage['serviceURL'];
  var numHab = localStorage['numHab'];
  var dni = localStorage['dniUsu'];
  var medicion = [];
  var hora = [];
  
  //var datos = [1,2,3,4,5];
  
  $('#busy').show();
	$.getJSON(serviceURL + 'getconsumototal.php?dni='+dni+'&format=json', function(data) {
		$('#busy').hide();
		
		totales = data.items;
		$.each(totales, function(index, total) {
			
			//localStorage['nombre'] = nombre.post.nombreusu + ' ' + nombre.post.apellidousu;
			$('#employeeList').append(	
					'<p>' + decodeURIComponent(total.post.Total) +' Kwh</p>');
					
		
		});
		setTimeout(function(){
			scroll.refresh();
		});
	});
  
  $.getJSON(serviceURL + 'getcostototal.php?dni='+dni+'&format=json', function(data) {
		$('#busy').hide();
		
		totales = data.items;
		$.each(totales, function(index, total) {
			
			//localStorage['nombre'] = nombre.post.nombreusu + ' ' + nombre.post.apellidousu;
			$('#employeeLista').append(	
					'<p>S/.' + parseFloat(decodeURIComponent(total.post.Total)).toFixed(2) +'</p>');
					
		
		});
		setTimeout(function(){
			scroll.refresh();
		});
	});
  
  
  $scope.graph = {};                        // Empty graph object to hold the details for this graph
  
  $.getJSON(serviceURL + 'getconsumograficohoy.php?habCod='+numHab+'&format=json', function(data) {
		temps = data.items;
		var cont = 0;
		$.each(temps, function(index, temp) {
			medicion[cont] = temp.post.TEMmedicion;
			hora[cont] = temp.post.TEMhora;
			//localStorage['tasasp'] = tasap.post.porcentajedeta;
			cont++;
		});
		setTimeout(function() {
			scroll.refresh();
		});
		  $scope.graph.data = [                     // Add bar data, this will set your bars height in the graph
		  medicion
		  ];
		  $scope.graph.labels = hora;    // Add labels for the X-axis
		  //$scope.graph.series = ['Tasa'];  // Add information for the hover/touch effect
	});


})


.controller('PopupCtrl',function($scope, $ionicPopup, $timeout) {


 // A confirm dialog
 $scope.showConfirm = function() {
   var confirmPopup = $ionicPopup.confirm({
     title: 'Cerrar Sesion',
     template: '¿Esta seguro?',
     cancelText: 'No',
     okText: 'Sí',
   });
   confirmPopup.then(function(res) {
     if(res) {
     location.href='#/login';
     } else {
     }
   });
 };
 
 // An alert dialog
 $scope.showAlert = function() {
   var alertPopup = $ionicPopup.alert({
     title: 'Contáctenos',
     template: 'MEDICOR '+
' </br>Sistema Medidor de Corriente</br></br>'+
'</br>'+
'Central Telef: 999999999</br>'
   });
 };
 


});