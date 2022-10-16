# met_data_geocoding

気象庁から提供されている[過去の気象データ](https://www.data.jma.go.jp/risk/obsdl/index.php)は、観測点ごとのダウンロードができますが、観測点の経緯度が分からないので、別途[アメダスのページ](https://www.jma.go.jp/jma/kishou/know/amedas/kaisetsu.html)で提供されている観測所一覧の CSV から、経緯度を付与するメモです。

## データの事前加工
過去の気象データについては、データ整形の必要がありそうです。取り急ぎ、Excel 上の作業で対応しています。
1. [過去の気象データ](https://www.data.jma.go.jp/risk/obsdl/index.php)から、データを CSV でダウンロード。
2. Excel で開いて転置。
3. ピボットテーブルで、行ラベルとして観測所名、列ラベルとして、各種情報（「均質番号」、「品質情報」、「目的の値」のセット）が並ぶようにします。
4. 上記のピボットテーブルのデータを CSV で出力します。

## 観測所の経緯度の付与
[アメダスのページ](https://www.jma.go.jp/jma/kishou/know/amedas/kaisetsu.html)の中ほどに、「地域気象観測所一覧 [ZIP圧縮形式]」というリンクがあるので、ここから ZIP をダウンロードして解凍し、中のCSVを取り出します。

この観測所一覧の CSV と上記の事前加工して作った気象データ CSV を tidyr を用いて left_join() 等で結合させることで、観測地のに経緯度を付与します。なお、ここでは観測所名がキーになりますが、**観測所名は全国で重複があるので、都道府県等で事前に観測所一覧を絞り込む**などの工夫が必要です。

※サンプルの R スクリプトでは、その後の使い道として、クリギングをしています。

## PDF の観測所一覧から情報取得

上記の CSV の存在に気が付く前に、[観測所一覧のPDF](https://www.jma.go.jp/jma/kishou/know/amedas/ame_master.pdf)から何とか情報を取得しようと正規表現を駆使して試行錯誤した結果もメモで残します。Node.js 用に JavaScript で記述したコードが、`getInfoFromAmePdf.js` です。使う際は、まず、表紙を除いて PDF を全部コピペして、テキストファイルに貼り付けたものを入力としてください。

## 気象データ等の利用規約
https://www.jma.go.jp/jma/kishou/info/coment.html

# 参考文献

https://www.data.jma.go.jp/developer/index.html

https://dplyr.tidyverse.org/

https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames

https://qiita.com/mg_kudo/items/f06144c7f2267d6436af
