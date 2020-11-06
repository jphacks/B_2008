const express = require("express");
const pug = require("pug");
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require( 'fs' );
const https = require( 'https' );
const line = require('@line/bot-sdk');
const jimp = require("jimp")
require("dotenv").config();
require('@tensorflow/tfjs');
const use = require('@tensorflow-models/universal-sentence-encoder');
var AWS = require('aws-sdk');
var uuid = require('node-uuid');
const app = express();

app.set("views", "./views");
app.set("view engine", "pug");
app.use(express.static('public'));
// app.use(express.static('../../s3/mokumoku'));
app.use(bodyParser.urlencoded({extended: false}));
// rekognition api no　設定
const aws_config = new AWS.Config({
 accessKeyId: process.env.REKOGNITION_accessKeyId,
 secretAccessKey:process.env.REKOGNITION_secretAccessKey,
 region: process.env.REKOGNITION_region,
})
AWS.config.update(aws_config);
//先ほど書いた.envファイルからアクセストークンとチャンネルシークレットを引っ張ってくる。
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};


//--通信設定------------------------------
//TODO: httpsの設定書く
//const adress = "54.150.52.212";
//const port = 3000;
// app.listen(port);
// console.log(`server running at http://${adress}:${port}/`);


var https_port = 3003;
const options = {
  key: fs.readFileSync( process.env.HTTPS_PRIVATE_KEY ),
  cert: fs.readFileSync( process.env.HTTPS_CERTIFICATION )
};
const https_server = https.createServer( options, app );
https_server.listen( https_port );
console.log(`server running at https://www.mokumokuver3.tk:${https_port}`);

//--home-----------------------------------
app.get("/", (req,res,next) => {
    console.log("home");
    res.render("index", {title:"photune", message: "何たらするアプリ。"});
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

function choice_musics(img_buffer) {
    return new Promise(resolve =>{
        let h_sum = 0;
        let s_sum = 0;
        let v_sum = 0;
        let h_ave = 0;
        let s_ave = 0;
        let v_ave = 0;
        let pixel_num = 0;
        let attri_idx = 0;
        // console.log(img_bufer);
        jimp.read(img_buffer)
        .then((image)=>{
            //if(err) {throw err};
            image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx)=> { //各画素にアクセス
                let rgb = [image.bitmap.data[idx], image.bitmap.data[idx+1], image.bitmap.data[idx+2]];
                let hsv = rgb2hsv(rgb);
                if(hsv[0] <0 || hsv[0] > 360)
                  console.log("error: invalid hue,in choice_musics");
                if(hsv[1] <0 || hsv[1] > 1)
                  console.log("error: invalid s,in choice_musics");
                  if(hsv[2] <0 || hsv[2] > 1)
                  console.log("error: invalid v,in choice_musics");
                //hsv_img[i]=hsv[0];hsv_img[i+1]=hsv[1];hsv_img[i+2]=hsv[2];
                h_sum += hsv[0];
                s_sum += hsv[1];
                v_sum += hsv[2];
            });
            pixel_num = (image.bitmap.width * image.bitmap.height);
            h_ave = h_sum / pixel_num;
            s_ave = s_sum / pixel_num;
            v_ave = v_sum / pixel_num;
            //console.log(h_sum);
            console.log("h average is "+ h_ave);
            console.log("s average is "+ s_ave);
            console.log("v average is "+ v_ave);
            console.log("choice genre");
            // music_lists = [0:calm, 1:excited, 2:fashionable, 3:funny, 4:relax, 5:mirai_komachi];
            
            if(v_ave < 0.4){
              attri_idx = 0;// 明度が0.4以下だった場合に calmにする
            }else if(s_ave >= 0.9){
              attri_idx = 3;// 彩度が0.9以上だったら　funncy 
            }else if(h_ave > 170 && h_ave <=280){
              attri_idx = 4;// 色が青っぽかったら relax
            }else if(h_ave > 90 && h_ave <= 170){
              attri_idx = 2;// 色が緑色っぽかったら　fasionable
            }else if(h_ave > 280 || h_ave <=90){
              attri_idx = 1;// 色が赤っぽかったら excited
            }else{
              attri_idx = 5;// どれでも無かったら未来こまち
            }
            console.log("choice genre is " + music_lists[attri_idx]);
            resolve(attri_idx);
        }).catch(function(err){
            console.error(err);
        });
        // resolve(attri_idx); 
        
    });
};


