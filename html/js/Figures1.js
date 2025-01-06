/*
(exercises in quantum mechanics)
Visualisation of calculated data from the server calculations using plotly

Authors:    A.Korovin [a.v.korovin73@gmail.com] 25/05/2019-30/04/2020;
            M. Sosnova [mariya.v.sosnova@gmail.com] 15/06/2023-15/07/2024;
*/

var config={responsive: true,
			scrollZoom: true,
			};

//Whittaker functions for E
function plotFig1(resultFig) {
	try{
		Plotly.purge(resultFig);
		if (jsondata.r_i == null) return;

		var trace = [];
		var x = jsondata.r_i;
		var y1 = jsondata.y1;
		var y2 = jsondata.y2;

		if ($("#var_isWhitm").prop('checked'))
			trace.push( {
				x:		x,
				y:		y1,
				mode: 'lines',
				type:	'scatter',
				name:	'regular at large distances',
				line: {
					color: 'rgb(231, 99, 250)',
					width: 2
				},
		});
		if ($("#var_isWhitw").prop('checked'))
			trace.push( {
				x:		x,
				y:		y2,
				mode: 'lines',
				type:	'scatter',
				name:	'diverges at large distances',
				line: {
					color: 'rgb(0, 231, 99)',
					width: 2
				},		
		});			

		var xmin = x.min();
		var xmax = x.max();
		var dx = 0.05*(xmax-xmin);

		var vmin = [y1.min(), y2.min()].min();
		var vmax = [y1.max(), y2.max()].max();
		var dv = (vmax-vmin)*0.2;

		switch (lang){
			case 0:
				titles="Whittaker functions";
				xlabel = "$r \\text{(a.u)}$";
				ylabel = "Energy (a.u.)";
				break;
			case 1:
				titles="Fonctions de Whittaker";
				xlabel = "$r \\text{(a.u)}$";
				ylabel = "L'énergie (a.u.)";
				break;
		}

		var layout = {
			template:	layout_template,
			title:		titles,
			legend: {
				x:0.6, y: 1.1},
			xaxis: {
				title: xlabel, range: [xmin - dx, xmax + dx]},
			yaxis: {
				title: ylabel,
				range: [vmin - dv, vmax + dv]},
		};

		Plotly.newPlot(resultFig, {data:trace, layout:layout, config:config});
	} catch (error) {
		console.error("An error occurred: " + error.message);
	}	
}

// Coulumb functions
function plotFig2(resultFig) {
	try{
		Plotly.purge(resultFig);

  		if (jsondata.r_f == null) return;
		var trace = [];
		var x = jsondata.r_f;
		var y1 = jsondata.chi_f1;
		var y2 = jsondata.chi_f2;

		if ($("#var_coulomb_F").prop('checked'))
			trace.push( {
				x:		x,
				y:		y1,
				mode: 'lines',
				type: 'scatter',
				name: 'Coulomb wave function F',
				line: {
					color: 'rgb(231, 99, 250)',
					width: 2
				},
			});
		if ($("#var_coulomb_G").prop('checked'))
			trace.push( {
				x:		x,
				y:		y2,
				mode: 'lines',
				type:	'scatter',
				name:	'Coulomb wave function G',
				line: {
					color: 'rgb(0, 231, 99)',
					width: 2
				},
				
			});			

		switch (lang){
			case 0:
				titles="Coulomb wave functions";
				xlabel = "$r \\text{(a.u)}$";
				ylabel =  "$\\chi_f$";//"&#x1D712_<sub>f</sub>";
				break;
			case 1:
				titles="Fonction d'onde coulombienne";
				xlabel = "$r (a.u.)$";
				ylabel = "$\x1D712_f$";
				break;
		}

		var xmin = x.min();
		var xmax = x.max();
		var dx = 0.05*(xmax-xmin);

		var vmin = [y1.min(), y2.min()].min();
		var vmax = y1.max();
		var dv = (vmax-vmin)*0.5;

		var layout = {
			template:	layout_template,
			title:		titles,
			legend: {
				x:0.65, y: 1.1},

			xaxis: {title: xlabel, range: [xmin - dx, xmax + dx]},
			yaxis: {title: ylabel, range: [vmin - dv, vmax + dv],},
		};
	
	Plotly.newPlot(resultFig, {data:trace, layout:layout, config:config});
	} catch (error) {
		console.error("An error occurred: " + error.message);
	}	
}

