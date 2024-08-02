[台語](readme/README-oan.md) | [國語](readme/README-cmn.md)



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

**Taiwanese Hokkien Transliterator and Tokeniser**

It has methods that allow to customise transliteration and retrieve any necessary information about Taiwanese Hokkien pronunciation.<br />
Includes word tokeniser for Taiwanese Hokkien.

[Report Bug][bug] •
[npm][npm]

</div>



---



<!-- TABLE OF CONTENTS -->
<details open>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#versions">Versions</a></li>
    <li><a href="#install">Install</a></li>
    <li>
      <a href="#usage">Usage</a>
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
        <li><a href="#other-functions">Other Functions</a></li>
      </ul>
    </li>
    <li><a href="#example">Example</a></li>
    <li><a href="#data">Data</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
    <li><a href="#licence">Licence</a></li>
  </ol>
</details>



<!-- OTHER VERSIONS -->
## Versions

[![Python Version][py-badge]][py-link]



<!-- INSTALL -->
## Install

Taibun can be installed from [npm][npm]

```bash
$ npm install taibun --save
```



<!-- USAGE -->
## Usage

### Converter

`Converter` class transliterates the Chinese characters to the chosen transliteration system with parameters specified by the developer. Works for both Traditional and Simplified characters.

```js
// Constructor
c = new Converter({ system, dialect, format, delimiter, sandhi, punctuation, convertNonCjk });

// Transliterate Chinese characters
c.get(input);
```

#### System

`system` String - system of transliteration.

