/*
(exercises in quantum mechanics)
function of reading input data from a client PC

Author: Alexander V. Korovin [a.v.korovin73@gmail.com]
25/05/2019-30/04/2020
*/

var x;
var V;

function readSingleFile(evt) {
	console.log('readSingleFile');

	var file = evt.target.files[0];
	//alert(file.toString())
	if (!file) {
		alert("File not found!")
		return;
	}
	var reader = new FileReader();
	reader.onload = function(e) {
//		var array_tmp = e.target.result.split('\n').map(function(ln){return ln.split('\t');});
		var array_tmp = e.target.result.split('\n').map(x => x.trim().replace(/\s\s+/g, '\t').split('\t'));
		x = array_tmp.map(x => parseFloat(x[0]));
		V = array_tmp.map(x => parseFloat(x[1]));
		
		isReadingFile = false;
		ServerUpdate(0, 0);
	};
	reader.readAsText(file);
}
