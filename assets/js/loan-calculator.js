
$(document).ready(function(){
	// loading default values of calculator
	if ($("#paymentCalc").width() > 0)
		cd_loanCalculator();
});

// loan calculator in car-sale-item.html
function cd_loanCalculator(){
	// introducing variabiles
	var vehiclePrice  = parseInt(document.getElementById("vehiclePrice").value);
	var firstPayment  = parseInt(document.getElementById("firstPayment").value);
	var intRate       = parseInt(document.getElementById("intRate").value);
	var paymentPeriod = parseInt(document.getElementById("paymentPeriod").value);


	// !!! FORMULAS
	// 1. car total - down payment = restPaymentSold
	var restPaymentSold = Math.abs(vehiclePrice) - Math.abs(firstPayment);

	// 2. monthly interes
	var monthlyInteres = (restPaymentSold * (intRate * .01)) / paymentPeriod;
		monthlyInteres = Math.round(monthlyInteres * 100) / 100;

	// 3. monthly payment
	var monthlyPayment = (restPaymentSold / paymentPeriod) + monthlyInteres;
		monthlyPayment = Math.round(monthlyPayment * 100) / 100;


	// 4. total interes
	var totalInteres = monthlyInteres * paymentPeriod;
		totalInteres = Math.round(totalInteres * 100) / 100;

	// 5. total amount to pay
	var totalAmount = (monthlyPayment * paymentPeriod) + totalInteres;
		totalAmount = Math.round(totalAmount * 100) / 100;


	// VALIDATING RESULTS
	if ( isNaN(vehiclePrice) ) {
		document.getElementById("vehiclePrice").style.borderColor = "red";
	} else if (isNaN(firstPayment)) {
		document.getElementById("firstPayment").style.borderColor = "red";
	} else if (isNaN(intRate)) {
		document.getElementById("intRate").style.borderColor = "red";
	} else {
		// !!! RESULTS
		document.getElementById("totalResult").innerHTML    = "$" + Math.abs(totalAmount).toString().replace(/(\d)(?=(\d{3})+\.)/g, "1 ");
		document.getElementById("monthPay").innerHTML       = "$" + Math.abs(monthlyPayment).toString().replace(/(\d)(?=(\d{3})+\.)/g, "1 ");
		document.getElementById("interesPayment").innerHTML = "$" + Math.abs(totalInteres).toString().replace(/(\d)(?=(\d{3})+\.)/g, "1 ");
	    document.getElementById("periodPay").innerHTML      = paymentPeriod + " months";

	    // input borders
	    document.getElementById("vehiclePrice").style.borderColor = "";
	    document.getElementById("firstPayment").style.borderColor = "";
	    document.getElementById("intRate").style.borderColor      = "";

	}

}

// car dimensions in item-submit.html
function changeCarDimensions(){

	var vehicleWidthTop = document.getElementById("carWidthTopInput").value;
	var vehicleLenght   = document.getElementById("carLenghtInput").value;
	var vehicleHeight   = document.getElementById("carHeightInput").value;
	var vehicleWeelBase = document.getElementById("carWheelInput").value;
	var vehicleWeight   = document.getElementById("carWeightInput").value;

	document.getElementById("carWidthTop").innerHTML    = vehicleWidthTop + " mm";
	document.getElementById("carHeightTop").innerHTML   = vehicleLenght   + " mm";
	document.getElementById("carHeightSide").innerHTML  = vehicleHeight   + " mm";
	document.getElementById("carWidthBottom").innerHTML = vehicleWeelBase + " mm";
	document.getElementById("carWeight").innerHTML      = vehicleWeight   + " kg";

}

