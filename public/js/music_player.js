
//音楽再生
const player1 = document.getElementById("audio");
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