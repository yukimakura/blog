---
title: "CSharpのgRPCサーバーでUDSとTCP同時受けする"
date: "2023-08-08T08:15:00Z"
description: "CSharp(C#)のgRPCサーバーでUnixDomainSocketとTCP同時受けする"
tags: ["C#","gRPC","UDS","DIコンテナ"]
---
## TL;DR
- Kestrelの設定を変更すればOK
    - [MSのソースを真似ればできる](https://learn.microsoft.com/ja-jp/aspnet/core/grpc/interprocess-uds?view=aspnetcore-7.0)
- [デモソースはここ(ゆきまくらのGithub)](https://github.com/yukimakura/grpc_uds_tcp_server_dotnet_demo/tree/main)


## ざっくり解説
### サーバーサイド
``` csharp{13-24}:title=Program.cs
using serverside.Services;
using grpcschema;
using Microsoft.AspNetCore.Server.Kestrel.Core;

var builder = WebApplication.CreateBuilder(args);

// Additional configuration is required to successfully run gRPC on macOS.
// For instructions on how to configure Kestrel and gRPC clients on macOS, visit https://go.microsoft.com/fwlink/?linkid=2099682

// Add services to the container.
builder.Services.AddGrpc();

var udsAddress = Path.Combine(Path.GetTempPath(), "socket.tmp");
builder.WebHost.ConfigureKestrel(serverOptions =>
{
    serverOptions.ListenUnixSocket(udsAddress, listenOptions =>
    {
        listenOptions.Protocols = HttpProtocols.Http2;
    });
    serverOptions.Listen(System.Net.IPAddress.Parse("0.0.0.0"),18686, ListenOptions =>
    {
        ListenOptions.Protocols = HttpProtocols.Http2;
    });
});

var app = builder.Build();



// Configure the HTTP request pipeline.
app.MapGrpcService<GreeterService>();
app.MapGet("/", () => "Communication with gRPC endpoints must be made through a gRPC client. To learn how to create a client, visit: https://go.microsoft.com/fwlink/?linkid=2086909");

app.Run();
```

Kestrelの設定にて、`ListenUnixSocket`(16〜19行目)でUDSの受け設定をし、   
`Listen`(20〜23行目)でTCPの受け設定をしている。   

### クライアントサイド
#### TCP
``` csharp{5}:title=UnitTest.cs(一部抜粋)
[Fact]
public async Task TCPTest()
{
    
    var channel = GrpcChannel.ForAddress(TCPAddress);

    var req = new grpcschema.HelloRequest() { Name = "てぃーしーぴぃそけっと" };

    var client = new grpcschema.Greeter.GreeterClient(channel);

    var reply = await client.SayHelloAsync(req);

    reply.Message.Should().Be("Hello " + req.Name);
}
```
５行目でTCPでのサーバーのアドレスを設定している

#### UDS(UnixDomainSocket)
クライアントサイドのUDSでは、   
**UDSのコールバック処理を別途用意する必要がある**
``` csharp:title=UnixDomainSocketsConnectionFactory.cs
using System.Net;
using System.Net.Sockets;

namespace clientside;

public class UnixDomainSocketsConnectionFactory
{
    private readonly EndPoint endPoint;

    public UnixDomainSocketsConnectionFactory(EndPoint endPoint)
    {
        this.endPoint = endPoint;
    }

    public async ValueTask<Stream> ConnectAsync(SocketsHttpConnectionContext _,
        CancellationToken cancellationToken = default)
    {
        var socket = new Socket(AddressFamily.Unix, SocketType.Stream, ProtocolType.Unspecified);

        try
        {
            await socket.ConnectAsync(this.endPoint, cancellationToken).ConfigureAwait(false);
            return new NetworkStream(socket, true);
        }
        catch
        {
            socket.Dispose();
            throw;
        }
    }
}
```
``` csharp{4-18}:title=UnitTest.cs(一部抜粋)
[Fact]
public async Task UDSTest()
{
    var udsEndPoint = new UnixDomainSocketEndPoint(UDSAddress);
    var connectionFactory = new UnixDomainSocketsConnectionFactory(udsEndPoint);
    var socketsHttpHandler = new SocketsHttpHandler
    {
        ConnectCallback = connectionFactory.ConnectAsync
    };

    var channel = GrpcChannel.ForAddress(
        TCPAddress, //←これはなんでもいい(無視される)
            new GrpcChannelOptions
    {
        HttpHandler = socketsHttpHandler
    });

    var req = new grpcschema.HelloRequest() { Name = "ゆにっくすどめいんそけっと" };

    var client = new grpcschema.Greeter.GreeterClient(channel);

    var reply = await client.SayHelloAsync(req);

    reply.Message.Should().Be("Hello " + req.Name);
}

```

11行目でTCPのアドレスが引数として要求されるが、
無視されるので、適当な値をいれる。

## 〆と注意点
注意点として、Kestrelから   
```
warn: Microsoft.AspNetCore.Server.Kestrel[0]
      Overriding address(es) 'http://localhost:5151'. Binding to endpoints defined via IConfiguration and/or UseKestrel() instead.
```
と警告が吐かれる。   
まぁ、内容を読めば、「せやな」としか言いようが無いので...   
<br/>
案外、簡単かつお手軽にUDS対応が出来ることがわかったと思います。   
また、.Net7からUDSはお手軽に使えるようになりましたが、   
.Net8からは名前付きパイプ経由も出来るようになるらしいです。     
選択肢が増えることは良いことだぁ(*^^*)  
あと、タイトルだけCSharpとなっているのは、   
なんか#を入れるとルーティングが狂うからです。（おい     
では(^^)ノシ