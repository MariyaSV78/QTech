
/*
(exercises in quantum mechanics)
functions for AJAX request and resulting data treatment

Author: Alexander V. Korovin [a.v.korovin73@gmail.com]
25/05/2019-30/04/2020
*/
	
	
function ServerUpdate(type) {

	if (type==-1){
		
		// $("#var_Type").val(localStorage.getItem("var_Type"));
		$("#var_Pot_Type").val(localStorage.getItem("var_Pot_Type"));
		$("#var_Nx").val(localStorage.getItem("var_Nx"));
		$("#var_Ny").val(localStorage.getItem("var_Ny"));
		$("#var_x0").val(localStorage.getItem("var_x0"));
		$("#var_xL").val(localStorage.getItem("var_xL"));
		$("#var_y0").val(localStorage.getItem("var_y0"));
		$("#var_yL").val(localStorage.getItem("var_yL"));
		$("#var_slit_d").val(localStorage.getItem("var_slit_d"));
		$("#var_slit_ls").val(localStorage.getItem("var_slit_ls"));
		$("#var_slit_ly").val(localStorage.getItem("var_slit_ly"));
		$("#var_slit_n").val(localStorage.getItem("var_slit_n"));
		$("#var_V0").val(localStorage.getItem("var_V0"));
		$("#var_mu").val(localStorage.getItem("var_mu"));
		$("#var_xc_WP").val(localStorage.getItem("var_xc_WP"));
		$("#var_yc_WP").val(localStorage.getItem("var_yc_WP"));
		$("#var_a0x").val(localStorage.getItem("var_a0x"));
		$("#var_a0y").val(localStorage.getItem("var_a0y"));
		$("#var_k0x").val(localStorage.getItem("var_k0x"));
		$("#var_k0y").val(localStorage.getItem("var_k0y"));
		$("#var_Nkx").val(localStorage.getItem("var_Nkx"));
		$("#var_Nky").val(localStorage.getItem("var_Nky"));
		$("#var_Nt").val(localStorage.getItem("var_Nt"));
		$("#var_dt").val(localStorage.getItem("var_dt"));
		$("#var_Nc_max").val(localStorage.getItem("var_Nc_max"));
		$("#var_amin").val(localStorage.getItem("var_amin"));
		$("#var_epsilon").val(localStorage.getItem("var_epsilon"));
		$("#var_x_screen").val(localStorage.getItem("var_x_screen"));	
		
		$("#var_y_axis").val(localStorage.getItem("var_y_axis"));
		$("#var_x_axis").val(localStorage.getItem("var_x_axis"));
	
		Neig		= parseInt($("#var_Neig").val());
		Pot_Type	= parseInt($("#var_Pot_Type").val());
	
			data_treat(JSON.parse(localStorage.getItem('jsondata')),type);
			return;
		}
			
	
		if (type==0){
			SetDefault();
		}
			
	
		if(!checkInput()){
			alert("Cannot calculate. Input is incorrect. Please check input!");
			return;
		}
			
	
		if (type<=2){
			type = 2;
			jsondata = [];
		}
				
		Neig		= parseInt($("#var_Neig").val());
		Pot_Type	= parseInt($("#var_Pot_Type").val());
		json_inputdata = {};
		json_inputdata.calctype=8;
		// json_inputdata.Type = parseInt($("#var_Type").val());
		// localStorage.setItem("var_Type",$("#var_Type").val());
		json_inputdata.Pot_Type = parseInt($("#var_Pot_Type").val());
		localStorage.setItem("var_Pot_Type",$("#var_Pot_Type").val());
		json_inputdata.Nx = parseInt($("#var_Nx").val());
		localStorage.setItem("var_Nx",$("#var_Nx").val());
		json_inputdata.Ny = parseInt($("#var_Ny").val());
		localStorage.setItem("var_Ny",$("#var_Ny").val());
		json_inputdata.x0 = parseFloat($("#var_x0").val());
		localStorage.setItem("var_x0",$("#var_x0").val());
		json_inputdata.xL = parseFloat($("#var_xL").val());
		localStorage.setItem("var_xL",$("#var_xL").val());
		json_inputdata.y0 = parseFloat($("#var_y0").val());
		localStorage.setItem("var_y0",$("#var_y0").val());
		json_inputdata.yL = parseFloat($("#var_yL").val());
		localStorage.setItem("var_yL",$("#var_yL").val());
		json_inputdata.slit_d = parseFloat($("#var_slit_d").val());
		localStorage.setItem("var_slit_d",$("#var_slit_d").val());
		json_inputdata.slit_ls = parseFloat($("#var_slit_ls").val());
		localStorage.setItem("var_slit_ls",$("#var_slit_ls").val());
		json_inputdata.slit_ly = parseFloat($("#var_slit_ly").val());
		localStorage.setItem("var_slit_ly",$("#var_slit_ly").val());
		json_inputdata.slit_nslits = parseInt($("#var_slit_n").val());
		localStorage.setItem("var_slit_n",$("#var_slit_n").val());
		json_inputdata.V0 = parseFloat($("#var_V0").val());
		localStorage.setItem("var_V0",$("#var_V0").val());
		json_inputdata.mu = parseFloat($("#var_mu").val());
		localStorage.setItem("var_mu",$("#var_mu").val());
		json_inputdata.xc_WP = parseFloat($("#var_xc_WP").val());
		localStorage.setItem("var_xc_WP",$("#var_xc_WP").val());
		json_inputdata.yc_WP = parseFloat($("#var_yc_WP").val());
		localStorage.setItem("var_yc_WP",$("#var_yc_WP").val());
		json_inputdata.a0x = parseFloat($("#var_a0x").val());
		localStorage.setItem("var_a0x",$("#var_a0x").val());
		json_inputdata.a0y = parseFloat($("#var_a0y").val());
		localStorage.setItem("var_a0y",$("#var_a0y").val());
		json_inputdata.k0x = parseFloat($("#var_k0x").val());
		localStorage.setItem("var_k0x",$("#var_k0x").val());
		json_inputdata.k0y = parseFloat($("#var_k0y").val());
		localStorage.setItem("var_k0y",$("#var_k0y").val());
		json_inputdata.Nkx = parseInt($("#var_Nkx").val());
		localStorage.setItem("var_Nkx",$("#var_Nkx").val());
		json_inputdata.Nky = parseInt($("#var_Nky").val());
		localStorage.setItem("var_Nky",$("#var_Nky").val());
		json_inputdata.Nt = parseInt($("#var_Nt").val());
		localStorage.setItem("var_Nt",$("#var_Nt").val());
		json_inputdata.delta_t = parseFloat($("#var_dt").val());
		localStorage.setItem("var_dt",$("#var_dt").val());
		json_inputdata.Nc_max = parseInt($("#var_Nc_max").val());
		localStorage.setItem("var_Nc_max",$("#var_Nc_max").val());
		json_inputdata.amin = parseFloat($("#var_amin").val());
		localStorage.setItem("var_amin",$("#var_amin").val());
		json_inputdata.epsilon = parseFloat($("#var_epsilon").val());
		localStorage.setItem("var_epsilon",$("#var_epsilon").val());
	
		json_inputdata.x_screen = parseFloat($("#var_x_screen").val());
		localStorage.setItem("var_x_screen",$("#var_x_screen").val());	
		
		json_inputdata.y_axis = parseFloat($("#var_y_axis").val());
		localStorage.setItem("var_y_axis",$("#var_y_axis").val());
		
		json_inputdata.Temporal = type;
	
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
	//			fontWeight:			200,
				margin: 'auto', // Center horizontally
				top: '50%', // Center vertically
				left: '50%', // Center horizontally
				transform: 'translate(-50%, -50%)', // Center vertically and horizontally
	
				// margin:				'0 auto',
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
		 
	}}
	
	function data_treat(response,type){
		jsondata_tmp = response;
		if (jsondata==null || type<2)
	
			{
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
		
	
		var txt_Nc	= document.getElementById('txt_Nc_current');
		if (jsondata.Nc!=null){
			txt_Nc.innerHTML= ' (for current simulations: '+String.raw`\(N_c=\)`+ jsondata.Nc+')'
				MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
		}else{
			txt_Nc.innerHTML= '';
		}
	
	
		if (type==3 || type==5){
			var txt_tmax	= document.getElementById('txt_tmax');
			txt_tmax.innerHTML= ' ('+String.raw`\(t_{max}<\)`+ jsondata.time.length*parseFloat($("#var_dt").val())+')'
					MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
		}
		if (type==5){
			$("#typ_saveVideo").attr("hidden", false);
		}else{
			$("#typ_saveVideo").attr("hidden", true);
		}
		
		updateFigs();
	}
	
	$(document).ready(function () {
	
		$('#Form1').submit(function(){
			if ( $("#defaultdata").data('clicked')==true ){
				ServerUpdate(0);
				$("#defaultdata").data('clicked','false');
			}else{
				// Perform the condition check for "Update profile"
				var n_slits = parseFloat($("#var_slit_n").val());
				var slit_ls = parseFloat($("#var_slit_ls").val());
				var slit_ly = parseFloat($("#var_slit_ly").val());
				var yL = parseFloat($("#var_yL").val());
				var y0 = parseFloat($("#var_y0").val());
				var condition = n_slits * slit_ls + (n_slits - 1 + 2) * slit_ly >= (yL - y0);
				if (!condition) {
					// Condition is met, submit the form with ServerUpdate(2)
					ServerUpdate(2);
				} else {
					// Condition is not met, display an alert
					if (lang == 0){
						alert("Number of slits too large for the current grid!!!")
					}else{
						alert("Nombre de fentes trop grand pour la grille actuelle !!!")
					}
					$("#alert").show();
				}
			}
				return false;
		});
			
	
		$('#Form2').submit(function(){
			if(Neig!=parseInt($("#var_Neig").val()))
				Add_Eigenvalues_selection();
			updateFigs();
			return false;
		});	
	
		$('#Form3').submit(function(){
			updateFigs();
			return false;
		});
				
		$('#Form4').submit(function(){
	
			if ( $("#submitdata2recal").data('clicked')==true ){
				ServerUpdate(2);
				$("#submitdata2recal").data('clicked','false');
			}else{
				if (jsondata.psi==null){
					if (lang == 0){
						alert("To save the data, please UPDATE the FIGURE!!!")
					}else{
						alert("Pour enregistrer les données, s'il vous plaît, METTEZ À JOUR LA FIGURE!!!")
					}
					$("#alert").show();
				}
				
			}
				return false;
		});
	
		$('#Form5').submit(function(){
	
			if ( $("#simulations_video").data('clicked')==true ){
				ServerUpdate(5);
				$("#simulations_video").data('clicked','false');
			}
			else{
				ServerUpdate(3);
			}
			return false;
		});
			
	});
	
	function updateFigs() {
		plotFig1('resultFig1');
		plotFig4('resultFig4a');
		plotFig4c('resultFig4c');
		plotFig5('resultFig5');
		plotFig_ex8('resultFig_ex8');
		// plotFig3('resultFig3');
	}
	
	function change_tmax(){
		return;
	
		var txt_tmax	= document.getElementById('txt_tmax');
		txt_tmax.innerHTML= ' ('+String.raw`\(t_{max}<\)`+ parseInt($("#var_Nt").val())*parseFloat($("#var_dt").val())+')'
				MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
	}
	
	function SetFFT() {
	
		var isChecked = document.getElementById("var_isFourrier").checked;	
		if (isChecked){
			$("#not_isFourrier1").hide();
			$("#not_isFourrier2").hide();
			
		}else{
			$("#not_isFourrier1").show();
			$("#not_isFourrier2").show();
		}
		plotFig5('resultFig5');
	
	}

