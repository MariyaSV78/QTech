/*
(exercises in quantum mechanics)
function of saving calculated data on a client PC

Authors:    A.Korovin [a.v.korovin73@gmail.com] 25/05/2019-30/04/2020;
            M. Sosnova [mariya.v.sosnova@gmail.com] 15/06/2023-15/07/2024;
*/

function Clear_accuracy(num){
	if (num==null)
		return "NaN";
	else
		return parseFloat(num).toFixed(10
		);
}

function print_var(vect,i){
	if(vect!=null)
 		return "\t"+Clear_accuracy(vect[i]);
 	else
 		return "";
}

function savefile(filename,data,type){
	var file = new Blob([data], {type: type});
	if (window.navigator.msSaveOrOpenBlob)
		window.navigator.msSaveOrOpenBlob(file, filename);
	else { 
		var atmp = document.createElement("a"),
			urltmp = URL.createObjectURL(file);
		atmp.href = urltmp;
		atmp.download = filename;
		document.body.appendChild(atmp);
		atmp.click();

		setTimeout(function() {
			document.body.removeChild(atmp);
			window.URL.revokeObjectURL(urltmp);  
			}, 0);

	}
}

// Function to download data to a file : Photoionisation
function save_data1(type, filename){
	var data;

	try{
		var x = jsondata.r_i;

		if (type == 1){
			data = "% r";

			var y1 = jsondata.y1;
			var y2 = jsondata.y2;	
		
			data += "\ty1";
			data += "\ty2";
			data += "\n";

			for(i=0;i<x.length;i++){
				data += Clear_accuracy(x[i]);
				data += print_var(y1,	i);
				data += print_var(y2,	i);
				data += "\n";
			}
		}
		else if (type == 2) {
			data = "% r";
			var y1 = jsondata.chi_f1;
			var y2 = jsondata.chi_f1;

			data += "\tchi_f1";
			data += "\tchi_f1";
			data += "\n";

			for(i=0;i<x.length;i++){
				data += Clear_accuracy(x[i]);
				data += print_var(y1,	i);
				data += print_var(y2,	i);
				data += "\n";
			}
		}
		else if (type == 3) {
			data = "% energy_f(eV)";
			data += "\tcs_regular * 10^-18";
			data += "\tcs_diverges * 10^-18 ";
			data += "\n";
			var x1 = jsondata.energy_f;
			var y1 = jsondata.cross_section;
			var y2 = jsondata.cross_section2;
			let y11 = y1.map(element => element * 10**18);
			let y12 = y2.map(element => element * 10**18);

			for(i=0;i<x1.length;i++){
				data += Clear_accuracy(x1[i]);
				data += print_var(y11,	i);
				data += print_var(y12,	i);

				data += "\n";
			}

			data += "\n";
			var x2 = jsondata.r_ph;
			var y21 = jsondata.chi_i;
			var y22 = jsondata.chi_f;

			data += "%r(a.e)";
			data += "\t\tchi_i";
			data += "\t\tchi_f";

			data += "\n";

			for(i=0;i<x2.length;i++){
				data += Clear_accuracy(x2[i]);
				data += print_var(y21,	i);
				data += print_var(y22,	i);

				data += "\n";
			}

		}
		console.log("save_json_data: filename="+filename);
		savefile(filename,data,"txt");
	} catch (error) {
		console.error("An error occurred: " + error.message);
   	}	
}


// Function to download data to a file: Spectroscopy of molecule
function save_data2(type, filename){
	var data;
	try{
		let j_to_display = parseInt($("#var_j_to_print").val())
		var x = jsondata.r_A;		

		if (type == 1){ //potential energy
			data = "% r"
			var y = jsondata.V[j_to_display];
	
			data += "\tV";
			data += "\n";

			for(i=0;i<x.length;i++){
				data += Clear_accuracy(x[i]);
				data += print_var(y, i);
				data += "\n";
			}
		} else if (type == 2) { //wave function
			
			data = "% r"
			data += "\tpsi[v]";

			let neig = parseInt($("#Eigenvalues").val());

			let j = 0;
			let v = 0;
			var y = jsondata.psi[j][v];

			j = neig % j_to_display;
			v =  Math.floor(neig / j_to_display);
		
			data += "\t\tfor E["+v+","+j+"] = ";
			data += jsondata.E[j][v];
			data +="\n"

			for(i=0;i<x.length;i++){
				data += Clear_accuracy(x[i]);
				data += print_var(y, i);
				data += "\n";
			}
		} else if (type == 3){
			let j = parseInt($("#var_j_max").val());
			let v = 0; 
			var E = jsondata.E;

			if (filename == 'P_branch'){
				data = "% j";
				data += "\tjp"
				data += "\tE_[1,jp]-E_[0,j] \n"
				for(i=0; i<j-1; i++){
					data += i;
					data += "\t"+(i+1)+"\t";

					data += (E[i+1][v+1]- E[i][v]).toPrecision(7)+"\n";
				}
			}
			if (filename == 'R_branch'){
				data = "% jp";
				data += "\tj"
				data += "\tE[1,jp]-E[0,j] \n"
				for(i=0; i<j-1; i++){
					data += i;
					data += "\t"+(i+1)+"\t";
					data += (E[i][v+1]- E[i+1][v]).toPrecision(7)+"\n";
				}
			}
		} else if (type == 4) {
			data = "% r"
			data += "\t\tD(r)";
			data += "\n";
			var y = jsondata.D;

			for(i=0; i<x.length; i++){
				data += Clear_accuracy(x[i]);
				data += print_var(y,	i);
				data += "\n";
			}

		} else if (type == 5) {
			data = "% Delta_P:E(vj)"
			var x1 = jsondata.Delta_P;		
		
			data += "\t\tP";
			var y1 = jsondata.P;
			
			data += "\t\t\tDelta_R:E(vj)"
			var x2 = jsondata.Delta_R;		
				
			data += "\t\tR";
			data += "\n";
			var y2 = jsondata.R;

			for(i=0;i<x1.length;i++){
				data += Clear_accuracy(x1[i]);
				data += print_var(y1,	i);
				data += "\t";

				data += Clear_accuracy(x2[i]);
				data += print_var(y2,	i);
				data += "\n";
			}
		}
		console.log("save_json_data: filename="+filename);
		savefile(filename,data,"txt");

	} catch (error) {
		console.error("An error occurred: ", error);
	}	
}

