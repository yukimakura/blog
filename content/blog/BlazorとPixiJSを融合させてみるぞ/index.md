---
title: BlazorとPixiJSを融合させてみるぞ
date: "2024-04-02T10:00:00Z"
description: "BlazorとPixiJSを融合させる(Pixi-Viewportつき)"
tags: ["CSharp","Blazor","PixiJS","typescript",]
---

# 前置き
Blazorでグラフィカルなアプリケーションを作るとき皆さんはどうしますか？   
...といいますかぶっちゃけあまりニーズが少ないのか、はたまたこれから出てくるのか🤔   
<br/>
ちょいと仕事でBlazorでグラフィカルなアプリケーションを作らなければならず、   
とりあえず、BECanvasというHTML5のCanvasをC#にラッピングしてくれるライブラリを使っていました。  
しかし、お察しの通りヤツはGPUをあまり賢く使ってくれません。   
(結果激重になってしまった...orz)   
と、言うわけでGPUを上手に使うことで見事SDGsを果たそうという企画です（大げさ

# レポ＆デモ
[ゆきまくら製デモのレポです](https://github.com/yukimakura/PixiJSBlazorDemo)   
<iframe
  id="inlineFrameExample"
  title="Inline Frame Example"
  width="300"
  height="200"
  src="https://yukimakura.github.io/PixiJSBlazorDemo/">
</iframe>

デモの概要を軽く説明すると、`Click me`を押すとキャンバス上に■が現れます。   
その■をクリックまたはタップすると、色が変わり、キャンバス外の`lask clickobj`の項目に選択されたオブジェクトの情報が表示される感じです。   
**Pixi-Viewportも導入してあるので、思うがままにヌルヌル拡大縮小できます!**

# 問題点
- PixiJSの導入バージョン及び、Pixi-Viewportの導入バージョンが古め
    - なんか、Pixi-Viewportが最新だと言うこと聞いてくれなかった...(´・ω・`)
        - さらに最新のPixiJSだとWebGPU対応周りで結構変わってるっぽい？
    - 裏を返せば、Pixi-Viewport使わない方は最新を導入してください

# 詳解
気が向いたら書きます＆レポの方も気が向いたらコメント追記します（おい

# 〆
昨日はエイプリルフールだからなんかネタぶっこもうかと思って、   
音のソノリティ✕アル中カラカラ（もう古い？）の動画でも作ろうかなと思ってたが、   
Tictokでやってる人見つけてしかもそんなにバズってなかったので萎えました（おい   
<br>
にしても、PixiJSとかWebGLすごいね...   
こんなお手軽にプラットフォーム気にぜずGPU上手に使えるとは...   
標準化及びそれに準拠してる方々には頭が上がりませんな^^;   
では(^^)ノシ
            