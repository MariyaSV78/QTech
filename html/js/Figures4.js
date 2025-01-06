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

function plotFig3(resultFig) {
	try{
		Plotly.purge(resultFig);
	
		if ((jsondata.energies == null) || (jsondata.n_g == null)) return;
		Ratio_0 = parseInt($("#var_Ej_Ec").val());
		const trace = [], annotations = [];
		const E = jsondata.energies;
		const x = jsondata.n_g, xmin = x.min(), xmax = x.max(); dx = 0.25*(xmax-xmin);
		let xE = new Array();

		let legend = true, color = 'rgb(0, 0, 0)';

		for(let i = 0; i < 3; i++){
			xE = Array().fill(0);	
			for(let v = 0; v < x.length; v++){
				xE.push(E[v][i])}

			console.log(xE)
			color = getRandomColor()
			

			trace.push( createTrace(x, xE, `${i} th state`, legend, color, true));

		}	
		// $E_j/E_C$ =" ${Ratio_0}
			switch (lang){
			case 0:
				titles= "$ \\text{Energies of states as a function of parameter } n_g$";
				xlabel = "$n_g$";
				ylabel = "$E/E_{C}$";
				break;
			case 1:
				titles="\\text{Énergies des états en fonction du paramètre } n_g$";
				xlabel = "$n_g$";
				ylabel = "$E/E_{C}$";
				break;}
			const ymin = E.min(), ymax = E.max(), dy = 0.1*(ymax-ymin)
	console.log(ymax, ymin, dy)
			const layout = createLayout (titles, xlabel, ylabel, xmin, xmax, ymin - dy, ymax + dy, false, true, true /*, annotations , ylabel2, ymin2, ymax2 + dy, 'black'*/)
			Plotly.newPlot(resultFig, {data:trace, layout:layout, config:config});	
		
	} catch (error) {
		console.error("An error occurred: " + error);
	}
}

