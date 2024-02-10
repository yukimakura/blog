---
title: 10万円アンダーでディザスタリカバリ対応のSSDのNASを構築するぜ！（概要編)
date: "2024-02-10T15:00:00Z"
description: "10万円アンダーでディザスタリカバリ対応のSSDのNASを構築するぜ！（概要編)"
tags: ["OpenWRT","Ubuntu","NAS","VPN"]
---
## 経緯・モチベーション
2024年1月1日、北陸に大きな地震が牙を剥きました。   
ちょうど実家に帰っていた私は家族総出で津波から逃げたわけですが、
そんな中で姉貴がラップトップの心配をめちゃくちゃしてました      
姉貴は所謂ネト充側の人間でして、データが非常に重要とのこと   
<br>
ラップトップを家に置いてきたことをとても後悔していました
<br>
今回は偶然何事もなかったので良かったですが、   
この際せっかく遠隔地に私がいるのにこの状況を活かさないのはもったいないと思い、   
構築しようと思い至ったわけです   
<br>
すでに実家にはNASがあり、そこに家族写真などのデータもあるため、
父親も案外乗り気になってくれて、SSDを買ってくれました(実質総額の半分を出してくれました、ありがとう)   
...まぁ、フルSSDの部分は私のロマンなんですけどね^^;   

## 全体の構成図
``` plantuml
@startuml
left to right direction
frame 実家 {
    agent "ONU(ゲートウェイあり,IPv4 over IPv6)" as zikkaONU
    frame "OpenWRT導入済みハブ" as zikkaHub {
        component "SoftEtherVPNClient" as zikkaVPN
    }

    frame "MiniPC(UbuntuServer)" as zikkaMiniPC{
        component "mdadm(raid0)" as zikkaRaid
        component "SambaのNAS" as zikkaNAS
    }

    file "USB外付けSSDx4(2TBx4)" as SSD
    agent "家庭内のいろんな機器" as zikkaAny
}
cloud WAN
frame ゆきまくらのおうち {
    agent "ONU(ゲートウェイなし)" as ykmkrONU
    frame "MiniPC(OpenWRT)" as ykmkrMiniPC {
        component "DHCPServer(OpenWRT)" as ykmkrDHCP
       
        component "MAP-E ゲートウェイ(IPV4 over IPv6)" as ykmkrGW
        component "SoftEtherVPNServer" as ykmkrVPN
        component "NFSのNAS(HDD)" as ykmkrNAS
    }

    file "USB外付けHDD(8TB)" as HDD

    agent "家庭内のいろんな機器" as ykmkrAny
}


WAN -- ykmkrONU
WAN -- zikkaONU

HDD -- ykmkrNAS 
ykmkrONU -- ykmkrGW  
ykmkrAny -- ykmkrDHCP 

zikkaONU -- zikkaVPN
SSD -- zikkaRaid
zikkaRaid - zikkaNAS
zikkaNAS - zikkaVPN
zikkaAny -- zikkaVPN

note left of ykmkrDHCP
    SecureNATのDHCPではなく、
    OpenWRTのDHCPでIPアドレスを配布する
end note


note left of zikkaONU
    フレッツ光 1Gbps 
    (So-net IPv6プラス)
    RT-500KI
end note

note left of ykmkrONU
    フレッツ光 1Gbps 
    (So-net IPv6プラス)
end note
@enduml
```
## ざっくりとしたソフト構成
### MiniPC(ゆきまくらのお家)
#### SoftEther VPN Server
- OSはOpenWRTのAmd64版
    - DDで書き込んだ
- 4系
    - OpenWRTのパッケージマネージャーでは5系と4系がラインナップされてるのだが、何故か5系だと、OpenVPNのポート設定が変えれなかったため
    - ホントはDockerで入れたかったけど、DockerでやるとTapデバイス周りでコケたので断念
- SecureNATは無効化
    - スループット上げるため
#### NFSサーバー
- 外付けHDDをネットワークストレージにするため
- バックアップ用で、1日1回程度で実家SSDNASとrsyncする
    - 原則、他のPCはこのHDDNASにアクセスしない
- Dockerにて構築予定

