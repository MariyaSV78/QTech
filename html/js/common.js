/*
(exercises in quantum mechanics)
Common js functions for working with server modeling
Authors:    A.Korovin [a.v.korovin73@gmail.com] 25/05/2019-30/04/2020;
            M. Sosnova [mariya.v.sosnova@gmail.com] 15/06/2023-15/07/2024;
*/

var lang = 0;
var Ryd = 219474.6313710;

var au_to_fm  = 0.5291772083e5;
var au_to_MeV = 1/3.67493245e4;
var au_to_sec = 2.4188843e-17

var is2D = false;
var isShowAnalyticSolution = false;
var isTemporal = false;

var LabelType=1;
var jsondata;
var Neig;
var Pot_Type;
var isReadingFile	= false;

var Eshift = 0;
var Perturbation_Type = 0; // no perturbation

var sessionID;


var layout_template = {
	autosize: false,
	width:	500,
	height:	400,
	margin: {
		l: 0,
		r: 0,
		b: 0,
		t: 0,
	},
	xaxis: {
		automargin: true,
		zeroline: false,
		showline: true,
		ticks: 'outside',
	},
	yaxis: {
		zeroline: false,
		ticks: 'outside',
		showline: true,
	},
	legend: {
		y: 1,
		x: 1,
		bgcolor: 'rgba(0,0,0,0)',
	},
	autosize: true,
};


/* creation of traces: x - datas for x-axis, y - for y-axis,
					name - legend description (str),
					showlegend (true or false),
					color - color of curves,
					useLine - curve type (true - for line, false - for marker),
					dash - type of line.*/
function createTrace(x, y, name, showlegend, color, useLine = true, dash) {
    const mode = useLine ? 'lines' : 'markers';
    return {
        x,
        y,
        type: 'scatter',
        mode,
        name,
        showlegend,
        line: useLine ? {
            color,
            width: 2,
            dash,
        } : {},
        marker: useLine ? {} : {
            color,
            size: 8,
        },
    };
}


//creation Layout: title of plot, 
//				   xlabel, ylabel - labels of axis,
//				   xmin, xmax, ymin, ymax - used intervals,
//				   annotations - not used by default
//				   showLine, zeroLine - true or false 
//				   ylabel2, ymin2, ymax2, color2 - paremeters fo right y-axis, not used by default
function createLayout(title, xlabel, ylabel, xmin, xmax, ymin, ymax, annotations, showLine, zeroLine, ylabel2, ymin2, ymax2, color2) {
	const defaultMargin = {
        l: 70,
        r: 70,
        b: 60,
        t: 60,
    };
	const layout ={
	    title,
        xaxis: { 
			title: xlabel, 
			range: [xmin, xmax], 
			showline: showLine, //true
			zeroline: zeroLine, //false
			ticks: 'outside',	
		},
        yaxis: { 
			title: ylabel,
			range: [ymin, ymax],
			showline: showLine, //true
			zeroline: zeroLine, //false
			ticks: 'outside',
			minor: {ticks: 'outside', nticks: 5, showgrid: true},
		},
		annotations,
		margin: defaultMargin,

    };
	if (ylabel2 && ymin2 !== undefined && ymax2 !== undefined) {
		layout.yaxis2 = {
			title: {
				text: ylabel2,
				font: {
					color: color2 // Change color for the title of yaxis2
					// Add other font properties as needed
				}
			},
			tickfont: {
				color: color2 // Change color for the tick labels of yaxis2
				// Add other font properties as needed
			},
			showline: showLine,
			linecolor: color2, // Set the color of y-axis line for yaxis2

			ticks: 'outside',	
			range: [ymin2, ymax2],
			overlaying: 'y',
			side: 'right',
		};
	}
    return layout;
}

