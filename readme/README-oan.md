[國語](README-cmn.md) | [English](../README.md)



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/andreihar/taibun.js">
    <img src="https://github.com/andreihar/taibun/raw/main/readme/logo.png" alt="Logo" width="90" height="80">
  </a>
  
# Taibun.js



<!-- PROJECT SHIELDS -->
[![Contributions][contributions-badge]][contributions]
[![Live Demo][demo-badge]][demo]
[![Tests][tests-badge]][tests]
[![Release][release-badge]][release]
[![Licence][licence-badge]][licence]
[![LinkedIn][linkedin-badge]][linkedin]
[![Downloads][downloads-badge]][npm]

**台語音譯器佮標記器**

伊有允許自己設定音譯，佮揣出關於台語發音所需要的資料的方法<br />
包括台語的單詞標記器

[回報程式缺點][bug] •
[npm][npm]

</div>



---



<!-- TABLE OF CONTENTS -->
<details open>
  <summary>目錄</summary>
  <ol>
    <li><a href="#版本">版本</a></li>
    <li><a href="#安裝">安裝</a></li>
    <li>
      <a href="#用法">用法</a>
      <ul>
        <li>
          <a href="#converter">Converter</a>
          <ul>
            <li><a href="#system">System</a></li>
            <li><a href="#dialect">Dialect</a></li>
            <li><a href="#format">Format</a></li>
            <li><a href="#delimiter">Delimiter</a></li>
            <li><a href="#sandhi">Sandhi</a></li>
            <li><a href="#punctuation">Punctuation</a></li>
            <li><a href="#convert-non-cjk">Convert non-CJK</a></li>
          </ul>
        </li>
        <li>
          <a href="#tokeniser">Tokeniser</a>
          <ul>
            <li><a href="#keep-original">Keep original</a></li>
          </ul>
        </li>
        <li><a href="#其他的函式">其他的函式</a></li>
      </ul>
    </li>
    <li><a href="#例">例</a></li>
    <li><a href="#數據">數據</a></li>
    <li><a href="#致謝">致謝</a></li>
    <li><a href="#牌照">牌照</a></li>
  </ol>
</details>



<!-- OTHER VERSIONS -->
## 版本

[![Python Version][py-badge]][py-link]



<!-- INSTALL -->
## 安裝

Taibun 會曉通過 [npm][npm] 安裝

```bash
$ npm install taibun --save
```



<!-- USAGE -->
## 用法

### Converter

`Converter` 類別使用開發人員指定的參數將中文字音譯為所選的音譯系統。繁體佮簡體攏合用。

```js
// 建構仔
c = new Converter({ system, dialect, format, delimiter, sandhi, punctuation, convertNonCjk });

// 音譯中文字
c.get(input);
```

#### System

`system` String - 音譯系統。

* `Tailo` (預設) - [臺灣羅馬字拼音方案][tailo-wiki]
* `POJ` - [白話字][poj-wiki]
* `Zhuyin` - [臺語方音符號][zhuyin-wiki]
* `TLPA` - [臺灣語言音標方案][tlpa-wiki]
* `Pingyim` - [閩南話拼音方案][pingyim-wiki]
* `Tongiong` - [臺語通用拼音][tongiong-wiki]
* `IPA` - [國際音標][ipa-wiki]

| 文本 | Tailo   | POJ     | Zhuyin      | TLPA      | Pingyim | Tongiong | IPA         |
| ---- | ------- | ------- | ----------- | --------- | ------- | -------- | ----------- |
| 台灣 | Tâi-uân | Tâi-oân | ㄉㄞˊ ㄨㄢˊ | Tai5 uan5 | Dáiwán  | Tāi-uǎn  | Tai²⁵ uan²⁵ |

#### Dialect

`dialect` String - 頭一範的發音。

