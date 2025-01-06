
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
		$("#var_U").val(localStorage.getItem("var_U"));
		$("#var_E_0").val(localStorage.getItem("var_E_0"));
		$("#var_dp").val(localStorage.getItem("var_d"));

		$("#var_Phi_s").val(localStorage.getItem("var_Phi_s"));
		$("#var_Phi_t").val(localStorage.getItem("var_Phi_t"));
		$("#var_d").val(localStorage.getItem("var_d"));
		$("#var_S").val(localStorage.getItem("var_S"));
		$("#var_V").val(localStorage.getItem("var_V"));


		data_treat(JSON.parse(localStorage.getItem('jsondata')),type);
		return;
	}

	if (type==0){
		SetDefault(clctp);
		return;
	}
		
	if(!checkInput()){
		alert("Cannot calculate. Input is incorrect. Please check input!");
		return;
	}
		
	json_inputdata = {};
	
	json_inputdata.calctype = 5;
	json_inputdata.subtype = clctp;

	
	json_inputdata.U = parseFloat($("#var_U").val());
	localStorage.setItem("var_U",$("#var_U").val());

	json_inputdata.E0 = parseFloat($("#var_E_0").val());
	localStorage.setItem("var_E_0",$("#var_E_0").val());

	json_inputdata.dp = parseFloat($("#var_dp").val());
	localStorage.setItem("var_dp",$("#var_dp").val());



	json_inputdata.Phi_s = parseFloat($("#var_Phi_s").val());
	localStorage.setItem("var_Phi_s",$("#var_Phi_s").val());

	json_inputdata.Phi_t = parseFloat($("#var_Phi_t").val());
	localStorage.setItem("var_Phi_t",$("#var_Phi_t").val());

	json_inputdata.d = parseFloat($("#var_d").val());
	localStorage.setItem("var_d",$("#var_d").val());

	json_inputdata.S = parseFloat($("#var_S").val());
	localStorage.setItem("var_S",$("#var_S").val());

	json_inputdata.V = parseFloat($("#var_V").val());
	localStorage.setItem("var_V",$("#var_V").val());	
	
	// json_inputdata.Vrange = parseFloat($("#var_Vrange").val());
	// localStorage.setItem("var_Vrange",$("#var_Vrange").val());




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
	updateFigs();
	update_Coefficients()

}

$(document).ready(function () {
	$('#Form1').submit(function(){
		if ( $("#defaultdata").data('clicked')==true ){
			ServerUpdate(0, 0);
			ServerUpdate(2, 0);
			$("#defaultdata").data('clicked','false');
		}else {
			ServerUpdate(2, 0);
		}

	});	

	$('#Form2').submit(function(){
		if ( $("#defaultdata1").data('clicked')==true ){
			ServerUpdate(0, 0);
			ServerUpdate(2, 0);
			$("#defaultdata1").data('clicked','false');
		}else {
			ServerUpdate(2, 0);
		}
		return false;
	});
});


function updateFigs() {
	try{
		plotFig1('resultFig1');

	// Determine which figure to plot based on the selected range
		let Vrange = parseInt($("#var_Vrange").val());
		if (Vrange == 0) {
			plotFig3('resultFig3')
		} else if (Vrange == 1) {
			plotFig3('resultFig3_low')
		} else if (Vrange == 2) {
			plotFig3('resultFig3_intermediate');
		} else if (Vrange == 3) {
			plotFig3('resultFig3_high');
		}
		
	} catch (error) {
		console.error("An error occurred: " + error.message);
	}
}

function update_Coefficients() {
	let Ai = jsondata.Ai;
	let Bi = jsondata.Bi;
	let Ci = jsondata.Ci;
	let Di = jsondata.Di;

	let Ar = jsondata.Ar;
	let Br = jsondata.Br;
	let Cr = jsondata.Cr;
	let Dr = jsondata.Dr;

	// let sign = '';
	// if (Ai > 0) {sign = '+'}
	// $("#span_A").text(' = ' + Ar.toFixed(5) + sign + Ai.toFixed(5))
	// if (Bi > 0) {sign = '+'} else {sign = ''}
	// $("#span_B").text(' = ' + Br.toFixed(5) + sign + Bi.toFixed(5))
	// if (Ci > 0) {sign = '+'} else {sign = ''}
	// $("#span_C").text(' = ' + Cr.toFixed(5) + sign + Ci.toFixed(5))
	// if (Di > 0) {sign = '+'} else {sign = ''}
	// $("#span_D").text(' = ' + Dr.toFixed(5) + sign + Di.toFixed(5))

	function updateSpan(spanId, real, imag) {
		const sign = imag > 0 ? '+' : '';
		$(`#${spanId}`).text(` = ${real.toFixed(5)}${sign}${imag.toFixed(5)}i`);
	}
	
	updateSpan('span_A', Ar, Ai);
	updateSpan('span_B', Br, Bi);
	updateSpan('span_C', Cr, Ci);
	updateSpan('span_D', Dr, Di);
}









