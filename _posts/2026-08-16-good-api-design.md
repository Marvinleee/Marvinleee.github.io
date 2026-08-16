---
layout: post
title: "Everything I know about good API design — 我所知道的 API 设计全指南"
date: 2026-08-16 21:00:00 +0800
categories: [软件工程]
tags: [API设计, 软件工程, REST, 系统设计, 幂等性, 接口稳定性]
description: Sean Goedecke 的 API 设计经验长文逐字转载 + 中文模块化解读。核心命题：好 API 是「无聊」的、绝不破坏既有使用者（WE DO NOT BREAK USERSPACE）、版本化是必要之恶、产品价值大于接口优雅、幂等键与游标分页与限流是工程底线。
---

> 原文：[Everything I know about good API design](https://www.seangoedecke.com/good-api-design/)
> 作者：Sean Goedecke（个人博客 seangoedecke.com，推断作者名来自域名；原文未单列作者字段）
> 原文发布日：**2025-08-24**（署名元数据，非本站发布日）
> 形态：说明性 / 教学长文，全文开放、无付费墙、无配图
> 本站处理：第一部分英文原文逐字转载，第二部分中文深度解读（按本文实际主题归类于 `软件工程`，未沿用半导体投资分类）；原文为作者个人观点，文中对 REST/GraphQL 的主观偏好不代表本站立场。

# 第一部分：正文（Original Article）

# Everything I know about good API design

Most of what modern software engineers do[1](https://www.seangoedecke.com/good-api-design/#fn-1) involves APIs: public interfaces for communicating with a program, like [this one](https://www.twilio.com/docs/iam/api/account#fetch-an-account-resource) from Twilio. I've spent a *lot* of time working with APIs, both building and using them. I've written public APIs for third-party developers, private APIs for internal use (or consumption by a single frontend page), REST and GraphQL APIs, and even non-network interfaces like the ones for command-line tools.

Like [designing good software systems](https://www.seangoedecke.com/good-system-design), I think much of the advice floating around about API design is too fancy. People get wrapped up in what "real" REST is, or whether HATEOAS is a good idea, and so on. This post is my attempt at writing down everything I know about designing good APIs.

### Designing APIs is a balance between familiarity and flexibility

If this is true about systems — and it is — it's even more true about APIs: **good APIs are boring**. An API that's interesting is a bad API (or at least it would be a better one if it were less interesting). For the developers who build them, APIs are complex products that they spend time designing and polishing. But for the developers who use them, APIs are tools that they use in order to accomplish some other goal. Any time they spend thinking about the API instead of about that goal is time wasted. From their perspective, an ideal API should be so familiar that they will more or less know how to use it before they read any documentation[2](https://www.seangoedecke.com/good-api-design/#fn-2).

However, one big difference from most software systems is that **APIs are hard to change**. Once you publish an API and people start using it, any change to the interface will break your users' software. Of course, it is *possible* to make changes. But (as I'll say below) each change imposes a serious cost: every time you force your users to update their software, they will give serious thought to using a different API that's more stable. That gives API-builders a strong incentive to design carefully and get it right the first time.

This tension leads to an interesting dynamic for engineers who build APIs. On the one hand, they want to build the simplest API possible. On the other hand, they want to do clever things to maintain flexibility long-term. In broad strokes, API design is about finding a balance between those two incompatible goals.

### WE DO NOT BREAK USERSPACE

What happens when you need to make changes to your API? Additive changes — for instance, putting a new field in the response — are typically fine. There are some consumers which will blow up if they're getting more fields than they expect, but in my view this is irresponsible. You should expect API consumers to ignore unexpected fields (sensible JSON-parsing typed languages do this by default).

However, you can't *remove* or change the types of fields. You can't change the structure of existing fields (for instance, moving `user.address` to `user.details.address` in the JSON response). If you do, every single piece of code that relies on those fields will immediately break. Consumers of that code will report it as a bug, and the maintainers of the code will (when they figure it out) be rightfully furious that you deliberately broke their software.

The principle here is something like Linus Torvalds' famous slogan [WE DO NOT BREAK USERSPACE](https://lore.kernel.org/all/CA+55aFy98A+LJK4+GWMcbzaa1zsPBRo76q+ioEjbx-uaMKH6Uw@mail.gmail.com/). As a maintainer of an API, you have something like a sacred duty to avoid harming your downstream consumers. The norm is so strong because so much software depends on so many APIs (which in turn depend on upstream APIs, and so on). One careless API maintainer far enough upstream can break hundreds or thousands of pieces of software downstream.

You should never make a change to an API just because it'd be neater, or because it's a little awkward. The "referer" header in the HTTP specification is famously a misspelling of the word "referrer", but they haven't changed it, *because we do not break userspace*.

### Changing APIs without breaking userspace

It's honestly hard to think of examples where an API really *needs* a breaking change. But sometimes the technical value of a change is high enough that you decide to bite the bullet and do it anyway. In those cases, how can you change your API responsibly? The answer is *versioning*.

API versioning means "serve both the old and new version of your API at the same time". Existing consumers can continue to use the old version, while new consumers can opt-in to the new one. The easiest way to do this is to include something like `/v1/` in your API url. OpenAI's chat API is at [v1/chat/completions](https://platform.openai.com/docs/api-reference/chat/create), so if they ever want to totally rework the structure, they can do that in `v2/chat/completions` and keep the existing consumers working.

Once you have the new and old version working simultaneously, you can start telling users to upgrade to the new version. This takes a *long* time: months or even years. Even with banners on the website, docs, custom emails, and headers on the API response, when you finally remove the old version, you will still get a lot of angry users upset that you've broken their software. But at least you'll have done what you can about it.

There are lots of other ways to do API versioning. The Stripe API does versioning in a [header](https://docs.stripe.com/api/versioning), and lets accounts set their default version in the UI. But the principle is the same — any consumers of the Stripe API can be confident that Stripe won't decide to break their applications, and they can upgrade versions at their own pace.

**I don't like API versioning.** I think at best it's a necessary evil, but it's still evil. It's confusing to users, who can't easily search for your API docs without making sure that the version selector matches the version they're using. And it's a *nightmare* for maintainers. If you have thirty API endpoints, every new version you add introduces thirty new endpoints to maintain. You will rapidly end up with hundreds of APIs that all need testing, debugging, and customer support.

Of course, adding a new version doesn't double the size of your codebase. Any sensible API versioning backend will have something like a translation layer that can turn a response into any of your public API versions. Stripe has [something like this](https://stripe.com/blog/api-versioning): the actual business logic is the same for all versions, so only the parameter serializing and deserializing needs to be aware of versioning. However, abstractions like that will always leak. See this 2017 [HN comment](https://news.ycombinator.com/item?id=13711171) from a Stripe employee, pointing out that some versioning changes need conditional logic throughout the "core code".

In short, **you should only use API versioning as a last resort**.

### The success of your API depends entirely on the product

An API by itself doesn't do anything. It's a layer between the user and the thing they actually want. For the [OpenAI API](https://platform.openai.com/docs/api-reference/chat/create), that's the ability to do inference with a language model. For the [Twilio API](https://www.twilio.com/docs/iam/api/account#fetch-an-account-resource), that's sending SMS messages. Nobody uses an API because the API itself is so elegantly designed. They use it to *interact with your product*. **If your product is valuable enough, users will flock to even a terrible API.**

This is why some of the most popular APIs are a nightmare to use. Facebook and Jira are famous for having appalling APIs, but it doesn't matter — if you want to integrate with Facebook or Jira, which you do, you need to spend the time to figure them out. Sure, it would be nice if those companies had a better API. But why invest the time and money into improving it when people are going to integrate with it anyway? Writing good APIs is *really hard*.

I'm going to give a lot of concrete advice in the rest of this post about how to write good APIs. But it's worth remembering that most of the time it doesn't matter. If your product is desirable, any barely-functional API will do; if it isn't, it doesn't matter how good your API is. API quality is a marginal feature: it only matters when a consumer is choosing between two basically-equivalent products.

Incidentally, the *presence* of an API is an entirely different story. If one product doesn't have an API at all, that's a big problem. Technical users will demand some way to integrate with the software they're buying via code.

### Poorly-designed products will usually have bad APIs

A technically-great API can't save a product that nobody wants to use. However, **a technically-poor product can make it nearly impossible to build an elegant API**. That's because API design usually tracks the "basic resources" of a product (for instance, Jira's resources would be [issues](https://developer.atlassian.com/cloud/jira/platform/rest/v2/api-group-issues/#api-rest-api-2-issue-issueidorkey-get), [projects](https://developer.atlassian.com/cloud/jira/platform/rest/v2/api-group-projects/#api-rest-api-2-project-projectidorkey-get), [users](https://developer.atlassian.com/cloud/jira/platform/rest/v2/api-group-users/#api-rest-api-2-user-get) and so on). When those resources are set up awkwardly, that makes the API awkward as well.

As an example, consider a blogging system that stored comments in-memory as a linked list (each comment has a `next` field that points to the next comment in the thread). This is a terrible way to store comments. The naive way to bolt a REST API onto this system would be to have an interface that looks like this:

`GET /comments/1 -> { id: 1, body: "...", next_comment_id: 2 }`

Or even worse, like this:

`GET /comments -> {body: "...", next_comment: { body: "...", next_comment: {...}}}`

This might seem like a silly example, because in practice you'd just iterate over the linked list and return an array of comments in the API response. But even if you're willing to do that extra work, how far down do you iterate? In a thread with thousands of comments, is it just impossible to fetch any comment after the first few hundred? Will your comment-fetching API have to use a background job, forcing the interface to turn into something like:

`POST /comments/fetch_job/1 -> { job_id: 589 }` `GET /comments_job/589 -> { status: 'complete', comments: [...] }`

This is how some of the worst APIs happen. Technical constraints that can be cleverly hidden in the UI are laid bare in the API, forcing API consumers to understand far more of the system design than they should reasonably have to.

### Authentication

**You should let people use your APIs with a long-lived API key.** Yes, API keys are not as secure as various forms of short-lived credentials, like OAuth (which you should probably also support). It doesn't matter. Every integration with your API begins life as a simple script, and using an API key is the easiest way to get a simple script working. You want to make it as easy as possible for engineers to get started.

Although consumers of an API will (almost by definition) be writing code, **many of your users will not be professional engineers**. They may be salespeople, product managers, students, hobbyists, and so on. When you're an engineer at a tech company building an API, it's easy to imagine that you're building it for other people like yourself: full-time, competent, professional software engineers. But you're not. You're building it for a very wide cross-section of people, many of whom are not comfortable writing or reading code. If your API requires users to do anything difficult — like performing an OAuth handshake — many of those users will struggle.

### Idempotency and retries

When an API request succeeds, you know it did what it tried to do. What about when it fails? Some types of failure tell you what happened: a 422 typically means it failed during the request-validation stage, before any action was taken[3](https://www.seangoedecke.com/good-api-design/#fn-3). But what about a 500? What about a timeout?

This is important for API operations that *take action*. If you're hitting some Jira API to create an issue comment, and the request 500s or times out, should you retry? You don't know for sure whether the comment has been created or not, since the error might be happening after that operation. If you retry, you might end up posting two comments. This is even more important when there's more at stake than a Jira comment. What if you're transferring some amount of money? What if you're dispensing medication?

The solution is *idempotency*, which is a fancy word for "the request should be safely retriable without creating duplicates". The standard way to do this is to support an "idempotency key" in the request (say, some user-defined string in a parameter or header). When the API server gets a "create comment" request with an idempotency key, it first looks to see if it's seen this idempotency key before. If so, it does nothing; otherwise it goes and creates the comment, then saves the idempotency key. That way you can send as many retries as you like, as long as they've all got the same idempotency key — the operation will only be performed once.

How should you store the key? I've seen people store it in some durable, resource-specific way (e.g. as a column on the `comments` table), but I don't think that's strictly necessary. The easiest way is to put them in Redis or some similar key/value store (with the idempotency key as the key). UUIDs are unique enough that you don't need to scope them by user, but you may as well. If you're not dealing with payments, you can even expire them after a few hours, since most retries happen immediately.

Do you need idempotency keys for every request? Well, you don't need them for read requests, since double-reads are harmless. You also typically[4](https://www.seangoedecke.com/good-api-design/#fn-4) don't need them for delete requests, since if you're deleting by resource ID, that ID serves as the idempotency key. Think about it — if you send three `DELETE comments/32` requests in a row, it won't delete three comments. The first successful request will delete the comment with ID 32, and the remaining requests will 404 when they can't find the already-deleted comment.

For most cases, idempotency should be optional. Like I said above, you want to make sure that your API is accessible to non-engineers (who often find idempotency a tricky concept). In the grand scheme of things, getting more people on your API is more important than the occasional duplicated comment from users who didn't read the documentation.

### Safety and rate limiting

Users who are interacting with your UI are limited by the speed of their hands. If there's some flow that's expensive for your backend to serve, a malicious or careless user can only trigger that flow as fast as they can click through it. APIs are different. **Any operation you expose via an API can be called at the speed of code.**

Be careful about APIs that do a lot of work in a single request. When I worked at Zendesk, we had an API that let you fan out notifications to all the users of a particular app. Some enterprising third-party developer[5](https://www.seangoedecke.com/good-api-design/#fn-5) used this to build an in-app chat system, where every message sent a notification to every other user on the account. For accounts with more than a handful of active users, this reliably killed the Apps backend server.

We didn't anticipate people building a chat app on top of this API. But once it was out there, people did what they wanted with it. I've been in many, many incident calls where the root cause was some hand-rolled customer integration that was doing something silly, like:

- Creating and deleting the same records hundreds of times per-minute, for no real reason
- Polling a big `/index` endpoint with no delay in between, forever
- Importing or exporting a ton of data without backing off in case of errors

**You should put a rate limit on your API, with tighter limits for expensive operations.** It's also sensible to reserve the ability to temporarily disable the API for specific customers, so you can take the pressure off your backend system if it's really getting hammered.

Include rate limiting metadata in your API responses. `X-Limit-Remaining` and `Retry-After` headers give clients the information they need to be respectful consumers of your API, and allow you to set stricter rate limits than you would otherwise be able to.

### Pagination

Almost every API has to serve a long list of records. Sometimes a very long list (for instance, the Zendesk `/tickets` API can contain millions of tickets). How can you serve those records?

A naive `SELECT * FROM tickets WHERE...` approach will blow out your available memory (if not in the database, then in the application layer where you're trying to serialize this million-item list). You just can't serve every ticket in a single request. Instead, you have to *paginate*.

The simplest way to paginate is to use pages (or "offsets", more generically). When you hit `/tickets`, you get the first ten tickets on the account. To get more, you have to hit either `/tickets?page=2` or `/tickets?offset=20`. This is easy to implement, since the server can just add `OFFSET 20 LIMIT 10` to the end of the database query. But it doesn't scale to really high numbers of records. Relational databases have to count through your offset every time, so each page you serve gets a little slower than the last page. By the time your offset is in the hundreds of thousands, it's a real problem.

The solution is "cursor-based pagination". Instead of passing `offset=20` to get the second page, you take the final ticket on the first page (say, with ID 32) and pass `cursor=32`. The API will then return the next ten tickets, *starting with ticket number 32*. Instead of using `OFFSET`, the query becomes `WHERE id > cursor ORDER BY id LIMIT 10`. That query is equally quick whether you're at the start of the collection or hundreds of thousands of tickets in, because the database can instantly find the (indexed) position of your cursor ticket instead of having to count through the entire offset.

**You should always use cursor-based pagination for datasets that might end up being large.** Even though it's harder for consumers to grasp, when you run into scaling problems you might *have* to change to cursor-based pagination anyway, and the cost of making that change is often very high. However, I think it's fine to use page or offset-based pagination otherwise.

It's usually wise to include a `next_page` field in your API list responses. That saves consumers having to figure out the next page number or cursor on their own.

### Optional fields and GraphQL

**If parts of your API response are expensive to serve, make them optional.** For instance, if fetching the user's subscription status requires your backend to make an API call, consider making your `/users/:id` endpoint not return subscription unless the request passes an `include_subscription` parameter. As a more general approach, you could have an `includes` array parameter with all your optional fields. This is often used for records that are associated (for instance, you could pass `includes: [posts]` to your user request to get the user's posts in the response).

This is part of the idea behind [GraphQL](https://graphql.org/), a style of API where instead of hitting different endpoints per-operation, you craft a single query with all the data you need and the backend figures it out[6](https://www.seangoedecke.com/good-api-design/#fn-6).

**I don't like GraphQL very much**, for three reasons. First, it's completely impenetrable to non-engineers (and to many engineers). Once you learn it, it's a tool like any other, but the barrier to entry is just so much higher than `GET /users/1`. Second, I don't like giving users the freedom to craft arbitrary queries. It makes caching more complicated and increases the number of edge cases you have to think about. Third, in my experience the backend implementation is so much more fiddly than your standard REST API.

I don't feel *that* strongly about my dislike of GraphQL. I've spent maybe six months working with it in various contexts and am far from an expert. I'm sure there are use cases where it buys you enough flexibility to be worth the costs. But right now I'd only use it where I absolutely had to.

### Internal APIs

Everything I've said so far is about *public* APIs. What about internal APIs: APIs that are only used by your colleagues at a particular company? Some of the assumptions I've made above don't hold for internal APIs. For instance, your consumers are usually professional software engineers. It's also possible to safely make breaking changes, because (a) you often have an order of magnitude fewer users, and (b) you have the ability to go in and ship new code for all of those users. You can require as complex a form of authentication as you want.

However, internal APIs can still be a source of incidents, and still need to be idempotent for key operations.

### Summary

- APIs are hard to build because they're inflexible but must be easy to adopt
- API maintainers' primary duty is to NOT BREAK USERSPACE. Never make breaking changes to public APIs
- Versioning your API lets you make changes, but imposes significant implementation and adoption barriers
- If your product is valuable enough, it doesn't really matter how good your API is, people will use it anyway
- If your product is badly-designed enough, it doesn't matter how carefully you design your API, it will likely suck
- Your API should support simple API keys for authentication, because many of your users will not be professional engineers
- Requests that take action (particularly high-stakes action like payments) should include some kind of idempotency key to make retries safe
- Your API will always be a source of incidents. Make sure you have rate limits and killswitches in place
- Use cursor-based pagination for datasets that might end up being very large
- Make expensive fields optional and off-by-default, but (in my opinion) GraphQL is overkill
- Internal APIs are different in some ways (because your consumers are very different)

What haven't I written about? I haven't written much about REST vs SOAP, or JSON vs XML, because I don't think that stuff is particularly important. I like REST and JSON, but I don't feel strongly about it. I also haven't mentioned OpenAPI schema — it's a useful tool, but I think it's also fine to just write your API docs in Markdown if you want.

edit: this post was discussed on [Hacker News](https://news.ycombinator.com/item?id=45006801) and [Reddit](https://www.reddit.com/r/programming/comments/1mzqigs/everything_i_know_about_good_api_design/) with lots of comments. Commenters pointed out that I should have mentioned PUT in my idempotency section, since it's supposedly idempotent by design. I guess so — I haven't seen it a lot in practice, and in my view there's nothing inherently about the HTTP verb that makes it more idempotent than POST. There was also some concern about using Redis as an idempotency store, since you can't get safely atomic operations that coordinate Redis and your database. That's a reasonable concern for payments or high-risk areas, but bolting Redis on top of an existing non-idempotent API is still much better than nothing.

---

# 第二部分：解析（深度解读）

## 核心论点速览

Sean Goedecke 把 API 设计的核心矛盾一句话点破：**API 既要「无聊」（对使用者极度熟悉），又要「难以改动」（一旦发布就绑死了下游无数软件）**。文章通篇在这两个张力之间做工程权衡，而不是在 REST/GraphQL 的宗教战争里站队。他把大量「花哨建议」归类为噪音，认为好 API 的本质是稳定性与可预期性，而非优雅。

下面按主题拆解，并给出对工程实践的落地含义。

## 一、好 API 是「无聊」的：熟悉度 vs 灵活度

- **熟悉度优先**：使用者调用你的 API 是为了完成别的更高层目标，他们不愿意停下来研究你的接口。理想状态下，用户在读文档之前就该「差不多知道怎么用」。这就是为什么 REST 这种烂大街的范式反而是好选择——不是因为它最好，而是因为它足够熟悉。
- **灵活度是长期负债**：设计者想做聪明的事来保持未来扩展空间，但每多一层抽象，就多一处使用者需要理解的东西。API 设计 ≈ 在「极简」与「为长期灵活而聪明」之间找平衡。

**落地含义**：新接口优先复用团队/业界已有的约定（统一命名、统一错误码、统一分页参数），而不是发明新范式。可预期性 > 巧妙性。

## 二、WE DO NOT BREAK USERSPACE：不可破坏既有使用者

这是全文最重要的一条铁律，借用 Linus Torvalds 的名言：

- **加字段（additive）通常安全**：响应里多返回几个字段，合规的 JSON 解析器默认忽略未知字段。那些「收到多余字段就崩」的消费者是设计失职。
- **删字段 / 改类型 / 改结构 = 破坏**：把 `user.address` 挪到 `user.details.address`，所有依赖旧路径的代码立刻挂掉。下游会把这当 bug 报上来，且愤怒有理。
- **哪怕拼写错了也不改**：HTTP 的 `referer` 头是 `referrer` 的著名拼写错误，但至今没改——因为改了就破坏了用户空间。

**落地含义**：把「不破坏下游」当成一种近乎神圣的义务。任何接口改动都要问：有没有现成软件依赖它？一次破坏可能沿着依赖链放大成数百、数千个软件的故障。

## 三、改 API 不破坏用户：版本化是「必要之恶」

- **版本化 = 同时服务新旧两份接口**（`/v1/`、`/v2/` 或 Stripe 的 header 版本）。老用户继续用老版本，新用户可选新版本。
- **迁移极慢**：即便有横幅、邮件、响应头提示，真正下线旧版本时仍会有一批愤怒用户。
- **作者明确讨厌版本化**：对用户困惑（文档版本选择器对不上）、对维护者是噩梦（30 个端点 × N 个版本 = 数百个要测要支持的组合）。Stripe 靠翻译层把业务逻辑与序列化解耦，但抽象一定会泄漏（核心代码里仍要写条件分支）。
- **结论**：版本化只作为最后手段。

**落地含义**：优先用「不破坏式」演进（加字段、加可选参数）避免版本化；真要 breaking change，必须并行跑双版本 + 长周期迁移窗口。

## 四、API 的成功完全取决于产品

- API 本身啥也不干，它只是「用户」和「用户真正想要的东西」之间的一层。没人因为 API 优雅而用它，人们是为了**用产品**才容忍 API。
- 所以 Facebook、Jira 有出了名的烂 API，但无所谓——你要想接入，就得硬啃。
- **API 质量是边际特性**：只有当两个产品基本等价、用户在二选一时，API 好不好才有决定性。

**落地含义**：别在接口优雅度上过度投资而忽视产品价值本身。但「有没有 API」是另一回事——技术用户会要求用代码集成，缺 API 是硬伤。

## 五、烂产品几乎必然产出烂 API

- 技术再好的 API 也救不了没人用的产品；但**产品底层建模糟糕，会让你几乎无法造出优雅的 API**——因为 API 通常映射产品的「基本资源」。
- 案例：评论用内存链表存储（每个评论有 `next` 指针）。在 UI 里能巧妙藏拙，但一做成 API，消费者就不得不理解这套链表结构，甚至被迫走「后台任务」式接口去拉取深层评论。

**落地含义**：API 是产品内部建模的「照妖镜」。想让接口干净，先让底层资源建模干净。

## 六、认证：放行长期有效的 API Key

- 每个集成都始于一段简单脚本，**API Key 是让脚本跑起来最省事的方式**。OAuth 也该支持，但不该是唯一的、第一道门槛。
- **很多使用者不是专业工程师**：销售、PM、学生、爱好者。要求他们做 OAuth 握手，会把一大批人挡在门外。

**落地含义**：默认提供长期 Key，把高安全短期凭证作为可选项而非必选项，降低上手摩擦。

## 七、幂等性与重试：让「会做事」的请求可安全重试

- 失败分两种：422 通常意味着「校验阶段就失败、什么都没做」；**500 / 超时则不知道动作到底有没有发生**——重试可能重复发两条评论，更危险的是重复转账、重复发药。
- **解法 = 幂等键（idempotency key）**：服务端见到同一个 key 就只执行一次。标准实现放 Redis（key 即幂等键），非支付场景几小时后过期即可。
- 不需要幂等键的：读请求（重复读无害）、删除请求（按资源 ID 删，ID 本身就是幂等键）。
- 作者倾向**幂等可选**，理由是别把非工程师用户吓跑；广度 > 偶发的重复评论。

**落地含义**：对「有副作用且高代价」的操作（支付、发消息、创建单据）强制幂等键；低风险操作可默认关闭以降低使用门槛。

## 八、安全与限流：API 能被代码以机器速度调用

- UI 用户受手速限制；API 用户受代码速度限制。一次暴露的重操作，可能被一秒钟狂刷上千次（作者举了 Zendesk 通知扇出被拿来做聊天、把后端打挂的真实事故）。
- **必须有 rate limit**，且对昂贵操作更严；保留对特定客户临时熔断（killswitch）的能力。
- 响应里带 `X-Limit-Remaining`、`Retry-After`，让客户端学会体面地退避。

**落地含义**：任何对外 API 默认带限流 + 熔断，把「客户手搓集成搞挂后端」列为常态风险而非意外。

## 九、分页：大数据集务必用游标（cursor）分页

- `offset` 分页好实现（`OFFSET 20 LIMIT 10`），但关系库每次都要数过 offset，越翻越慢；到几十万 offset 就是真问题。
- **游标分页**：传上一页最后一条的 ID 作 `cursor`，查询变成 `WHERE id > cursor ORDER BY id LIMIT 10`，有无索引都能瞬时定位，与集合大小无关。
- 作者建议：可能变大的数据集一律游标分页；小数据集用 offset 无妨。列表响应里带 `next_page` 字段，省得客户端自己算下一页。

**落地含义**：从第一天就为「可能变大的列表」上游标分页，事后迁移的代价极高。

## 十、可选字段与 GraphQL：贵字段默认不返回

- 昂贵字段（如要再发一次内部调用才能拿到的订阅状态）做成**可选**，靠 `include_xxx` / `includes:[...]` 参数按需拉取。这是 GraphQL 思想的一部分。
- **作者不太喜欢 GraphQL**：对非工程师不友好、把任意查询权交给用户使缓存与边界情况变复杂、后端实现比 REST 繁琐。但他也说没那么强烈，特定场景仍值得。

**落地含义**：用「可选字段」达成 GraphQL 想解决的「按需取数」，而不必引入整套 GraphQL 复杂度——除非你真的需要它。

## 十一、内部 API 是另一回事

- 内部 API 的消费者通常是专业工程师、用户数低一两个数量级、你能直接改所有人的代码，所以**可以安全地做 breaking change、可以用复杂认证**。
- 但内部 API 照样能引发事故，关键操作照样要幂等。

**落地含义**：别把公开 API 的「不破坏」铁律生搬硬套到内部接口，但稳定性与幂等基本工程纪律一视同仁。

## 与本站其他文章的连接

这是本站第一篇纯软件工程（非半导体）长文，但文中的核心精神——**「不破坏接口契约」的强约束**——与硬件/芯片世界高度同构，可作为一则以软件视角注解硬件标准的短文：

- [读懂 CPO 之前你必须知道的 SerDes 技术（SerDes Part 1）](/posts/serdes-part-1-the-technology-you-should-know-before-cpo/)：SerDes 本质上是芯片/板级之间的「硬件 API」，其速率、编码、信道契约一旦定型，下游 PHY、retimer、封装都要长期兼容——和「WE DO NOT BREAK USERSPACE」是同一句话的硅基版本。
- [先进封装与异构集成完全技术概览](/posts/a-masterclass-on-advanced-packaging/)：die-to-die 接口（如 UCIe、CoWoS 的互联平面）同样是「发布即锁定」的契约，封装层面的「字段改名」代价极高。
- [AI 硬件入门](/posts/the-ai-hardware-primer/)：NVIDIA 的硬件/软件栈之所以形成生态护城河，很大程度上正是因为其「接口长期稳定 + 产品价值极高」——恰好印证本文「产品价值大于接口优雅」那条。
- 顺带延伸阅读（非半导体）：[如何记住你读过的所有东西](/posts/how-to-remember-everything-you-read/)（本站阅读与思考类）。

## 风险提示与去主观化

- 本文是作者**个人经验性**总结，对 REST vs GraphQL、版本化、幂等是否默认开启都有明显主观偏好，不代表本站立场，也不构成工程规范。
- 部分建议有适用边界：例如「幂等可选」「游标分页一律上」在超大规模或强一致场景下需结合业务再判断；把 Redis 当幂等存储的原子性隐患（文末读者已指出），在支付/高危场景应改用数据库事务级保证。
- 文中案例（Zendesk、Stripe、OpenAI、Twilio、Jira）仅作说明，其当前 API 形态可能已变化，引用以原文发布时点（2025-08-24）为准。
