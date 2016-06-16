# webmo-client
[Webmo](http://webmo.io/) のためのJavaScript用ライブラリです。

## Examples
### ブラウザからすぐ使う

```
<script src="https://raw.githubusercontent.com/cidreixd/webmo-library-javascript/master/dist/webmo.min.js"></script>
```

でgithubから直接ライブラリをインポートできます。


#### 例: 毎秒90度のスピードで回転して2秒後に止まる
```
<html>
  <head>
    <script src="https://raw.githubusercontent.com/cidreixd/webmo-library-javascript/master/dist/webmo.min.js"></script>
    <script type="text/javascript">
    var webmo = new Webmo.ws("webmo.local") // 引数にはホスト名を指定します。
    
    // クライアントがWebmoに接続したら呼ばれる関数
    webmo.onopen = function () {
      webmo.rotate(90) // 毎秒90度で回転する
      setTimeout(function () {
          // 2秒後に停止
          webmo.stop()
      }, 2000)
    }
    </script>
  </head>
  <body></body>
</html>
```

### Node.jsで使う

```
npm install webmo-client --save
```

#### 例: 毎秒90度のスピードで回転して2秒後に止まる
```
var WebmoWs = require('webmo-client').ws
var motor = new WebmoWs("webmo.local")

webmo.onopen = () => {
  motor.rotate(90)
  setTimeout(() => { motor.stop() }, 2000)
}
```

## document
commming soon...

## サポートするWebmoのソフトウェアバージョン
`v0.1.0`-`v0.1.1`

## License
MIT License