* `south` (預設) - 發音較像[漳州話][zhangzhou-wiki]
* `north` - 發音較像[泉州話][quanzhou-wiki]
* `singapore` - 帶有[新加坡特色][singapore-wiki]的泉州話發音

| 文本           | south                       | north                       | singapore                  |
| -------------- | --------------------------- | --------------------------- | -------------------------- |
| 五月節我啉咖啡 | Gōo-gue̍h-tseh guá lim ka-pi | Gōo-ge̍h-tsueh guá lim ka-pi | Gōo-ge̍h-tsueh uá lim ko-pi |

#### Format

`format` String - 轉換後的句子中表示聲調的格式。

* `mark` (預設) - 每个音節攏用變音符號。毋支援拼音
* `number` - 加入一个代表音節尾端聲調的數字
* `strip` - 刪除任何音調標記

| 文本 | mark    | number    | strip   |
| ---- | ------- | --------- | ------- |
| 台灣 | Tâi-uân | Tai5-uan5 | Tai-uan |

#### Delimiter

`delimiter` String - 設定欲放佇詞音節中間的分隔符。

預設值看所選的 `system` 決定:

* `'-'` - 對著 `Tailo`, `POJ`, `Tongiong`
* `''` - 對著 `Pingyim`
* `' '` - 對著 `Zhuyin`, `TLPA`, `IPA`

| 文本 | '-'     | ''     | ' '     |
| ---- | ------- | ------ | ------- |
| 台灣 | Tâi-uân | Tâiuân | Tâi uân |

#### Sandhi

`sandhi` String - 用[台語變調規則][sandhi-wiki]。

因為編碼所有變調法度困難，Taibun 提供濟種模式變調改換以支援自訂變調處理。

* `none` - 無執行任何變調
* `auto` - 上接近台語的正確音調變音，包括代詞、後娗佮帶有「仔」詞的音調變音
* `excLast` - 除了最後一个音節以外，每一个音節攏變調
* `inclLast` - 包括上尾一个音節在內，每一个音節攏變調

預設值看所選的 `system` 決定:

* `auto` - 對著 `Tongiong`
* `none` - 對著 `Tailo`, `POJ`, `Zhuyin`, `TLPA`, `Pingyim`, `IPA`

| 文本             | none                    | auto                   | excLast                | inclLast               |
| ---------------- | ----------------------- | ---------------------- | ---------------------- | ---------------------- |
| 這是你的茶桌仔無 | Tse sī lí ê tê-toh-á bô | Tse sì li ē tē-to-á bô | Tsē sì li ē tē-tó-a bô | Tsē sì li ē tē-tó-a bō |

變調規則也會隨著選的方言而有所改變。

| 文本 | 無變調  | south   | north / singapore |
| ---- | ------- | ------- | ----------------- |
| 台灣 | Tâi-uân | Tāi-uân | Tài-uân           |

#### Punctuation

`punctuation` String

* `format` (預設) - 將中文標點符號轉做英文標點符號，佮將每句頭前的詞大寫
* `none` - 保留中文風格的標點符號，佮新句開頭的詞毋大寫

| 文本                                                                           | format                                                                                            | none                                                                                                 |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| 這是臺南，簡稱「南」（白話字：Tâi-lâm；注音符號：ㄊㄞˊ ㄋㄢˊ，國語：Táinán）。 | Tse sī Tâi-lâm, kán-tshing "lâm" (Pe̍h-uē-jī: Tâi-lâm; tsù-im hû-hō: ㄊㄞˊ ㄋㄢˊ, kok-gí: Táinán). | tse sī Tâi-lâm，kán-tshing「lâm」（Pe̍h-uē-jī：Tâi-lâm；tsù-im hû-hō：ㄊㄞˊ ㄋㄢˊ，kok-gí：Táinán）。 |

#### Convert non-CJK

`convertNonCjk` Boolean - 定義轉換非中文單詞。會當用台羅來做其他羅馬拼音系統。

* `true` - 轉換非中文字詞
* `false` (預設) - 干焦轉換中文字詞

