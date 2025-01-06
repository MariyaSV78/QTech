
/*
(exercises in quantum mechanics)
functions for AJAX request and resulting data treatment

Authors:    A.Korovin [a.v.korovin73@gmail.com] 25/05/2019-30/04/2020;
            M. Sosnova [mariya.v.sosnova@gmail.com] 15/06/2023-15/07/2024;

*/
	
	
function ServerUpdate(type, clctp) {
	console.log("type", type)
	console.log("clctp", clctp)

	if (type==-1){
			
		$("#var_x_min").val(localStorage.getItem("var_x_min"));
		$("#var_x_max").val(localStorage.getItem("var_x_max"));
		$("#var_n_state").val(localStorage.getItem("var_n_state"));
		$("#var_n").val(localStorage.getItem("var_n"));
		$("#var_n_samples").val(localStorage.getItem("var_n_samples"));
		
		$("#var_n_samples_print").val(localStorage.getItem("var_n_samples_print"));

		$("#var_lerning_rate").val(localStorage.getItem("var_lerning_rate"));
		$("#var_training_iter").val(localStorage.getItem("var_training_iter"));
		$("#var_batch_size").val(localStorage.getItem("var_batch_size"));

		Pot_Type = parseInt($("#var_Pot_Type").val());

		data_treat(JSON.parse(localStorage.getItem('jsondata')),type);
		return;
	}

	if (type==0){
		SetDefault();
		return;
	}
		
	if(!checkInput()){
		alert("Cannot calculate. Input is incorrect. Please check input!");
		return;
	}
		
	json_inputdata = {};
	
	json_inputdata.calctype = 3;

	json_inputdata.x_min = parseInt($("#var_x_min").val());
	localStorage.setItem("var_x_min",$("#var_x_min").val());
	
	json_inputdata.x_max = parseInt($("#var_x_max").val());
	localStorage.setItem("var_x_max",$("#var_x_max").val());
	
	json_inputdata.n_state = parseInt($("#var_n_state").val());
	localStorage.setItem("var_n_state",$("#var_n_state").val());

	json_inputdata.n = parseInt($("#var_n").val());
	localStorage.setItem("var_n",$("#var_n").val());
	
	json_inputdata.n_samples = parseInt($("#var_n_samples").val());
	localStorage.setItem("var_n_samples",$("#var_n_samples").val());
	
	json_inputdata.n_samples_print = parseInt($("#var_n_samples_print").val());
	localStorage.setItem("var_n_samples_print",$("#var_n_samples_print").val());
	
	json_inputdata.learning_rate = parseFloat($("#var_lerning_rate").val());
	localStorage.setItem("var_lerning_rate",$("#var_lerning_rate").val());

	json_inputdata.training_iter = parseInt($("#var_training_iter").val());
	localStorage.setItem("var_training_iter",$("#var_training_iter").val());

	json_inputdata.batch_size = parseInt($("#var_batch_size").val());
	localStorage.setItem("var_batch_size",$("#var_batch_size").val());

	Pot_Type	= parseInt($("#var_Pot_Type").val());
	document.getElementById("N_sampl").value = 0;


	let default_data = {"calctype": 3,"x_min": -8,"x_max": 8, "n_state": 1, "n": 200, "n_samples": 5000, "learning_rate": 0.0005, "training_iter": 100, "batch_size": 64}
	let tmp_data = JSON.parse(JSON.stringify(json_inputdata));;
console.log("json_inputdata", json_inputdata)

	if (!objectsAreEqual(default_data, tmp_data)){
		let k = parseFloat($('#var_n_samples').val());
		k = 0.18*k + 60
		const confirmationMessage = 'It will take you about '+k+'s to do this calculation'
		const confirmation = window.confirm(confirmationMessage);
		if (confirmation) {
			console.log("Calculations started...");
			// Proceed with your calculations here
		  } else {
			console.log("Calculations stopped. Exiting...");
			return;
		  }
	}else{
		console.log("default_data =json_inputdata")
	}
	
	$.blockUI({
		message: 'Calculating...',
		css: {
			animation:			'blinker 1s linear infinite',
			border:				'none',
			padding:			'15px',
			width:			'auto',
			backgroundColor:	'#000', '-webkit-border-radius': '10px', '-moz-border-radius': '10px',
			opacity:			'.5',
			color:				'#fff',
			fontSize:			'18px',
			fontFamily:			'Verdana,Arial',
			margin: 'auto', // Center horizontally
			top: '50%', // Center vertically
			left: '50%', // Center horizontally
			transform: 'translate(-50%, -50%)', // Center vertically and horizontally		
		}
	});

	$.ajax({
		url: "../cgi-bin/main.py",
		type: "POST",
		data: JSON.stringify(json_inputdata),
		dataType: "json",
	//		async: "false",
		success: function (response) {
console.log('jsondata success', response);		
			try {
				data_treat(response,type);

			} catch (e) {
				console.error('Error parsing JSON:', e);
				// Handle the parsing error
			}
		},	
		complete: function () {
console.log('jsondata complete');		

		},
		error: function(xhr, status, error) {
	// Handle any errors that occur during the request
console.error('Error:', error, status, xhr);
		}
		});
};
	
