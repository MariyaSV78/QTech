var config={responsive: true,
	scrollZoom: true,
//			modeBarButtonsToRemove: ['pan2d','select2d','lasso2d','resetScale2d','zoomOut2d'],
	};

	var config={responsive: true,
		scrollZoom: true,
//			modeBarButtonsToRemove: ['pan2d','select2d','lasso2d','resetScale2d','zoomOut2d'],
		};

function meshgrid(x0,y0){
Nx = x0.length;
Ny = y0.length;
var x = new Array(Nx);
var y = new Array(Nx);

 for(var ix=0;ix<Nx;ix++){
	 x[ix] = new Array(Ny);
	 y[ix] = new Array(Ny);
	 for(var iy=0;iy<Ny;iy++){
		 x[ix][iy] = x0[ix];
		 y[ix][iy] = y0[iy];
	 }
 }

return {
	x: x,
	y: y,
};  
}


function wireframe(trace,x,y,v,line,name){
Nx = x.length;
Ny = x[0].length;
for(var i=0;i<Nx;i++){
	trace.push({
		x: x[i],
		y: y[i],
		z: v[i],
		mode: 'lines',
		type: 'scatter3d',
		showlegend: false,
		line: line,
	});
}
zero = new Array(Nx);
for(var ix=0;ix<Nx;ix++) zero[ix] = 0;
for(var j=0;j<Ny;j++){
	trace.push({
		x: zero.map((a,i)=> x[i][j]),
		y: zero.map((a,i)=> y[i][j]),
		z: zero.map((a,i)=> v[i][j]),
		mode: 'lines',
		type: 'scatter3d',
		showlegend: false,
		line: line,
	});
}

}




// show potential energy profile
function plotFig1(resultFig) {
	Plotly.purge(resultFig);
	console.log('resultFig1');
	
	if (jsondata.V==null) return;

	Neig = parseInt($("#var_Neig").val());

	switch (lang){
		case 0:
			titles="Potential energy profile";
			switch(LabelType){
				case 1: // x dimensionless
					xlabel = "$x\\text{-coordinate (a.u.)}$";
					ylabel = "Energy (a.u.)";
					break;
				case 2: // r dimensionless
					xlabel = "$r\\text{-coordinate (a.u.)}$";
					ylabel = "Energy (a.u.)";
					break;
				case 3: // x eV,Ang
					xlabel = "$x\\text{-coordinate (}\\mathring{A}\\text{)}$";
					ylabel = "Energy (eV)";
					break;
				case 4: // r eV,Ang
					xlabel = "$r\\text{-coordinate (}\\mathring{A}\\text{)}$";
					ylabel = "Energy (eV)";
					break;
				case 5: // r MeV,fm
					xlabel = "$r\\text{-coordinate (fm)}$";
					ylabel = "Energy (eV)";
					break;
			}
			break;
	}

	// plotly.js
	var trace = [];

	if (is2D){
		console.log("fig1 2D")

		var meshxy = meshgrid(jsondata.x,jsondata.y);

		// correct potential view
// 		var v = JSON.parse(JSON.stringify(jsondata.V));
		var v_top = jsondata.V[0].min();
		// var v = jsondata.V.map(row => row.map(x => x>v_top ? NaN : x ));
		var v = jsondata.V;
		trace.push({
			type: "surface",
			x: meshxy.x,
			y: meshxy.y,
			z: v.map(row=> row.map(x=> x+Eshift)),
			showscale: false,
			// opacity: 0.8,
			colorscale: [[0, 'rgb(200, 200, 200)'],[1, 'rgb(0, 0, 139)']],//"Jet",
			name:	"potential",
			showscale: false,
			// showlegend: true,
		});


		// perturbation
		if (jsondata.W!=null){
			wireframe(trace,meshxy.x,meshxy.y,jsondata.V.map((row,i)=>row.map((x,j)=> x+jsondata.W[i][j]>v_top ? NaN : x+Eshift+jsondata.W[i][j])),{color: 'rgb(0, 0, 0)',size: 2},'$V+\\delta V$');
		}

		if ($("#var_isProbability").prop('checked')){
			var neig = parseInt($("#Eigenvalues").val());
//			console.log("psi"+neig+"="+jsondata.psi[neig])
			var scale = jsondata.V[0].min()/2;
			console.log("scale="+scale);

			var v_2 = jsondata.psi[neig];
			v_2 = v_2.map(row => row.map(x => scale*x*x + jsondata.E[neig]) )

//			console.log("v="+v);
			trace.push({
				type: 'scatter3d', //"surface",
				x: meshxy.x,
				y: meshxy.y,
				z: v_2,
				colorscale:	"Jet",
				name:		'WF',
				showscale: false,
				showlegend: false,
			});
		}

		flattened = jsondata.V.reduce((acc, val) => acc.concat(val), []);
		v_min = flattened.min();
		v_max = flattened.max();
		dv = v_max - v_min;
		x_screen = parseFloat($("#var_x_screen").val());
		var layout = {
			template:	layout_template,
			autosize: true,
			title: {text: titles, y: 0.9},
			scene: {
				xaxis: {
					title: 'x (a.u.)',
				},
				yaxis: {
					title: 'y (a.u.)',
				},
				zaxis: {
					title: ylabel, //'V (a.u.)',
					range: [v_min - 0.05 * dv, v_max + 0.05 * dv],
				}
			},

			margin: {t: 20, b: 40, l: 40, r: 40,},

		};
	}
	else{console.log("fig1 1D")}

	Plotly.newPlot(resultFig, {data:trace, layout:layout, config:config});
}	


