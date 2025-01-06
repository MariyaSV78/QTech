
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
		$("#var_N").val(localStorage.getItem("var_N"));
		$("#var_Ej_E").val(localStorage.getItem("var_Ej_E"));

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
	
	json_inputdata.calctype = 4;

	json_inputdata.N = parseFloat($("#var_N").val());
	localStorage.setItem("var_N",$("#var_N").val());

	json_inputdata.Ej_Ec = parseInt($("#var_Ej_Ec").val());
	localStorage.setItem("var_Ej_Ec",$("#var_Ej_Ec").val());



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
	updateFigs();

}

$(document).ready(function () {
	$('#Form1').submit(function(){
		return false;
	});	

	$('#Form2').submit(function(){
		if ( $("#defaultdata1").data('clicked')==true ){
			ServerUpdate(0, 1);
			// ServerUpdate(2, 1);
			$("#defaultdata1").data('clicked','false');
		}else{
			ServerUpdate(2, 1);
		}
		return false;
	});
});


function updateFigs() {
	try{
		plotFig3('resultFig3');
		// plotFig4('resultFig4')
	} catch (error) {
		console.error("An error occurred: " + error.message);
	}
}