function data_locsave(response){
	try {localStorage.setItem('jsondata', JSON.stringify(response))
	console.log('save')		
		}
	catch (e) {
		// clear local Storage
		localStorage.removeItem('jsondata');
console.log(e)
}}

function data_treat(response,type){
	jsondata_tmp = response;
	if (jsondata==null || type<2) {
		console.log("type", type)	

		jsondata = jsondata_tmp;
	}else{
		Object.assign(jsondata, jsondata_tmp);
	}
		
	data_locsave(Object.assign({}, jsondata));

				if (jsondata.Error!=null){
					alert(jsondata.Error);
					jsondata.Error=null;
					return;
				}
		
	sessionID = jsondata.sessionID;

	if (jsondata.caltime!=null){
		var txt	= document.getElementById('txt_SimulationTime');
		if (txt!=null){
			if (jsondata.calRAM!=null)
				if (jsondata.calRAM==0)
					switch(lang){
						case 0:
							txt.innerHTML = "<br>Last simulation time = "+jsondata.caltime.toPrecision(4)+" s (No RAM information under Windows).";
							break;
						case 1:
							txt.innerHTML = "<br>Dernièr temps de simulation = "+jsondata.caltime.toPrecision(4)+" s (Aucune information RAM sous Windows).";
							break;
					}
				else
					switch(lang){
						case 0:
							txt.innerHTML = "<br>Last simulation time = "+jsondata.caltime.toPrecision(4)+" s (RAM used: "+jsondata.calRAM.toPrecision(4)+" MB).";
							break;
						case 1:
							txt.innerHTML = "<br>Dernièr temps de simulation = "+jsondata.caltime.toPrecision(4)+" s (RAM utilisée: "+jsondata.calRAM.toPrecision(4)+" MB).";
							break;
					}
				else
					switch(lang){
						case 0:
							txt.innerHTML = "<br>Last simulation time = "+jsondata.caltime.toPrecision(4)+" s.";
							break;
						case 1:
							txt.innerHTML = "<br>Dernièr temps de simulation = "+jsondata.caltime.toPrecision(4)+" s.";
							break;
					}
		}
	}
	Add_Nsampl_selection();
	updateFigs();
	update_Equation()
}

$(document).ready(function () {
	$('#Form1').submit(function(){
		return false;
	});	

	$('#Form2').submit(function(){
		if ( $("#defaultdata1").data('clicked')==true ){
			ServerUpdate(0, 1);
			$("#defaultdata1").data('clicked','false');
		}else{
			ServerUpdate(2, 1);
console.log('im here3')
		}
		return false;
	});

	$('#Form3').submit(function(){
		updateFigs();
		return false;
	});	

	$('#Form4').submit(function(){
		update_Data();
		Add_Nsampl_selection();
		updateFigs();
		
		return false;
	});

});

