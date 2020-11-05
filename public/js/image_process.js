var inputfile = document.getElementById('inputFile');
var canvas = document.getElementById('canvas');
var ctx = c.getContext('2d');
inputfile.addEventListener("change", function(event) {
  var file = event.target.files;
  var reader = new FileReader();
  reader.readAsDataURL(file[0]);
  reader.onload = function() {
    var dataUrl = reader.result; // readed File url
    var img = new Image();
    img.src = dataUrl;
    
    img.onload = function(){ // when image is readed.
      canvas.width = img.width;
      canvas.height = img.height;
      let src = ctx.getImageData(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img,0,0);
    }
  }
}, false);

function rgb2hsv ( rgb ) {
	var r = rgb[0] / 255 ;
	var g = rgb[1] / 255 ;
	var b = rgb[2] / 255 ;

	var max = Math.max( r, g, b ) ;
	var min = Math.min( r, g, b ) ;
	var diff = max - min ;

	var h = 0 ;

	switch( min ) {
		case max :
			h = 0 ;
		break ;

		case r :
			h = (60 * ((b - g) / diff)) + 180 ;
		break ;

		case g :
			h = (60 * ((r - b) / diff)) + 300 ;
		break ;

		case b :
			h = (60 * ((g - r) / diff)) + 60 ;
		break ;
	}

	var s = max == 0 ? 0 : diff / max ;
	var v = max ;

	return [ h, s, v ] ;
};