//Initial state chi_i(r_ph)
function plotFig3(resultFig) {
	try{
		Plotly.purge(resultFig);
		if (jsondata.energy_f == null) return;
		var trace = [];
		var x = jsondata.r_ph;
		var y = jsondata.chi_i;
	
		trace.push( {
			x:		x,
			y:		y,
			mode: 'lines',
			type: 'scatter',
			name: 'Whittaker function regular at infinity',
			line: {
				color: 'red',//'rgb(231, 99, 250)',
				width: 2
			},
		});

		switch (lang){
			case 0:
				titles="$\\text{Initial state} \\chi_i(r)$";
				xlabel = "$r \\text{(a.u.)}$";
				ylabel = "$\\chi_i$" ;
				break;
			case 1:
				titles="$\\text{État initial} \\chi_i(r)$";
				xlabel = "$r \\text{(a.u.)}$";
				ylabel = "$\\chi_i$";
				break;

			}
		var xmin = x.min();
		var xmax = x.max();
		var dx = 0.05*(xmax-xmin);

		var vmin = y.min();
		var vmax = y.max();
		var dv = (vmax-vmin)*0.2;

		var layout = {
			template:	layout_template,
			title:		titles,
			// showlegend: true,
			legend: {
				x:0.65, y: 1.1},
			xaxis: {title: xlabel, range: [xmin-dx, xmax+dx], showline: true, zeroline: true, ticks: 'outside',},
			yaxis: {title: ylabel, range: [vmin - dv, vmax + dv], showline: false, zeroline: false, ticks: 'outside'},
		};

		Plotly.newPlot(resultFig, {data:trace, layout:layout, config:config});

	} catch (error) {
		console.error("An error occurred: " + error.message);
	}
}

//Final state chi_f(r_ph)
function plotFig4(resultFig) {
	try{
		Plotly.purge(resultFig);
		if (jsondata.energy_f == null) return;
		var trace = [];
		var x = jsondata.r_ph;
		var y = jsondata.chi_f;
	
		trace.push( {
			x:		x,
			y:		y,
			mode: 'lines',
			type:	'scatter',
			name:	'continuum Coulomb function',
			line: {
				color: 'green',//'rgb(231, 99, 250)',
				width: 2
			},
		});

		switch (lang){
			case 0:
				titles="$\\text{Final state } \\chi_f(r)$";
				xlabel = "$r \\text{(a.u.)}$";
				ylabel = "$\\chi_f$" ;
				break;
			case 1:
				titles="$\\text{Final initial } \\chi_f(r)$";
				xlabel = "$r \\text{(a.u.)}$";
				ylabel = "$\\chi_f$";
				break;

			}
		var xmin = x.min();
		var xmax = x.max();
		var dx = 0.05*(xmax-xmin);

		var vmin = y.min();
		var vmax = y.max();
		var dv = (vmax-vmin)*0.2;

		var layout = {
			template:	layout_template,
			title:		titles,
			// showlegend: true,
			legend: {
				x:0.65, y:1.1},
			xaxis: {title: xlabel, range: [xmin-dx, xmax+dx], showline: true, zeroline: true, ticks: 'outside',},
			yaxis: {title: ylabel, range: [vmin - dv, vmax + dv], showline: false, zeroline: false, ticks: 'outside'},
		};

		Plotly.newPlot(resultFig, {data:trace, layout:layout, config:config});

	} catch (error) {
		console.error("An error occurred: " + error.message);
	}
}

//Photoionization cross section

