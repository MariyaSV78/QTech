/*
(exercises in quantum mechanics)
Visualisation of calculated data from the server calculations using plotly
Authors:    A.Korovin [a.v.korovin73@gmail.com] 25/05/2019-30/04/2020;
            M. Sosnova [mariya.v.sosnova@gmail.com] 15/06/2023-15/07/2024;
*/

let config={responsive: true,
			scrollZoom: true,
//			modeBarButtonsToRemove: ['pan2d','select2d','lasso2d','resetScale2d','zoomOut2d'],
			};

//Potential and numerical wave function
function plotFig1(resultFig) {
	try{
		Plotly.purge(resultFig);
	
		if ((jsondata.E == null) || (jsondata.V == null)|| (jsondata.waves == null) || (jsondata.x == null) || (jsondata.alpha == null)) return;

		const trace = [], annotations = [];
		const V = jsondata.V, waves = jsondata.waves, E = jsondata.E;
		const x = jsondata.x, xmin = x.min(), xmax = x.max(); dx = 0.25*(xmax-xmin);
		
		let sample_print = parseInt($("#var_n_samples_print").val());
		if (sample_print > E.length){
			sample_print = E.length;
		}
				
console.log("n_samples_print", sample_print)
console.log("waves", waves.length)

		let xE = new Array(), vE = new Array();
		xE.push(xmin,xmax,null);
		let legend = true, color = 'rgb(0, 0, 0)';
		for(let s = 0; s < sample_print; s++){
			vE = Array().fill(0);	
			color = getRandomColor()
		// potential energy	
			trace.push( createTrace(x, V[s], "$V_{n_s}$", legend, color, true, 'dashdot'));
		// Energy	
			vE.push(E[s],E[s],null);
			if ($("#var_E_1").prop('checked'))
				trace.push(createTrace(xE, vE, "$ E_{n_s} $", legend, color, true, 'dot'));
		// wave function
			if ($("#var_WF_1").prop('checked')){
				if (Array.isArray(waves[s])) {

					// const traceWaves = createTrace(x, waves[s].map(wave => wave + E[s]), "$\\varphi_{n_s} $", legend, color, true);
					// traceWaves.yaxis = 'y2'; // Associate with yaxis2 (right y-axis)
					// trace.push(traceWaves);

					trace.push(createTrace(x, waves[s].map(wave => wave/*((Math.max(...V[s]) - Math.min(...V[s]))/10) */+ E[s]), "$ \\psi_{n_s} $", legend, color, true));
				} else {
					// Handle the case when waves[s] is not an array or is undefined/null
					console.error("waves[" + s + "] is not an array or is undefined/null");
				}}
			legend = false;
			annotations.push({
					x: xmax + dx/2,
					y: E[s],
					text: "$n_{sample} = "+s+"$",
					showarrow: false,
					font: { size: 9, color: color},				
				});
		}
			switch (lang){
			case 0:
				titles="$ \\text{ } $";
				xlabel = "$\\text{x}$";
				ylabel = "$\\text{Potentials and numerical wave function} $";
				break;
			case 1:
				titles="$ \\text { } $";
				xlabel = "$\\text{x}$";
				ylabel = "$\\text{Potentiels et fonction d'onde numérique} $";
				break;}
			const ymin = V.min(), ymax = V.max(), dy = 0.5*(ymax-ymin)
			
			// 	// New parameters for the secondary y-axis
			// let ylabel2 = "$ \\varphi_{n_s} $ $";
			// let ymin2 = waves.min() + E.min(), ymax2 = waves.max();

			const layout = createLayout (titles, xlabel, ylabel, xmin, xmax + dx, ymin - dy/5, ymax - dy, annotations, false, true /*, ylabel2, ymin2, ymax2 + dy, 'black'*/)
			Plotly.newPlot(resultFig, {data:trace, layout:layout, config:config});	
		
	} catch (error) {
		console.error("An error occurred: " + error);
	}
}