//resultFig4a - |Psi (x,t=0)|
//resultFig4b - Profile of the Fourier transformation for w.f.
function plotFig4() {
	Plotly.purge(resultFig4a);
	
    if (typeof resultFig4b !== 'undefined' && resultFig4b) {
        Plotly.purge(resultFig4b);
    }
		console.log("plotFig4 - Wave packet");

	// plotly.js 
	var trace = [];

	if (is2D){
		var meshxy = meshgrid(jsondata.x,jsondata.y);

		var v = jsondata.psi;

		trace.push({
//			type: 'contour',
			type: "surface",
			x: meshxy.x,
			y: meshxy.y,
 			z: v,
			showscale: false,
//			opacity: 0.8,
			colorscale: [[0, 'rgb(255, 255, 255)'],[1, 'rgb(0, 0, 139)']],//"Jet",
			name:	'potential',
		});

		switch (lang){
			case 0:
				var titles = "Wave function profile";
				break;
		}

		var layout = {
			template:	layout_template,
			autosize: true,
			title: {text: titles, y: 0.9},
			// images:{sizex: 0.2, sizey: 1.5},
			scene: {
				xaxis: {
					title: 'x',
				},
				yaxis: {
					title: 'y',
				},
				zaxis: {
					title: '|Ψ(x,t=0)|<sup>2</sup> (a.u.)',//'$|\\Psi (x,t=0)|^2\\text{ (a.u.)}$',
				}
			},
			margin: {t: 20, b: 20, l: 50, r: 50},
		};


	}else{console.log("fig1 1D")}

	Plotly.newPlot(resultFig4a, {data:trace, layout:layout, config:config});
	
	// resultFig4b
	if (typeof resultFig4b !== 'undefined' && resultFig4b) {
		var tracek = [];
		if (is2D){
			var meshkxy = meshgrid(jsondata.kx,jsondata.ky);
			var v = jsondata.psi_FT;

			tracek.push({
	//			type: 'contour',z
				type: "surface",
				x: meshkxy.x,
				y: meshkxy.y,
				z: v,
				showscale: false,
	//			opacity: 0.8,
				colorscale: "Jet",
				name:	'potential',
			});

			switch (lang){
				case 0:
					titlek="Profile of the Fourier transformation for w.f.";
					break;
			}
			layoutk = {
	//			template:	layout_template,
				autosize: true,
				title: titlek,
	//			scene: {
					xaxis: {
						title: {text: '$k_x$'},
					},
					yaxis: {
						title: '$k_y$',
					},
					zaxis: {
						title: '$|\\overline{\\Psi} (k,t=0)|\\text{ (a.u.)}$',
					},
	//			},
			};

		}else{console.log("fig1 1D")}

		Plotly.newPlot(resultFig4b, {data:tracek, layout:layoutk, config:config});
	}
}

