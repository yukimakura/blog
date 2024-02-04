---
title: DependencyInjectionのすゝめ(LT会のパワポ)
date: "2023-08-06T18:15:00Z"
description: "エンジニアの輪 at 大阪(第10回)でのLT会のスライド"
tags: ["ポエム","LT会","DIコンテナ"]
---
## 背景
エンジニアの輪 at 大阪(第10回)にて発表させて頂いた資料です。   
DependencyInjection(以下DIと略す)コンテナは様々な言語やフレームワークで標準サポートされているようですが、   
今回の発表会で、「とりあえず使ってはいるのだけれど、正直旨味がいまいちピンとこない」との方がチラホラ見られました。    
それを聞いて私も、**めっっっちゃ気持ち分かるわ...** となりました(^_^;)   
ずるい言い方をすると、結局のところはDIを意識して設計・製作しないと腹落ちしないんですよね。   
出来るなら、まずDIで実装してみる。→どこがDIか、具体的になぜどこからどう注入されるのかというのを分かる人から聞くのがやはり効率が良いのでしょうかね？   
<br/>
今回のLT会でドメイン駆動設計(以下DDDと略す)のテーマのあったのですが、私は今のところDDDの本質や旨味を腹落ちしきってないです。   
ですが、DDDの経験者さんも結局抽象的な概念で、ぶっちゃけ哲学といえば哲学だからDDDで実装してみたり、DDDで実装されてるコードやプロジェクトをみたり携わらないと納得しないと思うと言われてしまいました。   
**圧倒的納得っ....!!!**

## スライド
<iframe src="https://docs.google.com/presentation/d/e/2PACX-1vROj76itC8oHgCvJVhddIWOo_AueX3nS9m_xCPR54PoSksR20wRUzTi0ArYgamZKwhifwjLuRqDj4ti/embed?start=false&loop=false&delayms=3000" frameborder="0" width="960" height="569" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>