| 文本      | false                   | true                    |
| --------- | ----------------------- | ----------------------- |
| 我食pháng | ㆣㄨㄚˋ ㄐㄧㄚㆷ˙ pháng | ㆣㄨㄚˋ ㄐㄧㄚㆷ˙ ㄆㄤˋ |

### Tokeniser

`Tokeniser` 類別佇台語句子做類似 [NLTK wordpunct_tokenize][nltk-tokenize] 的標記化。

```js
// 建構仔
t = new Tokeniser(keepOriginal);

// 標記台語句
t.tokenise(input);
```

#### Keep original

`keepOriginal` Boolean - 定義保留輸入的原始字符。

* `true` (預設) - 保留原始字符
* `false` - 使用資料集中定義的字符替換原始字符

| 文本         | true                 | false                |
| ------------ | -------------------- | -------------------- |
| 臺灣火鸡肉饭 | ['臺灣', '火鸡肉饭'] | ['台灣', '火雞肉飯'] |

### 其他的函式

實用的台語 NLP 助手函式。

`toTraditional` 函式共輸入轉換做繁體字元以便佇資料集使用。嘛會當應對繁體字符變體。

`toSimplified` 函式共輸入轉換做簡體字元。

`isCjk` 函式檢查輸入字串敢是完全由中文字符成做。

```js
toTraditional(input);

toSimplified(input);

isCjk(input);
```



<!-- EXAMPLE -->
## 例

```js
// Converter
const { Converter } = require('taibun');

//// System
c = new Converter(); // system 預設值: Tailo
c.get('先生講，學生恬恬聽。');
>> Sian-sinn kóng, ha̍k-sing tiām-tiām thiann.

c = new Converter({ system: 'Zhuyin' });
c.get('先生講，學生恬恬聽。');
>> ㄒㄧㄢ ㄒㆪ ㄍㆲˋ, ㄏㄚㆶ˙ ㄒㄧㄥ ㄉㄧㆰ˫ ㄉㄧㆰ˫ ㄊㄧㆩ.

//// Dialect
c = new Converter(); // dialect 預設值: south
c.get("我欲用箸食魚");
>> Guá beh īng tī tsia̍h hî

c = new Converter({ dialect: 'north' });
c.get("我欲用箸食魚");
>> Guá bueh īng tū tsia̍h hû

c = new Converter({ dialect: 'singapore' });
c.get("我欲用箸食魚");
>> Uá bueh ēng tū tsia̍h hû

//// Format
c = new Converter(); // 佇 Tailo 中，format 預設值: mark
c.get("生日快樂");
>> Senn-ji̍t khuài-lo̍k

c = new Converter({ format: 'number' });
c.get("生日快樂");
>> Senn1-jit8 khuai3-lok8

c = new Converter({ format: 'strip' });
c.get("生日快樂");
>> Senn-jit khuai-lok

//// Delimiter
c = new Converter({ delimiter: '' });
c.get("先生講，學生恬恬聽。");
>> Siansinn kóng, ha̍ksing tiāmtiām thiann.

c = new Converter({ system: 'Pingyim', delimiter: '-' });
c.get("先生講，學生恬恬聽。");
>> Siān-snī gǒng, hág-sīng diâm-diâm tinā.

//// Sandhi
c = new Converter(); // 佇 Tailo 中，sandhi 預設值: none
c.get("這是你的茶桌仔無");
>> Tse sī lí ê tê-toh-á bô

c = new Converter({ sandhi: 'auto' });
c.get("這是你的茶桌仔無");
>> Tse sì li ē tē-to-á bô

c = new Converter({ sandhi: 'excLast' });
c.get("這是你的茶桌仔無");
>> Tsē sì li ē tē-tó-a bô

c = new Converter({ sandhi: 'inclLast' });
c.get("這是你的茶桌仔無");
>> Tsē sì li ē tē-tó-a bō

//// Punctuation
c = new Converter(); // punctuation 預設值: format
c.get("太空朋友，恁好！恁食飽未？");
>> Thài-khong pîng-iú, lín-hó! Lín tsia̍h-pá buē?

c = new Converter({ punctuation: 'none' });
c.get("太空朋友，恁好！恁食飽未？");
>> thài-khong pîng-iú，lín-hó！lín tsia̍h-pá buē？

//// Convert non-CJK
c = new Converter({ system: 'Zhuyin' }); // convertNonCjk 預設值: false
c.get("我食pháng");
>> ㆣㄨㄚˋ ㄐㄧㄚㆷ˙ pháng

c = new Converter({ system: 'Zhuyin', convertNonCjk: true });
c.get("我食pháng");
>> ㆣㄨㄚˋ ㄐㄧㄚㆷ˙ ㄆㄤˋ


// Tokeniser
const { Tokeniser } = require('taibun');

t = new Tokeniser();
t.tokenise("太空朋友，恁好！恁食飽未？");
>> ['太空', '朋友', '，', '恁好', '！', '恁', '食飽', '未', '？']

//// Keep Original
t = new Tokeniser(); // keepOriginal 預設值: true
t.tokenise("爲啥物臺灣遮爾好？");
>> ['爲啥物', '臺灣', '遮爾', '好', '？']

t.tokenise("为啥物台湾遮尔好？");
>> ['为啥物', '台湾', '遮尔', '好', '？']

t = new Tokeniser(false);
t.tokenise("爲啥物臺灣遮爾好？");
>> ['為啥物', '台灣', '遮爾', '好', '？']

t.tokenise("为啥物台湾遮尔好？");
>> ['為啥物', '台灣', '遮爾', '好', '？']


// 其他的函式
const { toTraditional, toSimplified, isCjk } = require('taibun');

//// toTraditional
toTraditional("我听无台语");
>> 我聽無台語

toTraditional("我爱这个个人台面");
>> 我愛這个個人檯面

toTraditional("爲啥物");
>> 為啥物

//// toSimplified
toSimplified("我聽無台語");
>> 我听无台语

//// isCjk
isCjk('我食麭')
>> true

isCjk('我食pháng');
>> false
```