$(document).ready(function() {
    $("#showInfo").click(function(event) {
        event.preventDefault(); // Prevent the default behavior of the anchor tag
        $("#infoSection").toggle(); // Toggle the visibility of the div
    });
	$("#closeInfo").click(function(event) { //function()
		event.preventDefault(); // Prevent default behavior of the button
        $("#infoSection").hide();
	});
});


function print_table(Table){
	try{
		if(jsondata.alpha==null){
			return;}

		let n = parseInt($("#var_n_samples_print").val());
		let alpha = jsondata.alpha;
		var str = '';
		str += '<table border="1" align="center" frame="box" width="100%">';
		str += '<tr style="border-bottom: double;">';
		
		if (n > alpha.length){
			n = alpha.length;
		}

		var table = document.getElementById(Table);

		str += String.raw`<td>$$n_{sample}$$</td><td>$$\alpha_{i, n_s}$$</td>`;
		str += '</tr>';
		
		for(i=0;i<n;i++){
			if (Table == 'table_alpha2'){
				const N_s = parseInt($("#N_sampl").val());
				i = n = N_s;	
			}
			alpha_tmp = alpha[i].map(value => value.toFixed(3));
		
			str += '<tr>';
			str += '<td>'+i+'</td> <td>'+alpha_tmp.join(',&nbsp&nbsp&nbsp')+'</td>';
			str += '</tr>';
		}
		str += '</table>';

		table.innerHTML = str
				MathJax.Hub.Queue(["Typeset",MathJax.Hub]);

	} catch (error) {
		console.error("An error occurred: " + error.message);
	}
}


function updateFigs() {
	try{
		plotFig1('resultFig1');
		plotFig1_a('resultFig1_a');
		print_table('table_alpha')
		plotFig2('resultFig2')
		print_table('table_alpha2')
		update_Data()
		plotFig3('resultFig3')
	} catch (error) {
		console.error("An error occurred: " + error.message);
	}
}


function update_Data() {
	try{	
		const Pot_Type = parseInt($("#var_Pot_Type").val());

		var alpha, MSE, MSE_E;
	
		if 	(Pot_Type == 0){
			MSE = jsondata.MSE_PP, MSE_E = jsondata.MSE_E_PP

		} else if (Pot_Type == 1){
			MSE = jsondata.MSE_HO, MSE_E = jsondata.MSE_E_HO

		} else if (Pot_Type == 2){
			MSE = jsondata.MSE_morse, MSE_E = jsondata.MSE_E_morse}
		
		$("#span_MSE").text(' = ' + MSE.toFixed(7)) 
		$("#span_MSE_E").text(' = ' +  MSE_E.toFixed(7)) 
		set_Omega();
		// update_Equation();
	} catch (error) {
		console.error("An error occurred: " + error.message);
	}
}


function set_Omega() {
	try{	
		var N = parseInt($("#N_sampl").val());
		const omega = jsondata.omega;
	
		$("#span_omega").text(' = ' + omega[N]) 

	} catch (error) {
		console.error("An error occurred: " + error.message);
	}
}


function update_Equation() {
	try{
		const Pot_Type = parseInt($("#var_Pot_Type").val());
		// Get the value of n_s
		let n_s = parseInt($("#N_sampl").val());
		if 	(Pot_Type == 0){
console.log("update_Equation 0")
			$("#polynomial_Equation").html(`$$V_{${n_s}}(x) = \\sum_{i=0}^{k-1} \\alpha_{i, ${n_s}} x^i$$`);
		} else if (Pot_Type == 1){
console.log("update_Equation 1")
			$("#ho_Equation").html(`$$V_{${n_s}}(x) = \\frac{1}{2} m\\omega_{${n_s}}^2 x^2 .$$`);
		} else if (Pot_Type == 2){
console.log("update_Equation 2")
			$("#morse_Equation").html(`$$V_{${n_s}}(x) = D_e [(1-e^{-a(x-x_{e})})^{2}-1] ,$$`);
		}
	} catch (error) {
		console.error("An error occurred: " + error.message);
	}
    
}



