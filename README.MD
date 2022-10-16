# met_data_geocoding

気象庁から提供されている[過去の気象データ](https://www.data.jma.go.jp/risk/obsdl/index.php)は、観測点ごとのダウンロードができますが、観測点の経緯度が分からないので、別途[アメダスのページ](https://www.jma.go.jp/jma/kishou/know/amedas/kaisetsu.html)で提供されている観測所一覧の CSV から、経緯度を付与するメモです。

## データの事前加工
過去の気象データについては、データ整形の必要がありそうです。取り急ぎ、Excel 上の作業で対応しています。
1. [過去の気象データ](https://www.data.jma.go.jp/risk/obsdl/index.php)から、データを CSV でダウンロード。
2. Excel で開いて転置。
3. ピボットテーブルで、行ラベルとして観測所名、列ラベルとして、各種情報（「均質番号」、「品質情報」、「目的の値」のセット）が並ぶようにします。
4. 上記のピビットテーブルのデータを CSV で出力します。

## 観測所の経緯度の付与
[アメダスのページ](https://www.jma.go.jp/jma/kishou/know/amedas/kaisetsu.html)の中ほどに、「地域気象観測所一覧 [ZIP圧縮形式]」というリンクがあるので、ここから ZIP をダウンロードして解凍し、中のCSVを取り出します。
この観測所一覧の CSV と上記の事前加工して作った気象データ CSV を tidyr を用いて結合させることで、観測地のに経緯度を付与します。なお、ここでは観測所名がキーになりますが、**観測所名は全国で重複があるので、都道府県等で事前に観測所一覧を絞り込む**などの工夫が必要です。

※サンプルの R スクリプトでは、その後の使い道として、クリギングをしています。

## 利用規約
https://www.jma.go.jp/jma/kishou/info/coment.html

# 参考文献

https://www.data.jma.go.jp/developer/index.html

https://dplyr.tidyverse.org/

https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames

https://qiita.com/mg_kudo/items/f06144c7f2267d6436af
