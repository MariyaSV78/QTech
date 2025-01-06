function print_buttonsection(id, str1,ref1, str2,ref2, str3,ref3, type){
	console.log('print_buttonsection id='+id+', str1='+str1+', str2='+str2+', str3='+str3+', type='+type);

	var str = String.raw`<div class="divbuttons">`;

	// left button
	str += String.raw`<div class="divbutton">`;
	if(str1!=''){ 
		str += String.raw`<p align="center">`;
		str += String.raw`<svg id="mysvg" viewBox="0 0 100 25" onclick="window.location.href='`+ref1+String.raw`'">`;
		str += String.raw`<path id="SVGstroke"`;
		if(type==0){ // top button section
			str += String.raw`d ="M   9  5`;
			str += String.raw`L 99  5`;
			str += String.raw`L 99  24`;
			str += String.raw`L  9  24`;
			str += String.raw`L  1  15`;
			str += String.raw`Z"/>`;
			str += String.raw`<text id="SVGtext" x="50" y="17.5">`;
		}else{
			str += String.raw`d ="M   9  1`;
			str += String.raw`L 99  1`;
			str += String.raw`L 99  20`;
			str += String.raw`L  9  20`;
			str += String.raw`L  1  10`;
			str += String.raw`Z"/>`;
			str += String.raw`<text id="SVGtext" x="50" y="12.5">`;
		}
		str += str1+String.raw`</text></svg></p>`;
	}
	str += String.raw`</div>`; // divbutton

	
	// central button
	str += String.raw`<div class="divbutton">`;
	str += String.raw`<p align="center">`;
	str += String.raw`<svg id="mysvg" viewBox="0 0 100 25" onclick="window.location.href='`+ref2+String.raw`'">`;
	str += String.raw`<path id="SVGstroke"`;
	if(type==0){ // top button section
		str += String.raw`d ="M  1  5`;
		str += String.raw`L 50  1`;
		str += String.raw`L 99  5`;
		str += String.raw`L 99  24`;
		str += String.raw`L 50  20`;
		str += String.raw`L  1  24`;
		str += String.raw`Z"/>`;
		str += String.raw`<text id="SVGtext" x="50" y="17.5">`;
	}else{
		str += String.raw`d ="M  1  1`;
		str += String.raw`L 50  5`;
		str += String.raw`L 99  1`;
		str += String.raw`L 99  20`;
		str += String.raw`L 50  24`;
		str += String.raw`L  1  20`;
		str += String.raw`Z"/>`;
		str += String.raw`<text id="SVGtext" x="50" y="12.5">`;
	}
	str += str2+String.raw`</text></svg></p>`;
	str += String.raw`</div>`; // divbutton


	// right button
	str += String.raw`<div class="divbutton">`;
	if(str3!=''){
		str += String.raw`<div class="divbutton">`;
		str += String.raw`<p align="center">`;
		str += String.raw`<svg id="mysvg" viewBox="0 0 100 25" onclick="window.location.href='`+ref3+String.raw`'">`;
		str += String.raw`<path id="SVGstroke"`;
		if(type==0){ // top button section
			str += String.raw`d ="M  1  5`;
			str += String.raw`L 90  5`;
			str += String.raw`L 99  15`;
			str += String.raw`L 90  24`;
			str += String.raw`L  1  24`;
			str += String.raw`Z"/>`;
			str += String.raw`<text id="SVGtext" x="50" y="17.5">`;
		}else{
			str += String.raw`d ="M  1  1`;
			str += String.raw`L 90  1`;
			str += String.raw`L 99  10`;
			str += String.raw`L 90  20`;
			str += String.raw`L  1  20`;
			str += String.raw`Z"/>`;
			str += String.raw`<text id="SVGtext" x="50" y="12.5">`;
		}
		str += str3+String.raw`</text></svg></p>`;
	}
	str += String.raw`</div>`; // divbutton

	str += String.raw`</div>`; //divbuttons

	document.getElementById(id).innerHTML = str;
}