//Training and Validation Losses
function plotFig1_a(resultFig) {
	try{
		Plotly.purge(resultFig);
	
		if ((jsondata.training_loss == null)) return;
		const loss = jsondata.training_loss;
		const x = loss[0], xmin = 0, xmax = x.max(), dx = 0.01*(xmax-xmin);
		var ymin = 0, ymax = Math.max(loss[1].max(), loss[2].max()), dy = 0.25*(ymax-ymin);;
		const trace = [];
		trace.push(createTrace(x, loss[2], "$ \\text{Training loss} $", false, 'black', true));

		const traceValidationLoss = createTrace(x, loss[1], "$ \\text{Validation loss} $", false, 'red', true);
		traceValidationLoss.yaxis = 'y2'; // Associate with yaxis2 (right y-axis)
        trace.push(traceValidationLoss);
		// trace.push(createTrace(x, loss[2], "$ \\text{Training loss} $", false, 'red', true));

		switch (lang){
			case 0:
				titles = "";
				xlabel = "$\\text{Epoch}$";
				ylabel = "$ \\text{Training loss}$";
				break;
			case 1:
				titles = "";
				xlabel = "$\\text{Epoch}$";
				ylabel = "$ \\text{} $"
				break;}


		// New parameters for the secondary y-axis
		let ylabel2 = "$ \\text{Validation loss} $";
		let ymin2 = ymin, ymax2 = ymax;
		const layout = createLayout (titles, xlabel, ylabel, xmin + dx, xmax, ymin, ymax + dy, false, true, false, ylabel2, ymin2, ymax2 + dy, 'red')
		
		Plotly.newPlot(resultFig, {data:trace, layout:layout, config:config});	
	} catch (error) {
		console.error("An error occurred: " + error);
	}
}


