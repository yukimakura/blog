---
title: NextjsでDIコンテナ経由でイベントを発火してみる[typescript]
date: "2023-07-08T11:10:00Z"
description: "nextjsでinversifyとnanoeventsをコラボしてコンポーネントをまたいでイベントやり取りする"
tags: ["nextjs","typescript","nanoevents","inversify","DIコンテナ","ポエム"]
---
## 背景
仕事でWebUIでアプリを作ることになり、いろいろ勉強中です。   
偶然、このブログを作っていた事が色々役に立ちました。   
まぁそんなこんなで、コンポーネントをまたいでやり取りするケースが出てきて、   
いろいろ考えたわけです。   
<br/>
当方、C#が今のところ一番得意なようで、   
もしC#で組むならDIコンテナ✕イベントでやるなと。   
ということで、TSでもDIコンテナ✕イベントをやる方法を模索しました。   
ホントはMessagePipeのようにDIコンテナの   
セットアップが簡単にできるやつがあったら良かったんですが、    
見つけられなかった(ぶっちゃけそんなにガチに探してないです、あったら教えてくださいm(_ _)m)   
ので、[nanoevents](https://github.com/ai/nanoevents)と[inversify](https://github.com/inversify/InversifyJS)を組み合わせて見ることにしました。

**※当方はtypescriptやweb系技術についてズブの素人です。ご注意ください。**

## 結論(ソース)

[Githubに置きました](https://github.com/yukimakura/nextjs_inversify_and_nanoevents_demo)   
Dockerで環境構築してください。   
[Dockerで環境構築する際はぜひこの記事も参考にしてみてください！](https://yukimakura.github.io/blog/%E3%81%84%E3%81%84%E3%81%8B%EF%BC%9FDocker%E3%81%A7%E9%96%8B%E7%99%BA%E3%81%99%E3%82%8B%E3%81%A8%E3%81%8D%E3%81%AB%E5%8B%95%E7%9A%84%E7%94%9F%E6%88%90%E3%83%95%E3%82%A9%E3%83%AB%E3%83%80%E3%81%AFBindMount%E3%81%97%E3%81%A1%E3%82%83%E3%81%84%E3%81%91%E3%81%AA%E3%81%84%E3%81%9E%EF%BC%9F%E7%B4%84%E6%9D%9F%E3%81%A0%E3%81%9E%EF%BC%9F/)

また、お初ですが、`devcontainer.json`を設置してあるので、   
**Github Codespaceを使うとセットアップが自動化されます。**   
便利な世の中だなぁ...（しみじみ   

## 詳解
### DIコンテナとnanoeventsの導入
#### 依存解決
1. inversifyを導入(記事いっぱいあるため割愛)
2. nanoeventsを導入
``` shell:title=shell
yarn add nanoevents
```
#### イベントをハンドリングするインターフェースとクラスの準備
1. 新規に`IHogeEventProvider.tsx`を作成する
``` tsx:title=IHogeEVentProvider.tsx
export interface CallbackFunc {
    (push: boolean): void;
}

export interface IHogeEventProvider{
    publish: (push:boolean) => void,
    subscribe: (cbFunc:CallbackFunc) => void
}
```

2. 新規に`IHogeEvent.tsx`を作成する
``` tsx:title=IHogeEvent.tsx
export interface IHogeEvent {
    push: (push: boolean) => void;
}
```

3. 新規に`HogeEventProvider.tsx`を作成する
``` tsx:title=HogeEventProvider.tsx
import { CallbackFunc, IHogeEventProvider } from "@/interfaces/IHogeEventProvider"
import { IHogeEvent } from "@/interfaces/eventSchemas/IHogeEvent"
import { injectable } from "inversify";
import { Emitter, createNanoEvents } from "nanoevents"
import 'reflect-metadata'

@injectable()
export class HogeEventProvider implements IHogeEventProvider {
    private emitter: Emitter<IHogeEvent>;

    constructor(){
        this.emitter = createNanoEvents<IHogeEvent>();
    }

    public publish(push: boolean) {
        this.emitter.emit('push',push);
    }

    public subscribe(cbFunc: CallbackFunc) {
        this.emitter.on('push',push => {
            cbFunc(push);
        })
    }

}
```
#### DIコンテナのセットアップ
1. tsconfig.jsonを修正   
`"experimentalDecorators": true`と`"emitDecoratorMetadata": true`を追加
``` json{17-18}:title=tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}

```

2. next.config.jsを修正
``` js:title=next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        instrumentationHook: true
    }
}

module.exports = nextConfig
```

3. 新規に`Types.ts`を作成する   
    この中にはDIコンテナに登録するための型情報リストが格納されると思ってもらって良い
``` tsx:title=Types.ts
import { IHogeEventProvider } from "@/interfaces/IHogeEventProvider"
const TYPES = {
    IHogeEventProvider: Symbol.for('IHogeEventProvider'),
  }
  
  export { TYPES }
```

4. 新規に`inversify.config.ts`を作成する   
    **この中で、DIコンテナの登録処理を行う**
``` tsx:title=inversify.config.ts
import { Container } from 'inversify'
import { TYPES } from '@/dependencyInjections/Types'
import { IHogeEventProvider } from '@/interfaces/IHogeEventProvider'
import { HogeEventProvider } from '@/implements/HogeEventProvider'

const myContainer = new Container()
myContainer.bind<IHogeEventProvider>(TYPES.IHogeEventProvider).to(HogeEventProvider).inSingletonScope()

export { myContainer }
```

## DIコンテナとイベントの呼び出し方・使い方
### Subscriber
例として、[LeftComponent.tsx](https://github.com/yukimakura/nextjs_inversify_and_nanoevents_demo/blob/main/src/components/LeftComponent.tsx)で示す
``` tsx{8,11-13}:title=LeftComponent.tsx
import React, { useState } from "react";
import { myContainer } from "@/dependencyInjections/inversify.config";
import { HogeEventProvider } from "@/implements/HogeEventProvider";
import { TYPES } from "@/dependencyInjections/Types";
type Props = {};

const LeftComponent = (props: Props) => {
    const eventAction = myContainer.get<HogeEventProvider>(TYPES.IHogeEventProvider);
    const [isOn, setIsOn] = useState(false);

    eventAction.subscribe(x => {
        setIsOn(!isOn);
    });

    return (
        <>
        ひだりのこんぽーねんと<br/>
        {isOn ? "おん" : "おっふ"}<br/>
        <br/>
        </>
    );
};

export default LeftComponent;
```

8行目でDIコンテナからEventProviderを取り出し、   
11-13行目でイベント購読のコールバック処理を記述している   

### Publisher
例として、[RightComponent.tsx](https://github.com/yukimakura/nextjs_inversify_and_nanoevents_demo/blob/main/src/components/RightComponent.tsx)で示す
``` tsx{10,15}:title=RightComponent.tsx
import React, { useState } from "react";
import { myContainer } from "@/dependencyInjections/inversify.config";
import { HogeEventProvider } from "@/implements/HogeEventProvider";
import { TYPES } from "@/dependencyInjections/Types";
import { Button } from 'antd';

type Props = {};

const RightComponent = (props: Props) => {
    const eventAction = myContainer.get<HogeEventProvider>(TYPES.IHogeEventProvider);

    return (
        <div>
            右のコンポーネント<br/>
            <Button type="primary"  onClick={x => eventAction.publish(true)} > Button </Button>
        </div>
    );
};

export default RightComponent;
```
10行目でDIコンテナからEventProviderを取り出し、   
15行目でイベントの発信を行っている   

## 実行の様子
RightComponentにあるButtonを押すことで、   
LeftComponentの表示が切り替わっているのがわかる   
<iframe width="560" height="315" src="https://www.youtube.com/embed/1S21hIumpdc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

もちろんイベントのため、   
**複数の一斉購読も可能**   
<iframe width="560" height="315" src="https://www.youtube.com/embed/2LNx2mE36JA" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## 〆
DIコンテナから使う側はほぼMessagePipeと同じ使用感になったので   
結構満足です(｀・ω・´)   
しかし、DIコンテナの登録が鬼面倒くさいですね...   
これなんとかしたいなぁ...   
<br/>
まぁとりあえずこれで比較的キレイ＆楽チンに   
コンポーネント間通信ができるようになりましたね！   
めでたしめでたし？   
では(*^^*)ノシ   