function plotFig4c(resultFig) {
	Plotly.purge(resultFig);
	console.log("plotFig4c - Wave packet_projection");
	
	if(jsondata.psi==null) return;
	var trace = [];

	var v = jsondata.psi;
console.log("psi",v)
	v = jsondata.y.map((row,i)=>jsondata.x.map((col,j)=>v[j][i]))

	trace.push({
		type: 'contour',
		x: jsondata.x,
		y: jsondata.y,
		z: v,
		colorscale: [[0, 'rgb(255, 255, 255)'],[1, 'rgb(0, 0, 139)']],//"Jet",
		name:	'psi',
		xaxis: 'x1',
		yaxis: 'y1',
	});

	trace.push({
		type: 'contour',
		z: jsondata.V[0].map((col,i)=>jsondata.V.map(row=>row[i])),
		x: jsondata.x,
		y: jsondata.y,
		contours:{
			coloring: 'lines',
			showlabels: false,
		},
		line:{
			color: 'green',
			width:2
		},
		ncontours:2
	})

	var layout = {
		template:	layout_template,
		autosize: true,
		title: {text: titles, y: 0.9},
		// images:{sizex: 0.2, sizey: 1.5},
		xaxis: {
			title: 'x (a.u.)',
			y: 1,
		},
		yaxis: {
			title: 'y (a.u.)',
		},
		zaxis: {
			title: '$|\\Psi (x,t=0)|\\text{ (a.u.)}$',
		},
		margin: {t: 60, b: 80, l: 50, r: 30},
	};

	Plotly.newPlot(resultFig, {data:trace, layout:layout, config:config});
}

