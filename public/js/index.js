
//プレビュー
function previewFile(file) {
  // プレビュー画像を追加する要素
  const preview = document.getElementById('preview');

  // FileReaderオブジェクトを作成
  const reader = new FileReader();

  // URLとして読み込まれたときに実行する処理
  reader.onload = function (e) {
    const imageUrl = e.target.result; // URLはevent.target.resultで呼び出せる
    const img = document.createElement("img"); // img要素を作成
    img.src = imageUrl; // URLをimg要素にセット
    preview.appendChild(img); // #previewの中に追加
  }

  // いざファイルをURLとして読み込む
  reader.readAsDataURL(file);
}
// <input>でファイルが選択されたときの処理
const fileInput = document.getElementById('img_file');
const handleFileSelect = () => {
  const preview = document.getElementById('preview');
   while(preview.firstChild){
     preview.removeChild(preview.firstChild);
   }
  const files = fileInput.files;
  for (let i = 0; i < files.length; i++) {
    previewFile(files[i]);
  }
}
fileInput.addEventListener('change', handleFileSelect);

//画像の送信
document.getElementById("img_post_btn").addEventListener("click", function(){
// 	FoemDataオブジェクトに要素セレクタを渡して宣言する
	console.log("post?");
	const formDatas = document.getElementById("img_post_form");
      
  console.log(formDatas);
  const sendData = new FormData(formDatas);
  console.log(sendData);
  
	var XHR = new XMLHttpRequest();

	// openメソッドにPOSTを指定して送信先のURLを指定します
	
	XHR.open("POST", "/img_post", true);
	// XHR.setRequestHeader( 'content-type', 'application/x-www-form-urlencoded;charset=UTF-8' );
	// XHR.setRequestHeader( 'content-type', 'application/json' );

	// sendメソッドにデータを渡して送信を実行する
	XHR.send(sendData);

	// サーバの応答をonreadystatechangeイベントで検出して正常終了したらデータを取得する
	XHR.onreadystatechange = function(){
		if(XHR.readyState == 4 && XHR.status == 200){
		  const res = JSON.parse(XHR.responseText);
		  console.log(res);
			document.getElementById("result_response").textContent = "BGMM!: "+res.audio_title;
		// 	document.getElementById("audio_list").textContent = res.audio_list;
			audio_list = res.audio_list;
			Add_music(audio_list);
		}
		else{
			document.getElementById("result_response").textContent = XHR.responseText;
		}
	};
} ,false);


//音楽再生
function Add_music(audio_list){
  const music_player = document.getElementById('music_player');
   while(music_player.firstChild){
     music_player.removeChild(music_player.firstChild);
   }
  
  // const player1 = new Audio('music/'+audio_list[Math.round( Math.random()* (audio_list.length-1) )]);
  const player1 = new Audio("music/"+audio_list[Math.round( Math.random()* (audio_list.length-1) )]);
  player1.setAttribute("preload", "auto");
  console.log(player1.getAttribute("src"));
  player1.preload = "auto";
  player1.controls = true;
  const music_btns = document.createElement('div');
  const playdiv = document.createElement('div');
  const stopdiv = document.createElement('div');
  playdiv.textContent = "PLAY!";
  stopdiv.textContent = "STOP";
  music_btns.setAttribute("id", "music_btns");
  playdiv.setAttribute("id", "play");
  stopdiv.setAttribute("id", "stop");
  
  music_player.appendChild(player1);
  music_btns.appendChild(playdiv);
  music_btns.appendChild(stopdiv);
  music_player.appendChild(music_btns);
  
  document.getElementById("play").addEventListener("click", function(){
    player1.play();
  });
  document.getElementById("stop").addEventListener("click", function(){
    player1.pause();
  });
  
  
	player1.addEventListener("ended", function(){
	  if (audio_list.length > 1){
  	  let i = Math.round( Math.random()* (audio_list.length-1) );
      while(player1.getAttribute('src') === "music/"+audio_list[i]){
  	    i = Math.round( Math.random()* (audio_list.length-1) );
      }
      player1.setAttribute('src', "music/"+audio_list[i]);
	  }
    player1.play()
    console.log(player1.getAttribute("src"));
	} ,false);
	
  // const data_responce = document.getElementById('data_responce');
  // data_responce.style.margin = "10px";
  // data_responce.style.padding = "10px";
  
  //スクロール
  // const rect = document.getElementById('data_responce').getBoundingClientRect();
  // const position = rect.top;    // 一番上からの位置を取得
  // window.scroll({
  //   top: position,
  //   behavior: 'smooth'
  // });
}

// {
//   document.getElementById("to_top").addEventListener("click", function() {
//     const rect = document.getElementById('img_form_container').getBoundingClientRect();
//     const position = rect.top;    // 一番上からの位置を取得
//     window.scroll({
//       top: position,
//       behavior: 'smooth'
//     });
//   });
// }


// {
//   const xhr = new XMLHttpRequest();
  
//   xhr.open('GET', '/music/mattari1.mp3', true);
//   xhr.responseType = 'arraybuffer';
  
//   xhr.onload = () => {
//     const blob = new Blob([xhr.response], { type: 'audio/mpeg' });
//     // xhr.responseType = 'blob'; の場合は、そのまま使える
//     // const blob = xhr.response;
//     const objectUrl = URL.createObjectURL(blob);
    
//     // var link = document.createElement("a");
//     // document.body.appendChild(link);
//     // link.href = objectUrl;
//     // link.download = "audio.mp3";
//     // link.click();
//     // document.body.removeChild(link);
    
//     const audio = new Audio();
//     audio.autoplay = true;
//     audio.onload = () => {
//       URL.revokeObjectURL(objectUrl);
//     };
//     audio.src = objectUrl;
//   };
//   xhr.send();
// }

// 音楽連続再生
{
//   const player1 = document.getElementById('player1');
//   const player2 = document.getElementById('player2');
//   player1.setAttribute('src', 'music/'+audio_list[0]);
//   player2.setAttribute('src', 'music/'+audio_list[1]);
  
//   // プレイヤーの自動再生設定
// 	player1.addEventListener("ended", function(){
// 	  player1.classList.add("hidden");
// 	  player2.classList.remove("hidden");
// 	  player2.play()
// 	  let i = Math.round( Math.random()* (audio_list.length-1) );
//     while(player1.getAttribute('src') === 'music/'+audio_list[i] || player2.getAttribute('src') === 'music/'+audio_list[i]){
// 	    i = Math.round( Math.random()* (audio_list.length-1) );
//     }
//     player1.setAttribute('src', 'music/'+audio_list[i]);
// 	} ,false);
	
// 	player2.addEventListener("ended", function(){
// 	  player2.classList.add("hidden");
// 	  player1.classList.remove("hidden");
// 	  player1.play()
// 	  let i = Math.round( Math.random()* (audio_list.length-1) );
//     while(player1.getAttribute('src') === 'music/'+audio_list[i] || player2.getAttribute('src') === 'music/'+audio_list[i]){
// 	    i = Math.round( Math.random()* (audio_list.length-1) );
//     }
//     player2.setAttribute('src', 'music/'+audio_list[i]);
// 	} ,false);
	
}
