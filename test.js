var express = require( 'express' );
var app = express();

var fs = require( 'fs' );
var https = require( 'https' );
var options = {
  key: fs.readFileSync( "/etc/letsencrypt/live/www.mokumokuver3.tk/privkey.pem" ),
  cert: fs.readFileSync( "/etc/letsencrypt/live/www.mokumokuver3.tk/cert.pem" )
};
var https_server = https.createServer( options, app );
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
function choice_musics(img) {// 今は明度だけで適当にやっている
    //let hsv_img = new Image();
    //hsv_img.width = img.width;
    //hsv_img.height = img.height;
    let v_sum = 0;
    for(let i=0;i<img.data.length;i=i+4){
        let rgb = [img.data[i],img.data[i+1],img.data[i+2]];
        let hsv = rgb2hsv(rgb);
        //hsv_img[i]=hsv[0];hsv_img[i+1]=hsv[1];hsv_img[i+2]=hsv[2];
        v_sum += hsv[2];
    }
    let v_ave = v_sum / (img.width * img.height);
    console.log("v average is "+ v_ave);
    let attri_idx = 0;
    if(v_ave > 0.8)
      attri_idx = 0;
    else if(v_ave > 0.6)
      attri_idx = 1;
    else if(v_ave > 0.4)
      attri_idx =2;
    else if(v_ave > 0.2)
      attri_idx = 3;
    else
      attri_idx = 4;
    return attri_idx;
};
const music_title = ["calm", "excited", "fashionable", "funny", "relax", "mirai_komachi"];
const calm = ["calm/cafebossa.mp3", "calm/NOIR.mp3", "calm/Rhodes_Trip.mp3", "calm/Silence.mp3", "calm/落ち着いた？.mp3"];
const excited = ["excited/Star_Rising_Up.mp3", "excited/Stream.mp3", "excited/Sunrise.mp3", "excited/swing_swing.mp3"];
const fashionable = ["fashionable/Fizzing_Heart.mp3", "fashionable/Midnight_Moon.mp3", "fashionable/Sepia_Talk.mp3", 
                    "fashionable/the_opening_of_a_book.mp3", "fashionable/おどれグロッケンシュピール.mp3", "fashionable/作りかけ豆乳100％.mp3"];
const funny = ["funny/CLAP!.mp3", "funny/parasol.mp3", "funny/tekutekunamikimiti.mp3", "funny/ちょっと楽しい.mp3", "funny/パステルハウス.mp3"];
const relax = ["relax/Easier.mp3", "relax/Martini.mp3", "relax/ゆったりまったり.mp3", "relax/雨の日リラックス.mp3", "relax/青空空港.mp3"];
const mirai_komachi = ["mirai_komachi/Mirai_sato_master_180604.wav"];
const music_lists = [calm, excited, fashionable, funny, relax, mirai_komachi];
app.get( '/hello', function( req, res ){
  res.contentType( "text/plain" );
  res.writeHead( 200 );
  var img = document.createElement("img");
  img.src = "image/sample1.jpg";
  let idx = choice_musics(img); 
  res.send(music_lists[idx]);
});

var https_port = 8443;

https_server.listen( https_port );

console.log( "server starging on " + https_port + ' ...' );