//apiを使う時用
const title_vectors = JSON.parse(fs.readFileSync("public/data/embed_vector.json",'utf8'));
async function choice_musics_with_ml(rekognition_response) {
  console.log("funcion is called");
  const music_idx = await use.load().then(model => {
    console.log("model is loaded.")
      const labels_name = rekognition_response.Labels.map((label)=>{
        return label.Name;
      });
      console.log(labels_name);
      const labels_conf = rekognition_response.Labels.map((label)=> label.Confidence);
      console.log(labels_conf);
      const music_idx = model.embed(labels_name).then(embeddings => {
        // `embeddings` is a 2D tensor consisting of the 512-dimensional embeddings for each sentence.
        // So in this example `embeddings` has the shape [2, 512];
        return embeddings.array()
      }).then(async (arrays) => {
        let weighted_vector = new Array(arrays.length);
        await Promise.all(arrays.map(async (array, idx)=>{
         weighted_vector[idx] = array.map((val)=>val*labels_conf[idx]);
        }));
        const added_vector = weighted_vector.reduce((acc, cur)=>{
          return acc.map((val,idx)=>{
            return val + cur[idx];
          });
        });// ここ大丈夫か？added_vectorがundefinedにならない？
        return added_vector;
      }).then((vector)=>{
        //console.log("vector is:"+vector);
          let scores = [];
          title_vectors.forEach((tvec,tidx)=>{
              scores.push([dotProduct(tvec,vector),tidx]);// [cos_sim, title_idx]
          });// ここ大丈夫か？scoresが[]にならない？
          if(scores == []){
            console.log("scores is []");
          }
          return scores;
      }).then((scores)=>{
          if(scores == []){
            console.log("error:score is []");
          }else{
            console.log("first score is:"+scores);
          }
          scores.sort((a,b) => b[0]-a[0]);// cos_simの降順にソート
          console.log("sorted score is:" + scores);
          return scores[0][1]; // return best similer title_idx= music_idx
      }).catch((err)=>{
          console.log(err);
      });
    return music_idx;
  });
  return music_idx; // maybe Promise
};
// Calculate the dot product of two vector arrays.
const dotProduct = (xs, ys) => {
  const sum = xs => xs ? xs.reduce((a, b) => a + b, 0) : undefined;

  return xs.length === ys.length ?
    sum(zipWith((a, b) => a * b, xs, ys))
    : undefined;
}


// zipWith :: (a -> b -> c) -> [a] -> [b] -> [c]
const zipWith =
    (f, xs, ys) => {
      const ny = ys.length;
      return (xs.length <= ny ? xs : xs.slice(0, ny))
          .map((x, i) => f(x, ys[i]));
    };

const music_title = ["calm", "excited", "fashionable", "funny", "relax", "mirai_komachi"];
const calm = ["calm/cafebossa.mp3", "calm/NOIR.mp3", "calm/Rhodes_Trip.mp3", "calm/Silence.mp3", "calm/落ち着いた？.mp3"];
const excited = ["excited/Star_Rising_Up.mp3", "excited/Stream.mp3", "excited/Sunrise.mp3", "excited/swing_swing.mp3"];
const fashionable = ["fashionable/Fizzing_Heart.mp3", "fashionable/Midnight_Moon.mp3", "fashionable/Sepia_Talk.mp3", 
                    "fashionable/the_opening_of_a_book.mp3", "fashionable/おどれグロッケンシュピール.mp3", "fashionable/作りかけ豆乳100％.mp3"];
const funny = ["funny/CLAP!.mp3", "funny/parasol.mp3", "funny/tekutekunamikimiti.mp3", "funny/ちょっと楽しい.mp3", "funny/パステルハウス.mp3"];
const relax = ["relax/Easier.mp3", "relax/Martini.mp3", "relax/ゆったりまったり.mp3", "relax/雨の日リラックス.mp3", "relax/青空空港.mp3"];
const mirai_komachi = ["mirai_komachi/Mirai_sato_master_180604.mp3"];
const music_lists = [calm, excited, fashionable, funny, relax, mirai_komachi];

