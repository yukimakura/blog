---
title: CSharpの拡張メソッドで関数型言語のパイプ演算子風を考える
date: "2024-06-04T08:00:00Z"
description: "CSharpの拡張メソッドで関数型言語のパイプ演算子風を考える"
tags: ["関数型言語","CSharp","Elixir","Nerves"]
---
## 背景
先週、オープンソースカンファレンス名古屋というイベントに参加してきました！   
そこで、NervesというElixirベースの開発フレームワークの存在を知り、絶賛Elixirお勉強中でございます      
(いやTypeScriptやれよ)   

当方、Elixirが実質初の関数型言語でございまして、   
色々学びが多くて嬉しいです（語彙力   
    
その中で`パイプ演算子`というものが非常に興味を持ちました   
ざっくりどういうものかを説明すると
``` elixir
foo(bar(baz(new_function(other_function()))))
```
というクソ入れ子なブツを
``` elixir
other_function() |> new_function() |> baz() |> bar() |> foo()
```
という書き方ができるというものです   
    
入れ子がスッキリするのも良いのですが、自分的には   
**本来呼ばれる順番がシーケンシャルに並んでいる**ところに美しさを感じました   

ふむ、これは是非CSharpでも活かしたいと思ったわけです   
(Linqだってある意味同じことをしてるじゃないですか！Linqはいいぞ!)
    
## 完成品
[Githubのレポ](https://github.com/yukimakura/OpePipeForCSharp)   
[Nugetでも配布しました！](https://www.nuget.org/packages/OpePipeForCSharp)

## 解説
中の実装は以下のみです！
``` csharp
/// <summary>
/// 関数型言語のパイプ演算子のような機能を拡張メソッドにて提供する
/// </summary>
/// <typeparam name="T">対象となる値の型</typeparam>
/// <param name="value"></param>
/// <param name="action">返り値がVoidとなる任意の処理</param>
/// <returns>拡張メソッドの引数valueの値が何も処理されずにそのまま返される</returns>
public static T Pipe<T>(this T value, Action<T> action)
{
    action(value);
    return value;
}

/// <summary>
/// 関数型言語のパイプ演算子のような機能を拡張メソッドにて提供する
/// </summary>
/// <typeparam name="FromT">対象となる値の型</typeparam>
/// <typeparam name="ToT">引数funcによって変形された返り値の型</typeparam>
/// <param name="value"></param>
/// <param name="func">任意の値を加工する処理</param>
/// <returns>引数funcによって変形された返り値</returns>
public static ToT Pipe<FromT, ToT>(this FromT value, Func<FromT, ToT> func)
    => func(value);

```

この2つで、結構やりたいことができます

### ケース1 つらつら処理をつなげる
※`Should().Be()`ってやつは[FluentAssertion](https://github.com/fluentassertions/fluentassertions)っていうテストのヘルパー的奴です
``` csharp
int value = 1;

value.Pipe(x => x + 100)
    .Pipe(x => x.Should().Be(101));
```
### ケース2 引数を省略
``` csharp
int value = 1;

// 事前に関数を定義しておくと...       
Func<int, int> addFunc = x => x + 100;

// 自動的にマッピング!
value.Pipe(addFunc)
    .Pipe(x => x.Should().Be(101));
```
※お察しかと思いますが、関数の引数が2つ以上ある場合や型がマッチしない場合はラムダ式必須です   
※もちろん、Func型でなくても普通に定義した関数でも同等のことができます
### ケース3 処理の間にログ的な出力を差し込む
``` csharp
var value = new DummyRecord(1, "yukimakura");

var thruFlag = false;

Func<DummyRecord, int> tfFunc = x => x.ID;
Action<int> modThruFlag = x => thruFlag = true;
Func<int, int> addFunc = x => x + 100;
value.Pipe(tfFunc)
    .Pipe(modThruFlag) //こいつをたとえばConsole.WriteLineとかにしても良い、そうするとtfFuncの返り値の値が標準出力される
    .Pipe(addFunc)
    .Pipe(x => x.Should().Be(101));

thruFlag.Should().BeTrue();
```

...ふむふむ、なかなか魅力的ではないですか？（・∀・）ﾆﾔﾆﾔ   

## デメリットの考察
...さて、表面上はいいことづくしなように見えてしまいますが、   
この**CSharpという王道オブジェクト指向言語において**考えなければならない問題があります   
### 如何にこの関数型アプローチがハマるか
まず、これが根本的に致命傷かもしれません   
純粋関数のような実装ばかりしていればこのアプローチにハマると思います   
しかし、大半の場合はオブジェクトに操作が紐づくケースだと思います   
...といいますか、オブジェクト思考だと一般論的にはそちらのほうが美しいとされることも多いのではないのでしょうか？
```csharp
internal class HogeClass{
    public int Count {get; private set;} = 0;

    public int CountUpAndGet(int count){
        Count += count;
        return Count;
    }
}
```
てきな、`CountUpAndGet()`を呼ぶごとに結果が変わる、   
純粋関数ではないような作りです    

これだと、関数型アプローチにはハマらないと思いますが   
別にこれは絶対悪というわけではないと思います   
(もっとも、単体テストを考えたときに脆いテストになってしまいそうですが...   
[参考:UnitTesting](https://amzn.asia/d/fcBlfgT))

### 知らない人がこのコードを見たときの違和感
...これは慣れてもらうしかない部分もあるかもしれませんが、   
直感的な部分で、「これ、意味あるの？」と思われる方も居られる気はします
   
事実、これを導入したからと言って圧倒的に開発しやすくなっただとか、   
処理性能が上がっただとかは無いです
    
あくまで、考え方的な話にはなると思いますが、   
入れ子構造よりも、行われる処理が文頭からシーケンシャルに行われるというナチュラル感や、コードの文字数の削減(ただし微々たるもの、チリツモやで！)の恩恵はあるので私は無駄だとは思いません    
    
昨今、多様性多様性と大絶叫している世の中なのでチームで開発する場合は   
合意形成が大事だと思います(当たりさわりの無い言い回し)    

## 〆
書いてるうちに途中で`Pipe()`よりも`Then()`のほうが適切に思えてきたゆきまくらです^^;  
    
この件はぶっちゃけ正解はない世界だと思いますが、    
影響の少ない範囲で用法用量守って効率的に開発する分にはいいと思います    
なにも、**オブジェクト指向言語だからといってオブジェクト指向のパラダイムに縛られる必要は無いのです！**   
(たとえは、JavaのSpringだってAOP(アスペクト指向プログラミング)を練り込んできてるでしょう？)   
まぁ、ユースケースをイメージすると、DIおよびストラテジーパターンを採用しているアーキテクチャなシステムがあると想定して、その末端の各ストラテジーにこの手法を採用するとかは影響範囲が大きくなくて比較的導入しやすいのかなとは思います   
    
純粋関数であることの利点としては[UnitTesting](https://amzn.asia/d/fcBlfgT)でも書いてあるように、   
単体テストの単純化および脆くなりにくいテストの構築に貢献してくれるはずです   
なので、**パラダイムの(用法用量を守った)多様性**も注視して今後は開発していくのが何よりも重要なのでしょう(持論)   
     
では(*^^*)ノシ   
