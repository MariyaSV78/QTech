/*
(exercises in quantum mechanics)
Visualisation of calculated data from the server calculations using plotly
Authors:    A.Korovin [a.v.korovin73@gmail.com] 25/05/2019-30/04/2020;
            M. Sosnova [mariya.v.sosnova@gmail.com] 15/06/2023-15/07/2024;
*/

let config={responsive: true,
			scrollZoom: true,
};

function plotFig1(resultFig) {
	try{
		Plotly.purge(resultFig);	
		if ((jsondata.psi == null) || (jsondata.V == null)|| (jsondata.E == null) || (jsondata.r_A == null) ) return;

		const trace = [];
		const j_to_display = parseInt($("#var_j_to_print").val()), v_max = parseInt($("#var_v_max").val());
		const V = jsondata.V[j_to_display], psi = jsondata.psi[j_to_display], E = jsondata.E[j_to_display] 
		const x = jsondata.r_A, xmin = x.min(), xmax = x.max(); dx = 0.25*(xmax-xmin);

		// potential energy in Ryd	
		if ($("#var_isV").prop('checked')){
			trace.push( createTrace(x, V, "$ \\text{Potential energy} $", true, 'rgb(0, 0, 0)', true));}
		// Energy in Ryd	
		if ($("#var_isEnergies").prop('checked')){
			var xE = new Array(), vE = new Array();		
			for(let v = 0; v < v_max; v++){
				xE.push(xmin,xmax,null);
				vE.push(E[v],E[v],null)
			}
			trace.push(createTrace(xE, vE, 'energy', true, 'rgb(0, 99, 250)', true, 'dashdot'));}
		// psi**2
		if ($("#var_isProbability").prop('checked')){
			let scale, vpsi;
			// wave functions
			for(let v = 0; v < v_max; v++){
				if (v == E.length-1){
					if (v==0){
						scale = Auto_scale((V.slice(1,-1)).max()-E[v],psi[v],true);
					}
				}else{
					scale = Auto_scale(E[v+1]-E[v],psi[v],true);
				}
				vpsi = psi[v].map(x => scale*x*x + E[v]);
				trace.push(createTrace(x, vpsi, 'WF', false, 'rgb(99, 0, 250)', true));	
			}
		}
		switch (lang){
			case 0:
				titles="$ \\text{Potential energy profile } (j ="+j+")$";
				xlabel = "$r(\\text{\u00C5})$";
				ylabel = "$E (cm^{-1})$";
				break;
			case 1:
				titles="$ \\text {Profil d'énergie potentielle } (j ="+j+")$";
				xlabel = "$r(\\text{\u00C5})$";
				ylabel = "$E (cm^{-1})$";
				break;
		}
		const vmin = V.min(), vmax = V[V.length - 1], dv = 0.2*(vmax-vmin)	
		const layout = createLayout (titles, xlabel, ylabel, xmin-dx, xmax+dx, vmin - dv, vmax + dv, [], false, true)
		Plotly.newPlot(resultFig, {data:trace, layout:layout, config:config});	
	} catch (error) {
		console.error("An error occurred: " + error);
	}
}

