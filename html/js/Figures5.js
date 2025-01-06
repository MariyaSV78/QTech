/*
(exercises in quantum mechanics)
Visualisation of calculated data from the server calculations using plotly
Authors:    A.Korovin [a.v.korovin73@gmail.com] 25/05/2019-30/04/2020;
            M. Sosnova [mariya.v.sosnova@gmail.com] 15/06/2023-15/07/2024;
*/

let config={responsive: true,
			scrollZoom: true,
			};
// 
function plotFig1(resultFig) {
	try{
		Plotly.purge(resultFig);
	
		if ((jsondata.barrier_energy_values == null) || (jsondata.wf_energy_values == null)) return;
		const z = jsondata.z.map(element => element * 1e9);
		
		const zmin = z.min(), zmax = z.max(), dz = 0.05*(zmax-zmin);
		const BE = jsondata.barrier_energy_values, xmin = BE.min(), xmax = BE.max(), dx = 0.25*(xmax-xmin);
		const WF = jsondata.wf_energy_values, ymin = WF.min(), ymax = WF.max(), dy = 0.05*(ymax-ymin);
		const E0 = parseInt($("#var_E_0").val());
		console.log(E0)		
		const trace = []
		
		const traceBE = createTrace(BE, z, false, false, 'black', true);
		traceBE.line.width = 3; // Set the width of the line to make it thicker
		trace.push(traceBE); //barrier
		const traceWF = createTrace(WF, z, false, false, 'blue', true)
		traceWF.xaxis = 'x2'; // Associate with xaxis2 
		trace.push(traceWF); //wave function
		const traceE0 = createTrace(1, 0, false, false, 'red', true);
		trace.push(traceE0); //wave function

		switch (lang){
		case 0:
			titles= "";
			xlabel = "Energy";
			ylabel = "z (nm)";
			break;
		case 1:
			titles="";
			xlabel = "Energie";
			ylabel = "z (nm)";
			break;}
			// const ymin = E.min(), ymax = E.max(), dy = 0.1*(ymax-ymin)
			const layout = createLayout (titles, xlabel, ylabel, xmin, xmax, zmin - dz, zmax + dz, false, true /*, annotations , ylabel2, ymin2, ymax2 + dy, 'black'*/)
			layout.xaxis2 = {				
				range: [ymin, ymax],
				zeroline: false,
				showticklabels: false,
				overlaying: 'x',
				// side: 'top',

			};
	
			Plotly.newPlot(resultFig, {data:trace, layout:layout, config:config});	
		
	} catch (error) {
		console.error("An error occurred: " + error);
	}
}


function plotFig3(resultFig) {
	try{
		Plotly.purge(resultFig);
	
		if ((jsondata.J_1 == null) || (jsondata.J_2 == null) || (jsondata.J_3 == null) || (jsondata.V0 == null)) return;
		
		// const trace = []
		let Vrange = parseInt($("#var_Vrange").val());
		const J1 = jsondata.J_1.map(element => element * 1e9); 
		const J2 = jsondata.J_2.map(element => element * 1e9); 
		const J3 = jsondata.J_3.map(element => element * 1e9); 

		const V0 = jsondata.V0;
		let xmin, xmax, dx;
		let ymax, ymin;
		let trace = [];

		if (Vrange == 0){
			const J = jsondata.J.map(element => element * 1e9);
			ymin = J.min(), ymax = J.max();
			xmin = V0.min(), xmax = V0.max(), dx = 0.05*(xmax-xmin);
			trace.push(createTrace(V0, J, false, false, 'black', true));
			if ($("#lowR").prop('checked')){
				let filtered = filterData(V0, J1);
				trace.push(createTrace(filtered.V, filtered.J, false, false, 'blue', false)); 
			} 
			if ($("#intermediateR").prop('checked')){
				let filtered = filterData(V0, J2);
				trace.push(createTrace(filtered.V, filtered.J, false, false, 'red', false)); 
			} 
			if ($("#highR").prop('checked')){
				let filtered = filterData(V0, J3);
				trace.push(createTrace(filtered.V, filtered.J, false, false, 'green', false)); 
			} 

		}
		if (Vrange == 1){
			let filtered = filterData(V0, J1);
			console.log("filtered", filtered.J, filtered.V)
			ymin = filtered.J.min(), ymax = filtered.J.max();
			xmin = filtered.V.min(), xmax = filtered.V.max(), dx = 0.05*(xmax-xmin);
			trace.push(createTrace(filtered.V, filtered.J, false, false, 'blue', false)); 

		}			
		else if (Vrange == 2){	
			let filtered = filterData(V0, J2);
			ymin = filtered.J.min(), ymax = filtered.J.max();
			xmin = filtered.V.min(), xmax = filtered.V.max(), dx = 0.05*(xmax-xmin);
			trace.push(createTrace(filtered.V, filtered.J, false, false, 'red', false)); 
		}
		else if (Vrange == 3){	
			let filtered = filterData(V0, J3);
			ymin = filtered.J.min(), ymax = filtered.J.max();
			xmin = filtered.V.min(), xmax = filtered.V.max(), dx = 0.05*(xmax-xmin);
			trace.push(createTrace(filtered.V, filtered.J, false, false, 'green', false)); 
		}
		switch (lang){
		case 0:
			titles= "";
			xlabel = "V (V)";
			ylabel = "I (nA)";
			break;
		case 1:
			titles="";
			xlabel = "Energie";
			ylabel = "z (nm)";
			break;}

			const layout = createLayout (titles, xlabel, ylabel, xmin, xmax, ymin, ymax, false, true, false /*, annotations , ylabel2, ymin2, ymax2 + dy, 'black'*/)
	
			Plotly.newPlot(resultFig, {data:trace, layout:layout, config:config});	
		
	} catch (error) {
		console.error("An error occurred: " + error);
	}
}


function filterData(V, J) {
    let filteredV = [];
    let filteredJ = [];
    for (let i = 0; i < V.length; i++) {
        if (J[i] !== null && J[i] !== 0 && J[i] >= 0) {
console.log('J[i]', J[i])
            filteredV.push(V[i]);
            filteredJ.push(J[i]);
        }
console.log('filteredJ', filteredJ)

    }
    return { V: filteredV, J: filteredJ };
}