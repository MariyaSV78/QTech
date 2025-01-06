
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
	
	$("#var_energy_i").val(localStorage.getItem("var_energy_i"));
	$("#var_energy_ph").val(localStorage.getItem("var_energy_ph"));
	$("#var_energy_f").val(localStorage.getItem("var_energy_f"));

	$("#var_l_partial_i").val(localStorage.getItem("var_l_partial_i"));
	$("#var_l_partial_f").val(localStorage.getItem("var_l_partial_f"));
	$("#var_l_partial_i_ph").val(localStorage.getItem("var_l_partial_i_ph"));
	$("#var_l_partial_f_ph").val(localStorage.getItem("var_l_partial_f_ph"));

	$("#var_npoints_i").val(localStorage.getItem("var_npoints_i"));
	$("#var_r_min_i").val(localStorage.getItem("var_r_min_i"));
	$("#var_r_max_i").val(localStorage.getItem("var_r_max_i"));

	$("#var_npoints_f").val(localStorage.getItem("var_npoints_f"));
	$("#var_r_min_f").val(localStorage.getItem("var_r_min_f"));
	$("#var_r_max_f").val(localStorage.getItem("var_r_max_f"));

	$("#var_npoints_ph").val(localStorage.getItem("var_npoints_ph"));
	$("#var_r_min_ph").val(localStorage.getItem("var_r_min_ph"));
	$("#var_r_max_ph").val(localStorage.getItem("var_r_max_ph"));

	$("#var_N_E").val(localStorage.getItem("var_N_E"));

	$("#var_n_i").val(localStorage.getItem("var_n_i"));

	$("#var_m_i").val(localStorage.getItem("var_m_i"));  // magnetic quantum number initial
	// $("#var_m_f").val(localStorage.getItem("var_m_f"));

	$("#var_mu_i").val(localStorage.getItem("var_mu_i")); // quant_def_initial
	$("#var_mu_f").val(localStorage.getItem("var_mu_f"));

	$("#var_Atom_Type").val(localStorage.getItem("var_Atom_Type"));
	$("#var_Initial_State_atom").val(localStorage.getItem("var_Initial_State_atom"));
	$("#var_Final_State_atom").val(localStorage.getItem("var_Final_State_atom"));
	$("#var_nameInput").val(localStorage.getItem("var_nameInput"));

	Atom_Type = parseInt($("#var_Atom_Type").val());

	if (Atom_Type == 2) {
		$("#SelectedAtom").hide();
        $("#Your_atom").show();
	} else {
		$("#SelectedAtom").show();
        $("#Your_atom").hide();
	}

	StateI = parseInt($("#var_Initial_State_atom").val());

	StateF = parseInt($("#var_Final_State_atom").val());


console.log("LS2A", Atom_Type)
console.log("SI", StateI)
console.log("SF", StateF)
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