// Wave functions
function plotFig2(resultFig) {
	try{
		Plotly.purge(resultFig);	
		if (jsondata.psi == null) return;
		
		const trace = [];
		let j = 0, v = 0;
		const j_to_display = parseInt($("#var_j_to_print").val()), neig = parseInt($("#Eigenvalues").val());
		const x = jsondata.r_A, psi = jsondata.psi;

		j = neig % j_to_display;
		v =  Math.floor(neig / j_to_display);

		trace.push(createTrace(x, psi[j][v], 'w.f. for j='+j+ 'v='+v, false, 'rgb(99, 0, 250)', true))
		switch (lang){
			case 0:
				titles="$\\text{Wave functions}$";
				xlabel = "$r\\text{\u00C5}$";
				ylabel = '$\\psi_{'+v+j+'}(x)\\text{ (leta.u.)}$';
				break;
			case 1:
				titles="$\\text{Fonction d'onde}$";
				xlabel = "$r\\text{\u00C5}$";
				ylabel = '$\\psi_{'+v+j+'}(x)\\text{ (a.u.)}$';		
				break;
			}
		const xmin = 0.5, xmax = 2, dx = 0.25*(xmax-xmin);
		const vmin = psi[v].min(), vmax = psi[v].max(), dv = 0.2*(vmax-vmin);
		const layout = createLayout (titles, xlabel, ylabel, xmin-dx, xmax+dx, vmin - dv, vmax + dv, [], true, false)
		Plotly.newPlot(resultFig, {data:trace, layout:layout, config:config});
	} catch (error) {
		console.error("An error occurred: " + error.message);
	}
}
// Observable: Rotational constant
function plotFig3_RC(resultFig) {
	try{
		Plotly.purge(resultFig);	
		if (jsondata.Bv == null) return;

		const trace = [];
		const v_max = parseInt($("#var_v_max").val())
		const Bv = jsondata.Bv[0];	
		trace.push(createTrace(v_max - 1, Bv, 'c.s', false, 'rgb(231, 99, 250)', false))
		switch (lang){
			case 0:
				titles="$ \\text{Rotational constant }(j = 0)$";
				xlabel = "$v$";
				ylabel = "$B_v (cm^{-1})$" ;
				break;
			case 1:
				titles="$ \\text{Rotational constant }(j = 0)$";
				xlabel = "$v$";
				ylabel = "$B_v (cm^{-1})$";
				break;
		}
		const xmin = 0, xmax = v_max-1, dx = 1;
		const vmin = Bv.min(), vmax = Bv.max(), dv = 0.2*(vmax-vmin);
		const layout = createLayout (titles, xlabel, ylabel, xmin-dx, xmax+dx, vmin - dv, vmax + dv, [], true, false)
		Plotly.newPlot(resultFig, {data:trace, layout:layout, config:config});
	} catch (error) {
		console.error("An error occurred: " + error.message);
	}
}

function getLineType(v) {
	// Generate a line type (solid, dash, dot, etc.)
	const lineTypes = ['solid', 'dash', 'dot', 'longdash', 'longdashdot', 'dashdot'];
	return lineTypes[v % 6];
}