function plotFig5(resultFig) {
	Plotly.purge(resultFig);
	console.log("plotFig5 - Temporal evolution of the wave packet");

	if(jsondata.time==null) return;
	if(jsondata.psi_t==null) return;

	var trace = [];
	var frame = [];
	var sliderSteps = [];

	console.log("jsondata.time", jsondata.time)
	console.log("jsondata.psi_t", jsondata.psi_t)

	if (document.getElementById("var_isFourrier").checked){
		var x = jsondata.kx;
		if (is2D){
			var y = jsondata.ky;
			var xname = '$k_x\\text{ (a.u.)}$';
			var yname = '$k_y\\text{ (a.u.)}$';
		}else{
			var xname = '$k\\text{ (a.u.)}$';
		}
		var ftitle = '$\\text{FTT(}|\\Psi (x,t)|^2\\text{) (a.u.)}$';
	}else{
		var x = jsondata.x;
		if (is2D){
			var y = jsondata.y;
			var yname = '$y\\text{ (a.u.)}$';
		}
		var xname = '$x\\text{ (a.u.)}$';
		var ftitle = '$|\\Psi (x,t)|^2\\text{ (a.u.)}$';
	}

//	if (is2D) var meshxy = meshgrid(jsondata.x,jsondata.y);
	var v_t,v_a_t;
	if (document.getElementById("var_isFourrier").checked)
		v_t = jsondata.psi_FT_t;
	else{
		v_t = jsondata.psi_t;
		if($("#var_isShowAnalyticSolution").prop('checked')){
			if(jsondata.psi_analytic_t!=null) v_a_t = jsondata.psi_analytic_t;
		}
	}
	if (Perturbation_Type==6){
		v_t = v_t[nomegap];
		if(v_a_t!=null) v_a_t = v_a_t[nomegap];
	}
	v_max = v_t.max();

	if( !is2D && document.getElementById("var_isProfile_inFig5").checked && !document.getElementById("var_isFourrier").checked ){
		if (jsondata.H_average!=null)
			if (Perturbation_Type==6)
				var E_av = jsondata.H_average[nomegap][0];
			else
				var E_av = jsondata.H_average[0];

		if (Pot_Type==0){
			var x_pot = jsondata.x;
			var v_pot = jsondata.V.map(v => v+Eshift);
		}else{
			var x_pot = jsondata.x.slice(1,-1);
			var v_pot = jsondata.V.slice(1,-1).map(v => v+Eshift);
		}

		E_max = Math.max(2*E_av,v_pot.max());
		E_min = Math.min(0,v_pot.min());
	}


	// prepare perturbation for Perturbation_Type 5 or 6
	if (Perturbation_Type==5 || Perturbation_Type==6){
		Nt = parseInt($("#var_Nt").val());
		dt = parseFloat($("#var_dt").val());
		xc = (parseFloat($("#var_x0").val())+parseFloat($("#var_xL").val()))/2;
		t = parseFloat($("#var_t_perturb").val());
		if (Perturbation_Type==6){
			nomegap = parseInt($("#omegap_perturb").val());
			omegap = omegap_perturb[nomegap];
		}else
			omegap = parseFloat($("#var_omegap").val());
		qF = parseFloat($("#var_perturb_q").val())*parseFloat($("#var_perturb_F").val());
		w0 = x.map(x => -qF*(x-xc) );
	}

	//////////////////////////////////////////////////////////////////////////////////////////////////////////
	x_screen = parseFloat($("#var_x_screen").val());
	ix = findClosestIndex(jsondata.x, x_screen);
	
	v_screen_max = 0;
	// Create the main trace
	for (it = 0; it < jsondata.time.length; it++) {
		var argname = it;

		// Create a frame for each time
		v = v_t[it];
		if (v.everyisNaN()) break;
		var fdata = [];
		if (is2D){
			// transpose
			v = jsondata.y.map((row,i)=>jsondata.x.map((col,j)=>v[j][i]))
			fdata.push({
				type: 'contour',
				autocontour: false,
				contours: {
					coloring: 'Jet',
					start: 0,
					end: v_max/2,
					size: v_max/2/20,
				},
				line: {
 					width: 0,
				},
				x: jsondata.x,
				y: jsondata.y,
 				z: v,
				colorscale: [[0, 'rgb(255, 255, 255)'],[1, 'rgb(0, 0, 139)']],//"Jet",
				name:	'psi_t^2',
				xaxis: 'x1',
				yaxis: 'y1',
			});
	
////////////////////////////////////////////////////////////////////////////////////////
			if(!document.getElementById("var_isFourrier").checked && document.getElementById("var_isProfile_inFig5").checked){
				fdata.push({
					type: 'contour',
					z: jsondata.V[0].map((col,i)=>jsondata.V.map(row=>row[i])),
					x: jsondata.x,
					y: jsondata.y,
					contours:{
						coloring: 'lines',
						showlabels: false,
					},
					line:{
						color: 'green',
						width:2
					},
					ncontours:2
				})
			}

///////////////////////////////////////////////////////////////////////////////////////////////
		}else{
			switch(lang){
				case 0:
					ftitle = "energy (a.u.)";
					nameit = "w.f. at t=";
					break;
			}
			if(document.getElementById("var_isProfile_inFig5").checked && !document.getElementById("var_isFourrier").checked ){
				fdata.push({
							x: x,
							y: v.map( psi => (E_max-E_av)/v_max*psi + E_av ),
							mode: 'markers+lines',
							type: 'scatter',
							name: 'w.f. at t='+Clear_accuracy(jsondata.time[it]),
							showlegend: false,
					});

				// add perturbation
				if (Perturbation_Type==5 || Perturbation_Type==6){
					v_pot2 = v_pot.map((x,i)=>x+w0[i]*Math.sin(omegap*(dt*it)));
				}else if(jsondata.W!=null)
					v_pot2 = v_pot.map((x,i)=>x+jsondata.W[i]);
				else v_pot2 = v_pot;
				fdata.push({
					x: x_pot,
					y: v_pot,
					mode: 'lines',
					type:	'scatter',
					name:	'Potential energy',
					line: {
						color: 'rgb(231, 99, 250)',
						width: 2
					},
					showlegend: false,
				});
				fdata.push({
					x: x_pot,
					y: v_pot2,
					mode: 'lines',
					type:	'scatter',
					name:	'Perturbation potential',
					line: {
						color: 'rgb(99, 231, 250)',
						width: 2,
						dash: 'dash',
					},
					showlegend: false,
				});
			}else{
				fdata.push({
							type: 'scatter',
							name: nameit+Clear_accuracy(jsondata.time[it]),
							x: x,
							y: v,
							mode: 'markers+lines',
							showlegend: false,
					});
				nf = parseInt($("#var_nf").val());
				if(!isNaN(nf) && !document.getElementById("var_isFourrier").checked ){
					fdata.push({
							type: 'scatter',
							name: 'w.f. nf='+Clear_accuracy(nf),
							x: x,
							y: jsondata.psi[1].map(x=> Math.abs(x)**2),
							mode: 'lines',
							showlegend: false,
							line: {
								color: 'rgb(231, 0, 0)',
								width: 2
							},
					});
				}


			}
		}
		if($("#var_isShowAnalyticSolution").prop('checked') && v_a_t!=null){
			v_a = v_a_t[it];
			if (is2D){
// 				fdata.push({
// 					type: "surface",
// 					x: meshxy.x,
// 					y: meshxy.y,
// 					z: v_a,
// 					showscale: false,
// // 					opacity: 0.8,
// 					colorscale: "Jet",
// 					name:	'potential',
// 					});
			}else{
				if(document.getElementById("var_isProfile_inFig5").checked && !document.getElementById("var_isFourrier").checked ){
					fdata.push({
							type: 'scatter',
							name: 'w.f.(analytical) at t='+Clear_accuracy(jsondata.time[it]),
							x: x,
							y: v_a.map( psi => (E_max-E_av)/v_max*psi+E_av ),
							mode: 'markers+lines',
							showlegend: false,
					});
				}else{
					fdata.push({
							type: 'scatter',
							name: 'w.f.(analytical) at t='+Clear_accuracy(jsondata.time[it]),
							x: x,
							y: v_a,
							mode: 'markers+lines',
							showlegend: false,
					});
				}
			}
		}
		
		if (it==0){
			trace = fdata;
		}
		frame.push({
			name: argname,
			data: fdata,
		})

		// create slider steps, one for each frame.
		sliderSteps.push({
			method: 'animate',
			label: Clear_accuracy(jsondata.time[it]),
			args: [[argname], {
				mode: 'immediate',
				transition: {duration: 10,},
				frame: {duration: 200, redraw: true},
			}]
		});
	}

	
	if (document.getElementById("var_isFourrier").checked){
		var yaxis = {
			tickformat :".2f",
			title: ftitle,
		};		
	}else if(is2D){
		var yaxis = {
				title: '$y\\text{ (a.u.)}$',
		};
	}else{
		if(document.getElementById("var_isProfile_inFig5").checked && !document.getElementById("var_isFourrier").checked ){
			var yaxis = {
				tickformat :".2f",
				title: ftitle,
				range: [E_min-.01*(E_max-E_min), E_max+.01*(E_max-E_min)],
			};		
		}else{
			var yaxis = {
				tickformat :".2f",
				title: ftitle,
				range: [0, 1.01*v_max],
			};		
		}
	}
	// switch (lang){
	// 	case 0:
	// 		var titles = "Temporal evolution of the wave packet";
	// 		break;
	// 	case 1:
	// 		var titles = "Evolution temporelle du paquet d'onde";
	// 		break;
	// }

	var layout = {
		template:	layout_template,
		title: '',
		margin: {t: 80, b: 50, l: 50, r: 30},
		hovermode: 'closest',
		
		// We'll use updatemenus (whose functionality includes menus as
		// well as buttons) to create a play button and a pause button.
		// The play button works by passing `null`, which indicates that
		// Plotly should animate all frames. The pause button works by
		// passing `[null]`, which indicates we'd like to interrupt any
		// currently running animations with a new list of frames. Here
		// The new list of frames is empty, so it halts the animation.
		updatemenus: [{
			x: 0.1, y: 0, pad: {t: 85, r: 10},
			yanchor: 'top',
			xanchor: 'right',
			showactive: false,
			direction: 'left',
			type: 'buttons',
			buttons: [{
				method: 'animate',
				args: [null, {
					mode: 'afterall',
					fromcurrent: true,
					transition: {duration: 10},
					frame: {duration: 200, redraw: true}
				}],
				label: 'Play'
				}, {
				method: 'animate',
				args: [[], {
					mode: 'immediate',
					transition: {duration: 0},
					frame: {duration: 0, redraw: false}
				}],
				label: 'Pause'
			}]
		}],
		// Finally, add the slider and use `pad` to position it
		// nicely next to the buttons.
		sliders: [{
			x: 0.1, y: -0.1, len: 1, pad: {l: 10, t: 50},
//			pad: {l: 130, t: 55},
			currentvalue: {
				visible: true,
				prefix: 'Time: ',
				// suffix: '(a.u.)',
				xanchor: 'right',
				font: {size: 20, color: '#667'}
			},
			steps: sliderSteps
		}]
	};

	if  (document.getElementById("var_isScreen_inFig5") !=null) {
		if(!document.getElementById("var_isFourrier").checked && document.getElementById("var_isScreen_inFig5").checked){
			layout["shapes"] = [
				{
					type: 'line',
					x0: x_screen,
					x1: x_screen,
					yref: 'paper',
					y0: 0,
					y1: 1,
					line: {
						color: 'green',
						width: 2,
						dash: 'solid'
					}
				}
			];
		};
	}

	if (is2D){

		// layout['grid'] =  {rows: 1, columns: 2, pattern: 'independent'};
        // layout['xaxis1'] = {
		// 	title: xname,
		// 	domain: [0, 0.7],
		// };
        // layout['yaxis1'] = yaxis;
        // layout['xaxis2'] = {
		// 	title: "psi_t^2",
		// 	range: [0, 1.01*v_screen_max],
		// 	domain: [0.75, 1],
		// };
//        layout['yaxis2'] = {title: "y2",};
		layout['xaxis'] =  {title: xname,};
		layout['yaxis'] =  yaxis;
	}else{
		layout['xaxis'] =  {title: xname,};
		layout['yaxis'] =  yaxis;
	}

	Plotly.newPlot(resultFig, {
			data: trace,
			layout: layout,
			frames: frame,
			config:config,
		});

	// save video
//	document.getElementById("saveVideo").setAttribute( "onClick", "window.open('lines.gif', 'Download')" );
	// if(jsondata.video_fname!=null){
	// 	document.getElementById("saveVideo").setAttribute( "href", jsondata.video_fname );
	// }
}

