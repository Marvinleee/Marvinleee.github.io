---
layout: post
title: "Intel 800Gb/s 微环 DWDM 收发机（VLSI 2026 C20.1）— 中文解读"
date: 2026-08-24 20:35:00 +0800
categories: [计算机体系结构]
tags: [硅光子, 微环调制器, DWDM, MRR, CPO, 光互连, Intel, VLSI2026]
description: "对 Intel 在 VLSI 2026（C20.1）发表的 800Gb/s O 波段微环 DWDM 收发机样机的中文结构化解读：16 波長、5.7pJ/b、開腔有機封裝。"
---

> **来源**：[Simple Tech Trend](https://www.simpletechtrend.com/) — *Intel 把 16 個波長塞進一根光纖：800Gb/s、5.7pJ/b、開腔封裝的 MRR-DWDM 收發機長什麼樣*
> **原文链接**：<https://www.simpletechtrend.com/post/intel-800g-microring-dwdm-transceiver-open-cavity-vlsi2026>
> **原文发布日**：2026-07-07 ｜ **作者**：Simple Tech Trend
> **说明**：本文为原文全文转载（中文），附结构化中文解读。原文以中文写就，未作翻译；解读部分为整理归纳，不代表原作者观点。

# 第一部分：正文（Original Article）

Intel 在 VLSI 2026（論文編號 C20.1）端出一顆 O 波段的矽光子微環（MRR）DWDM 收發機，用 16 個波長、每波長 50Gb/s NRZ，在單一光纖上同時跑出 800Gb/s/fiber，且所有波長 BER<1e-9。它不是又一顆調變器 IP，而是一整套可運作的 DWDM 光互連系統樣機——把 16 波長 DFB 雷射陣列、微環調變、波長交織、Ge 光偵測器、半導體光放大器（SOA）全長在同一顆光子晶片上。整體能效約 5.7pJ/b，且用一種「開腔（open-cavity）有機封裝」把 22nm CMOS 電子晶片直接 3D 覆晶疊到光子晶片上，繞過高速中介層寄生。

## 1. 論文背景：Intel 在 VLSI 2026 的 C20.1，端的是「系統」不是「元件」

先講這篇不是什麼。它不是一顆單獨的微環調變器（MRM）電性量測，不是一顆孤立的接收機前端，也不是只有模擬沒有矽的概念驗證。這三個排除很重要，因為過去五年矽光子論文最常見的形態，正是「單一元件、實驗室級光路、外接大型雷射」的拼裝量測。這篇（作者 Cooper S. Levy 等，Intel，發表於 2026 IEEE VLSI Technology and Circuits Symposium，論文編號 C20.1）反其道而行：把一整套密集波長分工多工（DWDM）收發機做成可運作的樣機，而且是兩顆同款收發機用單模光纖（SMF）對接、真的跑起 16 波長同時傳輸的完整鏈路。微環路線是矽光子裡唯一能在 iso-energy 前提下，靠波長選擇性把每根光纖頻寬快速往上疊的方案。

## 2. 核心問題：把光引擎做成一整套可運作的 DWDM 光互連系統樣機

用一句話講清楚這篇在解什麼題：如何把「16 波長雷射 + 調變 + 解多工 + 光放大 + 高速 CMOS 電路 + 低寄生封裝」整合成一顆能真的在光纖上跑出 800Gb/s、且逐波長 BER<1e-9 的完整收發機。這不是單點突破，而是一場整合硬仗。難點分三層：光子層（16 波長要各自對準、互不串擾）、電子層（每波長 50Gb/s 的驅動與接收要夠快夠省）、封裝層（電光之間的高速互連寄生要壓到最低）。這三層任何一層掉鏈子，整套鏈路的 BER 就守不住。

## 3. Figure 1：一根光纖裝 16 個波長的系統藍圖

這張圖展示了整顆收發機（OTRX）的系統級架構——從發射端（TX）的 16 波長雷射陣列，一路到接收端（RX）的解多工與光偵測。TX 側是一組整合的 16 波長分散式回饋（DFB）雷射陣列，波長間距 200±40 GHz，每個波長被一顆獨立的微環調變器（MRM）調變；TX 與 RX 都做偶奇波長交織來壓低波長間串擾。RX 側用微環的分插濾波器（ADF）把進來的光解多工，drop 埠接 Ge 光偵測器（PD）。這張圖定義了 Intel 對 CPO 的一種完整想像：把一整條 DWDM 光路收斂成可以貼到 XPU／交換機封裝旁的模組。

![Intel 800G MRR-DWDM 收发机 · 图01](/assets/img/posts/intel-800g-microring-dwdm-transceiver-vlsi2026/img01.png)
*图01｜原文配图（Intel / VLSI 2026 C20.1）*

## 4. Figure 2：反相器式差分驅動器——把「堆疊高壓」的老問題丟掉

這張圖展示了每波長的差分高速光發射（OTX）驅動器電路，位於 CMOS 電子晶片（EIC）裡。這顆驅動器選了反相器（inverter-based）架構，以差分方式驅動 MRM 二極體，做出約 2Vdd 的峰對峰擺幅。關鍵是它繞開了單端堆疊式驅動器的高輸出阻抗問題——傳統堆疊架構為了頂住 2Vdd 電壓，得用能承受高壓的電晶體，輸出阻抗高、頻寬受限。這顆差分驅動器裡的高速電晶體不需要承受 2Vdd，因此拓撲容易隨製程微縮往下走。這暴示了異質整合（EIC 與 PIC 分開做、分開優化）的價值。

![Intel 800G MRR-DWDM 收发机 · 图02](/assets/img/posts/intel-800g-microring-dwdm-transceiver-vlsi2026/img02.png)
*图02｜原文配图（Intel / VLSI 2026 C20.1）*

## 5. Figure 3：基線漂移（BLW）校正——AC 耦合又想 DC 對準

這張圖展示了發射端的電性基線漂移（baseline-wander，BLW）校正電路：在 AC 耦合（陰極側）的驅動輸出上，補一條低頻前饋路徑，把 OTX 與 MRM 做 DC 耦合，並用一個回饋電路讓 DC 耦合擺幅（IT×Rbias）去匹配高速 AC 耦合擺幅（Vdd）。MRM 在 1.5V 反向偏壓下支援 50Gb/s NRZ，需要差分驅動器提供 1.95V 陰極偏壓；為避免過壓，陰極路徑做 AC 耦合，再補 DC 耦合前饋路徑處理低 MHz 資料截止問題。傳統做法要用一顆約 80kΩ 的大電阻 Rbias，但 μA 級的 MRM 光電流流過這麼大的電阻，會造成約 0.8V 的顯著壓降。Intel 的回饋機制讓 DC 路徑跨製程角落去追蹤 AC 耦合擺幅。

![Intel 800G MRR-DWDM 收发机 · 图03](/assets/img/posts/intel-800g-microring-dwdm-transceiver-vlsi2026/img03.png)
*图03｜原文配图（Intel / VLSI 2026 C20.1）*

## 6. Figure 4：抽出 MRM 光電流的複製電路——熱控制的量測抓手

這張圖展示了一個複製（replica）電路，用來抽取 MRM 的光電流 iPH；熱控制單元（TCU）會把這個 iPH 鎖定到一個校準過的目標值，而這個目標值唯一決定了 MRM 的插入損耗。微環是一種對溫度極度敏感的元件——環的共振波長會隨溫度漂，一漂就對不準雷射，鏈路就挂。因此每顆微環都需要一套獨立的熱控制把它鎖在對應雷射的波長上。這裡用 MRM 的 iPH 當作 TX 側的失諧指標。這揭露了微環量產化最現實的一道關卡——16 個波長就是 16 套 TCU，每套都要有自己的鎖定量測與回授。

![Intel 800G MRR-DWDM 收发机 · 图04](/assets/img/posts/intel-800g-microring-dwdm-transceiver-vlsi2026/img04.png)
*图04｜原文配图（Intel / VLSI 2026 C20.1）*

## 7. Figure 5：每波長接收機——三級前端 + 1-tap 決策回饋等化

這張圖展示了每波長的 CMOS 接收機，含一組三級的類比前端（AFE）與 ADF 的熱控制邏輯。每一路的 AFE 由一顆跨阻放大器（TIA）起頭，後接兩級跨導/跨阻的 Cherry-Hooper 級，再加一個直流偏移消除（dcoc）電路。AFE 輸出被四個四分之一速率的取樣保持（T/H）開關取樣，做 2 倍放大後送進兩個資料判決器與一個誤差判決器，執行 1-tap 推測式決策回饋等化（DFE）。AFE 達到 24GHz 頻寬、約 65dBΩ 增益、3μArms 輸入雜訊。而 dcoc 還兼差當 RX 側熱控制的量測抓手，一路電路兩用。

![Intel 800G MRR-DWDM 收发机 · 图05](/assets/img/posts/intel-800g-microring-dwdm-transceiver-vlsi2026/img05.png)
*图05｜原文配图（Intel / VLSI 2026 C20.1）*

## 8. Figure 6：四分之一速率取樣器——用中和雙尾閘延長建立時間

這張圖展示了四分之一速率取樣器：帶 25% 工作週期的 T/H 開關、2 倍增益，以及一個經中和的雙尾（DT）閘鎖器，並刻意延長其建立時間。在 50Gb/s、四分之一速率架構下，取樣器的每一個判決都是跟時間賽跑——放大器還沒建立好就再生，就會判錯。這顆設計用兩招爭取時間：用中和技術壓低雙尾閘鎖器的回踢雜訊，並用正交時脈驅動兩個閘鎖相位。正交時脈搭配 25% 的 T/H 工作週期，一起把 2 倍前置放大器在再生之前的建立時間拉長。

![Intel 800G MRR-DWDM 收发机 · 图06](/assets/img/posts/intel-800g-microring-dwdm-transceiver-vlsi2026/img06.png)
*图06｜原文配图（Intel / VLSI 2026 C20.1）*

## 9. Figure 7：開腔封裝——把光子晶片埋進基板凹槽，繞過中介層寄生

這張圖展示了這顆 DWDM 收發機的 3D 封裝：光子晶片（PIC）放在有機基板蚋刻出的開腔（open cavity）裡，電子晶片（EIC）則覆晶（flip-chip）疊到 PIC 與基板上。傳統把電光晶片接在一起常需要一層高速中介層（interposer），但中介層本身帶來寄生電容電感，會吃掉高速訊號的頻寬。Intel 的做法是把 PIC 埋進基板的蚋刻凹槽，EIC 直接 3D 覆晶疊上去，繞過高速中介層的寄生。EIC 同時貼到基板，讓 CMOS 電路可以直接取得電源；頂側有一片冷板控制 EIC 溫度；光則從 PIC 垂直耦合出來。這種「開腔 + 覆晶」封裝是 Intel 對「低寄生、無中介層」的具體答案。

![Intel 800G MRR-DWDM 收发机 · 图07](/assets/img/posts/intel-800g-microring-dwdm-transceiver-vlsi2026/img07.png)
*图07｜原文配图（Intel / VLSI 2026 C20.1）*

## 10. Figure 8：輸出頻譜——16 根梅齒真的都亮了

這張圖展示了 DWDM 光發射端（OTX）的輸出頻譜，可見 16 個被調變的光載波，標稱間距 200 GHz。把 OTX 輸出（16 波長各以 50Gb/s NRZ 調變）耦進單模光纖，一分為二，一路送光譜分析儀，拍下的就是這張圖。這張頻譜圖是 DWDM 系統最直觀的體檢表——16 根梅齒間距整齊、功率均勻，代表雷射陣列、波長交織與各環鎖定都到位了。它把前面九張電路圖的努力，收斂成一張看得懂的成果。

![Intel 800G MRR-DWDM 收发机 · 图08](/assets/img/posts/intel-800g-microring-dwdm-transceiver-vlsi2026/img08.png)
*图08｜原文配图（Intel / VLSI 2026 C20.1）*

## 11. Figure 9：50Gb/s 眼圖——邊緣通道也睜得開

這張圖展示了偶匯流排與奇匯流排上邊緣通道（edge channels）的 50Gb/s PRBS-15 OTX 眼圖。光譜證明有 16 個波長，眼圖則證明每個波長的訊號品質夠好。研究者用光學帶通濾波器選出單一波長，拍下 50Gb/s 的 PRBS-15 眼圖，且特意挖偶奇兩條匯流排上的邊緣通道——邊緣波長通常條件最差，能睜開就代表整組都穩。眼圖的消光比（extinction ratio）大於 5dB。5dB 以上的消光比配上乾淨的眼開，是這條 50Gb/s NRZ 鏈路能撐住 BER<1e-9 的前提。

![Intel 800G MRR-DWDM 收发机 · 图09](/assets/img/posts/intel-800g-microring-dwdm-transceiver-vlsi2026/img09.jpg)
*图09｜原文配图（Intel / VLSI 2026 C20.1）*

## 12. Figure 10：BLW 校正開/關對比——0.35dB 的眼開差距

這張圖展示了當發射端基線漂移校正電路開啟時，PRBS-31 的 8Gb/s OTX 輸出眼開改善的對比。研究者刻意用 8Gb/s 的 PRBS-31 圖樣——它的頻譜內容遠低於 AC 耦合的截止頻率，正好把低頻資料截止的問題放到最大，藉此凸顯校正電路有沒有作用。開啟 BLW 校正後，光學眼開改善 0.35dB。別小看這 0.35dB——在動輄要湊足鏈路裕度（link margin）的 DWDM 系統裡，每一分貝都是真金白銀。這張圖把 Figure 3 那個看似細節的電路，量化成一個可以寫進規格書的數字。

![Intel 800G MRR-DWDM 收发机 · 图10](/assets/img/posts/intel-800g-microring-dwdm-transceiver-vlsi2026/img10.png)
*图10｜原文配图（Intel / VLSI 2026 C20.1）*

## 13. Figure 11：16 波長同時跑、全數 BER<1e-9——這才是收尾的硬證據

這張圖展示了實測的 16 波長 DWDM 鏈路 BER：50Gb/s/λ 在八條偶匯流排與八條奇匯流排的通道上同時傳輸的結果。不是一次量一個波長再拼起來，而是同時全開——這才逼出真正的波長間串擾與功耗熱耦合。結果：16 波長全數 BER<1e-9；最差情況下 Ge-PD 接收光功率為 -10.9dBm。能效方面：22nm CMOS 驅動器為 0.92pJ/b；RX EIC 為 3.1pJ/b；全域時鐘分配為 0.17pJ/b；PIC（含雷射、SOA、波長交織/解交織的調諧功耗，雷射攛提到 8 根光纖）為 1.69pJ/b——合計約 5.7pJ/b。這把「矽光子 DWDM 用於高頻寬、能效優的光 I/O」從口號變成可審視的實測基準。

![Intel 800G MRR-DWDM 收发机 · 图11](/assets/img/posts/intel-800g-microring-dwdm-transceiver-vlsi2026/img11.png)
*图11｜原文配图（Intel / VLSI 2026 C20.1）*

## 總結

把 11 張圖串起來看，Intel 這篇的價值不在任何單一破紀錄數字，而在「整合完備度」。它從系統藍圖（Fig.1）出發，逐一交代發射端如何把電推進微環（Fig.2、Fig.3）、如何把每顆環鎖在雷射上（Fig.4）、接收端如何把微弱光電流救回並判讀（Fig.5、Fig.6）、如何用開腔封裝繞過寄生（Fig.7），最後用頻譜、眼圖、BLW 對比、全開 BER 四張量測圖把成果一一坐實。論文點名的三大致勝要素：O 波段 PIC 的高度整合、高頻寬 EIC 電路技巧、低寄生無中介層封裝。至於 5.7pJ/b 的能效，放在 OIF 為 AI 互連畫出的 pJ/bit 戰場上還有進步空間（RX 的 3.1pJ/b 是明顯大頭），但作為一顆把 16 波長真的全開跑通的系統樣機，它已把「微環 DWDM 是可行封裝形態」這件事釘在了桌上。

## 參考資料

論文標題：An 800 Gbps/Fiber Silicon Photonic Microring-Based DWDM Transceiver in an Open-Cavity Package。作者：Cooper S. Levy、Jahnavi Sharma、Zhe Xuan、Duanni Huang、Junyi Gao、Songtao Liu、Xinru Wu、Xiaoxi Wang、Susnata Mondal、Sashank Krishnamurthy、Dan Lake、James E. Jaussi（Intel Corporation, USA）。會議：2026 IEEE Symposium on VLSI Technology and Circuits，論文編號 C20.1，2026。DOI：10.1109/VLSITECHNOLOGYANDCIR65830.2026.11577543。

# 第二部分：解析（深度解读）

> 以下为基于原文的结构化中文解读，仅供学习交流，不代表原作者观点。

## 一、这篇论文到底在做什么

Intel 在 VLSI 2026（论文编号 C20.1）拿出的是一颗 **O 波段硅光子微环（MRR）DWDM 收发机样机**，而不是又一颗孤立的调制器 IP。它的硬指标是：用 **16 个波长、每波长 50Gb/s NRZ**，在单根单模光纤（SMF）上同时跑出 **800Gb/s/fiber**，且逐波长 BER < 1e-9；整体能效约 **5.7pJ/b**。更关键的是，这一整套链路是「真能跑」的——把 16 波长 DFB 激光阵列、微环调制、波长交织、Ge 光电探测器、半导体光放大器（SOA）全部集成在同一颗光子芯片上，再用一种「开腔（open-cavity）有机封装」把 22nm CMOS 电子芯片（EIC）直接 3D 覆晶叠到光子芯片（PIC）上，绕开高速中介层的寄生。

换句话说，这篇论文的叙事重心是「系统样机」而非「单点元件」——它把过去五年硅光子论文最常见的三种形态（单元件电性量测、孤立接收前端、只有仿真没有硅的概念验证）全部排除在外。

## 二、三层难点与对应的电路/封装创新

- **光子层**：16 个波长要各自对准、互不串扰。TX 用 16 波长 DFB 阵列（波长间距 200±40 GHz），每波长由独立 MRM 调制；TX 与 RX 都做奇偶波长交织来压制波长间串扰。RX 用微环分插滤波器（ADF）解多工，drop 端口接 Ge PD。
- **电子层**：每波长 50Gb/s 的驱动与接收要够快够省。Intel 选了反相器式（inverter-based）差分驱动器，做出约 2Vdd 峰峰值摆幅，却绕开了单端堆叠驱动器的高输出阻抗瓶颈；接收机每路由 TIA 起头的三级 Cherry-Hooper AFE + 1-tap 推测式 DFE 构成，AFE 达 24GHz 带宽、约 65dBΩ 增益、3μArms 输入噪声。
- **封装层**：电光之间的高速互连寄生要压到最低。开腔有机封装让 EIC 直接 3D 覆晶叠到 PIC，省掉高寄生中介层——这正是「异质整合」（EIC/PIC 分开做、分开优化）价值落地的体现。

## 三、两个容易被忽略、却决定量产可行性的细节

- **基线漂移（BLW）校正**：MRM 在 1.5V 反偏下支持 50Gb/s NRZ，需要差分驱动器提供 1.95V 阴极偏压。Intel 在 AC 耦合阴极路径之外，补一条 DC 耦合前馈路径处理低 MHz 数据截止，并用反馈电路让 DC 耦合摆幅去跟踪 AC 耦合摆幅，避免传统 80kΩ 大电阻造成约 0.8V 压降。
- **热控制（TCU）是微环量产的真正关卡**：微环共振波长对温度极度敏感，一漂就对不准激光。每个微环都需要独立 TCU 把它锁在对应波长上——16 个波长就是 16 套 TCU，每套都要有自己的锁定测量与反馈。论文用 MRM 光电流 iPH 作为 TX 侧失谐指标，用复制（replica）电路抽 iPH，再由 TCU 锁到校准目标值（该目标值唯一决定 MRM 插入损耗）。

## 四、与本站其他文章的衔接

- **光互联 / CPO 系列**：这篇是 CPO 物理可行性的「系统级实证」——把一整条 DWDM 光路收敛成可贴到 XPU/交换机封装旁的小模块。它直接呼应本批另一篇 *A System-Level Overview of Scale-up AI Racks* 里「use copper where you can, optics where you must」以及 co-packaged optics 的 Scaling 动机。
- **先进封装系列**：开腔有机封装 + EIC/PIC 3D 覆晶，是 CoWoS-L、EMIB 之外又一条异质整合路线。
- **投资映射**：价值不在「哪颗调制器赢」，而在 ①微环量产最现实的关卡是 TCU/热锁定（温控 IP 与闭环方案值得关注）；②25Gbaud 级 NRZ 推到 50Gb/s 后，更高速 SerDes 与均衡仍是瓶颈；③开腔封装若可复用，会削弱对高成本硅中介层的依赖。

## 五、一句话结论

Intel 这篇把「16 波长 + MRR + 开腔封装 + 5.7pJ/b」从 PPT 推向可跑样机，证明了 DWDM 微环路线在 iso-energy 前提下靠波长堆叠拉高单纤带宽的工程可行性；真正拦在大规模部署前的，不是调制器本身，而是 16 套独立波长热锁定的系统复杂度与封装寄生控制。