//Energy spectrum (in observable)
function plotFig3_ES(resultFig) {
	try{
		Plotly.purge(resultFig);
		if (jsondata.E == null) return;

		const trace = [];
		const j_to_display = parseInt($("#var_j_to_print").val()), v_max = parseInt($("#var_v_max").val());
		const E = jsondata.E;
		let annotations = [];
		const xmin = 0, xmax = 1, dx = 0.25*(xmax-xmin);
		for(let v = 0; v < v_max; v++){
			let color = getRandomColor()	
			for(let j = 0; j < j_to_display; j++){
				let xE = [], vE = [];
				xE.push(xmin,xmax,null);
				vE.push(E[j][v],E[j][v],null);		

				trace.push(createTrace(xE, vE, `E[${v}${j}]`, true, color, true, getLineType(j))); 
			// Create an annotation for this trace
				annotations.push({
					x: 0.2,
					y: E[j_to_display][v]+500,
					text: "$ v ="+v+"$",
					showarrow: false,
				});
			}
		}
		switch (lang){
			case 0:
				titles="$\\text{Energy spectrum}$";
				xlabel = "$$";
				ylabel = "$E_{vj}$" ;
				break;
			case 1:
				titles="$\\text{Energy spectrum}$";
				xlabel = "";
				ylabel = "";
				break;
			}
		let vmin = E[0][0], vmax = E[j_to_display][v_max - 1], dv = 0.2*(vmax-vmin);
		const layout = createLayout (titles, xlabel, ylabel, xmin-dx, xmax+dx, vmin - dv, vmax + dv, annotations, false, true)
		Plotly.newPlot(resultFig, {data: trace, layout:layout, config:config});
	} catch (error) {
		console.error("An error occurred: " + error.message);
	}
}
// Energy gap (in observable)
function plotFig3_3(resultFig) {
	try {
		Plotly.purge(resultFig);

		if (jsondata.E == null) return;

		const trace = [];
		let j = 0;
		const v_max = parseInt($("#var_v_max").val());
		const E = jsondata.E[j];
		let dE = [];
		for(let v = 0; v < v_max-1; v++){
			dE.push(E[v+1] - E[v]);}
		
		trace.push(createTrace(v_max, dE, 'none', false, 'rgb(231, 99, 250)', false))
		switch (lang){
			case 0:
				titles="$\\text{Energy gap} (j ="+j+")$";
				xlabel = "$v$";
				ylabel = "$E_{v+1 "+j+"}-E_{v "+j+"}$" ;
				break;
			case 1:
				titles="$\\text{Ecart d'energy} (j ="+j+")";
				xlabel = "$v$";
				ylabel = "$E_{(v+1) "+j+"}-E_{v "+j+"}$";
				break;
			}		
		const xmin = 0, xmax = v_max - 1, dx = 0.25*(xmax-xmin);
		const ymin = dE.min(), ymax = dE.max(), dy = 0.2*(ymax-ymin);	 
		const layout = createLayout (titles, xlabel, ylabel, xmin-dx, xmax+dx, ymin - dy, ymax + dy, [], true, false)
		Plotly.newPlot(resultFig, {data: trace, layout:layout, config:config});
	} catch (error) {
		console.error("An error occurred: " + error.message);
	}
}
// plotly.js for 3_4 (in observable)
function plotFig3_4(resultFig) {
	try{
		Plotly.purge(resultFig);
		
		if (jsondata.E == null) return;

		const trace = [];
		let v = 0;
		const j_to_display = parseInt($("#var_j_to_print").val()), v_max = parseInt($("#var_v_max").val());
		const E = jsondata.E;
		let dE = [];
		for(let j = 0; j < j_to_display; j++){ 
			dE.push((E[j+1][v] - E[j][v])/2/(j+1));}
		trace.push(createTrace(j_to_display, dE, 'none', false, 'rgb(231, 99, 250)', false))

		switch (lang){
			case 0:
				titles="$ v ="+v+"$";
				xlabel = "$j$";
				ylabel = "$(E_{"+v+"(j+1)}-E_{"+v+"j})/2(j+1)$"; //"$\\frac{E_{"+v+"(j+1)}-E_{"+v+"j}}{2(j+1)}$" ;
				break;
			case 1:
				titles="$ v ="+v+"$";
				xlabel = "$j$";
				ylabel = "$(E_{"+v+"(j+1)}-E_{"+v+"j})/2(j+1)$";
				break;
		}		
		const xmin = 0, xmax = j_to_display, dx = 0.25*(xmax-xmin);
		const ymin = dE.min(), ymax = dE.max(), dy = 0.2*(ymax-ymin);
		const layout = createLayout (titles, xlabel, ylabel, xmin-dx, xmax+dx, ymin - dy, ymax + dy, [], true, false)
		Plotly.newPlot(resultFig, {data: trace, layout:layout, config:config});
	} catch (error) {
		console.error("An error occurred: " + error.message);
	}
}
	// plotly.js for 4_DM (in selection rules)