// Generated a random color in hexadecimal format
function getRandomColor() {
	const letters = '0123456789ABCDEF';
	let color = '#';
	for (let i = 0; i < 6; i++) {
	  color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

function session_id() {
    var phpSessionId = document.cookie.match(/PHPSESSID=[A-Za-z0-9]+\;/i);

    if(phpSessionId == null) 
        return '';

    if(typeof(phpSessionId) == 'undefined')
        return '';

    if(phpSessionId.length <= 0)
        return '';

    phpSessionId = phpSessionId[0];

    var end = phpSessionId.lastIndexOf(';');
    if(end == -1) end = phpSessionId.length;

    return phpSessionId.substring(10, end);
//    return /SESS\w*ID=([^;]+)/i.test(document.cookie) ? RegExp.$1 : false;
}


function Add_Eigenvalues_selection(){
	let neig_old	= parseInt(document.getElementById("Eigenvalues").value);
	Neig		= parseInt($("#var_v_max").val());
	let E = jsondata.E;
	let var_j_to_print = parseInt($("#var_j_to_print").val());
	var sel = document.getElementById('Eigenvalues');

// clear option elements
	for (i = sel.options.length; i >= 0 ; i--)
		sel.remove(i);
	let k = 0;
	for (v = 0; v < Neig; v++) {
		for (j = 0; j < var_j_to_print; j++){

// create new option element
		var opt = document.createElement('option');

// set value property of opt
		opt.value = k;
		opt.innerHTML = 'E['+v+','+j+']='+(E[j][v]+Eshift).toFixed(5);
		sel.appendChild( opt );
		k++;
		}
	}
	if (isNaN(neig_old))
		document.getElementById("Eigenvalues").value = 0;
	else
		if (neig_old>Neig)
			document.getElementById("Eigenvalues").value = Neig-1;
		else
			document.getElementById("Eigenvalues").value = neig_old;
}

function Add_Nsampl_selection(){
	let N_sampl_old	= parseInt(document.getElementById("N_sampl").value);
	const Pot_Type = parseInt($("#var_Pot_Type").val());
	var N_sampl = document.getElementById('N_sampl');
	// clear option elements
	for (i = N_sampl.options.length; i >= 0 ; i--)
		N_sampl.remove(i);

	if (Pot_Type == 0){
		var N_to_print = parseInt($("#var_n_samples_print").val());
	} else {
		var N_to_print = 10;
	}
console.log('N sample Add', N_sampl)
console.log('Pot_Type', Pot_Type)

// create new option element
	for (n = 0; n < N_to_print; n++) {
		var opt = document.createElement('option');

// set value property of opt
		opt.value = n;
		opt.innerHTML = n;
		N_sampl.appendChild( opt );
	}
	if (isNaN(N_sampl_old))
		document.getElementById("N_sampl").value = 0;
	else
		if (N_sampl_old>N_to_print)
			document.getElementById("N_sampl").value = N_to_print-1;
		else
			document.getElementById("N_sampl").value = N_sampl_old;
	// $("#N_sampl").val('0');
}

function objectsAreEqual(obj1, obj2) {
	delete obj2.n_samples_print;

console.log("funct> obj2", obj2)
console.log("funct> obj1", obj1)

	const keys1 = Object.keys(obj1);
	const keys2 = Object.keys(obj2);
  
	if (keys1.length !== keys2.length) {
	  return false;
	}
  
	for (let key of keys1) {
	  if (obj1[key] !== obj2[key]) {
		return false;
	  }
	}
  
	return true;
}


// array functions
function getMaxOfArray(numArray) {
	return Math.max.apply(null, numArray);
}

function getMinOfArray(numArray) {
	return Math.min.apply(null, numArray);
}

function findFirstMinOfArray(numArray) {
	imin = numArray.length;
	for (var i=1; i<numArray.length-1; i++) {
		if (Math.abs(numArray[i])>1e-2 && numArray[i-1] > numArray[i] && numArray[i] < numArray[i+1]) {
			imin = i;
			break
		} 
	} 
	return imin;
}

function findFirstMaxOfArray(numArray) {
	imax = 0;
	for (var i=1; i<numArray.length-1; i++) {
		if (Math.abs(numArray[i])>1e-2 && numArray[i-1] < numArray[i] && numArray[i] > numArray[i+1]) {
			imax = i;
			break
		} 
	} 
	return imax;
}

Array.prototype.max = function() {
// 	if (this[0].length>1)
	if (this[0] instanceof Array)
		return Math.max.apply(null, this.map(x=>x.max()));
	else
		return Math.max.apply(null, this);
};

Array.prototype.min = function() {
// 	if (this[0].length>1)
	if (this[0] instanceof Array)
		return Math.min.apply(null, this.map(x=>x.min()));
	else
		return Math.min.apply(null, this);
};

Array.prototype.everyisNaN = function() {
// 	if (this[0].length>1)
	if (this[0] instanceof Array)
		return this.every(x=>x.everyisNaN());
	else
		return this.every(x=>(isNaN(x) || x==null))
};


function ArraySlice(array,n1,n2){
	if (n1>=n2){
		return array[n1];
	}else{
		return array.slice(n1,n2);
	}
}

function Auto_scale(dE,wf,isProbability){
	wf = wf.filter(x => !Number.isNaN(x));
	if (isProbability){
		scale = dE*(1-0.05)/wf.map(x => x*x).max();
	}else{
		scale = dE*(1-0.05)/wf.map(Math.abs).max()/2;
	}
	return scale;
}

// hide div tag
function HideDiv4(hdiv,div,divIDblink){
	if($('#'+hdiv).is(":hidden")){
		$('#'+hdiv).show();
		$('#'+div).css('box-shadow', 'none');
		window.dispatchEvent(new Event('resize'));
	}else{
		$('#'+hdiv).hide();
		$('#'+div).css('box-shadow', '0px 8px 10px 0px rgba(0, 0, 0, 0.5), inset 0px 4px 0px 1px #efffff, inset 0px -3px 1px 1px rgba(100,198,197,.5)');
	}

	var x1 = document.getElementById(divIDblink);
	if (x1.innerHTML === '[+]') {
		x1.innerHTML = '[&#8722;]';
	} else {
		x1.innerHTML = '[+]';
	}
}

// check data input
function checkInput(){
	return !Array.prototype.slice.call(document.getElementsByClassName("numinput")).some( x => isNaN(x.value) )
}

function put_innerHTMLmath(node,str)
{
	node.innerHTML=str;
	MathJax.Hub.Queue(["Typeset",MathJax.Hub,node]); // mathjax 2.7.8 
}

//  to find the closest index in an array for a given value
function findClosestIndex(arr, target) {
    if (arr.length === 0) return -1; // Handle empty array case

    return arr
        .map((value, index) => ({ value, index, difference: Math.abs(value - target) })) // Create an array of objects with value, index, and difference
        .reduce((closest, current) => current.difference < closest.difference ? current : closest) // Find the object with the smallest difference
        .index; // Return the index of that object
}