### MiniPC(実家)
#### mdadm
- SSD4枚をソフトウェアRaid0化する
    - ちなみにフルSSD化するモチベは静かなのと、小さいのと、ランダムアクセスが速いから
        - シーケンシャルアクセスを極めても1Gbpsのネットじゃ活きん...(´；ω；｀) 
#### Samba Server
- 普段みんながアクセスする用
- Dockerにて構築予定
    - 2TBほどTimeMachine設定

## 登場人物紹介
### MiniPC(ゆきまくらのお家)
メルカリで買った中古のMiniPC   
小さいくせに、本体に電源ユニット内蔵なのが結構気に入ってる
- Price : ￥9,000
- Model：FUJITSU FMVB10001
- CPU : Core i5-7500T CPU @ 2.70GHz
- RAM : DDR4 6GB
- OS : OpenWRT (23.05.2 (r23630-842932a63d))

### MiniPC(実家のNAS)
ヤフオクで買った中古のMiniPC   
電源ユニットは外だしだが、ミニPCのくせにUSB3が6つのあるのが気に入ってる
- Price : ￥5,000
- Model：NEC Mate MC-T
- CPU : Core i3-6100T CPU @ 3.20GHz
- RAM : DDR4 8GB
- OS : Ubuntu 22.04.3 LTS

### OpenWRT導入済みHub
引っ越しした当時、ヤマダ電気で買ったIODataの最安Wifiルーター(たしか4000円台で買ったはず？)   
偶然OpenWRTに対応してた   
最安のくせに、OpenWRT入れてみたら結構性能良くて感動した 
- Price : ￥4,000（ぐらい  
- Model: WN-DX1167R
- CPU : MediaTek MT7621A @ 880MHz
    - しれっと2コア4スレなのすごい

### SSDたち
[CFDの2TBのSSD](https://www.cfd.co.jp/biz/product/detail/cssd-m2l2trgaxn.html)
- Price : ￥13000 x 4 = ￥52000
- 速度は少し遅いが、値段の割にTLCでTBWが1200TBWあったのが決め手で購入
- USBアダプタはアリエクにて購入
    - ￥5,000
### HDD
[WDBlueの8TB(WD80EAZZ)](https://kakaku.com/item/K0001400942/)
- Price : ￥17000
- 定番のWDBlue。安くて評価も高いためこれにする
- USBアダプタはAmazonにて
    - ￥2,000

### 合計金額
**約￥94,000**でした!!
- 一部丼勘定ですみません🙇‍♀


## 〆
今回はここまでとさせてもらいます   
一部のものはすでに設定が終わっているので、   
各コンポーネントたちは追々記事化していきます
<br>
どちらの家もIPv4 over IPv6なので、スループットが安定して200Mbps以上出ています   
そのため常時接続でも実用的かと睨んでいます   
実際、家族の協力を得て私の家のVPNサーバーにつないだ状態でOoklaのIPA Server 400Gでベンチしたところ、午後8時ぐらいだったにも関わらず、250Mbps以上出てました
<br>
10万アンダーと書かれているものの、半分はSSDなので、HDDにすることで大幅なコスト削減が可能かと思われます
少し、複雑で多少ハードルは高いかもしれませんが、   
災害等に備えるのも悪くないのではないでしょうか？   
<br>
また、VPNで同じネットワークに参加できるので、遠隔地のPS5にリモート接続や、遠隔地のテレビ視聴など副産物があります    
なかなか良いですね   

--- 
話変わって、この記事はMeta Quest2を被りながらUbuntuマシンで書いております   
最近VisionProが出て、MRにてPCの画面を見ながらの作業ってどうなんだろうと思い、  
手元にあったQuest2で試しているわけです   
Linuxマシンでは無理だろな...と思い調べてみるとImmersedというソフトがなんとLinuxも対応しているではありませんか！！   
ということでやってみた次第です   
<br>
ブラインドタッチができると結構ありだなーって思います   
ただ、純正ストラップだとやはり視界がぼやけやすいかも
あと慣れてないので目が疲れる...   
けどめちゃくちゃトラックポイントとヨギボーの相性いいです（笑）
みなさんもお試しあれ^^;

では(^^)ノシ