// show diffraction on the screen
function plotFig_ex8(resultFig) {
Plotly.purge(resultFig);
// plotly.js
console.log('plotFig_ex8');

if(jsondata.time==null) return;
if(jsondata.psi_t==null) return;
if (!is2D) return;

x_screen = parseFloat($("#var_x_screen").val());
ix = findClosestIndex(jsondata.x, x_screen);

console.log('x_screen', x_screen);

// plotly.js
var trace = [];
var frame = [];
var sliderSteps = [];


var y = jsondata.y;

var yname = '$y\\text{ (a.u.)}$';
var ftitle = '$|\\Psi (y,t)|^2\\text{ (a.u.)}$';
var xname = '$|\\Psi (y,t)|^2\\text{ (a.u.)}$';


var v_t;
v_t = jsondata.psi_t;
var v_max = [];//= v_t.max();

//////////////////////////////////////////////////////////////////////////////////////////////////////////

// Create the main trace
for (it = 0; it < jsondata.time.length; it++) {
var argname = it;

// Create a frame for each time
v = v_t[it][ix];
v_max[it] = v.max();
if (v.everyisNaN()) break;
var fdata = [];
switch(lang){
	case 0:
		ftitle = "energy (a.u.)";
		nameit = "w.f. at t=";
		break;
	case 1:
		ftitle = "énergie (a.u.)";
		nameit = "f.o. à t=";
		break;

}

fdata.push({
		x: v,
		y: y,
	
		mode: 'lines',
		type: 'scatter',
		name: 'w.f. at t='+Clear_accuracy(jsondata.time[it]),
		showlegend: false,
});

if (it==0){
	trace = fdata;
}
frame.push({
	name: argname,
	data: fdata,
})

// create slider steps, one for each frame.
sliderSteps.push({
	method: 'animate',
	label: Clear_accuracy(jsondata.time[it]),
	args: [[argname], {
	mode: 'immediate',
	transition: {duration: 100,},
	frame: {duration: 100, redraw: true},
	}]
});
}


switch (lang){
case 0:
	var titles = "Temporal evolution of the wave packet";
	break;
case 1:
	var titles = "Evolution temporelle du paquet d'onde";
	break;
}

var layout = {
template:	layout_template,
title: {text:`The screen position x = ${x_screen}(a.u.)`,
		x: 0.9,
		y: 0.82,
		font: {
			size: 14,
			color: 'green' // Change the color of the title
		}},
xaxis: {
	title: {text: xname,},
	range:[0, v_max.max()],
},
yaxis: {
	title: yname,
},

margin: {t: 80, b: 50, l: 50, r: 30},
hovermode: 'closest',
// We'll use updatemenus (whose functionality includes menus as
// well as buttons) to create a play button and a pause button.
// The play button works by passing `null`, which indicates that
// Plotly should animate all frames. The pause button works by
// passing `[null]`, which indicates we'd like to interrupt any
// currently running animations with a new list of frames. Here
// The new list of frames is empty, so it halts the animation.
updatemenus: [{
	x: 0.1, y: 0, pad: {t: 85, r: 10},
	yanchor: 'top',
	xanchor: 'right',
	showactive: false,
	direction: 'left',
	type: 'buttons',
	buttons: [{
		method: 'animate',
		args: [null, {
			mode: 'immediate',
			fromcurrent: true,
			transition: {duration: 100},
			frame: {duration: 100, redraw: false}
		}],
		label: 'Play'
		}, {
		method: 'animate',
		args: [[], {
			mode: 'immediate',
			transition: {duration: 0},
			frame: {duration: 0, redraw: false}
		}],
		label: 'Pause'
	}]
}],
// Finally, add the slider and use `pad` to position it
// nicely next to the buttons.
sliders: [{
	x: 0.1, y: -0.1, len: 0.9, pad: {l: 10, t: 50},
//			pad: {l: 130, t: 55},
	currentvalue: {
		visible: true,
		prefix: 'Time: ',
		// suffix: '(a.u.)',
		xanchor: 'right',
		font: {size: 20, color: '#667'}
	},
	steps: sliderSteps
}]
};

Plotly.newPlot(resultFig, {
	data: trace,
	layout: layout,
	frames: frame,
	config: config,
});

}
