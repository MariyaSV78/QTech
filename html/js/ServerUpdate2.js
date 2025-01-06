
/*
(exercises in quantum mechanics)
functions for AJAX request and resulting data treatment

Authors:    A.Korovin [a.v.korovin73@gmail.com] 25/05/2019-30/04/2020;
            M. Sosnova [mariya.v.sosnova@gmail.com] 15/06/2023-15/07/2024;
*/
	
	
function ServerUpdate(type, clctp) {
	console.log("type", type)
	console.log("clctp", clctp)
	// showButtom()
	if (type==-1){
		
		$("#var_npoints_r").val(localStorage.getItem("var_npoints_r"));
		$("#var_r_min").val(localStorage.getItem("var_r_min"));
		$("#var_r_max").val(localStorage.getItem("var_r_max"));

		$("#var_mass_1").val(localStorage.getItem("var_mass_1"));
		$("#var_mass_2").val(localStorage.getItem("var_mass_2"));

		$("#var_j_to_print").val(localStorage.getItem("var_j_to_print"));
		$("#var_v_max").val(localStorage.getItem("var_v_max"));
		
		$("#var_j_max").val(localStorage.getItem("var_j_max"));

		$("#var_m").val(localStorage.getItem("var_m"));
		$("#var_m_p").val(localStorage.getItem("var_m_p"));
		
		$("#var_T").val(localStorage.getItem("var_T"));
		$("#var_v_p").val(localStorage.getItem("var_v_p"));
		$("#var_v").val(localStorage.getItem("var_v"));


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
	
	json_inputdata.calctype = 2;

	json_inputdata.npoints_r = parseInt($("#var_npoints_r").val());
	localStorage.setItem("var_npoints_r",$("#var_npoints_r").val());
	
	json_inputdata.r_min = parseFloat($("#var_r_min").val());
	localStorage.setItem("var_r_min",$("#var_r_min").val());
	
	json_inputdata.r_max = parseFloat($("#var_r_max").val());
	localStorage.setItem("var_r_max",$("#var_r_max").val());

	json_inputdata.mass_1 = parseFloat($("#var_mass_1").val());
	localStorage.setItem("var_mass_1",$("#var_mass_1").val());
	
	json_inputdata.mass_2 = parseFloat($("#var_mass_2").val());
	localStorage.setItem("var_mass_2",$("#var_mass_2").val());	
	
	json_inputdata.j_to_print = parseInt($("#var_j_to_print").val());
	localStorage.setItem("var_j_to_print",$("#var_j_to_print").val());

	json_inputdata.v_max = parseInt($("#var_v_max").val());
	localStorage.setItem("var_v_max",$("#var_v_max").val());
	
	json_inputdata.j_max = parseInt($("#var_j_max").val());
	localStorage.setItem("var_j_max",$("#var_j_max").val());

	//only for 4 part
	json_inputdata.m = parseInt($("#var_m").val()); 
	localStorage.setItem("var_m",$("#var_m").val());
	
	json_inputdata.m_p = parseInt($("#var_m_p").val());
	localStorage.setItem("var_m_p",$("#var_m_p").val());

	//only for 4 part
	json_inputdata.m_p = parseInt($("#var_T").val());
	localStorage.setItem("var_T",$("#var_T").val());

	json_inputdata.m_p = parseInt($("#var_v_p").val());
	localStorage.setItem("var_v_p",$("#var_v_p").val());

	json_inputdata.m_p = parseInt($("#var_v").val());
	localStorage.setItem("var_v",$("#var_v").val());


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
	try {localStorage.setItem('jsondata', JSON.stringify(response))
	console.log('save')		
		}
	catch (e) {
		// clear local Storage$("#var_v_max").val(localStorage.getItem("var_v_max"));
		
		// $("#var_j_max").val(localStorage.getItem("var_j_max"));

		// $("#var_m").val(localStorage.getItem("var_m"));
		// $("#var_m_p").val(localStorage.getItem("var_m_p"));
		
		// $("#var_T").val(localStorage.getItem("var_T"));
		// $("#var_v_p").val(localStorage.getItem("var_v_p"));
		// $("#var_v").val(localStorage.getItem("var_v"));


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
						case 0:sessionID = jsondata.sessionID;
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
	Add_Eigenvalues_selection();
	updateFigs();
}

$(document).ready(function () {

	$('#Form1').submit(function(){
		if ( $("#defaultdata1").data('clicked')==true ){
			ServerUpdate(0, 1);
			ServerUpdate(2, 1);
			$("#defaultdata1").data('clicked','false');
		}
		else if($("#updatedata").data('clicked')==true){
			Add_Eigenvalues_selection();
			updateFigs();
			$("#updatedata").data('clicked','false');
		}
		else if($("#updatedata1").data('clicked')==true){
			Add_Eigenvalues_selection();
			updateFigs();
			$("#updatedata1").data('clicked','false');
		}
		else{
			ServerUpdate(2, 1);
		}
		return false;
	});
		

	$('#Form2').submit(function(){
		plotFig1('resultFig1');
		return false;
	});		

	$('#Form3').submit(function(){
		plotFig2('resultFig2');
		return false;
	});

	$('#Form4').submit(function(){
		if ( $("#defaultdata4").data('clicked')==true ){
			ServerUpdate(0, 2);
			$("#defaultdata4").data('clicked','false');
		}
		plotFig4_SR2('resultFig4_SR2');
console.log("m=",parseInt($("#var_m").val()))
		return false;
	});

	$('#Form5').submit(function(){
		if ( $("#defaultdata5").data('clicked')==true ){
			ServerUpdate(0, 3);
			$("#defaultdata5").data('clicked','false');
		}
		plotFig5('resultFig5_1');
		plotFig5('resultFig5_2');		
		return false;
	});

});


//tables for "observable" part 5
function print_table(Table){
	try{
		if(jsondata.E==null){
			return;}

		let v = 0; 
		let j = parseInt($("#var_j_max").val());
		let E = jsondata.E;
		var str = '';
		str += '<table border="1" align="center" frame="box" width="50\%">';
		str += '<tr style="border-bottom: double;">';

		if (Table == 'table_1') {
			var table = document.getElementById('table_1');

			str += String.raw`<td>$$j$$</td><td>$$j_p$$</td><td>$$E_{[v+1,j_p]}-E_{[v,j]}, (cm^{-1})$$</td>`;
			str += '</tr>';
		
			for(i=0;i<j-1;i++){
				str += '<tr>';
				str += '<td>'+i+'</td> <td>'+(i+1)+'</td> <td>'+(E[i+1][v+1]- E[i][v]).toPrecision(7)+'</td>';
				str += '</tr>';
			}
		}

		if (Table == 'table_2') {
			var table = document.getElementById('table_2');
	
			str += String.raw`<td>$$j_p$$</td><td>$$j$$</td><td>$$E_{[v+1,j_p]}-E_{[v,j]}, (cm^{-1})$$</td>`;
			str += '</tr>';

			for(i=0;i<j-1;i++){
				str += '<tr>';
				str += '<td>'+i+'</td> <td>'+(i+1)+'</td> <td>'+(E[i][v+1]- E[i+1][v]).toPrecision(7)+'</td>';
				str += '</tr>';
			}
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
		// showButtom()
		plotFig1('resultFig1');
		plotFig2('resultFig2');		
		plotFig3_RC('resultFig3_RC');
		plotFig3_ES('resultFig3_ES');
		plotFig3_3('resultFig3_3');
		plotFig3_4('resultFig3_4');
		print_table('table_1');
		print_table('table_2');
		plotFig4_DM('resultFig4_DM');
		plotFig4_SR('resultFig4_SR');
		plotFig4_SR2('resultFig4_SR2');
		plotFig5('resultFig5_1');
		plotFig5('resultFig5_2');
		// plotFig5('resultFig5_3');
	} catch (error) {
		console.error("An error occurred: " + error.message);
	}
}

function showButtom(){

	if (jsondata == undefined) {
		// jsondata does not exist, hide the block
		$('#Fig1').hide();
		$('#Fig2').hide();
		$('#Tab1').hide();
		$('#Tab2').hide();
		$('#Fig4').hide();
		$('#Fig5').hide();
	} else {
		$('#Fig1').show();
		$('#Fig2').show();
		$('#Tab1').show();
		$('#Tab2').show();
		$('#Fig4').show();
		$('#Fig5').show();
	}
	return false;
}