function plotFig4_DM(resultFig) {
	try{
		Plotly.purge(resultFig);

		if (jsondata.D == null) return;
		let trace = [];
		const x = jsondata.r_A, D = jsondata.D;		
		trace.push(createTrace(x, D, 'none', false, 'rgb(99, 0, 250)', true))
		switch (lang){
			case 0:
				titles="Dipole moment";
				xlabel = "$r(A)$";
				ylabel = "$D(r) (Debye)$" ;
				break;
			case 1:
				titles="Moment dipolaire";
				xlabel = "$r(A)$";
				ylabel = "$D(r) (Debye)$";
				break;
		}
		const xmin = 0.05, xmax = 3, ymin = -0.5, ymax = 0.5, dy = 0.2*(ymax-ymin);
		const layout = createLayout (titles, xlabel, ylabel, xmin, xmax, ymin - dy, ymax + dy, [], true, false)
		Plotly.newPlot(resultFig, {data: trace, layout:layout, config:config});
	} catch (error) {
		console.error("An error occurred: " + error.message);
	}
}
// plotly.js for 4_SR (in selection rules)
function plotFig4_SR(resultFig) {
	try {
		Plotly.purge(resultFig);
		if (jsondata.I1 == null) return;

		const trace = [];
		const v_max = parseInt($("#var_v_max").val());
		const I1 = jsondata.I1;
		trace.push( {
				z:		I1,
				type:	'heatmap',
				colorscale: 'Cividis'
			});
		let annotations = [];
		for (let i = 0; i < v_max; i++) {
			for (let j = 0; j < v_max; j++) {
			annotations.push({
				x: j,
				y: i,
				text: I1[i][j].toFixed(4),
				showarrow: false,
			});
			}
		}
		switch (lang){
			case 0:
				titles="";
				xlabel = "$(vj)=(v0)$";
				ylabel = "$(v'j')=(v'0)$" ;
				break;
			case 1:
				titles="";
				xlabel = "$(vj)=(v0)$";
				ylabel = "$(v'j')=(v'0)$";
				break;
			}	
		const layout = {
			template:	layout_template,
			title:		titles,
			xaxis: {range: [-0.9, v_max-0.1], title: xlabel, zeroline: false,},
			yaxis: {title: ylabel, range: [v_max-0.1, -0.9], zeroline: false,},
			annotations: annotations,
			hovermode: 'closest'
		};
		Plotly.newPlot(resultFig, {data: trace, layout:layout, config:config});
	} catch (error) {
		console.error("An error occurred: " + error.message);
	}
}

