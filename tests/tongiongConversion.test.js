const { Converter } = require('taibun');
const checker = require('./utils');

const c = new Converter({ system: "Tongiong", punctuation: 'none' });
const cNorth = new Converter({ system: "Tongiong", dialect: "north", punctuation: 'none' });

test('tongiongInitials', () => {
	const bilabial = ["啡,bi", "波,por", "毛,mŏr", "猫,bhă"];
	checker(bilabial, c, cNorth);
	const alveolar = ["地,dē/duē", "唾,tôr", "早,zà", "厝,cû", "思,su", "耐,nāi", "如,rŭ/lŭ", "柳,liù"];
	checker(alveolar, c, cNorth);
	const alveolo_palatal = ["遮,zia", "手,ciù", "寫,sià", "而,rĭ/lĭ"];
	checker(alveolo_palatal, c, cNorth);
	const velar = ["求,giŭ", "去,kî", "雅,ngà", "語,ghì/ghù", "喜,hì"];
	checker(velar, c, cNorth);
});

test('tongiongVowelsAndRhymes', () => {
	const front = ["衣,i", "會,ē", "圓,ĭnn", "楹,ĕnn"];
	checker(front, c, cNorth);
	const central = ["阿,or", "亞,a", "餡,ānn"];
	checker(central, c, cNorth);
	const back = ["禹,ù", "烏,or", "張,diunn", "唔,onn"];
	checker(back, c, cNorth);
});

test('tongiongFinals', () => {
	const nasal = ["音,im", "寅,ĭn", "紅,ăng"];
	checker(nasal, c, cNorth);
	const stop = ["葉,iap", "楬,āt", "惡,ōk", "曷,ah"];
	checker(stop, c, cNorth);
	const syllabic = ["姆,m̀", "黃,n̆g"];
	checker(syllabic, c, cNorth);
});