// Function to download data to a file: :achine learning
function save_data3(type){
	var data;
	var filename;

	try{
		const N_sample = parseInt($("#N_sampl").val());
		var x = jsondata.x;
		Pot_Type = parseInt($("#var_Pot_Type").val());
		if(Pot_Type == 0){
			const V = jsondata.V[N_sample], waves = jsondata.waves[N_sample], preds = jsondata.pred[N_sample], E = jsondata.E;
			if (type == "WF"){ //potential energy+WF(pred+theory)
				filename = "WF_polynomial"
				data = "% x"
				data += "\t\tV";
				data += "\t\tWF(real)";
				data += "\t\tWF(predict)";
				data += "\n";

				for(i=0;i<x.length;i++){
					data += Clear_accuracy(x[i]);
					data += print_var(V, i);
					data += print_var(waves, i);
					data += print_var(preds, i);
					data += "\n";
	
				}
			} 
			if (type == "E"){//energy
				filename = "E_polynomial"
				const E_emp = jsondata.E_emp;
				data = "% E"
				data += "\tE";
				data += "\tE-emp";
				data += "\n";
				for(i=0;i<E.length;i++){
					data += Clear_accuracy(E[i]);
					data += print_var(E, i);
					data += print_var(E_emp, i);
					data += "\n";
				}
			}
		}else if(Pot_Type == 1){
			const V = jsondata.potential_HO[N_sample], waves = jsondata.phi0_HO[N_sample], preds = jsondata.pred_HO[N_sample], E = jsondata.E_HO;
		
			if (type == "WF"){ //potential energy+WF(pred+theory)
				filename = "WF_Harmonic_oscillator"
				data = "% x"
				data += "\t\tV";
				data += "\t\tWF(real)";
				data += "\t\tWF(predict)";
				data += "\n";

				for(i=0;i<x.length;i++){
					data += Clear_accuracy(x[i]);
					data += print_var(V, i);
					data += print_var(waves, i);
					data += print_var(preds, i);
					data += "\n";
				}
			} 
			if (type == "E"){//energy
				filename = "E_Harmonic_oscillator"
				const E_emp = jsondata.E_emp_HO;
				data = "% E"
				data += "\tE";
				data += "\tE-emp";
				data += "\n";
				for(i=0;i<E.length;i++){
					data += Clear_accuracy(E[i]);
					data += print_var(E, i);
					data += print_var(E_emp, i);
					data += "\n";
				}
			}
		} else if(Pot_Type == 2){ 
			const V = jsondata.potential_morse[N_sample], waves = jsondata.phi0_morse[N_sample], preds = jsondata.pred_morse[N_sample], E = jsondata.E_morse;
		
			if (type == "WF"){ //potential energy+WF(pred+theory)
				filename = "WF_Morse"
				data = "% x"
				data += "\t\tV";
				data += "\t\tWF(real)";
				data += "\t\tWF(predict)";
				data += "\n";

				for(i=0;i<x.length;i++){
					data += Clear_accuracy(x[i]);
					data += print_var(V, i);
					data += print_var(waves, i);
					data += print_var(preds, i);
					data += "\n";
				}
			} 
			if (type == "E"){//energy
				filename = "E_Morser"
				const E_emp = jsondata.E_emp_morse;
				data = "% E"
				data += "\tE";
				data += "\tE-emp";
				data += "\n";
				for(i=0;i<E.length;i++){
					data += Clear_accuracy(E[i]);
					data += print_var(E, i);
					data += print_var(E_emp, i);
					data += "\n";
				}
			}
		}	
		console.log("save_json_data: filename="+filename);
		savefile(filename,data,"txt");

	} catch (error) {
		console.error("An error occurred: ", error);
	}	
}