<!-- DATA -->
## 數據

- [台華線頂對照典][online-dictionary] (藉著 [ChhoeTaigi][data-via])
- [iTaigi華台對照典][itaigi-dictionary] (藉著 [ChhoeTaigi][data-via])



<!-- ACKNOWLEDGEMENTS -->
## 致謝

- 任全恩 ([Github][samuel-github] · [LinkedIn][samuel-linkedin]) - 台語佮國語通譯



<!-- LICENCE -->
## 牌照

因為 Taibun 合和 MIT 許可，所以任何開發人員基本上攏會當用伊做任何𪜶欲做的代誌，只欲𪜶佇源代碼的任何副本中含原始版權佮許可聲明。 請注意，彼包使用的資料已經拿著不同版權的許可。

數據已獲得 [CC BY-SA 4.0][data-cc] 許可



<!-- MARKDOWN LINKS -->
[contributions]: https://github.com/andreihar/taibun.js/issues
[contributions-badge]: https://img.shields.io/badge/歡迎-貢獻協助-be132d?style=for-the-badge&logo=github
[demo]: https://taibun.andreihar.com/
[demo-badge]: https://img.shields.io/badge/現場演示-222222?style=for-the-badge&logo=homeadvisor&logoColor=white
[tests]: https://github.com/andreihar/taibun.js/actions
[tests-badge]: https://img.shields.io/github/actions/workflow/status/andreihar/taibun.js/ci.yaml?style=for-the-badge&logo=github-actions&logoColor=ffffff&label=構建
[release-badge]: https://img.shields.io/github/v/release/andreihar/taibun.js?color=38618c&style=for-the-badge&label=發布
[release]: https://github.com/andreihar/taibun.js/releases
[licence-badge]: https://img.shields.io/github/license/andreihar/taibun.js?color=000000&style=for-the-badge&label=牌照
[licence]: ../LICENSE
[linkedin-badge]: https://img.shields.io/badge/LinkedIn-0077b5?style=for-the-badge&logo=linkedin&logoColor=ffffff
[linkedin]: https://www.linkedin.com/in/andreihar/
[py-badge]: https://img.shields.io/badge/Python_版本-346c99?style=for-the-badge&logo=python&logoColor=fcce3d
[py-link]: https://github.com/andreihar/taibun
[downloads-badge]: https://img.shields.io/npm/d18m/taibun.svg?style=for-the-badge&label=下載