json_inputdata.calctype = 1;
json_inputdata.subtype = clctp;


	if(clctp==1){
		json_inputdata.energy_i = parseFloat($("#var_energy_i").val());
		localStorage.setItem("var_energy_i",$("#var_energy_i").val());
	
		// json_inputdata.n_i = parseFloat($("#var_n_i").val());
		// localStorage.setItem("var_n_i",$("#var_n_i").val());
		
		// json_inputdata.mu_i = parseFloat($("#var_mu_i").val());
		// localStorage.setItem("var_mu_i",$("#var_mu_i").val());	

		json_inputdata.l_partial_i = parseFloat($("#var_l_partial_i").val());
		localStorage.setItem("var_l_partial_i",$("#var_l_partial_i").val());
		
		json_inputdata.npoints = parseInt($("#var_npoints_i").val());
		localStorage.setItem("var_npoints_i",$("#var_npoints_i").val());
		
		json_inputdata.r_min = parseFloat($("#var_r_min_i").val());
		localStorage.setItem("var_r_min_i",$("#var_r_min_i").val());
		
		json_inputdata.r_max = parseFloat($("#var_r_max_i").val());
		localStorage.setItem("var_r_max_i",$("#var_r_max_i").val());	

	

	}

	else if(clctp==2){
		json_inputdata.energy_f = parseFloat($("#var_energy_f").val());
		localStorage.setItem("var_energy_f",$("#var_energy_f").val());

		json_inputdata.l_partial_f = parseFloat($("#var_l_partial_f").val());
		localStorage.setItem("var_l_partial_f",$("#var_l_partial_f").val());
		
		json_inputdata.npoints = parseInt($("#var_npoints_f").val());
		localStorage.setItem("var_npoints_f",$("#var_npoints_f").val());
		
		json_inputdata.r_min = parseFloat($("#var_r_min_f").val());
		localStorage.setItem("var_r_min_f",$("#var_r_min_f").val());
		
		json_inputdata.r_max = parseFloat($("#var_r_max_f").val());
		localStorage.setItem("var_r_max_f",$("#var_r_max_f").val());			
	}

	else if(clctp==3){
		json_inputdata.l_partial_i_ph = parseInt($("#var_l_partial_i_ph").val());
		localStorage.setItem("var_l_partial_i_ph",$("#var_l_partial_i_ph").val());		
		
		json_inputdata.l_partial_f_ph = parseInt($("#var_l_partial_f_ph").val());
		localStorage.setItem("var_l_partial_f_ph",$("#var_l_partial_f_ph").val());

		json_inputdata.n_i = parseInt($("#var_n_i").val());
		localStorage.setItem("var_n_i",$("#var_n_i").val());

		json_inputdata.m_i = parseFloat($("#var_m_i").val()); // magnetic quantum number initial
		localStorage.setItem("var_m_i",$("#var_m_i").val());
	
		// json_inputdata.m_f = parseFloat($("#var_m_f").val());
		// localStorage.setItem("var_m_f",$("#var_m_f").val());

		json_inputdata.quant_def_i = parseFloat($("#var_mu_i").val()); // quant_def_initial
		localStorage.setItem("var_mu_i",$("#var_mu_i").val());

		json_inputdata.quant_def_f = parseFloat($("#var_mu_f").val()); // quant_def_final
		localStorage.setItem("var_mu_f",$("#var_mu_f").val());

		json_inputdata.N_E= parseInt($("#var_N_E").val());
		localStorage.setItem("var_N_E",$("#var_N_E").val());
		
		json_inputdata.npoints = parseInt($("#var_npoints_ph").val());
		localStorage.setItem("var_npoints_ph",$("#var_npoints_ph").val());
		
		json_inputdata.r_min = parseFloat($("#var_r_min_ph").val());
		localStorage.setItem("var_r_min_ph",$("#var_r_min_ph").val());
		
		json_inputdata.r_max = parseFloat($("#var_r_max_ph").val());
		localStorage.setItem("var_r_max_ph",$("#var_r_max_ph").val());

		Atom_Type = parseInt($("#var_Atom_Type").val());
		localStorage.setItem("var_Atom_Type",$("#var_Atom_Type").val());
	
		StateI = parseInt($("#var_Initial_State_atom").val());
		localStorage.setItem("var_Initial_State_atom",$("#var_Initial_State_atom").val());

		StateF = parseInt($("#var_Final_State_atom").val());
		localStorage.setItem("var_Final_State_atom",$("#var_Final_State_atom").val());

		// StateF = parseInt($("#var_Final_State_atom").val());
		localStorage.setItem("var_nameInput",$("#var_nameInput").val());

console.log("SUp1A", Atom_Type)
console.log("SI", StateI)
console.log("SF", StateF)

// 		var li = $("#var_l_partial_i_ph").val();
// 		var lf = $("#var_l_partial_f_ph").val();
// 		if(Math.abs(lf - li) != 1){
// 			alert("Attention, the selection rule! Please check input!");
// 			return;
// }

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
		success: function (response) {data_treat(response,type);},
	
		complete: function () {

			}
		});
	};
	
function data_locsave(response){

	try {localStorage.setItem('jsondata', JSON.stringify(response))}
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
			}
		}	
		updateFigs();
		update_E()
	}

$(document).ready(function () {

	$('#Form1').submit(function(){
		if ( $("#defaultdata1").data('clicked')==true ){
			ServerUpdate(0, 1);
			$("#defaultdata1").data('clicked','false');
			ServerUpdate(2, 1);
		}
		else{
			ServerUpdate(2, 1);
		}
		return false;
	});
		

	$('#Form2').submit(function(){
		updateFigs();
		return false;
	});
		

	$('#Form3').submit(function(){
		if ( $("#defaultdata2").data('clicked')==true ){
			ServerUpdate(0, 2);
			$("#defaultdata2").data('clicked','false');
			ServerUpdate(2, 2); 
		}
		else{
			ServerUpdate(2, 2); 
			plotFig2('resultFig2');
		}
		return false;
	});

	$('#Form4').submit(function(){
		updateFigs();
		return false;
	});
		
	$('#Form5').submit(function(){
		if ( $("#defaultdata3").data('clicked')==true ){
			ServerUpdate(0, 3);
			$("#defaultdata3").data('clicked','false');
			ServerUpdate(2, 3);
		}
		else{
			update_E();
			ServerUpdate(2, 3);
			plotFig3('resultFig3');
		}
		return false;
	});
});

// $(document).ready(function() {
	function update_E() {
		var mu_i = parseFloat($('#var_mu_i').val());
		var mu_f = parseFloat($('#var_mu_f').val());
		var n_i = parseInt($('#var_n_i').val());

		// var E = - (1 * 27.2113)/((n_i - mu_i)**2)/2
		var E_i = - (1 )/((n_i - mu_i)**2)/2
		var E_f = - (1 )/((n_i - mu_f)**2)/2

		$("#span_E_i").text(' = ' + E_i.toFixed(5))
		$("#span_E_f").text(' = ' + E_f.toFixed(5))

	}

