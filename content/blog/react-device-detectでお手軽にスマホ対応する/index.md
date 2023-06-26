---
title: react-device-detectでお手軽にスマホ対応する
date: "2023-06-26T21:00:00Z"
description: "react-device-detectでお手軽にスマホ対応する"
---
## 手順
### npmかyarnでreact-device-detectをインストール
``` bash:title=shell
npm install react-device-detect
```
### 実装する

``` jsx{3,10-15}:title=Hoge.js
import { graphql, useStaticQuery } from "gatsby"
import React from 'react'
import { BrowserView, MobileView } from "react-device-detect"

const Hoge = () => {


  return (
    <div >
        <BrowserView>
            <h1>ブラウザだけだよ！！！</h1>
        </BrowserView>
        <MobileView>
            <h2>スマホだけだよ！！</h2>
        </MobileView>
    </div>
  )
}

```
3行めでインポートして、   
PCブラウザのみで表示したいコンテンツは   
`<BrowserView>`でくくる。   
スマホブラウザのみで表示したいコンテンツは   
`<MoblieView>`でくくる。   
以上。   

## 〆
<h2>簡単杉</h2>    
こんなにお手軽に切り替え実装ができるだなんて夢にも思わんかったわ...    <br/>
ホント進歩してますな...   