[npm]: https://www.npmjs.com/package/taibun
[bug]: https://github.com/andreihar/taibun.js/issues
[online-dictionary]: http://ip194097.ntcu.edu.tw/ungian/soannteng/chil/Taihoa.asp
[itaigi-dictionary]: https://itaigi.tw/
[data-via]: https://github.com/ChhoeTaigi/ChhoeTaigiDatabase
[data-cc]: https://creativecommons.org/licenses/by-sa/4.0/deed.zh_TW
[samuel-github]: https://github.com/SSSam
[samuel-linkedin]: https://www.linkedin.com/in/samuel-jen/

[tailo-wiki]: https://zh.wikipedia.org/zh-tw/%E8%87%BA%E7%81%A3%E9%96%A9%E5%8D%97%E8%AA%9E%E7%BE%85%E9%A6%AC%E5%AD%97%E6%8B%BC%E9%9F%B3%E6%96%B9%E6%A1%88
[poj-wiki]: https://zh.wikipedia.org/zh-tw/%E7%99%BD%E8%A9%B1%E5%AD%97
[zhuyin-wiki]: https://zh.wikipedia.org/zh-tw/%E8%87%BA%E7%81%A3%E6%96%B9%E9%9F%B3%E7%AC%A6%E8%99%9F
[tlpa-wiki]: https://zh.wikipedia.org/zh-tw/%E8%87%BA%E7%81%A3%E8%AA%9E%E8%A8%80%E9%9F%B3%E6%A8%99%E6%96%B9%E6%A1%88
[pingyim-wiki]: https://zh.wikipedia.org/zh-tw/%E9%96%A9%E5%8D%97%E8%A9%B1%E6%8B%BC%E9%9F%B3%E6%96%B9%E6%A1%88
[tongiong-wiki]: https://zh.wikipedia.org/zh-tw/%E8%87%BA%E8%AA%9E%E9%80%9A%E7%94%A8%E6%8B%BC%E9%9F%B3
[ipa-wiki]: https://zh.wikipedia.org/zh-tw/%E5%9C%8B%E9%9A%9B%E9%9F%B3%E6%A8%99
[zhangzhou-wiki]: https://zh.wikipedia.org/zh-tw/%E6%BC%B3%E5%B7%9E%E8%AF%9D
[quanzhou-wiki]: https://zh.wikipedia.org/zh-tw/%E6%B3%89%E5%B7%9E%E8%AF%9D
[singapore-wiki]: https://zh.wikipedia.org/wiki/%E6%96%B0%E5%8A%A0%E5%9D%A1%E7%A6%8F%E5%BB%BA%E8%A9%B1
[nltk-tokenize]: https://nltk.org/api/nltk.tokenize.html
[sandhi-wiki]: https://zh.wikipedia.org/zh-tw/%E8%87%BA%E7%81%A3%E8%A9%B1#%E9%80%A3%E8%AE%80%E8%AE%8A%E8%AA%BF:~:text=%E3%80%82%5B144%5D-,%E9%80%A3%E8%AE%80%E8%AE%8A%E8%AA%BF,-%E9%80%A3%E8%AE%80%E8%AE%8A%E8%AA%BF