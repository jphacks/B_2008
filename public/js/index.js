
// スクロールによって表示されるヘッダー
var startPosition = 0;
function setStartPosition(){
    startPosition = document.documentElement.scrollTop;
}
function getStartPosition(){
  return startPosition;
}
window.addEventListener('scroll', function(){

  let pos1 =getStartPosition();
  setStartPosition();
  let pos2 =getStartPosition();
  let del_pos =pos2 -pos1;

   //console.log("----");
   //console.log(del_pos);
  let pMenu = document.getElementsByClassName('photoMenu')[0];
  let pMask = document.getElementsByClassName('photoMenuMask')[0];
  if(del_pos <= 0) {
    pMenu.classList.remove('hide');
    pMask.classList.remove('hide');
  }  else {
    pMenu.classList.add("hide");
    pMask.classList.add('hide');
  }


  //if (document.documentElement.scrollTop < getStartPosition()) {
  //    document.getElementsByClassName('photoMenu').classList.remove('hide');
  //    document.getElementsByClassName('photoMenuMask').classList.remove('hide');
  //} else {
  //    document.getElementsByClassName('photoMenu').classList.add("hide");
  //    document.getElementsByClassName('photoMenuMask').classList.add('hide');
  //}
});
// いつか実装したjQuery版
  // var startPosition = 0;
  // $(window).on('scroll',function(){
  //   if ($(this).scrollTop() < startPosition || $(this).scrollTop() < 100) {
  //     $('.photoMenu').removeClass('hide');
  //     $('.photoMenuMask').removeClass('hide');
  //     $('.menuButton').removeClass('hide');
  //   } else {
  //       $('.photoMenu').addClass('hide');
  //       $('.photoMenuMask').addClass('hide');
  //       $('.menuButton').addClass('hide');
  //   }
  //   startPosition = $(this).scrollTop();
  // });








