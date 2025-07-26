---
title: 718boxsterにて自力でAndroidAutoを有効化する！
date: "2025-07-21T08:00:00Z"
description: "718boxsterにて自力でAndroidAutoを有効化する！"
tags: ["360度カメラ","GoPro","GoProFusion","FFmpeg","YouTube"]
---

# Porsche 718 Boxster (2018年モデル) 買いました！
いやーーーーーー買っちまいましたよ！！ボクスター！    
オープントップでMR、しかもチョーパワフル！    
これが真の人馬一体だと痛感しましたね...   
もはや私が下手すぎて足引っ張ってるぐらい^^;   
あともちろんMTです！   
PDKも素晴らしいと思うのですが、あくまで速さではなく泥臭い楽しさ重視です！   
あとMTのほうがリセールも高いことを信じてます！！！    
    
高かったけど、今後のボクスターはEV化するだの、MTは駆逐されていくだろうと   
あと、もし家庭を持つ（全く想像できんが...）ことになったら真っ先に切り捨て候補になるだろうということで   
めちゃ奮発しましたよ〜〜〜いや〜買ってよかった！    
楽しいし所有欲も鬼満たされる...ε-(´∀｀*)ﾎｯ    
    
ですが、ただただ走って満足するだけじゃないのが私、ゆきまくらでございます^^;    
コーディングだの、PCMの設定だの色々いじっていきますぞい！    
んで、これが第一弾です！   

# ネタソース
[(YouTube)Android Auto and Apple Car Play on a 2017 Porsche Macan](https://www.youtube.com/watch?v=ybAS6n9Gw_g&list=LL&index=4&t=1s)    
↑Macanとなっていますが、多分おなじPCMだとおもったのでこれを参考にしました

# 下準備
- PC(OS問わず)
    - SDカードをさせるようにしておくこと(USBアダプタでも可)
- SDカード
- PCM4系のポルシェ

# PCでの作業
## ファイルのダウンロード
- [プレリリースを除いた、最新のM.I.BのリリースのSource Code(zip)をダウンロードする](https://github.com/Mr-MIBonk/M.I.B._More-Incredible-Bash/releases)   
    - 私は、`V3.6.0 - QR Edition`のSource Code(zip)をダウンロードしました
- [mibsolution.oneからパッチをダウンロードする](https://mibsolution.one/#/1)
    - ユーザー名`guest`、パスワード`guest`でログインする
    - `M.I.B`→`(最新の日付)_M.I.B_Patches`をダウンロードする
        - 私は、`20230926_M.I.B_Patches`でした

## SDカードの準備
1. SDカードをFat32にて、**8GB以下でフォーマットする(←ココ重要)**
    - 私は、16GBのSDに対してFat32で4GBでフォーマットしました
2. M.I.Bのzipファイルを解凍し、それをフォーマットしたSDにまるっとコピーする
3. SDカードのルートディレクトリに`patches`というディレクトリがあるので、そこに`(最新の日付)_M.I.B_Patches.7z`の中身をまるっとコピーする
4. SDカードのルートディレクトリに`_Swdlautorun.txt`があるので、`Swdlautorun.txt`にリネームする
    - これを行うと、SDカードをPCMに差したときに自動でアップデートが立ち上がるようになる

## ボクスターでの作業
1. 
2. 
3.
4. 
5. 


# 〆


では(^^)ノシ
