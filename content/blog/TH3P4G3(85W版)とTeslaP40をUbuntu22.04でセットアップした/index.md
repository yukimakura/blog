---
title: TH3P4G3(85W版)とTeslaP40をUbuntu22.04でセットアップした【外付けGPU】
date: "2024-02-10T09:00:00Z"
description: "TH3P4G3(85W版)とTeslaP40をUbuntu22.04でセットアップした"
tags: ["eGPU","Ubuntu","GPU","Docker","コンテナ仮想化"]
---

[この記事のTeslaP40版です](https://yukimakura.github.io/blog/TH3P4G3(85W%E7%89%88)%E3%81%A8RTX2080%E3%82%92Ubuntu22.04%E3%81%A7%E3%82%BB%E3%83%83%E3%83%88%E3%82%A2%E3%83%83%E3%83%97%E3%81%97%E3%81%9F/)

## そもそもなぜTesla P40🤔？
今、LLMがアツい！（そんなのわかってる   
最近では結構ローカルでLLMを動かす遊びができたりします   
GoogleさんやらMicrosoftさんやらはスマホで動かす用の小規模言語モデルというもの開発中とのこと(SLMって言うらしいよ)   

ローカルLLMをやるにあたって死活問題なのが、そう**VRAM**!   
LLama系で量子化したモデルでも賢いのを使おうとすると平気で何十ギガも食ってくる(ﾋﾟｴﾝ   
そこで、目をつけたのが**Tesla P40**です

ざっとスペック
| 項目 | 内容 |
| -- | -- |
|Cudaコア数|3840|
|Compute Capability |6.1|
|VRAM|**24GB**|
|TDP|250W|
[詳細はTechPowerUpさんにて](https://www.techpowerup.com/gpu-specs/tesla-p40.c2878)

なんと**24GB！！**   
でも、RTX3090やRTX4090だって24GB...   
それにTeslaなんて....お高いんでしょう？🤔   
<br>
...それがなんとebayやアリエクでは **2〜3マソで買えるのです!(もちろん中古ね)**   
多分、データセンターの世代交代による引退品が大量に流れてきてるのでしょうねぇ   

ちな、スペック的にはGTX1080Ti相当とのこと   
つまり、TensorCoreは搭載されておりません...（悲しい   
それでもいいという方はお試しあれ！（なんせ安いからシクッてもあんまりイタくないのがいいよね   

## 物理的な構成
### TH3P4G3(85W)
- PCIeをThunderbolt3に変換するアダプタ

### Tesla P40 24GB
- ebayで買った
  - 1週間で届いた（SFExpress速い。しゅごい

### ATX-1260GA1 80PLUS BRONZE 600W (Enhance製)
- ハードオフで3300円買った動作保証品(ジャンクじゃない)

### ThinkPad X1 Carbon Gen6
- 相棒
- スペック
    - Intel Core i7 8650U
    - 16GB RAM(速度はシラネ)
    - 訳あってWLANはBroadcom bcm94360ng
        - お察しください(^_^;)

## いろいろやったこと
### nvflashでcomputeモードからgraphicsモードに切り替える
これがコンシューマ機との大きな違い
pcieのデバイスのアクセス領域をちょめちょめして高速化する機能がデフォで有効らしく(Resizable BAR)、   
それが、原因で**dmesgにてエラー吐きながら認識・再認識を繰り返します**
なので、まずGPU側にてそれを無効化します   
1. 頑張って`nvflash`というユーティリティを入手する
2. eGPUを接続し、ubuntuの`設定`→`このシステムについて`→`ソフトウェアとアップデート`→`追加のドライバ`にて`X.Org.X.server`になっているか確認する
  - なってないなら、`sudo apt remove nvidia*`とかでいろいろ消したりしてX.Orgに切り替える
3. `sudo ./nvflash --list`でデバイスが認識されているのを確認し、<br>`sudo ./nvflash --gpumode graphics`を実行する

### nvidiaのドライバをインストール
1. GPUをThinkPadにぶっ挿す
2. 設定→このシステムについて→ソフトウェアのアップデート→追加のドライバータブを開く
3. nvidia-driver-535(プロプライエタリ)を選択し変更の適用
4. **再起動せず、eGPU Switcherのセットアップに続く**

### eGPU Switcherのセットアップ
[このQiitaの記事を参考にしました](https://qiita.com/y-vectorfield/items/8960c804441d2ebd605e#egpu-switcher%E3%81%AE%E3%82%BB%E3%83%83%E3%83%88%E3%82%A2%E3%83%83%E3%83%97egpu%E4%B8%8A%E3%81%A7%E5%8B%95%E4%BD%9C%E3%81%99%E3%82%8Bx-window-system)
1. eGPU Switcherをインストール&セットアップ
``` bash
sudo add-apt-repository ppa:hertg/egpu-switcher
sudo apt update
sudo apt install -y egpu-switcher
sudo egpu-switcher setup
```
2. 再起動

**※もし、GUIが死んでも`Ctrl+Alt+ファンクションキー(F2〜F6)`で**   
**CUIの別セッション開けれるのでそこで頑張ってなんとか復旧してください！(力技)**

### (オプション)Dockerのインストール&セットアップ
私は、あまり環境を汚したくないので、基本コンテナで開発してます。   
ネイティブにCUDAを入れるのは汚れる＆ダルいのでDockerでやっちゃいます。   
1. Dockerのインストール [いつもこのQiitaを参考にさせてもらってます](https://qiita.com/KEINOS/items/bdc9450c1a88c210aa88)
``` bash
curl -fsSL get.docker.com -o get-docker.sh && sh get-docker.sh && sudo gpasswd -a $USER docker && sudo docker run hello-world && rm -f get-docker.sh
```
2. 再起動
3. Nvidia Container Toolkitのインストール＆セットアップ   
[このzennを参考にしました](https://zenn.dev/usagi1975/articles/2022-09-05-000000_docker_gpu#nvidia-container-toolkit%E3%81%AE%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB)
``` bash
distribution=$(. /etc/os-release;echo $ID$VERSION_ID) \
  && curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg \
  && curl -s -L https://nvidia.github.io/libnvidia-container/$distribution/libnvidia-container.list | \
  sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | \
  sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list

> sudo apt update && sudo apt install -y nvidia-container-toolkit

sudo nvidia-ctk runtime configure --runtime=docker
sudo systemctl restart docker
```
4. コンテナ内でGPUが認識されているか確認する
```bash
docker run --rm --gpus all nvidia/cuda:12.0.0-base-ubuntu22.04 nvidia-smi
```
これで、nvidia-smiを確認できればおｋ！
```
+---------------------------------------------------------------------------------------+
| NVIDIA-SMI 545.29.06              Driver Version: 545.29.06    CUDA Version: 12.3     |
|-----------------------------------------+----------------------+----------------------+
| GPU  Name                 Persistence-M | Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp   Perf          Pwr:Usage/Cap |         Memory-Usage | GPU-Util  Compute M. |
|                                         |                      |               MIG M. |
|=========================================+======================+======================|
|   0  Tesla P40                      Off | 00000000:3E:00.0 Off |                  Off |
| N/A   36C    P8               9W / 250W |      4MiB / 24576MiB |      0%      Default |
|                                         |                      |                  N/A |
+-----------------------------------------+----------------------+----------------------+
                                                                                         
+---------------------------------------------------------------------------------------+
| Processes:                                                                            |
|  GPU   GI   CI        PID   Type   Process name                            GPU Memory |
|        ID   ID                                                             Usage      |
|=======================================================================================|
|  No running processes found                                                           |
+---------------------------------------------------------------------------------------+

```


## (オプション)ECCを有効化・無効化する
ここでは言及しませんが、さすがデータセンター用でECCが使えるようです

## (おまけ)みすってネットが死んだとき
クリーンな環境だとあまり問題にならないですが、   
すでにnvidiaのドライバ等入れてたときにそれを一旦消すと、   
たまに大事なものも一緒に消してしまうらしいです   
(私はRTX2080のときとP40のときで2回ネット周りがまるっと死んだ)   

まぁあくまで私の環境での復旧策ということで。

### カーネルのバージョンを調べる
```bash
uname -a
```

``` txt:title=出力
Linux yukimakura-ThinkPad-X1-Carbon-6th 6.5.0-17-generic #17~22.04.1-Ubuntu SMP PREEMPT_DYNAMIC Tue Jan 16 14:32:32 UTC 2 x86_64 x86_64 x86_64 GNU/Linux
```
これで、カーネルのバージョンが `6.5.0-17-generic`ということが分かりました
### 別のマシン(PCでもスマホでも可)を用意し、linux-modules-extraを拾ってくる
そう、このモジュールがうっかり消されてしまうモジュールです！   
こいつがないからネットにつながらないのです（この原因がわかるのに何時間も費やした...     
<br>
[pkgs.orgから該当するカーネルバージョンのlinux-modules-extraを探してダウンロードします](https://pkgs.org/search/?q=linux-modules-extra)   
それをUSBメモリなどのリムーバブルディスクにてコピーし、
```bash
sudo dpkg -i ./がいとうするlinux-modules-extra
```
してインストールすると復活するはず？   

## 〆
最初、試しで買ったときにデバイスが認識を繰り返して、   
dmesgでBar周りでエラー吐きまくったときは正直絶望しましたが、   
なんとかなってほんと良かったです…   
VRAMが24GBあれば量子化モデルであれば34BパラメーターのLLMとかいけちゃいます(yiとかね)   
ぜひぜひラップトップ勢も、諦めずに外付けTelsaで遊んでみては？

おまけのおまけで、同環境でRTX2080とP40をBlenderベンチした結果貼っときます

| テスト項目 | GPU | 結果 |
| --- | -- | -- |
| monster | RTX2080 | 1298.992945 |
| monster | P40 | 386.695855 |
| junkshop | RTX2080 | 699.879324 |
| junkshop | P40 | 250.4996267 |
| classroom | RTX2080 | 619.444119 |
| classroom | P40 | 190.203885 |
   
**差開きスギィ....!**   
では(^^)ノシ