// 	// Add event listeners to the input fields to update the values on change
// 	$('#var_mu_i, #var_mu_f').on('input', calculateEnergy);

// 	// Calculate initial values
// 	update_E();
// });


function updateFigs() {
	try{
		plotFig1('resultFig1');
		plotFig2('resultFig2');		
		plotFig3('resultFig3');
		plotFig4('resultFig4');
		plotFig5('resultFig5_log');
		plotFig6('resultFig5');


	} catch (error) {
		console.error("An error occurred: " + error.message);
	}
}

// function showButtom(clctp){

// 	if (jsondata == undefined) {
// 		// jsondata does not exist, hide the block
// 		$('#Fig1').hide();
// 		$('#Fig2').hide();
// 		$('#Fig3').hide();
// 	} else {
// 		if (clctp == 1){
// 		// jsondata exists, show the block
// 			$('#Fig1').show();
// 			updateFigs('resultFig1');
// 		}
// 		if (clctp == 2){
// 		// jsondata exists, show the block
// 			$('#Fig2').show();
// 			updateFigs('resultFig2');
// 		}
// 		if (clctp == 3){
// 		// jsondata exists, show the block
// 			$('#Fig3').show();
// 			updateFigs('resultFig3');
// 		}
// 	}
// 	return false;
// }

function SetTypeAtom() {
	var Atom_Type0 = parseInt($("#var_Atom_Type").val());
	if (Atom_Type0 != null) Atom_Type = Atom_Type0;

	// Hide all
	$("#Your_atom, #SelectedAtom, #SelectedAtom1").hide();

	// Show the div corresponding to the selected atom
	if (Atom_Type == 0 || Atom_Type == 1 ) {
		$("#SelectedAtom").show();
		$("#var_Initial_State_atom").val(0);
		$("#var_Final_State_atom").val(0);
		SetInitialState()

	} else {
		$("#Your_atom").show();

	}

}

function SetInitialState() {

	var StateI0 = parseInt($("#var_Initial_State_atom").val());
	var StateF0 = parseInt($("#var_Final_State_atom").val());
	var Atom_Type0 = parseInt($("#var_Atom_Type").val());

	if (StateI0 != null) StateI = StateI0;
	if (StateF0 != null) StateF = StateF0;
	if (Atom_Type0 != null) Atom_Type = Atom_Type0;

	// insert new data for input
	switch (Atom_Type) {
		case 0:
			if(StateI == 0){ //Na P
				$("#var_n_i").val(3);
				$("#var_l_partial_i_ph").val(1);
				$("#var_m_i").val(0);
				$("#var_mu_i").val(0.8);

				if(StateF == 0){ 
					$("#var_l_partial_f_ph").val(2); //d
					$("#var_mu_f").val(0.0148972);
				}else{
					$("#var_l_partial_f_ph").val(1); //P
					$("#var_mu_f").val(0.8833);
				}
			}
			if(StateI == 1){ //Na S
				$("#var_n_i").val(3);
				$("#var_l_partial_i_ph").val(0); 
				$("#var_m_i").val(0);
				$("#var_mu_i").val(1.3479);

				if(StateF == 0){
					$("#var_l_partial_f_ph").val(2); //D
					$("#var_mu_f").val(0.0148972);
				}else{
					$("#var_l_partial_f_ph").val(1); //P
					$("#var_mu_f").val(0.8833);
				}
			}
			break;
		case 1:
			if(StateI == 0){ //Rb P
				$("#var_n_i").val(5);
				$("#var_l_partial_i_ph").val(1);
				$("#var_m_i").val(0);
				$("#var_mu_i").val(2.654884);

				if(StateF == 0){ 
					$("#var_l_partial_f_ph").val(2); //D
					$("#var_mu_f").val(1.34809171);
				}else{
					$("#var_l_partial_f_ph").val(1); //P
					$("#var_mu_f").val(2.654884);
				}
			}
			if(StateI == 1){ //Rb S
				$("#var_n_i").val(5);
				$("#var_l_partial_i_ph").val(0); 
				$("#var_m_i").val(0);
				$("#var_mu_i").val(3.131180);

				if(StateF == 0){
					$("#var_l_partial_f_ph").val(2); //D
					$("#var_mu_f").val(1.34809171);
				}else{
					$("#var_l_partial_f_ph").val(1); //P
					$("#var_mu_f").val(2.654884);
				}
			}

			break;
	}
	// var li = $("#var_l_partial_i_ph").val();
	// var lf = $("#var_l_partial_f_ph").val();
	// if(Math.abs(lf - li) > 1){
	// 	alert("$\\text{ Attention! The selection rule} \\Delta l = \\pm 1. \\text{Please check input!}$");
	// 	return;
	// }

}