const upload = multer({ storage: multer.memoryStorage() });
app.post('/img_post', upload.single('img'), async function(req, res, next) {
    console.log(req.file);
    // console.log(req.file.fieldname);
    if(typeof req.file === "undefined"){
        console.log("post:undefined");
        const music_idx = Math.round( Math.random()* (music_title.length-1) );
        const audio_title = "random:"+music_title[music_idx];
        const audio_list = music_lists[music_idx];
        res.send(JSON.stringify({ok: true, audio_title, audio_list}))
    }else if(req.file.originalname === "Mirai_Komachi.jpg"){
        const audio_title = music_title[5];
        const audio_list = music_lists[5];
        res.send(JSON.stringify({ok: true, audio_title, audio_list}))
    }else{
        const music_idx = await choice_musics(req.file.buffer);
        // console.log("req.file:", req.file);
        console.log(`music_idx : ${music_idx}`);
        //console.log("music_idx :" music_idx);
        console.log(`originalname: ${req.file.originalname}`);
        console.log(`path: ${req.file.path}`);
        const audio_title = music_title[music_idx];
        const audio_list = music_lists[music_idx];
        res.send(JSON.stringify({ok: true, audio_title, audio_list}))
    }
});
/*
// api用の関数
app.post('/img_post', upload.single('img'), async function(req, res, next) {
    console.log(req.file);
    // console.log(req.file.fieldname);
    if(typeof req.file === "undefined"){
        console.log("post:undefined");
        const music_idx = Math.round( Math.random()* (music_title.length-1) );
        const audio_title = "random:"+music_title[music_idx];
        const audio_list = music_lists[music_idx];
        res.send(JSON.stringify({ok: true, audio_title, audio_list}))
    }else if(req.file.originalname === "Mirai_Komachi.jpg"){
        const audio_title = music_title[5];
        const audio_list = music_lists[5];
        res.send(JSON.stringify({ok: true, audio_title, audio_list}))
    }else{
        const client = new AWS.Rekognition();
        var params = {
            Image: {
                Bytes: req.file.buffer
            },
            MaxLabels: 10
        }
        client.detectLabels(params, async function(err, response) {
            const music_idx = await choice_musics_with_ml(response);
            // console.log("req.file:", req.file);
            console.log(`music_idx : ${music_idx}`);
            //console.log("music_idx :" music_idx);
            console.log(`originalname: ${req.file.originalname}`);
            console.log(`path: ${req.file.path}`);
            const audio_title = music_title[music_idx];
            const audio_list = music_lists[music_idx];
            res.send(JSON.stringify({ok: true, audio_title, audio_list}))
        });
    }
});
*/
app.post('/sample_img_post', async function(req, res, next) {
    console.log("-------------");
    //console.log(req.body);
    let receive_json =JSON.parse(Object.keys(req.body)[0]);
        
        //const music_idx = await choice_musics(req.file.buffer);

        let file_buf =fs.readFileSync( "public/image/"+receive_json.path );
        let music_idx = await choice_musics(file_buf);
        //const music_idx = await choice_musics("public/image/"+receive_json.path);
        // console.log("req.file:", req.file);
        console.log(`music_idx : ${music_idx}`);
        //console.log("music_idx :" music_idx);
        console.log(`originalname: ${receive_json.path}`);
        console.log(`path: public/image/${receive_json.path}`);
        const audio_title = music_title[music_idx];
        const audio_list = music_lists[music_idx];
        res.send(JSON.stringify({ok: true, audio_title, audio_list}))
    //}
});


// music player 単体用(LINE用　post面倒そうだったので)
app.get("/music_player", (req,res,next) => {
    console.log("music player");
    let i = req.query.index;
    if (i<0 || i>music_title.length-1){
    	i = Math.round( Math.random()* (music_title.length-1) );
    }
    console.log(i)
    // let music_idx = choice_musics("sample1.jpg");
    const audio_title = music_title[i];
    const audio_list=music_lists[i];
    res.render("music_player", {title:"photune", message: "何たらするアプリ。", 
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
            if (event.message.text==="ミライ小町"){
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: "世界中の人たちを笑顔にする未来型アイドル、ミライ小町さんを紹介します！\n\n"
                        +"ミライ小町さんHP\nhttps://www.miraikomachi.com/\n\n"
                        +"ミライ小町さん楽曲再生\nhttps://www.mokumokuver3.tk:3000/music_player?index=5"
                });
            }
            return client.replyMessage(event.replyToken, {
                type: 'text',
                // text: event.message.text //実際に返信の言葉を入れる箇所
                text: event.message.text + "\n画像を送信、または以下URLからご利用ください！\nhttps://www.mokumokuver3.tk:3000/ "
            });
        }else if(event.message.type === 'image'){
            console.log(event.message.id);
            let buffers = [];
            await client.getMessageContent(event.message.id)
                .then((stream) => {
                stream.on('data', (chunk) => {
                    buffers.push(chunk);
                });
                stream.on('end', async () => {
                    const index = await choice_musics(Buffer.concat(buffers));
                    console.log("index :"+index);
                    fs.writeFile('./img.jpg', Buffer.concat(buffers), 'utf-8', (err) => {
                    if(err) {
                        console.log(err);
                        return;
                    }
                        console.log('img:saved');
                        return client.replyMessage(event.replyToken, {
                            type: 'text',
                            // text: "画像を受け取りました！\nhttps://www.mokumokuver3.tk:3000"
                            text: `画像を受け取りました！\nhttps://www.mokumokuver3.tk:3000/music_player?index=${index}`
                        });
                    });
                });
                stream.on('error', (err) => {
                    console.log("img:error",err);
                });
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
