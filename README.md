#   Photune

### [Webサイト](https://www.mokumokuver3.tk:3000/)  
### LINE友達登録  
<a href="https://lin.ee/wJWCp8E" target="_blank"><img src="https://scdn.line-apps.com/n/line_add_friends/btn/ja.png" alt="友だち追加" height="36" border="0"></a>  
<img src="https://www.mokumokuver3.tk:3000/image/L.png" height="100">
<!-- ![QRコード](https://www.mokumokuver3.tk:3000/image/L.png) --> 

[![IMAGE ALT TEXT HERE](https://jphacks.com/wp-content/uploads/2020/09/JPHACKS2020_ogp.jpg)](https://www.youtube.com/watch?v=G5rULR53uMk)

##  製品概要
### 開発テーマ
#### **Music x Tech**  

###  背景(製品開発のきっかけ、課題等）
- 気分転換に散歩やドライブに出掛けた際、再生したプレイリストが周りの風景と合っておらず、いまいちリフレッシュできなかった。
周りの風景に合った音楽が聴ければ気分はもっと高まるのに。
- 友人との会食で訪れた飲食店の雰囲気とBGMが合っておらず違和感。食事は美味しいのに少し残念。お店の人は忙しくて気が回らないのかもしれない。

２人のチームメンバーの音楽に関する悩みを解決したい。  
そして、音楽の力で普段の生活をより楽しく、豊かに出来るのではないかと考え開発に至った。  
  
- 着目した顧客1:  
散歩・ランニングやドライブ中、音楽を聴きたい人  
- 顧客の課題1:  
状況にあった音楽が聴けない。適切な音楽を選ぶ暇がない。
- 現状1:  
ある程度自分の気分などにあった音楽を選ぶことは出来るが、見つけるのは手間がかかり、すぐに聞くことができない。 
または、違和感を感じたまま音楽を聴いたり、そのたびに音楽をスキップしたりしなければならない。

+ 着目した顧客2:  
店舗や会場を開く人、人をもてなす人  
+ 顧客の課題2:  
場所の雰囲気に合った曲をかけることが出来ない。選ぶとしても曲数が限られる。選ぶ暇がない。  
+ 現状2:  
ラジオや有線から音楽を流しているが、場の雰囲気に合わないものも流れる。  
自分で場にあった音楽もかけられるが、大量に用意することは出来ず何度も同じ曲を聴くことになってしまう。
<br>

### 製品説明（具体的な製品の説明）
雰囲気・状況にあった音楽を、写真を送信するだけですぐに再生することが出来るサービス。  
  
### 特長
#### 1. 利用が簡単
顧客は画像を送信するだけで音楽を聴くことが出来る。
画像の送信にはWebサイト、LINEアプリの2通りの方法があり、様々な機器や状況で利用が可能。  

#### 2. 適切な音楽  
Amazon Rekognition, TensorFlowを利用することで機械学習による高精度な画像認識が実現。  
画像から風景や状況などの情報が的確に抽出されることで、画像だけで状況に適した音楽を推薦することが出来る。  

#### 3. 豊富な楽曲  
サービス側で多くの楽曲を用意することで、顧客は自身で大量の楽曲を用意する必要なしに音楽を聴くことが出来る。  

### 解決出来ること
顧客の状況と音楽のミスマッチを解決。  
簡単に送信できるので、散歩の途中やちょっとした運転の休憩時に写真をとって送るだけで状況に合った音楽が聴ける。  
音楽と状況との相乗効果により、顧客は普段の生活においても気分を高めることが出来る。  

### 今後の展望
富士フイルム様のカメラ、矢崎総業様のドライブレコーダー、日立様のIoT機器のような録画可能機器に搭載、または連携させることで、画像送信の手間もなく自動で音楽を再生させられるかもしれない  
画像認識に機械学習モデルなどを使用する  
画像認識で得られた情報を利用する部分も含めて機械学習で実現しても良いかもしれない  
音楽の曲数の増加  

### 注力したこと（こだわり等）
* 画像の特徴からの音楽絞り込み
* LINEとの連携
* Webサイトのデザイン  
<br>

## 開発技術
### 活用した技術
#### API・データ
* LINE MessagingAPI
* Amazon Rekognition

#### フレームワーク・ライブラリ・モジュール
* Node.js (express)
* AWS EC2
* HTML/CSS(pug, sass), JavaScript
* TensorFlow.js

### 独自技術
#### ハッカソンで開発した独自機能・技術
* 画像の特徴量から音楽を推薦する

### その他
開発時の様子の参考として、開発時に使用した[Miroのリンク](https://miro.com/app/board/o9J_kgvg9F0=/)を記載します。