* `Tailo` (default) - [Tâi-uân Lô-má-jī Phing-im Hong-àn][tailo-wiki]
* `POJ` - [Pe̍h-ōe-jī][poj-wiki]
* `Zhuyin` - [Taiwanese Phonetic Symbols][zhuyin-wiki]
* `TLPA` - [Taiwanese Language Phonetic Alphabet][tlpa-wiki]
* `Pingyim` - [Bbánlám Uē Pìngyīm Hōng'àn][pingyim-wiki]
* `Tongiong` - [Daī-ghî Tōng-iōng Pīng-im][tongiong-wiki]
* `IPA` - [International Phonetic Alphabet][ipa-wiki]

| text | Tailo   | POJ     | Zhuyin      | TLPA      | Pingyim | Tongiong | IPA         |
| ---- | ------- | ------- | ----------- | --------- | ------- | -------- | ----------- |
| 台灣 | Tâi-uân | Tâi-oân | ㄉㄞˊ ㄨㄢˊ | Tai5 uan5 | Dáiwán  | Tāi-uǎn  | Tai²⁵ uan²⁵ |

#### Dialect

`dialect` String - preferred pronunciation.

* `south` (default) - [Zhangzhou][zhangzhou-wiki]-leaning pronunciation
* `north` - [Quanzhou][quanzhou-wiki]-leaning pronunciation
* `singapore` - Quanzhou-leaning pronunciation with [Singaporean characteristics][singapore-wiki]

| text           | south                       | north                       | singapore                  |
| -------------- | --------------------------- | --------------------------- | -------------------------- |
| 五月節我啉咖啡 | Gōo-gue̍h-tseh guá lim ka-pi | Gōo-ge̍h-tsueh guá lim ka-pi | Gōo-ge̍h-tsueh uá lim ko-pi |

#### Format

`format` String - format in which tones will be represented in the converted sentence.

* `mark` (default) - uses diacritics for each syllable. Not available for TLPA
* `number` - add a number which represents the tone at the end of the syllable
* `strip` - removes any tone marking

| text | mark    | number    | strip   |
| ---- | ------- | --------- | ------- |
| 台灣 | Tâi-uân | Tai5-uan5 | Tai-uan |

#### Delimiter

`delimiter` String - sets the delimiter character that will be placed in between syllables of a word.

Default value depends on the chosen `system`:

* `'-'` - for `Tailo`, `POJ`, `Tongiong`
* `''` - for `Pingyim`
* `' '` - for `Zhuyin`, `TLPA`, `IPA`

| text | '-'     | ''     | ' '     |
| ---- | ------- | ------ | ------- |
| 台灣 | Tâi-uân | Tâiuân | Tâi uân |

#### Sandhi

`sandhi` String - applies the [sandhi rules of Taiwanese Hokkien][sandhi-wiki].

Since it's difficult to encode all sandhi rules, Taibun provides multiple modes for sandhi conversion to allow for customised sandhi handling.

* `none` - doesn't perform any tone sandhi
* `auto` - closest approximation to full correct tone sandhi of Taiwanese, with proper sandhi of pronouns, suffixes, and words with 仔
* `excLast` - changes tone for every syllable except for the last one
* `inclLast` - changes tone for every syllable including the last one

Default value depends on the chosen `system`:

* `auto` - for `Tongiong`
* `none` - for `Tailo`, `POJ`, `Zhuyin`, `TLPA`, `Pingyim`, `IPA`

| text             | none                    | auto                   | excLast                | inclLast               |
| ---------------- | ----------------------- | ---------------------- | ---------------------- | ---------------------- |
| 這是你的茶桌仔無 | Tse sī lí ê tê-toh-á bô | Tse sì li ē tē-to-á bô | Tsē sì li ē tē-tó-a bô | Tsē sì li ē tē-tó-a bō |

Sandhi rules also change depending on the dialect chosen.

| text | no sandhi | south   | north / singapore |
| ---- | --------- | ------- | ----------------- |
| 台灣 | Tâi-uân   | Tāi-uân | Tài-uân           |

#### Punctuation

`punctuation` String

* `format` (default) - converts Chinese-style punctuation to Latin-style punctuation and capitalises words at the beginning of each sentence
* `none` - preserves Chinese-style punctuation and doesn't capitalise words at the beginning of new sentences

| text                                                                           | format                                                                                            | none                                                                                                 |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| 這是臺南，簡稱「南」（白話字：Tâi-lâm；注音符號：ㄊㄞˊ ㄋㄢˊ，國語：Táinán）。 | Tse sī Tâi-lâm, kán-tshing "lâm" (Pe̍h-uē-jī: Tâi-lâm; tsù-im hû-hō: ㄊㄞˊ ㄋㄢˊ, kok-gí: Táinán). | tse sī Tâi-lâm，kán-tshing「lâm」（Pe̍h-uē-jī：Tâi-lâm；tsù-im hû-hō：ㄊㄞˊ ㄋㄢˊ，kok-gí：Táinán）。 |

#### Convert non-CJK

`convertNonCjk` Boolean - defines whether or not to convert non-Chinese words. Can be used to convert Tailo to another romanisation system.

* `true` - convert non-Chinese character words
* `false` (default) - convert only Chinese character words

| text      | false                   | true                    |
| --------- | ----------------------- | ----------------------- |
| 我食pháng | ㆣㄨㄚˋ ㄐㄧㄚㆷ˙ pháng | ㆣㄨㄚˋ ㄐㄧㄚㆷ˙ ㄆㄤˋ |

### Tokeniser

`Tokeniser` class performs [NLTK wordpunct_tokenize][nltk-tokenize]-like tokenisation of a Taiwanese Hokkien sentence.

```js
// Constructor
t = new Tokeniser(keepOriginal);

// Tokenise Taiwanese Hokkien sentence
t.tokenise(input);
```

#### Keep original

`keepOriginal` Boolean - defines whether the original characters of the input are retained.

* `true` (default) - preserve original characters
* `false` - replace original characters with characters defined in the dataset

| text         | true                 | false                |
| ------------ | -------------------- | -------------------- |
| 臺灣火鸡肉饭 | ['臺灣', '火鸡肉饭'] | ['台灣', '火雞肉飯'] |

### Other Functions

Handy functions for NLP tasks in Taiwanese Hokkien.

`toTraditional` function converts input to Traditional Chinese characters that are used in the dataset. Also accounts for different variants of Traditional Chinese characters.

`toSimplified` function converts input to Simplified Chinese characters.

`isCjk` function checks whether the input string consists entirely of Chinese characters.

```js
toTraditional(input);

toSimplified(input);

isCjk(input);
```



<!-- EXAMPLE -->
## Example

```js
// Converter
const { Converter } = require('taibun');

//// System
c = new Converter(); // Tailo system default
c.get('先生講，學生恬恬聽。');
>> Sian-sinn kóng, ha̍k-sing tiām-tiām thiann.

c = new Converter({ system: 'Zhuyin' });
c.get('先生講，學生恬恬聽。');
>> ㄒㄧㄢ ㄒㆪ ㄍㆲˋ, ㄏㄚㆶ˙ ㄒㄧㄥ ㄉㄧㆰ˫ ㄉㄧㆰ˫ ㄊㄧㆩ.

//// Dialect
c = new Converter(); // south dialect default
c.get("我欲用箸食魚");
>> Guá beh īng tī tsia̍h hî

c = new Converter({ dialect: 'north' });
c.get("我欲用箸食魚");
>> Guá bueh īng tū tsia̍h hû

c = new Converter({ dialect: 'singapore' });
c.get("我欲用箸食魚");
>> Uá bueh ēng tū tsia̍h hû

//// Format
c = new Converter(); // for Tailo, mark by default
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
c = new Converter(); // for Tailo, sandhi none by default
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
c = new Converter(); // format punctuation default
c.get("太空朋友，恁好！恁食飽未？");
>> Thài-khong pîng-iú, lín-hó! Lín tsia̍h-pá buē?

c = new Converter({ punctuation: 'none' });
c.get("太空朋友，恁好！恁食飽未？");
>> thài-khong pîng-iú，lín-hó！lín tsia̍h-pá buē？

//// Convert non-CJK
c = new Converter({ system: 'Zhuyin' }); // false convertNonCjk default
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
t = new Tokeniser(); // true keepOriginal default
t.tokenise("爲啥物臺灣遮爾好？");
>> ['爲啥物', '臺灣', '遮爾', '好', '？']

t.tokenise("为啥物台湾遮尔好？");
>> ['为啥物', '台湾', '遮尔', '好', '？']

t = new Tokeniser(false);
t.tokenise("爲啥物臺灣遮爾好？");
>> ['為啥物', '台灣', '遮爾', '好', '？']

t.tokenise("为啥物台湾遮尔好？");
>> ['為啥物', '台灣', '遮爾', '好', '？']


// Other Functions
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
## Data

- [Taiwanese-Chinese Online Dictionary][online-dictionary] (via [ChhoeTaigi][data-via])
- [iTaigi Chinese-Taiwanese Comparison Dictionary][itaigi-dictionary] (via [ChhoeTaigi][data-via])



<!-- ACKNOWLEDGEMENTS -->
## Acknowledgements

- Samuel Jen ([Github][samuel-github] · [LinkedIn][samuel-linkedin]) - Taiwanese and Mandarin translation



<!-- LICENCE -->
## Licence

Because Taibun is MIT-licensed, any developer can essentially do whatever they want with it as long as they include the original copyright and licence notice in any copies of the source code. Note, that the data used by the package is licensed under a different copyright.

The data is licensed under [CC BY-SA 4.0][data-cc]



<!-- MARKDOWN LINKS -->
[contributions]: https://github.com/andreihar/taibun.js/issues
[contributions-badge]: https://img.shields.io/badge/Contributions-Welcomed-be132d?style=for-the-badge&logo=github
[demo]: https://taibun.andreihar.com/
[demo-badge]: https://img.shields.io/badge/Live_Demo-222222?style=for-the-badge&logo=homeadvisor&logoColor=white
[tests]: https://github.com/andreihar/taibun.js/actions
[tests-badge]: https://img.shields.io/github/actions/workflow/status/andreihar/taibun.js/ci.yaml?style=for-the-badge&logo=github-actions&logoColor=ffffff
[release-badge]: https://img.shields.io/github/v/release/andreihar/taibun.js?color=38618c&style=for-the-badge
[release]: https://github.com/andreihar/taibun.js/releases
[licence-badge]: https://img.shields.io/github/license/andreihar/taibun.js?color=000000&style=for-the-badge
[licence]: LICENSE
[linkedin-badge]: https://img.shields.io/badge/LinkedIn-0077b5?style=for-the-badge&logo=linkedin&logoColor=ffffff
[linkedin]: https://www.linkedin.com/in/andreihar/
[py-badge]: https://img.shields.io/badge/Python_Version-346c99?style=for-the-badge&logo=python&logoColor=fcce3d
[py-link]: https://github.com/andreihar/taibun
[downloads-badge]: https://img.shields.io/npm/d18m/taibun.svg?style=for-the-badge

[npm]: https://www.npmjs.com/package/taibun
[bug]: https://github.com/andreihar/taibun.js/issues
[online-dictionary]: http://ip194097.ntcu.edu.tw/ungian/soannteng/chil/Taihoa.asp
[itaigi-dictionary]: https://itaigi.tw/
[data-via]: https://github.com/ChhoeTaigi/ChhoeTaigiDatabase
[data-cc]: https://creativecommons.org/licenses/by-sa/4.0/deed.en
[samuel-github]: https://github.com/SSSam
[samuel-linkedin]: https://www.linkedin.com/in/samuel-jen/

[tailo-wiki]: https://en.wikipedia.org/wiki/T%C3%A2i-u%C3%A2n_L%C3%B4-m%C3%A1-j%C4%AB_Phing-im_Hong-%C3%A0n
[poj-wiki]: https://en.wikipedia.org/wiki/Pe%CC%8Dh-%C5%8De-j%C4%AB
[zhuyin-wiki]: https://en.wikipedia.org/wiki/Taiwanese_Phonetic_Symbols
[tlpa-wiki]: https://en.wikipedia.org/wiki/Taiwanese_Language_Phonetic_Alphabet
[pingyim-wiki]: https://en.wikipedia.org/wiki/Bb%C3%A1nl%C3%A1m_p%C3%ACngy%C4%ABm
[tongiong-wiki]: https://en.wikipedia.org/wiki/Da%C4%AB-gh%C3%AE_t%C5%8Dng-i%C5%8Dng_p%C4%ABng-im
[ipa-wiki]: https://en.wikipedia.org/wiki/International_Phonetic_Alphabet
[zhangzhou-wiki]: https://en.wikipedia.org/wiki/Zhangzhou_dialects
[quanzhou-wiki]: https://en.wikipedia.org/wiki/Quanzhou_dialects
[singapore-wiki]: https://en.wikipedia.org/wiki/Singaporean_Hokkien
[nltk-tokenize]: https://nltk.org/api/nltk.tokenize.html
[sandhi-wiki]: https://en.wikipedia.org/wiki/Taiwanese_Hokkien#Tone%20sandhi:~:text=thng%E2%9F%A9%20(%22soup%22).-,Tone%20sandhi,-%5Bedit%5D