//----------------------
//
//	let XHR4load = new XMLHttpRequest();
//
//	// openメソッドにPOSTを指定して送信先のURLを指定します
//	
//	//XHR4load.open("POST", "/img_post", true);
//	// XHR4load.setRequestHeader( 'content-type', 'application/x-www-form-urlencoded;charset=UTF-8' );
//	// //XHR4load.setRequestHeader( 'content-type', 'application/json' );
//
//	//// sendメソッドにデータを渡して送信を実行する
//	//XHR4load.send(sendData);
//
//	// サーバの応答をonreadystatechangeイベントで検出して正常終了したらデータを取得する
//	XHR4load.onreadystatechange = function(){
//		//if(XHR4load.readyState == 4 && XHR4load.status == 200){
//		if(XHR4load.readyState == 3){
//          console.log("loading");
//		}
//		else{
//          console.log("not loading");
//			//document.getElementById("result_response").textContent = XHR.responseText;
//		}
//	};
//----------------------



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
// 	console.log("post中...");
	const formDatas = document.getElementById("img_post_form");
      
  // console.log(formDatas);
  const sendData = new FormData(formDatas);
  // console.log(sendData);
  
	var XHR = new XMLHttpRequest();

	// openメソッドにPOSTを指定して送信先のURLを指定します
	
	XHR.open("POST", "/img_post", true);
	// XHR.setRequestHeader( 'content-type', 'application/x-www-form-urlencoded;charset=UTF-8' );
	// XHR.setRequestHeader( 'content-type', 'application/json' );

	// sendメソッドにデータを渡して送信を実行する
	XHR.send(sendData);
	document.getElementById("result_response").textContent = "now loading...";
  const loading = document.createElement('div');
  loading.classList.add("loading");
  loading.setAttribute("id", "loading");
  document.getElementById("result_response").appendChild(loading);
  console.log("post!");
  console.log("loading...");

	// サーバの応答をonreadystatechangeイベントで検出して正常終了したらデータを取得する
	XHR.onreadystatechange = function(){
		if(XHR.readyState == 4 && XHR.status == 200){
		  const res = JSON.parse(XHR.responseText);
		  // console.log(res);
      console.log(res.audio_title);
			document.getElementById("result_response").removeChild(document.getElementById("result_response").firstChild);
			document.getElementById("result_response").textContent = res.audio_title;
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
  // console.log(player1.getAttribute("src"));
  player1.preload = "auto";
  player1.volume = "0.01";
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
    // console.log(player1.getAttribute("src"));
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




////////////////////////////////////////////////


document.getElementById("sample_img_post_btn").addEventListener("click", function(){
//alert("hi")
 //hide_el2();
// 	FoemDataオブジェクトに要素セレクタを渡して宣言する
// 	console.log("post?");
	//const formDatas = document.getElementById("img_post_form");
	const formDatas = document.getElementById("sample_img_post_form");
	const radio_val = document.getElementById("sample_img_post_form").radio_imgnum.value;
    const src_val ="sample"+radio_val+".jpg";

  let person1 = new Object();
  person1.id = radio_val;
  person1.path = src_val;
  let sendData = JSON.stringify(person1);

  
	var XHR = new XMLHttpRequest();

	// openメソッドにPOSTを指定して送信先のURLを指定します
	
	XHR.open("POST", "/sample_img_post", true);
	 XHR.setRequestHeader( 'content-type', 'application/x-www-form-urlencoded;charset=UTF-8' );
	 //XHR.setRequestHeader( 'content-type', 'application/json' );

	// sendメソッドにデータを渡して送信を実行する
	XHR.send(sendData);

	// サーバの応答をonreadystatechangeイベントで検出して正常終了したらデータを取得する
	XHR.onreadystatechange = function(){
		if(XHR.readyState == 4 && XHR.status == 200){
		  const res = JSON.parse(XHR.responseText);
		  // console.log(res);
			document.getElementById("result_response").textContent =res.audio_title;
		// 	document.getElementById("audio_list").textContent = res.audio_list;
			audio_list = res.audio_list;
			Add_music(audio_list);
		}
		else{
			document.getElementById("result_response").textContent = XHR.responseText;
		}
	};
/*
*/
} ,false);

function show_el1(){
  document.getElementById("choise_img").style.display = "none";
  document.getElementById("upload_form").style.display = "block";
}
function show_el2(){
  document.getElementById("choise_img").style.display = "block";
  document.getElementById("upload_form").style.display = "none";
}
//function hide_el2(){
//
//  // form要素を取得
//  var element = document.getElementById( "sample_img_post_form" ) ;
//  
//  // form要素内のラジオボタングループ(name="hoge")を取得
//  var radioNodeList = element.radio_imgnum ;
//  
//  // 選択状態の値(value)を取得 (Bが選択状態なら"b"が返る)
//  var a = radioNodeList.value ;
//  
//  for(let i=0; i<2; i++){
//    document.getElementById("radio_img_con"+i).style.display = "none";
//    //document.getElementById("form_img_"+i).style.display = "none";
//  }
//  document.getElementById("radio_img_con"+a).style.display = "block";
//  //document.getElementById("img_"+a).style.display = "block";
// 
//    var tr_element = document.createElement('img')
//    var parent_object = document.getElementById('test_img1');
//    //tr_element.innerHTML = '<tr><td>cell11</td><td>cell21</td></tr>';
//    tr_element.innerHTML = '<img src="image/sample1.dd><td>cell11</td><td>cell21</td></tr>';
//    parent_object.appendChild(tr_element);
//
//
//}

function show_sample_preview(){
    // form要素を取得
  //var element = document.getElementById( "sample_img_post_form" ) ;
    // form要素内のラジオボタングループ(name="hoge")を取得
  //var radioNodeList = element.radio_imgnum ;
  var radioNodeList = document.getElementById( "sample_img_post_form" ).radio_imgnum ;
    // 選択状態の値(value)を取得 (Bが選択状態なら"b"が返る)
  var a = radioNodeList.value ;

  const sample_preview = document.getElementById('sample_img_preview');
  while(sample_preview.firstChild){
    sample_preview.removeChild(sample_preview.firstChild);
  }
  const img = document.createElement("img"); 
  img.src = "image/sample"+a+".jpg";
  img.setAttribute("id", "sample_result_img");
  img.setAttribute("width", "30%");
  sample_preview.appendChild(img); 

}

//function preview_postimg(){
//  const input_file = document.getElementById('img_file').files[0];
//
//  const sample_preview = document.getElementById('post_preview');
//  while(sample_preview.firstChild){
//    sample_preview.removeChild(sample_preview.firstChild);
//  }
//  const img = document.createElement("img"); 
//  img.src = input_file;
//  img.setAttribute("width", "30%");
//  sample_preview.appendChild(img); 
//}

function show_sample_main_img(){
  document.getElementById("checkbox-block").style.display = "none";
  document.getElementById("choise_img").style.display = "none";
 
  const res_img = document.getElementById('sample_img_preview').firstChild;
  const cln =res_img.cloneNode(true);
  const show_res_node = document.getElementById("res_img_block"); 
  show_res_node.appendChild(cln); 
  //show_res_node.firstChild.insertBefore(cln); 
}

function show_post_res_img(){
  document.getElementById("checkbox-block").style.display = "none";
  document.getElementById("upload_form").style.display = "none";
 
  const res_img = document.getElementById('preview').firstChild;
  if(res_img.tagName =="IMG"){
  
  
    const cln =res_img.cloneNode(true);
    const show_res_node = document.getElementById("res_img_block"); 
    show_res_node.appendChild(cln); 
  }
}

////////////////////////////////////////////////