function plotFig2(resultFig) {
	// try{
		Plotly.purge(resultFig);
		const N_sample = parseInt($("#N_sampl").val());
		const Pot_Type = parseInt($("#var_Pot_Type").val());
		const trace = [], annotations = [];
		if ((jsondata.x == null)) return;
		const x = jsondata.x, xmin = x.min(), xmax = x.max(); dx = 0.25*(xmax-xmin);
		let xE = new Array(), vE = new Array(), vE_emp = new Array();
		xE.push(xmin,xmax,null);
		vE = Array().fill(0);	

		//WP for polynomial potential for one samples (N_sample) determined at this section (can be visualized any of set that  determined at the beginning of the calculation)
		if 	(Pot_Type == 0){
			if ((jsondata.E == null) || (jsondata.pred == null) || (jsondata.V == null)|| (jsondata.waves == null) || (jsondata.x == null) || (jsondata.alpha == null) ) return;
			const V = jsondata.V, waves = jsondata.waves, E = jsondata.E, E_emp = jsondata.E_emp, preds = jsondata.pred;
			var ymin = V[N_sample].min(), ymax = V[N_sample].max(), dy = (ymax-ymin)/2, ymin = ymin -0.2*dy, ymax = ymax - dy	
			
			switch (lang){
				case 0:
					title = "$ \\text {Polynomial potential} $";
					break;
				case 1:
					title = "$ \\text {Potentiel polynomial} $";
					break;}
			// potential
			trace.push(createTrace(x, V[N_sample], "$ V_{n_s} $", true, 'black', true));
			if ($("#var_WF_2").prop('checked')){
				// predicted wave function
				trace.push(createTrace(x, preds[N_sample].map(pred => pred/*((Math.max(...V[N_sample]) - Math.min(...V[N_sample]))/10)*/ + E[N_sample]), "$ \\tilde\\psi_{n_s} $", true, 'red', true));
				// real wave function
				trace.push(createTrace(x, waves[N_sample].map(wave => wave/*((Math.max(...V[N_sample]) - Math.min(...V[N_sample]))/10)*/ + E[N_sample]), "$ \\psi_{n_s} $", true, 'blue', true));
			}
			if ($("#var_E_2").prop('checked')){
				// empirical energy
				vE_emp.push(E_emp[N_sample],E_emp[N_sample],null);
				trace.push(createTrace(xE, vE_emp, "$\\tilde{E}$", true, 'red', true, 'dot'));
				// theoretical energytitle
				vE.push(E[N_sample],E[N_sample],null);
				trace.push(createTrace(xE, vE, "$ E $", true, 'blue', true, 'dot'));
			}
		}
		/*WP for Harmonic oscillators for one samples (N_sample) determined at this section 
		(can be visualized any of set n_sample = 10, that determined at the beginning of the calculation in the code!!!)*/
		else if	(Pot_Type == 1){
			if ((jsondata.E_HO == null) || (jsondata.pred_HO == null) || (jsondata.phi0_HO == null)|| (jsondata.potential_HO == null) || (jsondata.x == null) || (jsondata.alpha == null) ) return;
			const V = jsondata.potential_HO, waves = jsondata.phi0_HO, E = jsondata.E_HO, E_emp = jsondata.E_emp_HO, preds = jsondata.pred_HO;
			var ymin = V[N_sample].min(), ymax = V[N_sample].max(), dy = (ymax-ymin), ymin = ymin -dy/10, ymax = ymax - dy/5
	
			switch (lang){
				case 0:
					title = "$ \\text {Harmonic oscillators} $";
					break;
				case 1:
					title = "$ \\text {Oscillateur harmonique} $";
					break;}
			// potential
			trace.push(createTrace(x, V[N_sample], "$ V_{n_s} $", true, 'black', true));
			if ($("#var_WF_2").prop('checked')){
				// predicted wave function		
				trace.push(createTrace(x, preds[N_sample].map(pred => pred*((Math.max(...V[N_sample]) - Math.min(...V[N_sample]))/10) + E[N_sample]), "$ \\tilde\\psi_{n_s} $", true, 'red', true));
				// real wave function
				trace.push(createTrace(x, waves[N_sample].map(wave => wave*((Math.max(...V[N_sample]) - Math.min(...V[N_sample]))/10) + E[N_sample]), "$ \\psi_{n_s} $", true, 'blue', true));
			}
			if ($("#var_E_2").prop('checked')){
				// empirical energy
				vE_emp.push(E_emp[N_sample],E_emp[N_sample],null);
				trace.push(createTrace(xE, vE_emp, "$ \\tilde{E}$", true, 'red', true, 'dot'));
				// theoretical energy
				vE.push(E[N_sample],E[N_sample],null);
				trace.push(createTrace(xE, vE, "$ E $", true, 'blue', true, 'dot'));
			}
		}
		/*WF for Morse potential for one samples (N_sample) determined at this section 
		(can be visualized any of set n_sample = 10, that determined at the beginning of the calculation in the code!!!)*/
		else if	(Pot_Type == 2){
			if ((jsondata.E_morse == null) || (jsondata.pred_morse == null) || (jsondata.phi0_morse == null)|| (jsondata.potential_morse == null) || (jsondata.x == null) || (jsondata.alpha == null) ) return;
			const V = jsondata.potential_morse, waves = jsondata.phi0_morse, E = jsondata.E_morse, E_emp = jsondata.E_emp_morse, preds = jsondata.pred_morse;
			var ymin = V[N_sample].min(), ymax = V[N_sample].max(), dy = (ymax-ymin), ymin = ymin -0.2*dy, ymax = ymax - dy/10
	
			switch (lang){
				case 0:
					title = "$ \\text {Morse potential} $";
					break;
				case 1:
					title ="$ \\text {Potentiel Morse} $";
					break;}
			// potential
			trace.push(createTrace(x, V[N_sample], "$ V_{n_s} $", true, 'black', true));
			if ($("#var_WF_2").prop('checked')){
				// predicted wave function
				trace.push(createTrace(x, preds[N_sample].map(pred => pred*((Math.max(...V[N_sample]) - Math.min(...V[N_sample]))/10) + E[N_sample]), "$ \\tilde\\psi_{n_s} $", true, 'red', true));
				// real wave function
				trace.push(createTrace(x, waves[N_sample].map(wave => wave*((Math.max(...V[N_sample]) - Math.min(...V[N_sample]))/10) + E[N_sample]), "$ \\psi_{n_s} $", true, 'blue', true));
			}
			if ($("#var_E_2").prop('checked')){
				// empirical energy
				vE_emp.push(E_emp[N_sample],E_emp[N_sample],null);
				trace.push(createTrace(xE, vE_emp, "$ \\tilde{E}$", true, 'red', true, 'dot'));
				// theoretical energy
				vE.push(E[N_sample],E[N_sample],null);
				trace.push(createTrace(xE, vE, "$ E $", true, 'blue', true, 'dot'));
			}
		}

		switch (lang){
			case 0:
				titles = title;
				xlabel = "$\\text{x}$";
				ylabel = "$\\text{Real and predicted wave functions} $";
				break;
			case 1:
				titles = title;
				xlabel = "$\\text{x}$";
				ylabel = "$\\text{Fonctions d'onde réelle and prédite} $"
				break;}
		const layout = createLayout (titles, xlabel, ylabel, xmin, xmax, ymin, ymax, annotations)
		
		Plotly.newPlot(resultFig, {data:trace, layout:layout, config:config});	
		
	// } catch (error) {
	// 	console.error("An error occurred: " + error);
	// }
}