// plotly.js for 4_SR2 (in selection rules)
function plotFig4_SR2(resultFig) {
	try{
		Plotly.purge(resultFig);

		if (jsondata.I2 == null) return;

		const trace = [];
		const j_to_display = parseInt($("#var_j_to_print").val()), m = parseInt($("#var_m").val()), m_p = parseInt($("#var_m_p").val());
		const I2 = jsondata.I2;
		let dI2 = [];
		for(let imp = 0; imp < j_to_display; imp++){ 
			let row = [];
			for(let im = 0; im < j_to_display; im++){ 
				row.push(I2[imp][im][m_p][m]);}
			dI2.push(row)
		}
		trace.push( {
				z:		dI2,
				type:	'heatmap',
				colorscale: 'Cividis'
			});
		let annotations = [];
		for (let i = 0; i < j_to_display; i++) {
			for (let j = 0; j < j_to_display; j++) {
				annotations.push({
					x: j,
					y: i,
					text: dI2[i][j].toFixed(4),
					showarrow: false,
				});
			}
		}	
		switch (lang){
			case 0:
				titles="$(m'm) = ("+m_p+m+")$";
				xlabel = "$(vj)=(0j)$";
				ylabel = "$(v'j')=(1j')$" ;
				break;
			case 1:
				titles="$(m'm) = ("+m_p+m+")$";
				xlabel = "$(vj)=(0j)$";
				ylabel = "$(v'j')=(1j')$";
				break;
			}
		const layout = {
			template:	layout_template,
			title:		titles,
			xaxis: {range: [-0.9, j_to_display-0.1], title: xlabel, zeroline: false,},
			yaxis: {title: ylabel, range: [j_to_display-0.1, -0.9], zeroline: false,},
			annotations: annotations,
		};
		Plotly.newPlot(resultFig, {data: trace, layout:layout, config:config});
	} catch (error) {
		console.error("An error occurred: " + error.message);
	}
}
// plotly.js for 5_1
function plotFig5(resultFig) {
	try {
		Plotly.purge(resultFig);
		if (jsondata.Delta_P == null || jsondata.Delta_R == null || jsondata.P == null || jsondata.R == null) return;

		const trace = []; annotations = []; layout = [];
		const P = jsondata.P, R = jsondata.R, Delta_P = jsondata.Delta_P, Delta_R = jsondata.Delta_R;
		const j_max = parseInt($("#var_j_max").val()) 
		const ymin = 0, ymax = 1.2;	 
		let max_P_R = Math.max(R.max(),P.max())
		for (let j = 0; j < j_max - 1; j++){
			P[j] /= max_P_R;
			R[j] /= max_P_R;}
	//Fig.5_1
		if (resultFig == 'resultFig5_1'){
			var xmin, xmax;
			trace.push(createTrace(Delta_R, R, 'R', true, 'blue', false))
			trace.push(createTrace(Delta_P, P, 'P', true, 'red', false))

			xmin = Math.min(Delta_P.min(),Delta_R.min());
			xmax = Math.max(Delta_P.max(),Delta_R.max());	
		}
	//Fig.5_2 - convolution
		if (resultFig == 'resultFig5_2' || resultFig == 'resultFig5_3'){
			if (jsondata.Convoluted_Intensity == null || jsondata.Energy == null)   return;
			const Convoluted_Intensity = jsondata.Convoluted_Intensity, Energy = jsondata.Energy;
			xmin = Energy.min(), xmax = Energy.max();

			if (resultFig == 'resultFig5_2'){
				trace.push(createTrace(Energy, Convoluted_Intensity, '$\\text{Simulated spectrum}$', false, 'black', true))
				for (let i = 0; i < j_max - 1; i++) {
					annotations.push({
						x: Delta_P[i],
						y: P[i] + P[i]*0.15,
						text: "$P_{"+i+"}$",
						showarrow: false,
						font: {	size: 8,}
					});
				}
				for (let i = 0; i < j_max - 1; i++) {
					annotations.push({
						x: Delta_R[i],
						y: R[i] + R[i]*0.15,
						text: "$R_{"+i+"}$",
						showarrow: false,
						font: { size: 8, }
					});
				}
			}

			// if (resultFig == 'resultFig5_3'){
			// 	trace.push(createTrace(Energy, Convoluted_Intensity, '$\\text{Simulated spectrum}$', true, 'black', true))
			// 	const imageUrl = "../img/Carbon_monoxide_IR_rotational-vibrational_spectrum_v2.png";
			// 	const imageAnnotation = {
			// 		xref: 'x',       // Set x-coordinate reference to 'x' (assuming it's along the x-axis)
			// 		yref: 'y',       // Set y-coordinate reference to 'y' (assuming it's along the y-axis)
			// 		x: 0.5,          // Adjust x-coordinate position (range: data values)
			// 		y: 0.5,          // Adjust y-coordinate position (range: data values)
			// 		sizex: 200,      // Adjust width of the image annotation (pixels or data values)
			// 		sizey: 200,      // Adjust height of the image annotation (pixels or data values)
			// 		opacity: 1,      // Ensure image opacity is fully visible
			// 		layer: 'above',  // Set the image to appear above other elements
			// 		source: imageUrl, // Specify the image URL or base64 encoded data here
			// 	  };

			// 	annotations.push(imageAnnotation);

			// }
		}
		switch (lang){
			case 0:
				titles="";
				xlabel = "$ \\text{Energy, } E_{vj} (cm^{-1})$";
				ylabel = "$ \\text{Relative intensity}$" ;
				break;
			case 1:
				titles= "";
				xlabel = "$ \\text{Energy, } E_{vj} (cm^{-1})$";
				ylabel = "$ \\text{Relative intensity}$";
				break;
			}
		layout = createLayout (titles, xlabel, ylabel, xmax+0.05*(xmax-xmin), xmin-0.05*(xmax-xmin), ymin, ymax, annotations, true, false)
		
		Plotly.newPlot(resultFig, {data: trace, layout:layout, config:config});

	} catch (error) {
		console.error("An error occurred: ", error);
	}
}