// !!! calculate price rent for user period in price blocks
jQuery(function(){
	 // Rent price calculators
    jQuery(".rent-select").change(function(){
       var selected = jQuery(this).find('option:selected').val();
			 var extra    = jQuery(this).find('option:selected').data('months');
			 //  to numbers
			 var selectedNum = parseInt(selected);
			 var extraNum    = parseInt(extra);

			//  output prices
			var monthPr = jQuery(this).parent().parent().parent().find(".rent-text").html('$' + selectedNum);
			var totalPr = jQuery(this).parent().parent().parent().find(".total-price").html('$' + (extraNum*selectedNum).toFixed(2) );
			// verify result ;-)
			 //console.log(extraNum * selectedNum);
    });

		// Basic price - one month free
		jQuery(".oneFree").change( function(){
			var selected = jQuery(this).find('option:selected').val();
			var extra    = jQuery(this).find('option:selected').data('months');
			//  to numbers
			var selectedNum = parseInt(selected);
			var extraNum    = parseInt(extra);

			// output for one month free prices
			var oneFreeNum = (( selectedNum*extraNum - selectedNum )/extraNum).toFixed(2);
			var oneFree = jQuery(".oneFree").parent().parent().parent().find(".rent-text").html('$' + oneFreeNum);
			var totalPr = jQuery(this).parent().parent().parent().find(".total-price").html('$' + (extraNum*selectedNum - 10).toFixed(2));

			if(isNaN(oneFreeNum)) {
				jQuery(".oneFree").parent().parent().parent().find(".rent-text").html('$' + 0)
			}
			console.log(oneFreeNum);

		});
});


// calculate price rent summ in car reservation form
jQuery(function(){

		// set curent Date
	var d = new Date();
	var month = d.getMonth()+1;
	var day = d.getDate();
	var output = d.getFullYear() + '-' +
	(month<10 ? '0' : '') + month + '-' +
	(day<10 ? '0' : '') + day;
	$("#curentDay").val(output);

	jQuery('#curentHour').datetimepicker({
		datepicker:false,
		ampm: true,
    	format : 'g:i A',
    	hours12: true, //time format 24h/12h
		onSelectTime:function(current_time,$input){
			jQuery('#dropHour').val( jQuery('#curentHour').val() );
			jQuery("#pickT").text( jQuery('#curentHour').val() )
		}
	});
	jQuery('#dropHour').datetimepicker({
		datepicker:false,
		ampm: true,
    	format : 'g:i A',
		hours12: true, //time format 24h/12h
		onSelectTime:function(current_time,$input){
			jQuery('#curentHour').val( jQuery('#dropHour').val() );
			jQuery("#pickT").text( jQuery('#curentHour').val() )
		}
	});

	// set days rent range
	jQuery('#curentDay').datetimepicker({
	  timepicker:false,
		onShow:function( ct ){
	   this.setOptions({
			minDate:0,
	    maxDate:jQuery('#dropDay').val()?jQuery('#dropDay').val():false
	   })
	  },
		onSelectDate:function(ct,$i){
			days();
		}
	});
	jQuery('#dropDay').datetimepicker({
	  timepicker:false,
		startDate:'+1970/01/02',
		onShow:function( ct ){
	   this.setOptions({
	     minDate:jQuery('#curentDay').val()?jQuery('#curentDay').val():false,
	   })
	  },
		onSelectDate:function(ct,$i){
			days();
		}
	});
	function days() {
    var a = $("#curentDay").datetimepicker('getValue'),
        b = $("#dropDay").datetimepicker('getValue'),
        c = 24*60*60*1000,
        diffDays = Math.round(Math.abs((a - b)/(c)));
    		console.log(diffDays); //show difference

		jQuery("#daysN").text(diffDays + " days");
		jQuery("#startR").text( jQuery('#curentDay').val() );
		jQuery("#endR").text( jQuery('#dropDay').val() );

		// output calculate costs
		var old_price = 70;
		var new_price = 50;
		var days_num  = diffDays;
		var total_p 		= old_price * diffDays;
		var reduced_p = new_price * diffDays;

		jQuery("#totDayP-old").text('$'+total_p);
		jQuery("#totDayP, .totalPrice").text('$'+reduced_p)

	}

});