test('tongiongSyllablesAdditional', () => {
	const additional = ["㨻,zānn", "一概,it-kâi", "三層,sām-zân", "不屑,but-sūt", "丑,tiù", "丼,dŏm", "乎,--ho̊nnh", "乞食,kit-ziah", "亂鐘,luân-zing", "交落,gā-lauh", "人間,rīn-gan/lîn-gan", "仰角,ghiong-gāk", "休克,hiū-kīk", "侮辱,bhu-riok/bhu-liok", "停電,tīng-diān/tîng-diān", "偝,āinn/iāng", "傳接,tuān-ziāp/tuân-ziāp", "僥倖,hiāu-hīng", "儼硬,ghiam-ngē/ghiam-ngī", "兄哥,hiānn-gor", "充作,ciōng-zōk", "免費,bhian-huî", "入口,rīp-kàu/līp-kàu", "八仙,bat-sian", "八月節,bè-ghuê-zēh/buè-ghê-zuēh", "冇浡,pànn-puh", "冰雹,bīng-pauh", "刐,dàinn", "判斷,puànn-duân", "別莊,biāt-zong", "刮,guēh/guīh", "剔斥,tak-tīk", "割禮,gat-lè", "劃,ueh/uih", "加快,gā-kuâi", "劣,luat", "劫棺,giap-guan", "匆促,cōng-ciōk", "匹敵,pit-dik", "半遂,buàn-suī", "協和,hiāp-hŏr", "卡片,kà-pînn", "卯名,bhau-miă", "卯落去,màu-lôr-kî", "危險,ghuī-hiàm/ghuî-hiàm", "卵包,nn̂g-bau", "參照,cām-ziâu", "合歡,hāp-huan", "含蓄,hām-tiōk/hâm-tiōk", "吭,kn̄gh", "吸汗,kip-guānn", "吻笑,bhun-ciôr", "呃酸,è-sng", "呿,kūh", "品嘗,pin-siŏng", "哈啾,hà-ciûnn", "哈氣,hā-kuî", "哼呻,hāinn-can", "唉,hāih", "喀,kennh", "喃,nāuh", "喓,iaunn", "喔,--o̊h", "喝令,huà-līng", "喢,sānnh", "嗙,pn̄gh", "嗾,zak", "嘈嘈唸,câu-câu-liām", "嘐潲,hāu-siău", "噎,ūh", "噯,āih", "噷,hmh", "嚇驚,hè-giann", "嚓,ciak", "嚷,riàng/liòng", "嚾,uang", "囤糴,dun-diah", "困局,kùn-giok", "圓參,īnn-som/înn-som", "在,zāi", "坉塗,tûn-tŏr", "坑谷,kēnn-gōk/kīnn-gōk", "坱埃,īng-ia", "垃圾,là-sāp", "基金,gī-gim", "堯韭,ghiāu-gù/ghiâu-gù", "塌替,tap-tê/tap-tuê", "壁畫,bià-uē", "壓模,ap-bhŏr", "外甥,ghuê-sing", "大山,Duâ-suann", "天光,tīnn-gng", "天后,tiān-hiōr", "太魯閣,Tài-lor-gōh", "央及,iāng-gip", "奇雙,kiā-siang", "奔喪,pūn-song", "好客,hònn-kēh", "妙,miāu", "妝娗,zn̄g-tānn", "妾,ciāp", "姓,sênn/sînn", "媽媽,mā-ma", "孵,bū", "學園,hāk-hn̆g", "學歹,ôr-pàinn", "孽,ghiat", "宅,teh", "安眠,ān-bhĭn", "寄來,già-lăi", "密實,bhāt-zat", "專員,zuān-uăn", "尿鈷,riôr-gòr/liôr-gòr", "屁,puî", "屆時,gài-sĭ", "屈橋,kut-giŏr", "屏遮那,Hè-sēn-nà", "屐,giah", "岩鹽,ghām-iăm/ghâm-iăm", "岳父,ghāk-hū", "年表,nī-biòr/nî-biòr", "店租,diàm-zor", "庵廟,ām-bhiōr", "廿,riap/liap", "彪,biu", "彼樣,hit-iūnn", "徼,kiôr", "忍心,rim-sim/lim-sim", "快活,kuìnn-uah", "忽然,hut-riăn/hut-liăn", "怦,pēnn", "怯膽,kiap-dànn", "恐畏,kiong-uî", "惜略,siòr-lioh", "愕,ghok", "愣,ghāng", "慼心,cè-sim/cuè-sim", "憚,dān", "懦,nōr", "懷念,huāi-liām/huâi-liām", "戇,ghōng", "扒飯,bē-bn̄g", "扭尻川,ngiu-kā-cng", "抓癢,riàu-ziūnn/liàu-ziūnn", "披埕,pī-diănn", "抹粉,bhuà-hùn", "抾拾,kiòr-sip", "拆壇,tià-duănn", "拋出,pāu-cūt", "拋捎,pā-sa", "拍插,pà-cāp", "拖直,tuā-dit", "招倚,ziōr-uà", "括流,guà-lău", "指,zàinn", "挓,tâ", "挕捒,hìnn-sāk", "挨餓,āi-ghōr", "掀冊,hiān-cēh", "掃蕩,sàu-dōng", "掇,duāh", "掙,ziānn", "掩目雞,ōm-bhāk-ge/ōm-bhāk-gue", "插春,cà-cun", "揬,duh", "搐,diūh", "搭嚇,dà-hiānnh", "搭里霧,Dâ-li-bhūh", "摳,kaunnh", "撇清,piat-cing", "撓,ngiàu", "撤職,tiat-zīt", "擉,diak", "擔當,dām-dng", "擗,piak", "攀登,pān-ding", "攔閘,nuā-zah/nuâ-zah", "敱,kàinn", "斟酒,tīn-ziù/tîn-ziù", "方興未艾,hōng-hīng-bhî-ngāi", "昨,zoh", "晚會,bhuan-huē", "晴,zĕnn", "晾,nĕ", "曲線,kiok-suânn", "朗讀,long-tok", "木業,bhōk-ghiap", "末路,bhuāt-lōr", "杵,tù", "枴,guài", "染,riàm/liàm", "校閱,gàu-uat", "核可,hīk-kòr", "桌屜,dòr-tuāh", "榆,riŭ/liŭ", "標本,biāu-bùn", "樸實,pòr-sit", "橫扴,huāinn-geh/huînn-geh", "檨,suāinn", "欶,sūh", "歇影,hiòr-iànn", "歌譜,guā-pòr", "歡度,huānn-dōr", "歪斜,uāi-cuah", "每擺,mui-bài", "沃雨,ak-hōr", "沉著,dīm-diok/dîm-diok", "沒藥,bhūt-ioh", "沓,dauh", "沓滴,dāp-dīh", "沖水,ciāng-zuì/ciâng-zuì", "沫,pueh/peh", "海蟹,hai-hē", "涼腔,liāng-kiang/liâng-kiang", "添設,tiām-siāt", "渺茫,bhiau-bhŏng", "湠叢,tuànn-zăng", "滅無,bhiāt-bhŏr", "漂浮,piāu-pŭ", "漉屎,lok-sài", "漚肥,āu-buĭ", "漳,ziang", "潑扇,puà-sînn", "潑賤,puat-ziān", "潤餅,rûn-biànn/lûn-biànn", "澩,haunnh", "激力,gik-lat", "濺,zuānn", "煏,biāk", "煠,sah", "煤,muĕ", "熁,hānnh", "熊,hĭm", "熱烈,riāt-liat/liāt-liat", "爁,nāh", "爹,dia", "牚,tênn", "牛膝,ghiū-cīk/ghiû-cīk", "物,mih/mngh", "物代,mì-dāi", "牽強,kiān-giŏng", "牽磕,kān-kap", "猛勇,bhing-iòng", "玉環,ghīk-kuăn", "玉蘭,ghiōk-lăn", "玩具,ghuan-kū", "甘苦,gām-kòr", "甪毛,lut-mn̆g", "番薯,hān-zĭ/hān-zŭ", "疊尖,tiāp-ziam", "疏散,sōr-sân", "癮甲,ghiàn-gāh", "百般,bà-buann", "益蟲,ik-tiŏng", "益閣,ià-gōh", "監牢,gānn-lŏr", "相閃,siōr-siàm", "眉額,bhāi-hiah/bhâi-hiah", "看,kuânn", "眩痧,hīn-sua/hîn-sua", "眵,cūh", "眼福,ghan-hōk", "睚,găinn", "督察,dok-cāt", "瞌,kēh/kuēh", "砌,gīh", "研缽,ghing-buāh", "破缺,puà-kīh", "硩,dēh", "碗頭箸尾,uann-tāu-dî-bhuè/uann-tâu-dû-bhè", "碧潭,pik-tăm", "確保,kak-bòr", "磨坩,bhuā-kann/bhuâ-kann", "礁石,dā-zioh", "礎,còr", "礙著,ghâi-dioh", "票箱,piòr-siunn", "禿,tūt", "空空,kāng-kang", "突,dut", "笠,leh", "筆算,bit-suân", "簇,cōk", "簸,buâ", "籤王,ciām-ŏng", "粒,liap", "糠瘡,kn̄g-cng", "糶,tiôr", "紂,diū", "納采,lāp-cài", "索梯,sòr-tui", "累積,lui-zīk", "紺,kòng", "結疤,giat-ba", "絕對,zuāt-duî", "絨布,riōng-bôr/liông-bôr", "經繭,gēnn-giàn/gīnn-giàn", "綠色,līk-sīk", "緝捕,cip-bòr", "緟,tōng", "編篡,biān-cuân", "缺糧,kuat-niŭ", "美味,bhi-bhī", "翕熱,hip-ruah/hip-luah", "聘請,pìng-ciànn", "聽錯,tiānn-côr", "肉目,bhà-bhak", "脈搏,mê-pōk", "脫節,tuat-ziāt", "腔調,kiūnn-diāu", "腰骨,iōr-gūt", "腳錢,giòr-zĭnn", "船運,zūn-ūn/zûn-ūn", "色牙,sik-ghă", "茅草,māu-càu/mâu-càu", "草笠仔,cau-lē-à/cau-luē-à", "莢,ngēh", "落落,lak-loh", "蓆,cioh", "蔥藕,cāng-ngāu", "蕨貓,guè-niau", "薄待,bōk-tāi", "薄膜,bôr-moh", "薑,giunn", "藃,hiāuh", "藩屏,puān-bĭn", "虹,kīng", "蚻,zuah", "蛤蜊,gap-lă", "蜀七,siōk-cīt", "蜈蚣,ghiā-gang/ghiâ-gang", "蜜月,bhīt-ghuat", "蝕秤,sî-cîn", "蝛,bhui", "蝨,sāt", "蟯桮,ghiōr-bue/ghiôr-bue", "蟯蟯動,ngiâu-ngiâu-dāng", "蟳,zĭm", "蟶坪,tān-piănn", "蠓罩,bhang-dâu", "蠘,cih", "蠻皮病,bhān-puē-bēnn/bhân-pê-bīnn", "血油,huè-iŭ/huì-iŭ", "血緣,hiat-iăn", "裂縫,lî-pāng", "裂隙,lià-kiāh", "褪,tn̂g", "褫奪,ti-duat", "襟章,kīm-ziong", "襪束,bhuê-sōk", "規暝,guī-mĕ/guī-mĭ", "覕喙,bhì-cuî", "觸纏,dak-dĭnn", "訣說,guat-suāt", "詰舌,kiat-zih", "誇張,kuā-diong", "諜,diap", "謔削,ghiôr-siāh", "謗大,bòng-duā", "謙遜,kiām-sûn", "謬誤,bhiû-ghōr", "謼,hōh", "豐沛,pōng-pâi", "買囑,mai-ziōk", "賴,luā", "赤疹,cià-zìn", "超市,ciāu-cī", "趖,sŏr", "跋涉,buāt-siap", "跡,riāh/liāh", "跤曲,kā-kiau", "跩,zuāinn", "跳躂,tiàu-tāt", "躄倒,pì-dòr", "躡,nēh/nīh", "輕聲細說,kīn-siānn-sè-suēh/kīn-siānn-suè-sēh", "轄境,hat-gìng", "辟走,pià-zàu", "迎神,ngiā-sĭn/ngiâ-sĭn", "迒,hānn", "迫切,bik-ciāt", "迭,diat", "迸,biâng", "送達,sàng-dat", "逝,zuā", "遮勘,riā-kâm/liā-kâm", "邀約,iāu-iōk", "邑,īp", "那通,na-tang", "郁,hiōk", "鄭,dēnn", "酷人,kok-lăng", "重青,dâng-cenn/dâng-cinn", "釣艚,diòr-zŏr", "銀髮,ghīn-huāt/ghûn-huāt", "銳減,ruê-giàm/luê-giàm", "錚,cānn", "錦繡,ghim-siû", "鎮煞,dìn-suāh", "鏨,zām", "鐵塔,tì-tāh", "鑠,siāk", "鑱,cĭm", "鑿,cak", "閂,cuânn", "閱覽,iāt-làm", "闊腹,kuà-bāk", "闖,cuâng", "關車,guāinn-cia/guīnn-cia", "闡,ciàn", "阿沙不魯,ā-sā-bù-lūh", "陷,hām", "雜柴,zāp-că", "雞齊根,gē-zē-gin/guē-zuê-gun", "靴管,hiā-gòng", "項,hāng", "領班,nia-ban", "額外,ghiâ-ghuā", "風吹日曝,hōng-cuē-rīt-pak/hōng-cē-līt-pak", "香,hiunn", "香茅,hiāng-hm̆", "香華,hiōng-hua", "騙,piân", "驕傲,giāu-ngōr", "鬧房,nâu-băng", "鬱卒,ut-zūt", "魠,tōh", "鱉,bīh", "鴆,tim", "鶴,hoh", "麥牙,bhê-ghĕ", "麻衫,muā-sann/muâ-sann", "默契,bhīk-kê/bhīk-kuê", "黜,tūh", "齴,ghiâng", "龐,piāng", "𠢕,ghău", "𠯗,zip", "𣁳,kāt", "𤆬,cuā", "𧮙,cōh", "𧿳,put", "𨂿,uàinn", "𩚨,kiū", "𩛩,gāuh"];
	checker(additional, c, cNorth);
});