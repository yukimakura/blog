---
title: いいか？Dockerで開発するときに動的生成フォルダはBindMountしちゃいけないぞ？約束だぞ？
date: "2023-07-05T22:10:00Z"
description: "いいか？Dockerで開発するときに動的生成フォルダはBindMountしちゃいけないぞ？約束だぞ？"
tags: ["Docker","gatsby","コンテナ仮想化"]
---

## 背景
...とにかくGatsbyのビルドが遅い！（●｀ε´●）ﾌﾟﾝｽｶ     
明らかに遅すぎてもはやコンテナ環境が悪いのでは？といろいろ調べた結果そのとおりでした。   

まぁ、使ってるコンピュータもそんなにいいものではないですし、   
なにせ爆熱でサーマルスロットリング起きてる説濃厚なので...   

↓あがいた跡   
<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">たしかにgRPC FUSEからVirtioFSにしたら早くなった気がする！<br><br>...けどGatsbyあきらかにビルド遅すぎんか<br><br>Gatsbyが遅いのか、i7 8650が遅いのか...<br>ﾌｧｲｯｯ！！ <a href="https://t.co/bNYD8N7boO">pic.twitter.com/bNYD8N7boO</a></p>&mdash; クワイン·ゆき·まくらすきぃ (@yukimakura86) <a href="https://twitter.com/yukimakura86/status/1674409444191670272?ref_src=twsrc%5Etfw">June 29, 2023</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

## やったこと
### とりあえず、Docker Desktopの設定を変える
gRPC FUSE からVirtioFSに変更→あまり変わらず...
### node_modulesのみをVolumeMountにする
<font color=red><h3>爆速！！！</h3></font>  
↑今回の本題です   
※当たり前ですが、ネイティブよりは早くなりませんよ    
これでネイティブより早いと言うことは、   
「いやーやっぱり生音声よりハイレゾ音源のほうが良い音質だな〜」   
って言ってるのと似てると思います。   

## (おさらい)VolumeMountとBindMountってなぁに？
BindMountとVolumeMountは、Dockerコンテナ内にデータを永続化するための2つの異なる方法です。   

BindMountは、ホストマシン上の特定のファイルやディレクトリをコンテナ内に直接マウントすることができます。   
これにより、**コンテナ内からホストマシン上のファイルやディレクトリにアクセスすることができます。**   
ただし、ホストマシンのファイルシステムに依存しており、**可搬性が低いという欠点があります。**
<br/>
一方、VolumeMountはDockerによって完全に管理される独立したストレージ領域です。   
**ホストマシン上のディレクトリ構造やOSに依存せず、複数のコンテナ間で安全に共有することができます。**    
また、ボリュームはDocker CLIコマンドやDocker APIを使用して管理することができます。  
<br/>

...とBingAI先生が申しております(｀・ω・´)

**パフォーマンスに関しては全然まっっったく違います！**   
**BindMountは引くほど遅いです**   
(すくなくともWSL2とmacに関しては。Linuxはまだ未検証)   
[2019年ごろからIssueに上がっていますが未だにOpenのままのようです](https://github.com/docker/for-mac/issues/3677)   

## 簡易ベンチマーク
### 計測環境
#### ホスト
- ThinkPad X1 Carbon Gen6 
    - Hardware
        - Core i7 8650u
        - RAM 16GB (LPDDR3 2133MHz)
        - SUNEAST SE900NVG3-01TB
        - Broadcom BCM94360NG
    - Software
        - macOS 12.6.3 (Monterey)
        - Docker Desktop 4.16.2 (95914)        
#### コンテナ
node:18-bullseye
### 結果
Pure : シンプルな**BindMount**     
    (ex) `-v $(pwd)/tmp:/ws`   
<br/>
Delegated : Delegatedオプション付きの**BindMount**    
    (ex) `-v &(pwd)/tmp:/ws:delegated`   
<br/>
VolumeMountNM : **node_modulesのみVolumeMount**     
    (ex) `-v node_module_volume:/ws/node_modules`    
<br/>
#### npm install
|マウント条件|real|user|sys|
|--|--|--|--|
|Delegated|6m46.746s|5m25.364s|3m47.648s|
|Pure|8m15.052s|6m38.064s|3m50.435s|
|Delegated & VolumeMountNM|1m50.672s|2m6.004s|1m15.796s|
|Pure & VolumeMountNM|1m46.771s|2m0.373s|1m1.540s|

#### gatsby build
|マウント条件|real|user|sys|
|--|--|--|--|
|Delegated|8m32.072s|8m26.974s|4m0.114s|
|Pure|7m7.828s|6m42.795s|1m39.654s|
|Delegated & VolumeMountNM|1m13.318s|2m19.687s|0m13.755s|
|Pure & VolumeMountNM|2m13.731s|8m21.418s|1m1.227s|

## 〆
当方も積極的にDockerを使ってきたつもりでしたが、      
お恥ずかしいことにこのことに今まで気づきませんでした...    
でもまさか、こんなに差があるとは...恐ろしや...   
コンテナ仮想化はめちゃくちゃ便利ですが、   
罠もいろいろありそうなのでしっかり学んだ上で活用していきたいですなぁ    
WSL2の環境でも試しましたが、この記事の結果と似た傾向を示していたので、   
ぜひお試しあれ。   
では(*^^*)ノシ   
