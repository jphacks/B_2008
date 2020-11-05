const express = require("express");
const pug = require("pug");
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require( 'fs' );
const https = require( 'https' );
const line = require('@line/bot-sdk');
require("dotenv").config();

const app = express();

app.set("views", "./views");
app.set("view engine", "pug");
app.use(express.static('public'));
// app.use(express.static('../../s3/mokumoku'));
app.use(bodyParser.urlencoded({extended: false}));


//先ほど書いた.envファイルからアクセストークンとチャンネルシークレットを引っ張ってくる。
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};


//--通信設定------------------------------
//TODO: httpsの設定書く
//const adress = "54.150.52.212";
//const port = 1106;
// app.listen(port);
// console.log(`server running at http://${adress}:${port}/`);


var https_port = 3000;
const options = {
  key: fs.readFileSync( "/etc/letsencrypt/live/www.mokumokuver3.tk/privkey.pem" ),
  cert: fs.readFileSync( "/etc/letsencrypt/live/www.mokumokuver3.tk/fullchain.pem" )
};
const https_server = https.createServer( options, app );
https_server.listen( https_port );
console.log(`server running at https://www.mokumokuver3.tk:${https_port}`);

//--home-----------------------------------
app.get("/", (req,res,next) => {
    console.log("home");
    res.render("index", {title:"BGM", message: "何たらするアプリ。"});
});

//--post&リストゲットするところ----------------------------
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
    return music_lists[attri_idx];
};

// const upload = multer({dest:'uploaded'})
// app.post("/img_post", upload.single('img'), (req,res,next) => {
    
//     choice_musics(img)
//     console.log(`originalname: ${req.file.originalname}`);
//     console.log(`path: ${req.file.path}`);
//     // res.send(JSON.stringify({ok: true, audio_list:["mattari1.mp3", "moriagaru.mp3", "sittori1.mp3"]}))
//     res.send(JSON.stringify({ok: true}))
// });

const music_title = ["calm", "excited", "fashionable", "funny", "relax", "mirai_komachi"];
const calm = ["calm/cafebossa.mp3", "calm/NOIR.mp3", "calm/Rhodes_Trip.mp3", "calm/Silence.mp3", "calm/落ち着いた？.mp3"];
const excited = ["excited/Star_Rising_Up.mp3", "excited/Stream.mp3", "excited/Sunrise.mp3", "excited/swing_swing.mp3"];
const fashionable = ["fashionable/Fizzing_Heart.mp3", "fashionable/Midnight_Moon.mp3", "fashionable/Sepia_Talk.mp3", 
                    "fashionable/the_opening_of_a_book.mp3", "fashionable/おどれグロッケンシュピール.mp3", "fashionable/作りかけ豆乳100％.mp3"];
const funny = ["funny/CLAP!.mp3", "funny/parasol.mp3", "funny/tekutekunamikimiti.mp3", "funny/ちょっと楽しい.mp3", "funny/パステルハウス.mp3"];
const relax = ["relax/Easier.mp3", "relax/Martini.mp3", "relax/ゆったりまったり.mp3", "relax/雨の日リラックス.mp3", "relax/青空空港.mp3"];
const mirai_komachi = ["mirai_komachi/Mirai_sato_master_180604.mp3"];
const music_lists = [calm, excited, fashionable, funny, relax, mirai_komachi];

// ポストするとこ(サイトからXHR用)
app.post("/img_post", (req,res,next) => {
    const i = Math.round( Math.random()* (music_title.length-1) );
    const audio_title = music_title[i];
    const audio_list=music_lists[i];
    // ----------------------------------------------------
    // 
    // リストの処理書くところ
    // 
    // ----------------------------------------------------
    res.send(JSON.stringify({ok: true, audio_title, audio_list}))
});

// music player 単体用(LINE用　post面倒そうだったので)
app.get("/music_player", (req,res,next) => {
    console.log("music player");
    let i = req.query.index;
    if (i<0 || i>music_title.length-1){
    	i = Math.round( Math.random()* (music_title.length-1) );
    }
    console.log(i)
    let music_idx = choice_musics("sample1.jpg");
    const audio_title = music_title[i];
    const audio_list=music_lists[i];
    res.render("music_player", {title:"BGM", message: "何たらするアプリ。", 
    							audio_title:audio_title, audio_list:audio_list});
});

// LINE用のところ PlayerOnly
app.post('/webhook', line.middleware(config), (req, res) => {
    console.log("LINE post: ", req.body.events);

    //ここのif分はdeveloper consoleの"接続確認"用なので削除して問題ないです。
    if(req.body.events[0].replyToken === '00000000000000000000000000000000' && req.body.events[1].replyToken === 'ffffffffffffffffffffffffffffffff'){
        res.send('Hello LINE BOT!(POST)');
        console.log('疎通確認用');
        return; 
    }

    Promise
      .all(req.body.events.map(handleEvent))
      .then((result) => res.json(result));
});

const client = new line.Client(config);

async function handleEvent(event) {
    
    if (event.type === 'message'){
        if(event.message.type === 'text'){
            return client.replyMessage(event.replyToken, {
                type: 'text',
                // text: event.message.text //実際に返信の言葉を入れる箇所
                text: event.message.text //実際に返信の言葉を入れる箇所
            });
        }else if(event.message.type === 'image'){
            console.log(event.message.id);
            let buffers = [];
            client.getMessageContent(event.message.id)
              .then((stream) => {
                stream.on('data', (chunk) => {
                    buffers.push(chunk);
                });
                stream.on('end', () => {
                 fs.writeFile('./img.jpg', Buffer.concat(buffers), 'utf-8', (err) => {
                  if(err) {
                   console.log(err);
                   return;
                  }
                  console.log('img:saved');
                 });
                });
                stream.on('error', (err) => {
                    console.log("img:error",err);
                });
              });
            const index = 3;
		    // ----------------------------------------------------
		    // 
		    // リストの処理書くところ
		    // 
		    // ----------------------------------------------------
            return client.replyMessage(event.replyToken, {
                type: 'text',
                // text: "画像を受け取りました！\nhttps://www.mokumokuver3.tk:3000"
                text: `画像を受け取りました！\nhttps://www.mokumokuver3.tk:3000/music_player?index=${index}`
            });
        }else{
            return Promise.resolve(null);
        }
    }
}

app.use(function (err, req, res, next) {
    console.log(err.stack);
    res.status(500);
    res.send(err.stack);
});