//Real and predicted mean energies
function plotFig3(resultFig) {
	try{
		Plotly.purge(resultFig);
		const Pot_Type = parseInt($("#var_Pot_Type").val());
		const trace = [], annotations = [];
		var xmin, xmax, ymin, ymax, dx, dy;

		//Energies for polynomial potential for N samples determined at the beginning of the calculation
		if 	(Pot_Type == 0){
			if ((jsondata.E == null) || (jsondata.E_emp == null) ) return;
			const E_emp = jsondata.E_emp, E = jsondata.E; // E - theoretical: x and y, E_emp - empirical:y

			ymin = E_emp.min(), ymax = E_emp.max(), dy = 0.2*(ymax-ymin)
			xmin = E.min(), xmax = E.max(); dx = 0.25*(xmax-xmin);

			switch (lang){
				case 0:
					title = "$ \\text {Energies for polynomial potential} $";
					break;
				case 1:
					title = "$ \\text {Energies pour le potentiel polynomial} $";
					break;}
			// empirical
			trace.push(createTrace(E, E_emp, "$ \\tilde{E} $", true, 'black', false));
			// theoretical
			trace.push(createTrace(E, E, "$ E $", true, 'red', true));
		}
		//Energies for Harmonic oscillators for N = 10 determined at the beginning of the calculation
		else if	(Pot_Type == 1){
			if ((jsondata.E_HO == null) || (jsondata.E_emp_HO == null) ) return;
			const E_emp = jsondata.E_emp_HO, E = jsondata.E_HO; // E - theoretical: x and y, E_emp - empirical:y

			ymin = E_emp.min(), ymax = E_emp.max(), dy = 0.2*(ymax-ymin)
			xmin = E.min(), xmax = E.max(); dx = 0.25*(xmax-xmin);

			switch (lang){
				case 0:
					title = "$ \\text {Energies for harmonic oscillator} $";
					break;
				case 1:
					title = "$ \\text {Energies pour l'oscillateur harmonique} $";
					break;}
			// empirical
			trace.push(createTrace(E, E_emp, "$ \\tilde{E} $", true, 'black', false));
			// theoretical
			trace.push(createTrace(E, E, "$ E $", true, 'red', true));
		}

		//Energies for Morse potential for N = 10 determined at the beginning of the calculation
		else if	(Pot_Type == 2){
			if ((jsondata.E_morse == null) || (jsondata.E_emp_morse == null) ) return;
			const E_emp = jsondata.E_emp_morse, E = jsondata.E_morse; // E - theoretical: x and y, E_emp - empirical:y

			ymin = E_emp.min(), ymax = E_emp.max(), dy = 0.2*(ymax-ymin)
			xmin = E.min(), xmax = E.max(); dx = 0.25*(xmax-xmin);

			switch (lang){
				case 0:
					title = "$ \\text {Energies for Morse potential} $";
					break;
				case 1:
					title = "$ \\text {Energies pour potentiel Morse} $";
					break;}
			// empirical
			trace.push(createTrace(E, E_emp, "$ \\tilde{E} $", true, 'black', false));
			// theoretical
			trace.push(createTrace(E, E, "$ E $", true, 'red', true));
		}
		switch (lang){
			case 0:
				titles = title;
				xlabel = "$\\text{Energy} $";
				ylabel = "$\\text{Energy} $";
				break;
			case 1:
				titles = title;
				xlabel = "$\\text{Energy} $";
				ylabel = "$\\text{Energy} $";
				break;
		}
		const layout = createLayout (titles, xlabel, ylabel, xmin - dx, xmax + dx, ymin - dy, ymax + dy, annotations, true, false)
		
		Plotly.newPlot(resultFig, {data:trace, layout:layout, config:config});	
		
	} catch (error) {
		console.error("An error occurred: " + error);
	}
}