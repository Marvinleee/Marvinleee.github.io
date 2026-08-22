---
layout: post
title: "从 3GPP MPS 到 Wi-Fi 7 EPCS：优先级通信如何跨接入技术延伸"
date: 2026-08-06 20:00:00 +0800
categories: [通信技术]
tags: ["Wi-Fi 7", EPCS, MPS, 3GPP, RADIUS, Passpoint]
description: "对 Zahid Ghadialy（The 3G4G Blog）关于 3GPP MPS 与 Wi-Fi 7 EPCS 技术演进解读的英文原文与中文深度分析，覆盖跨接入技术的 NS/EP 优先级通信架构、IETF RADIUS 扩展与 Passpoint 流程。"
image: /assets/img/covers/from-3gpp-mps-to-wifi-7-epcs.jpg

---

> **原文**：Zahid Ghadialy，*The 3G4G Blog*，发布于 2026-07-10。
> 本文为「英文原文 + 中文深度解读」对照版。原文完整公开，无付费墙。

---

# 第一部分：正文（Original Article）

## From 3GPP MPS to Wi-Fi 7 EPCS

By **Zahid Ghadialy**

Back in January 2011, I wrote about [Enhanced Multimedia Priority Service](https://blog.3g4g.co.uk/2011/01/emps-enhanced-multimedia-priority.html), or eMPS, in 3GPP Release 10. At the time, the focus was on extending priority treatment beyond basic voice calls to packet data and multimedia sessions over LTE and EPC.

The basic requirement has not changed. During a major incident, commercial communication networks may become heavily congested at exactly the time when certain authorised users most need to communicate. These users may include government personnel, emergency management officials and others assigned National Security or Emergency Preparedness, NS/EP, responsibilities.

3GPP addresses this through Multimedia Priority Service, or MPS, specified in [TS 22.153](https://3gpp.org/ftp/Specs/archive/22_series/22.153). MPS is not a separate radio system and it should not be confused with public emergency calling. It is a mechanism that gives authorised Service Users priority treatment on commercial networks, increasing the probability that their voice, video or data communications can be successfully established and maintained during congestion.

In my [original post](https://blog.3g4g.co.uk/2011/01/emps-enhanced-multimedia-priority.html), I explained that this required more than simply prioritising user-plane packets. End-to-end priority could involve NAS and AS signalling establishment, session establishment, resource allocation in the radio and core networks and treatment of the media bearers themselves.

Fifteen years later, the interesting development is that this idea is expanding beyond the traditional cellular access network.

The challenge is easy to understand. An authorised priority user may have an MPS subscription with a mobile operator, but that user may be inside a building, transport hub, stadium, campus or other environment where connectivity is provided over Wi-Fi. Even where cellular coverage exists, the device may already be using Wi-Fi because of local coverage, capacity or policy.

The question is therefore no longer just how to prioritise an NS/EP user in LTE or 5G. It is how priority authorisation can follow the user across different access technologies.

There are actually two related but different technical developments taking place.

The first is within 3GPP itself. In [Release 19](https://blog.3g4g.co.uk/2026/04/3gpp-release-19-description-and-summary.html), a change to TS 22.153 added explicit MPS requirements for situations where a UE is using a 3GPP radio access technology, such as NR or E-UTRA, and non-3GPP WLAN access connected to the same EPC or 5GC. The associated work item is MPS_WLAN, or MPS when access to EPC/5GC is WLAN.

This is important, but it is still primarily a 3GPP system view. The WLAN is acting as non-3GPP access towards the mobile core.

The second development goes further. [Wi-Fi 7](https://www.connectivity.technology/2022/02/almost-everything-you-need-to-know.html) introduces Emergency Preparedness Communications Service, or EPCS, functionality that can provide preferred or prioritised channel access to authorised users. This means that priority treatment can also be applied on the Wi-Fi access network itself.

This creates a different architectural problem.

Wi-Fi can define how the Access Point, AP, and Station, STA, support prioritised channel access, but the Wi-Fi network still needs to know whether the user is genuinely authorised to receive that treatment.

The network therefore needs to determine whether the user is authenticated, whether the user is authorised for Priority Services, what priority level has been assigned, whether that authorisation is valid in the relevant regulatory jurisdiction and whether the network and device support the required EPCS capabilities.

This is the gap that the current IETF work is attempting to address.

The latest version at the time of writing is [draft-gundavelli-radepcs-02](https://datatracker.ietf.org/doc/draft-gundavelli-radepcs/), titled RADIUS attributes for National Security and Emergency Preparedness Service. It is an active Internet-Draft and work in progress rather than an approved IETF standard. The draft describes RADIUS extensions for authorising EPCS users so that they can receive preferential access to Wi-Fi network resources during congestion.

The proposed architecture reuses mechanisms already widely deployed for managed and roaming Wi-Fi, including Passpoint, EAP and RADIUS.

A user is first authorised for Priority Services by an appropriate Authorising Entity. The service provider receives this authorisation and stores the relevant priority information against the subscriber profile. Where the service provider is also a cellular operator and Wi-Fi Identity Provider, the priority service subscription information can be mirrored into the Wi-Fi AAA system.

![EPCS Architecture for NS/EP Priority Communications Over Wi-Fi](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhOpN8-K7EhEpzDhl0T2UPCoY0RFKcSXoYJe2Hf6Z0D5K1lac1gACUzl96BodCcCKsWzbnGjTj-4n-DqbEupm37oeaDSl9F8FURVOhexPGb_tCfFgnKaDgQQawYr6XecJus7J08CIXDlDp8Q4kasBtdNS21-7U823mBUFlZ9LTspEI8pZ8b9O3KS36rkfo/w640-h360/The3G4GBlog_EPCSArchitectureFor_NS_EP_PriorityCommunicationsOverWiFi.jpg)
*The overall architecture and signalling flow for EPCS priority communications over Wi-Fi.*

The overall architecture and signalling flow are shown below.

The first part of the process is network discovery. An EPCS-enabled Wi-Fi network advertises an EPCS Roaming Consortium, while the authorised user's device contains a corresponding Passpoint profile. The device can discover the relevant roaming information and select the network using normal Passpoint mechanisms.

After the device associates with the Wi-Fi network, EAP authentication is performed and the AP or Wireless LAN Controller forwards the authentication exchange towards the Identity Provider using RADIUS.

This is where the proposed new RADIUS attributes become important.

**EPCS-Capable-Indication** allows the Wi-Fi Network Access Server to tell the RADIUS server that it supports EPCS. The capability information can also indicate whether priority treatment is possible only when the user device itself supports EPCS, or whether some treatment, such as downlink prioritisation, may still be possible for a non-EPCS device.

**EPCS-Regulatory-Info** provides information about the regulatory regime under which priority service is being authorised. This may contain an ISO 3166-1 country code or ISO 3166-2 subdivision code. This matters because priority authorisation and priority levels may be specific to a particular country or jurisdiction.

**EPCS-Subscription-Info** indicates that the authenticated user is authorised to receive Priority Services and carries the priority level associated with the user's subscription. The priority levels themselves are administered according to the relevant regulatory regime.

The important point is that the Wi-Fi network does not independently decide that a user should receive priority.

The authorisation originates from an external authority and is linked to an authenticated identity or subscription.

Authentication and priority authorisation are therefore separate. Successfully authenticating to a Wi-Fi network does not automatically make someone an EPCS user.

Once the AAA system confirms that the user is authorised, the AP/WLC can enable EPCS Priority Access for the device. Where both the network and device support EPCS, uplink and downlink traffic can receive priority treatment. Depending on the capabilities of the network, downlink traffic may still be prioritised even when the device itself does not support EPCS. The exact mechanism used by the network to prioritise the traffic is vendor-specific and outside the scope of the current IETF draft.

There are several interesting aspects to this architecture.

First, the solution uses the existing Wi-Fi roaming framework rather than creating an entirely separate emergency network discovery and authentication mechanism. Passpoint supports automatic discovery and network selection, EAP handles authentication and RADIUS carries the EPCS authorisation information.

Second, location and regulatory information become part of the authorisation process. A user authorised for a particular level of priority in one jurisdiction may not necessarily be entitled to the same treatment everywhere.

Third, the network needs to separate a user's normal access credentials from their entitlement to Priority Services. An ordinary subscriber, an authenticated Wi-Fi user and an authorised EPCS user may all use the same access network but receive very different treatment during congestion.

Finally, this is not simply a matter of giving some packets a higher priority marking.

Real end-to-end priority may involve access to the Wi-Fi medium, AP queues, backhaul networks, interconnected networks and application traffic. The IETF draft identifies authentication, authorisation, traffic identification and prioritisation as separate requirements. Where networks interconnect, priority indicators may also need to be passed securely to downstream networks.

It is also worth stressing the difference between Priority Services and emergency calling.

An ordinary user attempting to call 999, 112 or 911 is not automatically an NS/EP Priority Service user. Emergency calling is about allowing the public to reach emergency services, potentially even when normal cellular coverage or credentials are unavailable.

MPS and EPCS are different. They are intended for authorised users or organisations that have been assigned priority privileges so their communications have a greater probability of success during congestion.

The [Wireless Broadband Alliance](https://wballiance.com/wireless-broadband-alliance-enhances-emergency-services-communications-in-challenging-environments/) has been working on both areas through its Mission Critical and Emergency Services programme. Its work covers emergency calling over Wi-Fi, cellular emergency calling over OpenRoaming and NS/EP priority communications. For the priority case, the focus is on using Wi-Fi, Passpoint and roaming mechanisms to extend capabilities traditionally associated with cellular networks.

For me, the interesting part is how the boundaries between cellular and Wi-Fi continue to blur.

3GPP MPS started from the assumption that priority treatment had to be provided across the cellular system, from access signalling through to core network resources and application sessions. 3GPP has now added explicit requirements for MPS when 3GPP and WLAN accesses connect to the same EPC or 5GC.

At the same time, Wi-Fi 7 provides EPCS mechanisms for prioritised channel access, while Passpoint and the proposed RADIUS extensions provide a possible way to discover the service, authenticate the user and transfer priority authorisation into the Wi-Fi network.

The result is not a replacement for cellular MPS, and it is not simply Wi-Fi QoS.

It is the beginning of a more access-independent model in which an authorised user's priority status could potentially follow them across cellular and Wi-Fi networks, with each access technology applying the appropriate mechanisms within its own domain.

That is a much more interesting evolution than simply adding another priority bit to the network.

---

# 第二部分：解析（深度解读）

## 核心论点摘要

优先级通信（NS/EP，国家安全与应急准备）过去是**纯蜂窝**的事：3GPP 通过 MPS（TS 22.153）在拥塞时给授权用户「插队」待遇。但用户大量时间待在 Wi-Fi 覆盖的楼宇、交通枢纽、体育场里——优先级授权必须能**跨接入技术跟随用户**。本文讲清两条并行的技术线，以及把它们缝合起来的 IETF 草案：

1. **3GPP 内部**：Release 19 的 **MPS_WLAN** 工作项，把 MPS 要求扩展到「3GPP RAT + 非 3GPP WLAN 接入同一 EPC/5GC」的场景（仍属 3GPP 系统视角）。
2. **Wi-Fi 本身**：Wi-Fi 7 引入 **EPCS（Emergency Preparedness Communications Service）**，在 Wi-Fi 接入网内就能提供优先信道接入。
3. **缝合层**：IETF **draft-gundavelli-radepcs-02** 用 **RADIUS 扩展属性**把外部权威机构的优先级授权「搬运」进 Wi-Fi 的 AAA 体系，复用既有的 Passpoint / EAP / RADIUS 漫游框架。

## 关键概念解读

- **MPS（Multimedia Priority Service，TS 22.153）**：商业网络上给授权 Service User 优先级待遇的机制，**不是独立无线系统**，也**不同于公众紧急呼叫**（999/112/911）。它是端到端的——涉及 NAS/AS 信令建立、会话建立、无线与核心网资源分配、媒体承载处理。
- **MPS_WLAN（Release 19）**：当 UE 同时用 3GPP 无线（NR/E-UTRA）和非 3GPP WLAN 接入同一 EPC/5GC 时的 MPS 要求。仍是「WLAN 作为非 3GPP 接入指向移动核心」的视角。
- **EPCS（Wi-Fi 7）**：在 Wi-Fi 接入网本身提供优先/优先级信道接入，意味着优先级不只发生在核心网，也发生在 AP/STA 这一跳。
- **IETF RADIUS 扩展（draft-gundavelli-radepcs-02）**：三个关键属性——
  - `EPCS-Capable-Indication`：NAS 告诉 RADIUS 服务器「本Wi-Fi网络支持 EPCS」，并标明是否必须终端也支持 EPCS 才能优先（非 EPCS 终端是否仍可做下行优先）。
  - `EPCS-Regulatory-Info`：携带监管辖区（ISO 3166-1 国家码 / ISO 3166-2 分区码）——因为优先级授权和级别是**按司法辖区**界定的。
  - `EPCS-Subscription-Info`：标明认证用户已获优先级授权，并携带其订阅对应的优先级级别。

## 架构流程拆解

```
授权机构(Authorising Entity) ──授权──> 服务提供商(订户档案)
                                        │ (若为运营商兼 Wi-Fi IdP)
                                        │ 镜像优先级信息
                                        ▼
              Wi-Fi AAA 系统 (RADIUS)
                                        ▲
   ① Passpoint 发现(EPCS Roaming Consortium)  │
   ② 关联 + EAP 认证 ──RADIUS 转发──> IdP   │
   ③ RADIUS 携带 EPCS-* 属性做授权判定        │
                                        ▼
              AP/WLC 启用 EPCS Priority Access
      (终端+网络均支持 → 上下行均优先；仅网络支持 → 下行仍可优先)
```

要点：**认证（authentication）与优先级授权（authorisation）分离**。成功连上 Wi-Fi ≠ 成为 EPCS 用户；授权源自外部权威机构，并关联到已认证身份/订阅。

## 技术趋势

- **接入无关（access-independent）优先级模型**：授权用户的优先级状态可跨蜂窝与 Wi-Fi 跟随，各接入技术在自己的域内套用合适的机制——既不是替代蜂窝 MPS，也不只是 Wi-Fi QoS。
- **位置/监管信息纳入授权**：跨辖区的优先级级别并不自动通用，授权流程必须携带监管信息。
- **复用而非新建**：直接复用 Passpoint（自动发现/选网）、EAP（认证）、RADIUS（承载授权），避免另起一套应急发现/认证机制。
- **端到端优先级很重**：真正优先涉及 Wi-Fi 媒介接入、AP 队列、回传、互联网络、应用流量多层，优先级指示还需安全传递给下游网络。

## 与本站其他文章的连接

本篇偏**通信标准/协议**，与本站主流的半导体投资（CPO、SerDes、测试）主题关联较弱，但有两条间接线索值得留意：

- **Wi-Fi 7 芯片生态**：EPCS 能力依赖 Wi-Fi 7 芯片与 AP/WLC 设备侧的硬件支持，涉及高通、博通、联发科等 Wi-Fi 主芯片厂商——属于「标准落地→芯片规格→出货」的跟踪对象。
- **Passpoint / OpenRoaming 生态**：Wireless Broadband Alliance 推动的 OpenRoaming 把蜂窝紧急呼叫也纳入，是运营商与 Wi-Fi 漫游商业化的底层协议层。

若后续关注「标准 → 芯片需求」的投资映射，本篇可作为 Wi-Fi 7 优先级特性的技术底稿。

## 风险提示

- 本文为技术标准解读，**不构成投资建议**。
- IETF **draft-gundavelli-radepcs-02 仍为草案（Active Internet-Draft），尚未成为批准标准**；RADIUS 属性名与机制可能变动。
- 优先级级别由各国监管辖区（regulatory regime）管理，跨国/跨区并不自动互认，落地受政策影响大。
- 紧急呼叫（公众 999/112/911）与 MPS/EPCS（授权用户优先级）是**不同体系**，不可混淆。