function plotFig5(resultFig) {
	try{
		Plotly.purge(resultFig);

		if (jsondata.r_i == null) return;

		var Atom_Type = parseInt($("#var_Atom_Type").val());
		// var StateI = parseInt($("#var_Initial_State_atom").val());
		var atom;
		switch (Atom_Type) {
			case 0:
				atom = 'Na';
				break;
			case 1:
				atom = 'Rb';
				break;
			case 2:
				atom =  $("#var_nameInput").val();
				console.log("var_nameInput", atom)
				break;
			default:
				break;
		} 
		// var state;
		// switch (StateI) {
		// 	case 0:
		// 		state = '3P';
		// 		break;
		// 	case 1:
		// 		state = '3S';
		// 		break;
		// 	} 

		var trace = [];
		var e_f = jsondata.energy_f;
		var cs1 = jsondata.cross_section;
		var cs2 = jsondata.cross_section2;

		// if ($("#var_isWhitm").prop('checked'))
			trace.push( {
				x:		e_f,
				y:		cs1,
				mode: 'lines',
				type:	'scatter',
				name:	'unpolarized',
				line: {
					color: 'rgb(231, 99, 250)',
					width: 2
				},
		});
		// if ($("#var_isWhitw").prop('checked'))
			trace.push( {
				x:		e_f,
				y:		cs2,
				mode: 'lines',
				type:	'scatter',
				name:	'polarized',
				line: {
					color: 'rgb(0, 231, 99)',
					width: 2
				},		
		});			

		var xmin = e_f.min();
		var xmax = e_f.max();
		var dx = 0.05*(xmax-xmin);

		var vmin = [cs1.min(), cs2.min()].min();
		var vmax = [cs1.max(), cs2.max()].max();
		var dv = (vmax-vmin)*0.2;

		switch (lang){
			case 0:
				titles= `$\\text{Photoionization cross section for ${atom}}$`;
				xlabel = "Photon energy (eV)";
				ylabel = "$ \\text{Photoionization cross section (cm}^2{)}$";
				break;
			case 1:
				titles=`$\\textProfil d'énergie potentielle pour ${atom}$`;
				xlabel="Énergie photonique (eV)";
				ylabel="$ \\text{Section efficace de photoionisation (cm}^2{)}$";
				break;
		
			}

		var layout = {
			template:	layout_template,
			title:		titles,
			legend: {
				x:0.6, y: 1.1},
			xaxis: {
				title: xlabel,
				// range: [xmin - dx, xmax + dx]
				showline: true, 
				zeroline: true, 
				ticks: 'outside',
			},
			yaxis: {
                type: 'log',
				title: {
					text: ylabel,
					standoff: 20,
					xanchor: 'center',
					yanchor: 'middle'
				},
				automargin: true,
				// range: [vmin - dv, vmax + dv]
				showline: true, 
				zeroline: true, 
				ticks: 'outside',

			},
		};

		Plotly.newPlot(resultFig, {data:trace, layout:layout, config:config});
	} catch (error) {
		console.error("An error occurred: " + error.message);
	}	
}

function plotFig6(resultFig) {
	try{
		Plotly.purge(resultFig);

		if (jsondata.r_i == null) return;

		var Atom_Type = parseInt($("#var_Atom_Type").val());
		// var StateI = parseInt($("#var_Initial_State_atom").val());
		var atom;
		switch (Atom_Type) {
			case 0:
				atom = 'Na';
				break;
			case 1:
				atom = 'Rb';
				break;
			case 2:
				atom =  $("#var_nameInput").val();
				console.log("var_nameInput", atom)
				break;
			default:
				break;
		} 
		// var state;
		// switch (StateI) {
		// 	case 0:
		// 		state = '3P';
		// 		break;
		// 	case 1:
		// 		state = '3S';
		// 		break;
		// 	} 

		var trace = [];
		var e_f = jsondata.energy_f;
		var cs1 = jsondata.cross_section;
		var cs2 = jsondata.cross_section2;

		// if ($("#var_isWhitm").prop('checked'))
			trace.push( {
				x:		e_f,
				y:		cs1,
				mode: 'lines',
				type:	'scatter',
				name:	'unpolarized',
				line: {
					color: 'rgb(231, 99, 250)',
					width: 2
				},
		});
		// if ($("#var_isWhitw").prop('checked'))
			trace.push( {
				x:		e_f,
				y:		cs2,
				mode: 'lines',
				type:	'scatter',
				name:	'polarized',
				line: {
					color: 'rgb(0, 231, 99)',
					width: 2
				},		
		});			

		var xmin = e_f.min();
		var xmax = e_f.max();
		var dx = 0.05*(xmax-xmin);

		var vmin = [cs1.min(), cs2.min()].min();
		var vmax = [cs1.max(), cs2.max()].max();
		var dv = (vmax-vmin)*0.2;

		switch (lang){
			case 0:
				titles= `$\\text{Photoionization cross section for ${atom}}$`;
				xlabel = "Photon energy (eV)";
				ylabel = "$ \\text{Photoionization cross section (cm}^2{)}$";
				break;
			case 1:
				titles=`$\\textProfil d'énergie potentielle pour ${atom}$`;
				xlabel="Énergie photonique (eV)";
				ylabel="$ \\text{Section efficace de photoionisation (cm}^2{)}$";
				break;
		
			}

		var layout = {
			template:	layout_template,
			title:		titles,
			legend: {
				x:0.6, y: 1.1},
			xaxis: {
				title: xlabel,
				range: [xmin - dx, xmax + dx],
				showline: true, 
				zeroline: true, 
				ticks: 'outside',
			},
			yaxis: {
                // type: 'log',
				title: {
					text: ylabel,
					standoff: 20,
					xanchor: 'center',
					yanchor: 'middle'
				},
				automargin: true,
				// range: [vmin - dv, vmax + dv]
				showline: true, 
				zeroline: true, 
				ticks: 'outside',

			},
		};

		Plotly.newPlot(resultFig, {data:trace, layout:layout, config:config});
	} catch (error) {
		console.error("An error occurred: " + error.message);
	}	
}

