---
layout: post
title: "What Capable Agents Must Know: Selection Theorems for Robust Decision-Making under Uncertainty — 高性能 agent 必须知道什么：不确定性下稳健决策的选择定理"
date: 2026-08-19 00:00:00 +0800
categories: [人工智能]
tags: [Agent, 决策理论, 世界模型, 选择定理, 不确定性]
description: 高性能 agent 必须知道什么：不确定性下稳健决策的选择定理 本文附英文原文（arXiv 全文/PDF 提取）与中文深度解读。
---

> 原文：[What Capable Agents Must Know: Selection Theorems for Robust Decision-Making under Uncertainty](https://arxiv.org/abs/2603.02491)，作者 Aran Nayebi (Carnegie Mellon University)。
> 本页结构：第一部分为英文原文（Original Article），第二部分为中文深度解读（解析）。
> 说明：原文无付费墙，全文完整收录（来自 arXiv HTML 或 PDF 文本提取，公式以 LaTeX 呈现）。

# 第一部分：正文（Original Article）

# What Capable Agents Must Know: Selection Theorems for Robust Decision-Making under Uncertainty

[Aran Nayebi](mailto:<anayebi@cs.cmu.edu>?Subject=Your%20UAI%202026%20paper)

Affiliation: Machine Learning Department and Neuroscience & Robotics Institutes

Carnegie Mellon University

Pittsburgh, Pennsylvania, USA

Abstract
    

As artificial agents become increasingly capable, what internal structure is *necessary* for an agent to act competently under uncertainty?
Classical results show that optimal control can be *implemented* using belief states or world models, but not that such representations are required.
We prove quantitative “selection theorems” showing that strong task performance (low *average-case regret*) forces world models, belief-like memory and—under task mixtures—persistent regime-tracking variables resembling functional primitives of emotion, along with informational modularity under block-structured tasks.
Our results cover stochastic policies, partial observability, and evaluation under task distributions, without assuming optimality, determinism, or access to an explicit model.
Technically, we reduce predictive modeling to binary “betting” decisions and show that regret bounds limit probability mass on suboptimal bets, enforcing the predictive distinctions needed to separate high-margin outcomes. In fully observed settings, this yields approximate recovery of the interventional transition kernel; under partial observability, it implies necessity of predictive state and belief-like memory, addressing an open question in prior world-model recovery work.

  

## 1 Introduction

What internal structure is *necessary* for an agent to robustly act competently under uncertainty?

Classical results in control and reinforcement learning show that optimal behavior can be implemented using belief states or world models [[50], [31]].
These results are constructive: they show that an optimal controller *can* be expressed as a function of a sufficient statistic.
They do not establish that predictive internal state is *required*.
An architecture might be capable of belief-based control without being forced to implement predictive structure by the demands of its task distribution.
Our aim is to close this gap, in the sense of “selection-style” arguments articulated by [55].

Across decision theory, control, and learning theory, broad performance requirements often imply structural constraints.
Classical representation theorems show that agents satisfying rationality axioms behave *as if* maximizing expected utility [[53], [45]], and later axiomatic work [[32], [33]] studies the ordering of policies in closed-loop dynamic decision problems via local functionals, showing that such orderings induce probabilistic modeling of uncertainty in the optimized decision process.
The Good Regulator Theorem asserts that regulation requires modeling the system [[15]], a requirement formalized in linear control by the Internal Model Principle [[21]].
No-regret guarantees constrain the information needed to avoid systematic loss [[10], [20]].
However, these approaches either rely on strong axioms, target specialized and exactly optimal regulation settings, or stop short of representation-level necessity conclusions.

Selection depends on the task familyDiagnostic task familyInternal structure selected

Fully observed
action-conditioned bets
(§4, Thm. 1)

Threshold bets on
predictive tests
(§5.2, Thms. 2-4)

Paired-history
distinguishing tests
(§5.3, Thm. 5)

Block-structured
test families
(Cor. 3)

Regime-shift / mixture
test families
(Cor. 4)

Complete minimal
test families
(Cor. 5)

World model /
transition knowledge

Predictive state
(PSR coordinates)

Memory separating
aliased histories

Modular internal
structure

Persistent regime
variable
(tradeoff-tracking)

Representational
convergence
(invertible recoding)

_Figure 1: Different diagnostic task families select different internal structure, from world models and predictive state to memory, modularity, persistent regime variables, and representational convergence._

Our contribution.
We prove quantitative selection theorems showing that low *average-case regret* on structured families of action-conditioned prediction tasks forces an agent to implement predictive, structured internal state (visualized in Fig. [1]).

Our technical approach reduces predictive modeling to binary “betting” goals.
A regret decomposition shows that average normalized regret bounds directly control the probability mass assigned to suboptimal bets.
When the evaluation distribution places nontrivial mass on large-margin tests, this forces the agent’s internal memory to refine the predictive partition induced by those tests (Theorems [1]–[5]).
In fully observed environments, this yields approximate recovery of the interventional transition kernel (Corollary [1]); in partially observed environments, it yields quantitative no-aliasing bounds for belief-like memory, addressing an open question posed by [42].
We also show that [41] Level 2 interventions are recoverable, but Level 3 counterfactuals are not (Corollary [2]).

Our results differ from recent world-model recovery work [[43], [42]] in three key respects: (i) we assume only average-case regret rather than worst-case optimality; (ii) our results hold under stochastic policies, which have both had a long history in reinforcement learning [[57], [56], [52]] and are commonly used in modern deep learning algorithms, such as the Dreamer family  [[23], [24], [25], [26]], PPO [[47]], along with many others (e.g. [[27], [54]] to name a few); and (iii) unlike their work and later recent extensions, we derive necessity results under *partial observability* rather than focusing solely on explicit recovery in fully observed settings [[36], [28]] or under fully observed goals [[14]], directly addressing an *open question* raised by [42].

Structure from task families.
Beyond predictive modeling and memory, we also show that structured evaluation distributions impose further constraints.
Block-structured tests select for informational modularity (Corollary [3]); mixtures of regimes select for regime-sensitive internal state (Corollary [4]); and under minimality assumptions, any two vanishing-regret agents must *representationally converge* on decision-relevant partitions up to invertible recoding (Corollary [5]).

Taken together, these results formalize a simple principle:

> 

Robust generalization under uncertainty selects for the predictive internal structure tested by the evaluation task family.

They separate representation *necessity* from representation *recovery* and provide a regret-based route from empirically meaningful competence guarantees on *specified* task families to concrete constraints on internal organization.
After all, no representation theorem can force an agent to distinguish internal states that are never tested by the goals.

## 2 Related Work

Our results are framed in the standard POMDP setting, where posterior belief is a sufficient statistic for optimal control [[50], [31]].
However, these classical results are constructive: they show that optimal behavior *can* be expressed in terms of belief, not that predictive state is *required*.

[4], [5], [6], [8], [7], [9] develops a distinct weakness-maximization framework in which successful adaptation is argued to favor causal-identity constructions separating intervention from observation; however, unlike our regret-based selection theorems, it proceeds via task extensions and additional exchangeability and representation/incentive assumptions, and does not establish direct analogues of our quantitative recovery, partial-observability necessity, or representational convergence results.
Recent philosophical work [[29]] has also explored reducing interventional reasoning to probabilistic reasoning over enriched variable spaces, though in a distinct formal setting from the agent-based, regret-theoretic framework considered here.

Our notion of tests follows predictive-state representations (PSRs) [[37], [49], [12]], which represent state via predictions of action-conditioned futures rather than latent variables.
Unlike the PSR literature, which treats predictive state as sufficient for control, we derive it as *necessary*: low *average-case* regret on action-conditioned prediction tasks forces an agent to compute the predictive distinctions needed to separate high-margin outcomes.
Technically, our core inequality instantiates a standard margin-style regret decomposition [[3]], but uses it to derive representation-theoretic constraints rather than supervised generalization guarantees.
The betting-goal reduction is related to elicitation, proper scoring rules, and game-theoretic/imprecise probability [[44], [22], [17], [48]], though we use precise success probabilities rather than truthful reports or lower/upper-probability protocols.

Our work is complementary to [43], [42], who show that under strong competence assumptions in fully observed environments one can *recover* a transition model from an agent’s policy.
We instead study stochastic policies, partial observability, and *average-case* regret over a distribution of prediction tasks, and derive necessity results rather than recovery procedures.
In particular, we extend our selection argument to partially observed environments, giving quantitative no-aliasing bounds for belief-like memory—addressing an open question raised by [42].

## 3 Notation and Constants

Consider a one-step decision between two actions 

$$
L
$$

 and 

$$
R
$$

 with success probabilities 

$$
u_{L},u_{R}\in[0,1]
$$

.
Let a (possibly stochastic) policy choose 

$$
L
$$

 with probability 

$$
q\in[0,1]
$$

 and 

$$
R
$$

 with probability 

$$
1-q
$$

.
Then the achieved success probability is

$$
\begin{split}V&=\Pr(\text{success}\mid L)\Pr(L)+\Pr(\text{success}\mid R)\Pr(R)\\
&=q\,u_{L}+(1-q)\,u_{R}.\end{split}
$$

(1)

Let the optimal success probability be denoted as 

$$
V^{\star}:=\max_{q\in[0,1]}V
$$

.

Define the normalized regret as

$$
\delta:=1-\frac{V}{V^{\star}},
$$

(2)

assuming 

$$
V^{\star}>0
$$

 (this is without loss of generality, as a 

$$
V^{\star}=0
$$

 will imply that the goal is trivially unsatisfiable).

For any 

$$
\gamma\in(0,\tfrac{1}{2})
$$

, with 

$$
\gamma\to 1/2
$$

 only as a limit, define the following constants, which will be used throughout:

$$
c(\gamma):=\frac{4\gamma}{1+2\gamma},\qquad t_{\gamma}:=\sqrt{\frac{1+2\gamma}{1-2\gamma}}\;\geq 1.
$$

(3)

## 4 World model recovery in fully observed environments

Let 

$$
E=(\mathcal{S},\mathcal{A},P,\mu_{0})
$$

 be an environment with finite state space 

$$
\mathcal{S}
$$

 and action space 

$$
\mathcal{A}
$$

, with 

$$
|\mathcal{A}|\geq 2
$$

, where 

$$
P(s^{\prime}\mid s,a)
$$

 denotes the one-step transition probabilities and 

$$
\mu_{0}
$$

 the initial-state distribution.
We assume the environment is fully observed (the agent observes 

$$
s,s^{\prime}
$$

 exactly), stationary (transition probabilities do not drift over time), and that actions influence transitions (i.e., there exist 

$$
s,a,a^{\prime},s^{\prime}
$$

 such that 

$$
P(s^{\prime}\mid s,a)\neq P(s^{\prime}\mid s,a^{\prime})
$$

).
Additionally, we assume the environment is communicating, meaning that for any 

$$
s,s^{\prime}\in\mathcal{S}
$$

 there exists a finite action sequence that reaches 

$$
s^{\prime}
$$

 from 

$$
s
$$

 with positive probability, ensuring the agent can in principle carry out the diagnostic goals from any start state, thereby ruling out environments with permanently isolated regions (rather than realistic control problems).

We now can define the goal family.
Specifically, we define our bets over the agent’s successful completion of it:

Definition 1 (Composite goal family 

$$
G^{(n)}_{s,a,s^{\prime},k}
$$

).

Fix 

$$
s,s^{\prime}\in\mathcal{S}
$$

, an action to be tested 

$$
a\in\mathcal{A}
$$

, an integer 

$$
n\geq 1
$$

, and a threshold 

$$
k\in\{0,1,\dots,n\}
$$

.
Pick any two initial *marker* actions 

$$
L,R\in\mathcal{A}
$$

 (used only to select a branch at 

$$
t=0
$$

).

For an infinite trajectory 

$$
\tau=(S_{0},A_{0},S_{1},A_{1},\dots)
$$

 define the attempt times

$$
\begin{split}&T_{1}(\tau):=\inf\{t\geq 1:\ S_{t}=s,\ A_{t}=a\},\\
&T_{i+1}(\tau):=\inf\{t>T_{i}(\tau):\ S_{t}=s,\ A_{t}=a\},\end{split}
$$

with the convention 

$$
\inf\emptyset=\infty
$$

.
Thus, 

$$
T_{i}
$$

 is the 

$$
i
$$

-th occurrence of 

$$
(S_{t}=s,A_{t}=a)
$$

 along 

$$
\tau
$$

, if it occurs; otherwise, 

$$
T_{i}=\infty
$$

.

Define success indicators

$$
\begin{split}&X_{i}(\tau):=\mathbf{1}\{T_{i}(\tau)<\infty\ \wedge\ S_{T_{i}(\tau)+1}=s^{\prime}\},\\
&N_{n}(\tau):=\sum_{i=1}^{n}X_{i}(\tau).\end{split}
$$

Thus, 

$$
X_{i}
$$

 is the indicator that the 

$$
i
$$

th execution of 

$$
(s,a)
$$

 transitions to 

$$
s^{\prime}
$$

, and 

$$
N_{n}
$$

 is the total number of such successful transitions to 

$$
s^{\prime}
$$

 across the first 

$$
n
$$

 attempts.
(We omit the dependence on 

$$
s,a,s^{\prime},k
$$

 just to keep the notation from being overloaded.)

The *composite goal* 

$$
G^{(n)}_{s,a,s^{\prime},k}
$$

 is the event:

$$
\begin{split}&\Big(A_{0}=L\ \wedge\ T_{i}(\tau)<\infty\ \forall i\leq n\ \wedge\ N_{n}(\tau)\leq k\Big)\\
&\bigvee\Big(A_{0}=R\ \wedge\ T_{i}(\tau)<\infty\ \forall i\leq n\ \wedge\ N_{n}(\tau)>k\Big).\end{split}
$$

(4)

For convenience, we will write 

$$
G^{(n)}_{s,a,s^{\prime},k}=G^{(n,1)}_{s,a,s^{\prime},k}\lor G^{(n,2)}_{s,a,s^{\prime},k}
$$

, where 

$$
G^{(n,1)}_{s,a,s^{\prime},k}
$$

 and 

$$
G^{(n,2)}_{s,a,s^{\prime},k}
$$

 are the first and second disjuncts, respectively.

Interpretation: The goal 

$$
G^{(n)}_{s,a,s^{\prime},k}
$$

 forces a one-shot binary commitment at time 

$$
t=0
$$

: choosing 

$$
A_{0}=L
$$

 commits to the branch “at most 

$$
k
$$

 successes”, while choosing 

$$
A_{0}=R
$$

 commits to the branch “more than 

$$
k
$$

 successes”.
After this commitment, the agent must generate 

$$
n
$$

 *attempts* to execute 

$$
(S_{t}=s,A_{t}=a)
$$

; the 

$$
i
$$

th such attempt occurs at time 

$$
T_{i}
$$

.
Each attempt counts as a *success* if it transitions to 

$$
s^{\prime}
$$

 on the next step, i.e. 

$$
S_{T_{i}+1}=s^{\prime}
$$

, and 

$$
N_{n}
$$

 counts the number of successes in 

$$
n
$$

 attempts.
Thus 

$$
G^{(n)}_{s,a,s^{\prime},k}
$$

 is an either-or test about whether the transition 

$$
(s,a)\to s^{\prime}
$$

 happens “rarely” (

$$
\leq k
$$

 times) or “often” (

$$
>k
$$

 times) across 

$$
n
$$

 attempts.
Equivalently, at 

$$
t=0
$$

 the agent chooses between two incompatible branches:
*(i)* “

$$
\leq k
$$

 successes in 

$$
n
$$

 attempts of 

$$
(s,a)\to s^{\prime}
$$

” (signaled by 

$$
A_{0}=L
$$

) or *(ii)* “

$$
>k
$$

 successes in 

$$
n
$$

 attempts” (signaled by 

$$
A_{0}=R
$$

).

Next, we deal with the fact that under a stochastic policy, taking either action 

$$
L
$$

 or 

$$
R
$$

 is actually a mixture of the two.

Lemma 1 (Binary-decision regret controls wrong-action mass).

Define the *wrong-action mass*

$$
w\;:=\;\begin{cases}1-q,&\text{if }u_{L}\geq u_{R}\ (\text{$L$ is optimal}),\\
q,&\text{if }u_{R}>u_{L}\ (\text{$R$ is optimal}).\end{cases}
$$

Then the normalized regret 

$$
\delta
$$

 is equivalent to:

$$
\delta\;=\;w\cdot\frac{|u_{L}-u_{R}|}{\max\{u_{L},u_{R}\}}.
$$

(5)

In the special *betting* case where 

$$
u_{L}
$$

 and 

$$
u_{R}
$$

 are complementary, namely 

$$
u_{R}:=1-u_{L}
$$

, defining the margin

$$
m:=|u_{L}-\tfrac{1}{2}|
$$

, we obtain

$$
\delta=w\cdot\frac{4m}{1+2m}.
$$

(6)

Consequently, on the event 

$$
m\geq\gamma\in(0,\tfrac{1}{2})
$$

,

$$
w\leq\frac{\delta}{c(\gamma)}.
$$

(7)

#### Fully observed diagnostic setup.

For the composite goals 

$$
G^{(n)}_{s,a,s^{\prime},k}
$$

 of Definition [1], write

$$
q_{s,a,s^{\prime},k}:=\pi\!\left(G^{(n,1)}_{s,a,s^{\prime},k}\mid s_{0},G^{(n)}_{s,a,s^{\prime},k}\right),
$$

and define 

$$
V^{\pi},V^{\star}
$$

 and the normalized regret 

$$
\delta_{s,a,s^{\prime},k}(\pi;s_{0})
$$

 as in Eq. ([2]). The induced clipped soft estimator is

$$
\widehat{P}_{ss^{\prime}}(a):=\operatorname{clip}_{[0,1]}\!\left[\frac{1}{n}\left(\sum_{k=0}^{n}(1-q_{s,a,s^{\prime},k})-\frac{1}{2}\right)\right].
$$

(8)

The clipping only enforces that the estimator is a probability and cannot increase absolute error to the true 

$$
P_{ss^{\prime}}(a)
$$

.
Note this estimator is explicitly *computable* by querying the goal-conditioned policy on each diagnostic goal, recording its probability 

$$
q_{s,a,s^{\prime},k}
$$

 of choosing the first branch, and summing these probabilities as in Eq. ([8]); it does not require estimating transition frequencies from a rollout (though this can be done too).

Theorem 1 (Fully observed: stochastic policies + average regret 

$$
\Rightarrow
$$

 approximate transition model).

Under the fully observed diagnostic setup, assume

$$
\mathbb{E}_{(s,a,s^{\prime},k)\sim\mathrm{Unif}(\mathcal{S}\times\mathcal{A}\times\mathcal{S}\times\{0,\dots,n\})}\big[\delta_{s,a,s^{\prime},k}(\pi;s_{0})\big]\leq\bar{\delta}.
$$

(9)

Then, for any fixed 

$$
\gamma\in(0,\tfrac{1}{2})
$$

,

$$
\begin{split}&\mathbb{E}_{(s,a,s^{\prime})}\Big[\,\big|\widehat{P}_{ss^{\prime}}(a)-P_{ss^{\prime}}(a)\big|\,\Big]\\
\leq\;&2t_{\gamma}\,\mathbb{E}_{(s,a,s^{\prime})}\left[\sqrt{\frac{P_{ss^{\prime}}(a)(1-P_{ss^{\prime}}(a))}{n}}\right]+\frac{\bar{\delta}}{c(\gamma)}+O\!\left(\frac{1}{n}\right).\end{split}
$$

(10)

In particular,

$$
\mathbb{E}_{(s,a,s^{\prime})}\big[|\widehat{P}_{ss^{\prime}}(a)-P_{ss^{\prime}}(a)|\big]\leq\frac{t_{\gamma}}{\sqrt{n}}+\frac{\bar{\delta}}{c(\gamma)}+O\!\left(\frac{1}{n}\right).
$$

Remark 1 (Independence from goal family size).

[42] state a more restricted version of Theorem [1] under a (worst-case) competence assumption over all goals, but note that their proof only needs an explicit diagnostic subset of 

$$
O(n|\mathcal{A}||\mathcal{S}|^{2})
$$

 simple composite goals.
By contrast, our Theorem [1] does not depend on the goal family size because it relaxes the worst-case regret assumption by the average normalized regret assumption ([9]) on that diagnostic family.

Notably, the error bound ([10]) of Theorem [1] tightens as the goal depth 

$$
n
$$

 increases, reflecting the fact that longer-horizon goal competence forces the agent to estimate transition dynamics with increasing precision.
In contrast, when 

$$
n=1
$$

 (purely myopic goals), accurate world modeling is not required—explicating the classic pitfall behind the Good Regulator Theorem [[15]] that trivial or constant policies can suffice for immediate control, but fail once multi-step coordination is demanded.

A natural question to ask next is under what conditions can we recover a *causal* world model, and of what *type* is the represented causality?

Corollary 1 (Causal content: approximately recovered interventional kernel).

Assume the setting and hypotheses of Theorem [1].
Assume additionally that the controlled Markov process admits an *

$$
\varepsilon_{\mathrm{cMP}}
$$

-approximate* causal Markov-process (cMP) interpretation in which choosing 

$$
A_{t}=a
$$

 corresponds to the intervention 

$$
\mathrm{do}(A_{t}=a)
$$

 and,
for all 

$$
s,a,s^{\prime}
$$

,

$$
\begin{split}&\big|P_{ss^{\prime}}(a)-P^{\mathrm{do}}_{ss^{\prime}}(a)\big|\;\leq\;\varepsilon_{\mathrm{cMP}},\\
&P^{\mathrm{do}}_{ss^{\prime}}(a):=P(S_{t+1}=s^{\prime}\mid S_{t}=s,\mathrm{do}(A_{t}=a)).\end{split}
$$

(11)

Then the estimator 

$$
\widehat{P}
$$

 defined from 

$$
\pi
$$

 via ([8]) satisfies the same average error bound as in Theorem [1], up to the mismatch 

$$
\varepsilon_{\mathrm{cMP}}
$$

: for any fixed 

$$
\gamma\in(0,\tfrac{1}{2})
$$

,

$$
\begin{split}&\mathbb{E}_{(s,a,s^{\prime})}\big[\,|\widehat{P}_{ss^{\prime}}(a)-P^{\mathrm{do}}_{ss^{\prime}}(a)|\,\big]\\
\;\leq&\;2t_{\gamma}\,\mathbb{E}_{(s,a,s^{\prime})}\Big[\sqrt{\tfrac{P_{ss^{\prime}}(a)(1-P_{ss^{\prime}}(a))}{n}}\Big]\;+\;\frac{\bar{\delta}}{c(\gamma)}\\
&+\;\varepsilon_{\mathrm{cMP}}\;+\;O\left(\frac{1}{n}\right).\end{split}
$$

(12)

In particular, low average regret on the diagnostic goal family forces 

$$
\pi
$$

 to implicitly approximate Level 2 interventional queries, in the sense of [41], of the form 

$$
P(S_{t+1}=s^{\prime}\mid S_{t}=s,\mathrm{do}(A_{t}=a))
$$

 up to 

$$
\varepsilon_{\mathrm{cMP}}
$$

.

Note that Corollary [1] does not, in general, identify causal relations between *concurrent* components of the state vector (e.g. between 

$$
X_{t}
$$

 and 

$$
Y_{t}
$$

 when 

$$
S_{t}=(X_{t},Y_{t})
$$

), since such relations can be non-identifiable from the transition function alone.
It is worth noting that unless the transition function 

$$
P
$$

 is a point-mass, namely 

$$
S_{t+1}=f(S_{t},A_{t})
$$

, whereby learning the interventional kernel is exactly equivalent to learning the transition function 

$$
f
$$

, then [41] Level 2 of interventions, rather than counterfactuals, is the maximum level of recovery we can guarantee.
This is the same level that [43] reach, but they do it under a much stronger maximum (rather than average) regret assumption under deterministic (rather than stochastic) policies.

In fact, despite generalizing to stochastic policies under average regret, [41] Level 3 (counterfactuals) remains out of reach without additional assumptions:

Corollary 2 (No generic Level 3 recovery from the interventional kernel).

Even if 

$$
\widehat{P}
$$

 recovers the interventional kernel 

$$
P^{\mathrm{do}}_{ss^{\prime}}(a)
$$

 exactly (in particular, even if 

$$
\pi
$$

 is optimal on all the diagnostic goals), the resulting information does not, in general, identify Level 

$$
3
$$

 counterfactual queries involving 

$$
S_{t+1}^{a}
$$

 and 

$$
S_{t+1}^{a^{\prime}}
$$

 simultaneously, where 

$$
S_{t+1}^{a}
$$

 denotes the potential next state under 

$$
\mathrm{do}(A_{t}=a)
$$

.

Therefore, recovering [41] Level 3 counterfactuals requires an explicit structural causal model specifying the exogenous noise and its cross-action coupling, not merely the interventional transition kernel 

$$
P^{\mathrm{do}}(s^{\prime}\mid s,a)
$$

.

## 5 Selection Theorems under Partial Observability

Our betting reduction (Lemma [1]) also enables selection theorems under *partial* observability, addressing an open question of [42].
The reason this is open, is because under partial observability, we cannot guarantee that the agent’s action choices isolate a single underlying transition probability in the way they do in the fully observed case.
When the agent observes only an observation 

$$
o_{t}
$$

 rather than the true state 

$$
s_{t}
$$

, the success probabilities of the diagnostic branches become mixtures over latent states consistent with 

$$
o_{t}
$$

, and different latent dynamics can induce identical observable behavior on all composite goals of bounded depth.
Consequently, low regret does not imply recovery of the underlying transition kernel without additional structure.
This breaks the direct reduction used in Theorem [1] and requires more careful selection of diagnostic goals defined at the level of predictive beliefs rather than physical states.
We achieve this by combining our betting reduction from §[4] with predictive-state representations (PSRs).

### 5.1 Setup and Notation

POMDP.
A finite partially observed Markov decision process (POMDP) is a tuple

$$
E=(\mathcal{X},\mathcal{A},\mathcal{O},T,Z,\mu_{0}),
$$

where 

$$
\mathcal{X}
$$

 is a finite latent state space, 

$$
\mathcal{A}
$$

 is a finite action space with 

$$
|\mathcal{A}|\geq 2
$$

, 

$$
\mathcal{O}
$$

 is a finite observation space, 

$$
T(x^{\prime}\mid x,a)
$$

 is the transition kernel, 

$$
Z(o\mid x)
$$

 is the observation kernel, and 

$$
\mu_{0}\in\Delta(\mathcal{X})
$$

 is the initial latent-state distribution.
A history at time 

$$
t
$$

 is

$$
h_{t}:=(o_{0},a_{0},o_{1},\dots,a_{t-1},o_{t}).
$$

For any history 

$$
h_{t}
$$

 and any prescribed future action sequence 

$$
A_{t:t+k-1}=\alpha\in\mathcal{A}^{k}
$$

, the POMDP induces a well-defined conditional distribution over future observations 

$$
O_{t+1:t+k}
$$

.
For convenience, we will drop the subscript 

$$
t
$$

 and refer to histories as 

$$
h:=h_{t}
$$

.

Agent interface (report bit).
As in the fully observed case, we reduce prediction to a one-shot binary decision.
We allow the agent to emit a report bit 

$$
B_{t}\in\{L,R\}
$$

 that does not affect environment dynamics.
Formally, the agent outputs 

$$
(B_{t},A_{t})\in\{L,R\}\times\mathcal{A}
$$

, while the environment transition
ignores 

$$
B_{t}
$$

.
This device is without loss of generality for necessity results: any agent can internally commit to one of two incompatible plans before acting, without changing the induced environment process.
All prediction is expressed through the report bit; the environment-action channel is used only to execute prescribed action sequences.

Tests (predictive-state style).
A *test* is a pair

$$
T=(\alpha,W),
$$

where 

$$
\alpha\in\mathcal{A}^{k}
$$

 is a finite action sequence and 

$$
W\subseteq\mathcal{O}^{k}
$$

 is an event over the resulting observation sequence.
For a history 

$$
h
$$

, define the test success probability

$$
p_{T}(h)\;:=\;\Pr\!\big(O_{t+1:t+k}\in W\,\big|\,h,\ A_{t:t+k-1}=\alpha\big),
$$

and the associated margin

$$
m_{T}(h):=\big|p_{T}(h)-\tfrac{1}{2}\big|.
$$

Behavioral distinguishability.
Two histories 

$$
h,h^{\prime}
$$

 are *behaviorally distinguishable* if there exists a test 

$$
T
$$

 with 

$$
p_{T}(h)\neq p_{T}(h^{\prime})
$$

.
They are *

$$
\gamma
$$

-distinguishable* if 

$$
|p_{T}(h)-p_{T}(h^{\prime})|\geq\gamma
$$

 for some test 

$$
T
$$

.
A POMDP is *non-trivially partially observable* if there exist histories with the same last observation that are behaviorally distinguishable.

Betting goals induced by tests.
Each test 

$$
T=(\alpha,W)
$$

 induces a one-shot betting goal 

$$
g_{T}
$$

:
at history 

$$
h
$$

, the agent outputs a report bit 

$$
B_{t}
$$

; the environment then executes 

$$
A_{t:t+k-1}=\alpha
$$

; the episode succeeds iff 

$$
B_{t}=L
$$

 and 

$$
O_{t+1:t+k}\in W
$$

, or 

$$
B_{t}=R
$$

 and 

$$
O_{t+1:t+k}\notin W
$$

.
Thus, 

$$
g_{T}
$$

 is a binary bet on whether 

$$
W
$$

 occurs under 

$$
\alpha
$$

.

Policies, value, and regret.
A (possibly stochastic) goal-conditioned policy specifies 

$$
\pi(b\mid h,g_{T})
$$

 for 

$$
b\in\{L,R\}
$$

.
Let 

$$
q_{T}(h):=\pi(L\mid h,g_{T})
$$

.
The success probability under 

$$
\pi
$$

 is

$$
V^{\pi}(h;g_{T})=q_{T}(h)\,p_{T}(h)+(1-q_{T}(h))(1-p_{T}(h)),
$$

(13)

while the optimal success probability is

$$
V^{\star}(h;g_{T})=\max\{p_{T}(h),1-p_{T}(h)\}=\tfrac{1}{2}+m_{T}(h).
$$

(14)

Define the normalized regret

$$
\delta_{T}(\pi;h):=1-\frac{V^{\pi}(h;g_{T})}{V^{\star}(h;g_{T})}\in[0,1].
$$

Evaluation distribution.
Let 

$$
\mathcal{H}
$$

 be a distribution over histories and let 

$$
D
$$

 be a distribution over tests.
We assume a global average regret bound

$$
\mathbb{E}_{h\sim\mathcal{H}}\,\mathbb{E}_{T\sim D}\big[\delta_{T}(\pi;h)\big]\leq\bar{\delta}.
$$

(15)

Wrong-action mass and margins.
For a test 

$$
T
$$

 and history 

$$
h
$$

, define the probability mass assigned to the suboptimal bet

$$
w_{T}(h):=\begin{cases}1-q_{T}(h),&p_{T}(h)\geq\tfrac{1}{2},\\
q_{T}(h),&p_{T}(h)<\tfrac{1}{2}.\end{cases}
$$

For 

$$
\gamma\in(0,\tfrac{1}{2})
$$

, let

$$
\begin{split}&E_{\gamma}:=\{(h,T):m_{T}(h)\geq\gamma\}\\
&q_{\gamma}:=\Pr_{h\sim\mathcal{H},\,T\sim D}\big((h,T)\in E_{\gamma}\big).\end{split}
$$

Non-degenerate evaluation.
Our selection results are informative only if the evaluation distribution places nontrivial mass on informative tests.
We assume that for some 

$$
\gamma\in(0,\tfrac{1}{2})
$$

 there exists a constant 

$$
\eta^{\prime}>0
$$

 such that

$$
\Pr\!\big(p_{T}(h)\geq\tfrac{1}{2}+\gamma\big)\geq\eta^{\prime},\qquad\Pr\!\big(p_{T}(h)\leq\tfrac{1}{2}-\gamma\big)\geq\eta^{\prime},
$$

thereby implying that 

$$
q_{\gamma}\geq 2\eta^{\prime}
$$

.
These conditions rule out degenerate evaluations where all bets are near coin flips or where one outcome is almost always correct (to avoid the case where a constant policy that always reports 

$$
L
$$

 can have very low regret without representing any nontrivial predictive
distinctions, which is a pitfall of the original Good Regulator Theorem [[15]]).

Predictive world model.
In a POMDP, what matters for decision-making is the ability to predict future observations under candidate action sequences.
Accordingly, we use *predictive world model* to mean any internal mechanism sufficient to determine (or approximate) the test probabilities 

$$
\{p_{T}(h)\}
$$

.
In the language of predictive-state representations (PSRs), the vector

$$
\eta_{\mathcal{T}}(h):=\big(p_{T}(h)\big)_{T\in\mathcal{T}}
$$

is the *predictive state*.
For sufficiently rich 

$$
\mathcal{T}
$$

, 

$$
\eta_{\mathcal{T}}(h)
$$

 is decision-sufficient; in finite POMDPs, the belief state is *one* such representation [[31]].

Memory (representation of history).
We model the agent’s internal memory abstractly as a representation 

$$
M=f(h)
$$

 through which the policy factors:

$$
\pi(\cdot\mid h,g_{T})=\pi(\cdot\mid M(h),g_{T}).
$$

(16)

We say that 

$$
M
$$

 is *decision-sufficient* for a test family if 

$$
M(h)
$$

 determines the optimal bet for all tests in that family, and accordingly that 

$$
\pi
$$

 is *

$$
\mathbf{M}
$$

-based*, since 

$$
\pi
$$

 depends on 

$$
h
$$

 only through 

$$
M(h)
$$

 for all betting goals 

$$
g_{T}
$$

.
Our selection theorems show that achieving low average regret on separating betting goals forces the agent’s memory to refine the predictive-state partition induced by 

$$
\eta_{\mathcal{T}}
$$

; representations that alias histories with distinct predictive states incur unavoidable regret.

### 5.2 Predictive world modeling necessity and recovery under partial observability

Theorem 2 (Predictive modeling necessity).

Fix 

$$
\gamma\in(0,\tfrac{1}{2})
$$

.
Assume the global average regret bound ([15]).
Then

$$
\mathbb{E}_{h\sim\mathcal{H}}\ \mathbb{E}_{T\sim D}\Big[w_{T}(h)\,\mathbf{1}\{m_{T}(h)\geq\gamma\}\Big]\;\leq\;\frac{\bar{\delta}}{c(\gamma)}.
$$

(17)

Equivalently, if 

$$
q_{\gamma}>0
$$

 then

$$
\mathbb{E}\Big[w_{T}(h)\,\big|\,m_{T}(h)\geq\gamma\Big]\;\leq\;\frac{\bar{\delta}}{q_{\gamma}\,c(\gamma)}.
$$

(18)

In other words, if a policy has small *global average* regret on betting goals, then on tests that are not near a coin-flip (

$$
m_{T}(h)\geq\gamma
$$

), it must place only small probability mass on the suboptimal bet.
Thus, robust goal performance *selects for* an internal predictive mechanism sufficient to decide many action-conditioned future-observation tests—a minimal, decision-relevant notion of a predictive world model.

However, we may ask what further assumptions we need to recover the predictive state, in an analogous manner to the fully observed case of Theorem [1], assuming average regret and stochastic policies.

First, we show that recovery is not possible in our current setup with single bets (even under optimal policies), showing that under our assumptions, Theorem [2] is maximally strong:

Proposition 1 (No generic predictive-state recovery from fair bets).

Even exact optimal query access to the fair betting goals 

$$
g_{T}
$$

 does not, in general, identify the predictive state 

$$
\eta_{\mathcal{T}}(h)
$$

.
Indeed, there exist finite POMDPs 

$$
E_{p},E_{q}
$$

 with 

$$
|\mathcal{X}|=4
$$

, a history 

$$
h
$$

 with the same last observation in both environments, and parameters 

$$
p\neq q
$$

 in 

$$
(\tfrac{1}{2},1)
$$

 such that for every test 

$$
T
$$

 the unique optimal bet for 

$$
g_{T}
$$

 at 

$$
h
$$

 is the same in 

$$
E_{p}
$$

 and 

$$
E_{q}
$$

, while 

$$
p_{T}^{E_{p}}(h)\neq p_{T}^{E_{q}}(h)
$$

 for some test 

$$
T
$$

.
Consequently, from the family of fair betting decisions alone one cannot, in general, recover the predictive state, and hence not a PSR.

This finite-POMDP separation non-vacuously motivates Theorem [3]: identical fair-bet behavior can hide different predictive states, while threshold queries recover their magnitudes.

Next, we show that if we extend the tests to ask the *same* test across *multiple* thresholds, predictive state recovery is possible, as the agent’s response curve across thresholds reveals the actual magnitude of 

$$
p_{T}(h)
$$

, and average regret then forces those probabilities to be recoverable:

#### Threshold-bet setup.

For a test 

$$
T=(\alpha,W)
$$

 and threshold 

$$
\lambda\in[0,1]
$$

,
let 

$$
g_{T,\lambda}
$$

 be the bet comparing the test success
probability 

$$
p_{T}(h)
$$

 against an independent lottery of success
probability 

$$
\lambda
$$

. Write

$$
\displaystyle q_{T,\lambda}(h)
$$

$$
\displaystyle:=\pi(L\mid h,g_{T,\lambda}),
$$

$$
\displaystyle V^{\pi}(h;g_{T,\lambda})
$$

$$
\displaystyle:=q_{T,\lambda}(h)p_{T}(h)+(1-q_{T,\lambda}(h))\lambda,
$$

$$
\displaystyle V^{\star}(h;g_{T,\lambda})
$$

$$
\displaystyle:=\max\{p_{T}(h),\lambda\},
$$

$$
\displaystyle\delta_{T,\lambda}(\pi;h)
$$

$$
\displaystyle:=1-\frac{V^{\pi}(h;g_{T,\lambda})}{V^{\star}(h;g_{T,\lambda})}.
$$

For 

$$
K\geq 1
$$

, let 

$$
\lambda_{k}=(k-\frac{1}{2})/K
$$

 and define

$$
\hat{p}_{T}(h):=\frac{1}{K}\sum_{k=1}^{K}q_{T,\lambda_{k}}(h),\qquad\varepsilon_{K}:=2\bar{\delta}_{K}+\frac{1}{4K^{2}}.
$$

(19)

Theorem 3 (Predictive-state recovery from threshold bets).

Fix 

$$
\ell\geq 1
$$

 and suppose 

$$
D
$$

 is supported on tests 

$$
T=(\alpha,W)
$$

 with 

$$
|\alpha|\leq\ell
$$

. Under the threshold-bet setup, assume

$$
\mathbb{E}_{h\sim\mathcal{H}}\,\mathbb{E}_{T\sim D}\left[\frac{1}{K}\sum_{k=1}^{K}\delta_{T,\lambda_{k}}(\pi;h)\right]\leq\bar{\delta}_{K}.
$$

(20)

Then

$$
\mathbb{E}_{h\sim\mathcal{H}}\,\mathbb{E}_{T\sim D}\Big[\big(\hat{p}_{T}(h)-p_{T}(h)\big)^{2}\Big]\leq\varepsilon_{K}.
$$

(21)

In particular, if 

$$
D
$$

 is uniform over a finite family 

$$
\mathcal{T}_{\ell}=\{T_{1},\dots,T_{d}\}
$$

 of tests of depth at most 

$$
\ell
$$

, and

$$
\hat{\eta}_{\mathcal{T}_{\ell}}(h):=\big(\hat{p}_{T_{1}}(h),\dots,\hat{p}_{T_{d}}(h)\big),
$$

then

$$
\mathbb{E}_{h\sim\mathcal{H}}\left[\frac{1}{d}\big\|\hat{\eta}_{\mathcal{T}_{\ell}}(h)-\eta_{\mathcal{T}_{\ell}}(h)\big\|_{2}^{2}\right]\leq\varepsilon_{K}.
$$

(22)

Observe that for 

$$
K=1
$$

 we recover the counterexample in Proposition [1] where even for 

$$
\bar{\delta}_{K}=0
$$

 we get a recovery bound of 

$$
1/4
$$

, thereby only giving us information about the *sign* of 

$$
p_{T}(h)
$$

 rather than its underlying value.

The advantage of Theorem [3] is its generality as a recovery method under partial observability, which can be *repeatedly* applied to any history-test pair 

$$
(h,T)
$$

, without making any additional assumptions about how the environment dynamics evolve.
This makes it an appealing approach in practice to potentially apply to frontier agents in *open-ended* real-world settings.
However, it may still be of independent theoretical interest to study under what additional constraints one could recover the explicit compact predictive dynamics operator (the PSR operator) rather than the predictive coordinates 

$$
p_{T}(h)
$$

 on each tested family, which one has to run per test.
Specifically, we show in Theorem [4] that an average-regret recovery is possible under linear finite-dimensional PSR operators, which in practice can hold in restricted, resettable, finite-workflow deployments:

#### Linear-PSR operator setup.

Let 

$$
\mathcal{T}=\{T_{1},\dots,T_{d}\}
$$

 be a finite core test set. For 

$$
\sigma=(a,o)\in\mathcal{A}\times\mathcal{O}
$$

 and 

$$
T=(\alpha,W)
$$

, write

$$
\sigma\circ T:=((a,\alpha),\{o\}\times W).
$$

Define

$$
\begin{split}&s(h):=(p_{T_{1}}(h),\dots,p_{T_{d}}(h)),\\
&s_{\sigma}(h):=(p_{\sigma\circ T_{1}}(h),\dots,p_{\sigma\circ T_{d}}(h)).\end{split}
$$

Assume linear PSR dynamics: for each 

$$
\sigma
$$

 there is 

$$
B_{\sigma}\in\mathbb{R}^{d\times d}
$$

 such that

$$
s_{\sigma}(h)=B_{\sigma}s(h)\qquad\text{for all histories }h.
$$

(23)

Choose histories 

$$
h^{1},\dots,h^{d}
$$

 such that 

$$
S:=[s(h^{1})\ \cdots\ s(h^{d})]
$$

 is invertible, and set

$$
Y_{\sigma}:=[s_{\sigma}(h^{1})\ \cdots\ s_{\sigma}(h^{d})]=B_{\sigma}S.
$$

Using the threshold estimator in Eq. ([19]), define 

$$
\hat{s},\hat{s}_{\sigma},\hat{S},\hat{Y}_{\sigma}
$$

 analogously.

Theorem 4 (Linear-PSR operator recovery from threshold bets).

Assume the linear-PSR operator setup and the threshold-bet average-regret bound of Theorem [3] for all tests in

$$
\mathcal{T}\cup\{\sigma\circ T_{i}:\sigma\in\mathcal{A}\times\mathcal{O},\ i=1,\dots,d\}.
$$

Then

$$
\|\hat{S}-S\|_{F}^{2}+\sum_{\sigma\in\mathcal{A}\times\mathcal{O}}\|\hat{Y}_{\sigma}-Y_{\sigma}\|_{F}^{2}\leq d^{2}(1+|\mathcal{A}||\mathcal{O}|)\varepsilon_{K}.
$$

(24)

If additionally

$$
d\sqrt{(1+|\mathcal{A}||\mathcal{O}|)\varepsilon_{K}}\leq\frac{1}{2\|S^{-1}\|_{2}},
$$

(25)

then 

$$
\hat{S}
$$

 is invertible and, for 

$$
\hat{B}_{\sigma}:=\hat{Y}_{\sigma}\hat{S}^{-1}
$$

,

$$
\sum_{\sigma}\|\hat{B}_{\sigma}-B_{\sigma}\|_{F}^{2}\leq C(S,Y)\varepsilon_{K},
$$

(26)

where

$$
C(S,Y):=8d^{2}(1+|\mathcal{A}||\mathcal{O}|)\left(\|S^{-1}\|_{2}^{2}+\|S^{-1}\|_{2}^{4}\sum_{\sigma}\|Y_{\sigma}\|_{2}^{2}\right).
$$

Thus, vanishing average threshold-regret recovers the linear-PSR operators 

$$
(B_{\sigma})_{\sigma\in\mathcal{A}\times\mathcal{O}}
$$

.

### 5.3 Memory necessity

#### No-aliasing setup.

Let 

$$
M=f(h)
$$

 be any candidate memory statistic, as in Eq. ([16]), and let 

$$
\mathcal{P}
$$

 be a distribution over paired histories 

$$
(h,h^{\prime})
$$

 with the same last observation. Define

$$
\mathsf{Alias}_{M}:=\{(h,h^{\prime}):M(h)=M(h^{\prime})\}.
$$

For 

$$
\gamma\in(0,\tfrac{1}{2})
$$

 and test distribution 

$$
D
$$

, assume measurable witness sets 

$$
S_{\gamma}(h,h^{\prime})
$$

 such that, whenever 

$$
T\in S_{\gamma}(h,h^{\prime})
$$

,

$$
p_{T}(h)\geq\frac{1}{2}+\gamma,\qquad p_{T}(h^{\prime})\leq\frac{1}{2}-\gamma.
$$

Define the witnessed aliasing mass and pair-regret

$$
q^{\mathsf{Alias}}_{\gamma}(M):=\Pr_{(h,h^{\prime})\sim\mathcal{P},T\sim D}\big((h,h^{\prime})\in\mathsf{Alias}_{M},T\in S_{\gamma}(h,h^{\prime})\big)
$$

$$
\bar{\delta}_{\mathcal{P}}(\pi):=\mathbb{E}_{(h,h^{\prime})\sim\mathcal{P}}\frac{1}{2}\left(\mathbb{E}_{T\sim D}[\delta_{T}(\pi;h)]+\mathbb{E}_{T\sim D}[\delta_{T}(\pi;h^{\prime})]\right).
$$

All subsequent recoding statements are on the support of 

$$
\mathcal{P}
$$

, not globally over all histories.

Theorem 5 (Memory necessity).

Under the no-aliasing setup, any 

$$
M
$$

-based policy 

$$
\pi
$$

 satisfies

$$
\bar{\delta}_{\mathcal{P}}(\pi)\geq q^{\mathsf{Alias}}_{\gamma}(M)\frac{c(\gamma)}{2}.
$$

(27)

Consequently, if 

$$
\bar{\delta}_{\mathcal{P}}(\pi)

In other words, if a policy treats two histories the same while the correct bet differs with high confidence, then it must make errors on at least one of them.
Therefore, low regret rules out memory states that collapse histories needing different confident predictions.

## 6 Structured task families: modularity, tradeoffs, and representational match

So far for world modeling and memory necessity, we have not introduced major assumptions to the task families we expect the agent to be competent at.
But it turns out that for average-case competence under different task families, we get interesting properties that have to do with the necessity of modularity, tracking internal drives, and inner representational match between agents.
These can be derived very cleanly as corollaries of our previous Theorems [2] and [5], leveraging the same underlying machinery of average-case betting and PSR.
Throughout, we work in the POMDP betting setup of §[5], with 

$$
\gamma\in(0,\tfrac{1}{2})
$$

.

#### Convention (vanishing regret).

In what follows, the convention 

$$
\bar{\delta}_{\mathcal{P}}\to 0
$$

 means there exists a *sequence* of admissible policies 

$$
(\pi_{k})
$$

 under 

$$
(\mathcal{P},D)
$$

 with 

$$
\bar{\delta}_{\mathcal{P}}(\pi_{k})\to 0
$$

; equivalently, for every 

$$
\varepsilon>0
$$

 there exists admissible 

$$
\pi
$$

 with 

$$
\bar{\delta}_{\mathcal{P}}(\pi)\leq\varepsilon
$$

.

Corollary 3 (Informational modularity from block-structured tests).

Assume 

$$
\supp(D)=\bigsqcup_{i=1}^{K}\mathcal{T}_{i}
$$

, with

$$
p_{i}:=D(\mathcal{T}_{i})>0
$$

 and 

$$
D_{i}:=D(\cdot\mid T\in\mathcal{T}_{i})
$$

.
For each block 

$$
i
$$

, suppose the no-aliasing setup holds with test
distribution 

$$
D_{i}
$$

 and witness sets

$$
S_{\gamma,i}(h,h^{\prime})\subseteq\mathcal{T}_{i}
$$

. Let

$$
q^{\mathsf{Alias}}_{\gamma,i}(M)
$$

 denote the corresponding witnessed
aliasing mass, and let 

$$
\bar{\delta}_{\mathcal{P}}(\pi)
$$

 denote pair-regret
under the original mixture 

$$
D
$$

. If 

$$
\pi
$$

 is 

$$
M
$$

-based, then

$$
q^{\mathsf{Alias}}_{\gamma,i}(M)\leq\frac{2\,\bar{\delta}_{\mathcal{P}}(\pi)}{p_{i}\,c(\gamma)}\qquad\text{for every }i.
$$

Thus, as 

$$
\bar{\delta}_{\mathcal{P}}(\pi)\to 0
$$

, aliasing of 

$$
\gamma
$$

-separable pairs vanishes within every block.

Corollary 4 (Tradeoff/regime tracking from shifting mixtures).

Let the evaluation draw a latent regime 

$$
I\sim\Lambda
$$

 and then 

$$
T\sim D_{I}
$$

, so that the marginal test distribution is 

$$
D=\sum_{i}\Lambda(i)D_{i}
$$

; the supports of the 

$$
D_{i}
$$

 need not be disjoint. Let 

$$
\mathcal{P}
$$

 be a paired-history distribution with regime labels 

$$
I(h)
$$

 and assume the no-aliasing setup holds for 

$$
D
$$

 with witnesses 

$$
S_{\gamma}(h,h^{\prime})
$$

 satisfying

$$
T\in S_{\gamma}(h,h^{\prime})\implies I(h)\neq I(h^{\prime}).
$$

Then any 

$$
M
$$

-based policy 

$$
\pi
$$

 satisfies

$$
\displaystyle\Pr_{(h,h^{\prime})\sim\mathcal{P},\ T\sim D}\!\left(M(h)=M(h^{\prime}),\ I(h)\neq I(h^{\prime}),T\in S_{\gamma}(h,h^{\prime})\right)
$$

$$
\displaystyle\leq\frac{2\,\bar{\delta}_{\mathcal{P}}(\pi)}{c(\gamma)}.
$$

Thus, as 

$$
\bar{\delta}_{\mathcal{P}}(\pi)\to 0
$$

, memory cannot be insensitive to regime changes that flip a 

$$
\gamma
$$

-margin optimal bet for the same queried test.

Thus, if two regimes can occur under the same last observation and they induce opposite 

$$
\gamma
$$

-margin optimal bets for the *same* queried test on nontrivial mass, then low pair-regret on the *same* distribution forces 

$$
M(h)
$$

 to distinguish the regime whenever it matters.
More generally, Corollary [4] implies that competence under mixtures of task distributions provides a normative pressure for maintaining persistent, internal variables that track latent evaluative conditions; in embodied settings, such variables can be viewed as analogous to affective or homeostatic modulators studied in affective neuroscience that globally influence policy, attention, and learning across tasks [[18], [2]].
Importantly, this is a structural claim about functional organization—global, task-general modulation of behavior under uncertainty—rather than a commitment to any particular theory of emotion or phenomenology.

Corollary 5 (Representational convergence under 

$$
\gamma
$$

-minimality, up to invertible recoding).

Fix 

$$
D
$$

 and 

$$
\gamma\in(0,1/2)
$$

. Define the 

$$
\gamma
$$

-coarsened decision profile 

$$
\ell_{D}^{\gamma}(h):=\big(\ell_{T}^{\gamma}(h)\big)_{T\in\supp(D)}
$$

, where:

$$
\ell_{T}^{\gamma}(h):=\begin{cases}L,&p_{T}(h)\geq\tfrac{1}{2}+\gamma,\\
R,&p_{T}(h)\leq\tfrac{1}{2}-\gamma,\\
\bot,&\text{otherwise}.\end{cases}
$$

Let 

$$
M_{1}=f_{1}(h)
$$

 and 

$$
M_{2}=f_{2}(h)
$$

 be two memory representations with 

$$
M_{j}
$$

-based policies 

$$
\pi_{j}
$$

. Assume, for 

$$
j=1,2
$$

, that 

$$
\bar{\delta}_{\mathcal{P}}(\pi_{j})\to 0
$$

, that 

$$
M_{j}
$$

 is 

$$
\gamma
$$

-minimal,

$$
\ell_{D}^{\gamma}(h)=\ell_{D}^{\gamma}(h^{\prime})\implies M_{j}(h)=M_{j}(h^{\prime}),
$$

and that the witnesses are 

$$
\gamma
$$

-complete: for 

$$
\mathcal{P}
$$

-a.e. pair,

$$
\ell_{D}^{\gamma}(h)\neq\ell_{D}^{\gamma}(h^{\prime})\implies D(S_{\gamma}(h,h^{\prime}))>0.
$$

Then, on the support of 

$$
\mathcal{P}
$$

, each 

$$
M_{j}
$$

 induces exactly the partition given by 

$$
\ell_{D}^{\gamma}
$$

. Hence 

$$
M_{1}
$$

 and 

$$
M_{2}
$$

 agree up to invertible recoding: there exist measurable maps 

$$
\varphi,\psi
$$

 such that almost surely

$$
M_{1}=\varphi(M_{2}),\qquad M_{2}=\psi(M_{1}).
$$

Therefore, under the *same* evaluation family, low pair-regret forces any *sufficient* memory representation to preserve exactly the 

$$
\gamma
$$

-margin decision-relevant distinctions between histories; if two agents are also 

$$
\gamma
$$

-minimal (no extra splitting beyond those distinctions), then their internal memory states must agree up to a relabeling (invertible recoding) on the evaluation support.

## 7 Discussion

This work develops quantitative “selection theorems” [[55]]: representation-theoretic conclusions derived from performance guarantees. Across fully observed and partially observed settings, we showed that low average-case regret on structured families of action-conditioned prediction tasks *selects for* the predictive internal structure tested by the evaluation family. This yields recovery of the interventional kernel, predictive-state recovery and no-aliasing under partial observability, and further constraints from structured task families: informational modularity, regime-tracking state, and representational convergence up to invertible recoding.

Necessity is task-relative: different diagnostics select different structure. To our knowledge, these are the first quantitative selection theorems linking average-case regret over structured task families to necessary predictive-state and memory structure under partial observability. Unlike classical sufficiency results for belief representations [[50], [31]], our results show that regret-bounded competence alone—without worst-case optimality or determinism—imposes concrete internal constraints. The unifying perspective is that robust competence under uncertainty compresses admissible representations: when the evaluation distribution places mass on large-margin predictive distinctions, aliasing those distinctions incurs constant regret. Thus, predictive state, memory, modular decomposition, and regime-tracking variables are not merely architectural assumptions but *consequences* of task demands.

These results resonate with empirical trends in representation learning and NeuroAI. Increasingly general task demands correlate with increasingly aligned representations across architectures and modalities, including alignment between artificial and biological systems in visual [[58]], auditory [[34]], motor [[51]], memory [[39]], world-modeling [[40]], and language [[46]] brain areas, as well as between *autonomous agents* and *whole-brain data* in larval zebrafish [[35]]. The Contravariance Principle in NeuroAI [[13]] and the Platonic Representation Hypothesis in AI [[30]] both hypothesize that general learning pressures drive convergence toward a shared statistical model of reality. Our results provide a complementary formal lens: convergence can arise from *shared* competence constraints and, under minimality, be reversibly mapped across agents as in Corollary [5].

As AI systems become increasingly capable, our results suggest that organizational regularities should emerge across architectures: belief-like predictive state, modular specialization, persistent internal state, affective-like regime tracking [[18], [2]], and unified predictive representations. These regularities mirror cognitive-architecture themes such as global broadcast and modular processing [[1], [11]], and are relevant to increasingly agentic AI systems [[38]]; not as metaphysical commitments, but as *inevitable* structural consequences of task competence. More empirical evidence is needed for consciousness theories [[16]], so we make no such claims here: subjective experience may depend on *how* these components combine, though behavioral similarity across different brains [[19]] makes this less likely. Selection theorems thus formally explain how capability constrains internal organization.

Acknowledgements.
We thank Lenore Blum, Manuel Blum, Dylan Hadfield-Menell, and Daniel Yamins for helpful discussions, as well as Santiago Cifuentes, Leo Kozachkov, Reece Keller, Noushin Quazi, and the anonymous reviewers for helpful feedback on a draft of this manuscript.
We acknowledge the Burroughs Wellcome Fund (CASI award), Foresight Institute, and Protocol Labs for funding.

## References

- Baars (1997)
B. J. Baars

In the theater of consciousness: the workspace of the mind.

 Oxford University Press, USA.

Cited by: [§7].

- Barrett (2017)
L. F. Barrett

The theory of constructed emotion: an active inference account of interoception and categorization.

Social cognitive and affective neuroscience 12 (1), pp. 1–23.

Cited by: [§6],
[§7].

- Bartlett et al. (2006)
P. L. Bartlett, M. I. Jordan, and J. D. McAuliffe

Convexity, classification, and risk bounds.

Journal of the American Statistical Association 101 (473), pp. 138–156.

Cited by: [§2].

- Bennett (2023a)
M. T. Bennett

Emergent causality and the foundation of consciousness.

In International Conference on Artificial General Intelligence,

pp. 52–61.

Cited by: [§2].

- Bennett (2023b)
M. T. Bennett

The optimal choice of hypothesis is the weakest, not the shortest.

In International Conference on Artificial General Intelligence,

pp. 42–51.

Cited by: [§2].

- Bennett (2024)
M. T. Bennett

Is complexity an illusion?.

In International Conference on Artificial General Intelligence,

pp. 11–21.

Cited by: [§2].

- Bennett (2025a)
M. T. Bennett

A formal theory of optimal learning with experimental results.

In Proceedings of the Thirty-fourth International Joint Conference on Artificial Intelligence,

Cited by: [§2].

- Bennett (2025b)
M. T. Bennett

How to build conscious machines.

Ph.D. Thesis, The Australian National University (Australia).

Cited by: [§2].

- Bennett (2026)
M. T. Bennett

Regret is weighted forgetting.

Cited by: [§2].

- Blackwell (1956)
D. Blackwell

An analog of the minimax theorem for vector payoffs..

Cited by: [§1].

- Blum and Blum (2024)
L. Blum and M. Blum

AI consciousness is inevitable: a theoretical computer science perspective.

arXiv preprint arXiv:2403.17101.

Cited by: [§7].

- Boots et al. (2011)
B. Boots, S. M. Siddiqi, and G. J. Gordon

Closing the learning-planning loop with predictive state representations.

The International Journal of Robotics Research 30 (8), pp. 954–966.

Cited by: [§2].

- Cao and Yamins (2024)
R. Cao and D. Yamins

Explanatory models in neuroscience, part 2: functional intelligibility and the contravariance principle.

Cognitive Systems Research 85, pp. 101200.

Cited by: [§7].

- Cifuentes (2026)
S. Cifuentes

General agents contain world models even under partial observability and stochasticity.

arXiv preprint arXiv:2602.03146.

Cited by: [§1].

- Conant and Ross Ashby (1970)
R. C. Conant and W. Ross Ashby

Every good regulator of a system must be a model of that system.

International journal of systems science 1 (2), pp. 89–97.

Cited by: [§1],
[§4],
[§5.1].

- Consortium et al. (2025)
C. Consortium, O. Ferrante, U. Gorska-Klimowska, S. Henin, R. Hirschhorn, A. Khalaf, A. Lepauvre, L. Liu, D. Richter, Y. Vidal, et al.

Adversarial testing of global neuronal workspace and integrated information theories of consciousness.

Nature, pp. 1–10.

Cited by: [§7].

- Dempster (2008)
A. P. Dempster

Upper and lower probabilities induced by a multivalued mapping.

In Classic works of the Dempster-Shafer theory of belief functions,

pp. 57–72.

Cited by: [§2].

- Ekman (1992)
P. Ekman

An argument for basic emotions.

Cognition & emotion 6 (3-4), pp. 169–200.

Cited by: [§6],
[§7].

- Feather* et al. (2025)
J. Feather*, M. Khosla*, N. Murty*, and A. Nayebi*

Brain-model evaluations need the neuroai turing test.

arXiv preprint arXiv:2502.16238.

Cited by: [§7].

- Foster and Vohra (1997)
D. P. Foster and R. V. Vohra

Calibrated learning and correlated equilibrium.

Games and Economic Behavior 21 (589), pp. 40–55.

Cited by: [§1].

- Francis and Wonham (1976)
B. A. Francis and W. M. Wonham

The internal model principle of control theory.

Automatica 12 (5), pp. 457–465.

Cited by: [§1].

- Gneiting and Raftery (2007)
T. Gneiting and A. E. Raftery

Strictly proper scoring rules, prediction, and estimation.

Journal of the American Statistical Association 102 (477), pp. 359–378.

Cited by: [§2].

- Hafner et al. (2019)
D. Hafner, T. Lillicrap, J. Ba, and M. Norouzi

Dream to control: learning behaviors by latent imagination.

arXiv preprint arXiv:1912.01603.

Cited by: [§1].

- Hafner et al. (2020)
D. Hafner, T. Lillicrap, M. Norouzi, and J. Ba

Mastering atari with discrete world models.

arXiv preprint arXiv:2010.02193.

Cited by: [§1].

- Hafner et al. (2023)
D. Hafner, J. Pasukonis, J. Ba, and T. Lillicrap

Mastering diverse domains through world models.

arXiv preprint arXiv:2301.04104.

Cited by: [§1].

- Hafner et al. (2025)
D. Hafner, W. Yan, and T. Lillicrap

Training agents inside of scalable world models.

arXiv preprint arXiv:2509.24527.

Cited by: [§1].

- Hansen et al. (2023)
N. Hansen, H. Su, and X. Wang

Td-mpc2: scalable, robust world models for continuous control.

arXiv preprint arXiv:2310.16828.

Cited by: [§1].

- Harwood et al. (2026)
A. Harwood, J. Faustino, and A. Altair

Information-theoretic analysis of world models in optimal reward maximizers.

arXiv preprint arXiv:2602.12963.

Cited by: [§1].

- Herrmann et al. (2026)
D. A. Herrmann, A. Mohseni, B. A. Levinstein, and B. Rushing

A bayesian reduction of causation.

Note: Manuscript, forthcoming

Cited by: [§2].

- Huh et al. (2024)
M. Huh, B. Cheung, T. Wang, and P. Isola

The platonic representation hypothesis.

arXiv preprint arXiv:2405.07987.

Cited by: [§7].

- Kaelbling et al. (1998)
L. P. Kaelbling, M. L. Littman, and A. R. Cassandra

Planning and acting in partially observable stochastic domains.

Artificial Intelligence 101 (1–2), pp. 99–134.

Cited by: [§1],
[§2],
[§5.1],
[§7].

- Kárnỳ and Kroupa (2012)
M. Kárnỳ and T. Kroupa

Axiomatisation of fully probabilistic design.

Information Sciences 186 (1), pp. 105–113.

Cited by: [§1].

- Kárnỳ (2020)
M. Kárnỳ

Axiomatisation of fully probabilistic design revisited.

Systems & Control Letters 141, pp. 104719.

Cited by: [§1].

- Kell* et al. (2018)
A. J. Kell*, D. L. Yamins*, E. N. Shook, S. V. Norman-Haignere, and J. H. McDermott

A task-optimized neural network replicates human auditory behavior, predicts brain responses, and reveals a cortical processing hierarchy.

Neuron 98 (3), pp. 630–644.

Cited by: [§7].

- Keller et al. (2025)
R. Keller, A. Kirsch, F. Pei, X. Pitkow, L. Kozachkov, and A. Nayebi

Intrinsic goals for autonomous agents: model-based exploration in virtual zebrafish predicts ethological behavior and whole-brain dynamics.

In The Thirty-ninth Annual Conference on Neural Information Processing Systems,

Cited by: [§7].

- Khetarpal et al. (2026)
K. Khetarpal, G. Comanici, J. Richens, J. Shar, F. Xia, L. Orseau, A. Faust, and D. Precup

Affordances enable partial world modeling with llms.

arXiv preprint arXiv:2602.10390.

Cited by: [§1].

- Littman et al. (2001)
M. L. Littman, R. S. Sutton, and S. P. Singh

Predictive representations of state.

In Advances in Neural Information Processing Systems,

Vol. 14.

Cited by: [§2].

- Long et al. (2024)
R. Long, J. Sebo, P. Butlin, K. Finlinson, K. Fish, J. Harding, J. Pfau, T. Sims, J. Birch, and D. Chalmers

Taking ai welfare seriously.

arXiv preprint arXiv:2411.00986.

Cited by: [§7].

- Nayebi et al. (2021)
A. Nayebi, A. Attinger, M. Campbell, K. Hardcastle, I. Low, C. Mallory, G. Mel, B. Sorscher, A. Williams, S. Ganguli, L. M. Giocomo, and D. L. Yamins

Explaining heterogeneity in medial entorhinal cortex with task-driven neural networks.

Advances in Neural Information Processing Systems 34.

Cited by: [§7].

- Nayebi et al. (2023)
A. Nayebi, R. Rajalingham, M. Jazayeri, and G. R. Yang

Neural foundations of mental simulation: future prediction of latent representations on dynamic scenes.

Advances in Neural Information Processing Systems 36.

Cited by: [§7].

- Pearl (2009)
J. Pearl

Causality.

 Cambridge university press.

Cited by: [§1],
[§4],
[§4],
[§4],
[Corollary 1].

- Richens et al. (2025)
J. Richens, D. Abel, A. Bellot, and T. Everitt

General agents contain world models.

In Proceedings of the 42nd International Conference on Machine Learning (ICML),

Proceedings of Machine Learning Research, Vol. 267.

Note: Also available as arXiv:2506.01622

External Links: 2506.01622

Cited by: [Appendix B],
[§1],
[§1],
[§2],
[§5],
[Remark 1].

- Richens and Everitt (2024)
J. Richens and T. Everitt

Robust agents learn causal world models.

arXiv preprint arXiv:2402.10877.

Cited by: [§1],
[§2],
[§4].

- Savage (1971)
L. J. Savage

Elicitation of personal probabilities and expectations.

Journal of the American Statistical Association 66 (336), pp. 783–801.

Cited by: [§2].

- Savage (1954)
L. J. Savage

The foundations of statistics.

 Courier Corporation.

Cited by: [§1].

- Schrimpf et al. (2021)
M. Schrimpf, I. A. Blank, G. Tuckute, C. Kauf, E. A. Hosseini, N. Kanwisher, J. B. Tenenbaum, and E. Fedorenko

The neural architecture of language: integrative modeling converges on predictive processing.

Proceedings of the National Academy of Sciences 118 (45), pp. e2105646118.

Cited by: [§7].

- Schulman et al. (2017)
J. Schulman, F. Wolski, P. Dhariwal, A. Radford, and O. Klimov

Proximal policy optimization algorithms.

arXiv preprint arXiv:1707.06347.

Cited by: [§1].

- Shafer and Vovk (2005)
G. Shafer and V. Vovk

Probability and finance: it’s only a game!.

Vol. 491,  John Wiley & Sons.

Cited by: [§2].

- Singh et al. (2004)
S. Singh, M. R. James, and M. R. Rudary

Predictive state representations: a new theory for modeling dynamical systems.

In Proceedings of the 20th Conference on Uncertainty in Artificial Intelligence (UAI),

Cited by: [§2].

- Sondik (1971)
E. J. Sondik

The optimal control of partially observable markov processes.

Ph.D. Thesis, Stanford University.

Cited by: [§1],
[§2],
[§7].

- Sussillo et al. (2015)
D. Sussillo, M. M. Churchland, M. T. Kaufman, and K. V. Shenoy

A neural network that finds a naturalistic solution for the production of muscle activity.

Nature Neuroscience 18 (7), pp. 1025–1033.

External Links: [Document](https://dx.doi.org/10.1038/nn.4042)

Cited by: [§7].

- Sutton et al. (1998)
R. S. Sutton A. G. Barto et al.

Reinforcement learning: an introduction.

Vol. 1,  MIT press Cambridge.

Cited by: [§1].

- Von Neumann and Morgenstern (1947)
J. Von Neumann and O. Morgenstern

Theory of games and economic behavior, 2nd rev.

Cited by: [§1].

- Wang et al. (2024)
S. Wang, S. Liu, W. Ye, J. You, and Y. Gao

Efficientzero v2: mastering discrete and continuous control with limited data.

arXiv preprint arXiv:2403.00564.

Cited by: [§1].

- Wentworth (2021)
J. WentworthSelection theorems: a program for understanding agents(Website)

Note: LessWrong / AI Alignment Forum (online post)

External Links: [Link](https://www.lesswrong.com/posts/G2Lne2Fi7Qra5Lbuf/selection-theorems-a-program-for-understanding-agents)

Cited by: [§1],
[§7].

- Williams (1992)
R. J. Williams

Simple statistical gradient-following algorithms for connectionist reinforcement learning.

Machine learning 8 (3), pp. 229–256.

Cited by: [§1].

- Witten (1977)
I. H. Witten

An adaptive optimal controller for discrete-time markov environments.

Information and control 34 (4), pp. 286–295.

Cited by: [§1].

- Yamins et al. (2014)
D. L. Yamins, H. Hong, C. F. Cadieu, E. A. Solomon, D. Seibert, and J. J. DiCarlo

Performance-optimized hierarchical models predict neural responses in higher visual cortex.

Proceedings of the National Academy of Sciences 111 (23), pp. 8619–8624.

External Links: [Document](https://dx.doi.org/10.1073/pnas.1403112111)

Cited by: [§7].

What Capable Agents Must Know: Selection Theorems for Robust Decision-Making under Uncertainty

(Supplementary Material)

## Appendix A Proof of Lemma [1]

Proof.

Observe that the success probability defined in ([1]) can be rewritten as

$$
V=u_{R}+q(u_{L}-u_{R}),
$$

which is linear in 

$$
q
$$

.
Thus, the optimal success probability is achieved at the endpoints, 

$$
V^{\star}:=\max_{q\in[0,1]}V=\max\{V(0),V(1)\}=\max\{u_{L},u_{R}\}
$$

.

Assume wlog 

$$
u_{L}\geq u_{R}
$$

.
Then 

$$
V^{\star}=u_{L}
$$

, 

$$
w=1-q
$$

, and 

$$
V=(1-w)\,u_{L}+w\,u_{R}=u_{L}-w\,(u_{L}-u_{R})
$$

.
Therefore,

$$
\delta=1-\frac{u_{L}-w\,(u_{L}-u_{R})}{u_{L}}=w\frac{u_{L}-u_{R}}{u_{L}}.
$$

The other case is symmetric.

In the special case that 

$$
u_{R}=1-u_{L}
$$

, then we have that

$$
V^{\star}=\max\{u_{L},u_{R}\}=\max\{u_{L},1-u_{L}\}=\tfrac{1}{2}+m.
$$

Indeed, since 

$$
m:=\big|u_{L}-\tfrac{1}{2}\big|
$$

, we can write 

$$
u_{L}=\tfrac{1}{2}+m
$$

 or 

$$
u_{L}=\tfrac{1}{2}-m
$$

.
In the first case, 

$$
1-u_{L}=\tfrac{1}{2}-m
$$

, and in the second case 

$$
1-u_{L}=\tfrac{1}{2}+m
$$

.
In either case, since 

$$
m\geq 0
$$

,

$$
\max\{u_{L},1-u_{L}\}=\tfrac{1}{2}+m.
$$

Moreover, in both cases,

$$
|u_{L}-u_{R}|=|u_{L}-(1-u_{L})|=|2u_{L}-1|=2m.
$$

Substituting these expressions into ([5]), yields

$$
\delta=w\cdot\frac{|u_{L}-u_{R}|}{V^{\star}}=w\cdot\frac{2m}{\tfrac{1}{2}+m}=w\cdot\frac{4m}{1+2m},
$$

(28)

which proves the stated identity.

Now suppose that 

$$
m\geq\gamma>0
$$

. Since the function

$$
f(m):=\frac{4m}{1+2m}
$$

is increasing for 

$$
m\geq 0
$$

, since 

$$
f^{\prime}(m)=4/(1+2m)^{2}>0
$$

, then we have

$$
\frac{4m}{1+2m}\geq\frac{4\gamma}{1+2\gamma}=:c(\gamma).
$$

(29)

Combining ([29]) with ([28]) gives

$$
\delta\geq w\,c(\gamma),
$$

and hence gives us ([7]).
∎

## Appendix B Proof of Theorem [1]

Proof.

Fix a quadruple 

$$
(s,a,s^{\prime},k)
$$

 and let 

$$
X\sim\mathrm{Bin}(n,p)
$$

 with 

$$
p:=P_{ss^{\prime}}(a)
$$

, and define

$$
F(k):=\Pr[X\leq k].
$$

In what follows, we let 

$$
\widehat{P}_{ss^{\prime}}(a)
$$

 denote the *unclipped* quantity inside
([8]).
This is sufficient to upper bound

$$
|\widehat{P}_{ss^{\prime}}(a)-P_{ss^{\prime}}(a)|
$$

, since clipping onto 

$$
[0,1]
$$

 cannot increase distance to 

$$
P_{ss^{\prime}}(a)\in[0,1]
$$

.

1. Pointwise regret lower-bounds wrong-branch mass at margin 

$$
m_{k}
$$

.
By [42], the two disjuncts 

$$
G^{(n,1)}_{s,a,s^{\prime},k}
$$

 and 

$$
G^{(n,2)}_{s,a,s^{\prime},k}
$$

 of the composite goal 

$$
G^{(n)}_{s,a,s^{\prime},k}
$$

 have optimal satisfaction probabilities 

$$
F(k)
$$

 and 

$$
1-F(k)
$$

, respectively:

$$
\begin{split}&V^{\star}(s_{0};G^{(n,i)}_{s,a,s^{\prime},k}):=\max_{\pi^{\prime}}\Pr_{\pi^{\prime}}(G^{(n,i)}_{s,a,s^{\prime},k}\mid s_{0}),\qquad i\in\{1,2\},\\
&V^{\star}(s_{0};G^{(n,1)}_{s,a,s^{\prime},k})=F(k),\\
&V^{\star}(s_{0};G^{(n,2)}_{s,a,s^{\prime},k})=1-F(k).\end{split}
$$

(30)

Hence, by Lemma [1], the optimal satisfaction probability of the *overall* disjunction in ([4]) therefore is

$$
\begin{split}&V^{\star}(s_{0};G^{(n)}_{s,a,s^{\prime},k})=\max\{F(k),1-F(k)\}=\tfrac{1}{2}+m_{k}\\
&m_{k}:=\big|F(k)-\tfrac{1}{2}\big|,\\
\end{split}
$$

Let 

$$
w_{k}
$$

 denote the probability that 

$$
\pi
$$

 selects the *suboptimal* branch at threshold 

$$
k
$$

:

$$
w_{k}:=\begin{cases}1-q_{s,a,s^{\prime},k},&\text{if }V^{\star}(s_{0};G^{(n,1)}_{s,a,s^{\prime},k})\geq V^{\star}(s_{0};G^{(n,2)}_{s,a,s^{\prime},k}),\\
q_{s,a,s^{\prime},k},&\text{otherwise},\end{cases}
$$

and let 

$$
B_{k}
$$

 denote the event that 

$$
\pi
$$

 selects the disjunct with larger optimal satisfaction probability at threshold 

$$
k
$$

.
Then

$$
\Pr_{\pi}(B_{k})=1-w_{k}\quad\text{and}\quad\Pr_{\pi}(B_{k}^{c})=w_{k},
$$

since 

$$
w_{k}
$$

 is the probability that 

$$
\pi
$$

 selects the suboptimal disjunct.
By the law of total probability,

$$
\begin{split}&V^{\pi}(s_{0};G^{(n)}_{s,a,s^{\prime},k})\\
&=\Pr_{\pi}\!\big(G^{(n)}_{s,a,s^{\prime},k}\mid B_{k}\big)\Pr_{\pi}(B_{k})+\Pr_{\pi}\!\big(G^{(n)}_{s,a,s^{\prime},k}\mid B_{k}^{c}\big)\Pr_{\pi}(B_{k}^{c})\\
&=(1-w_{k})\,\Pr_{\pi}\!\big(G^{(n)}_{s,a,s^{\prime},k}\mid B_{k}\big)+w_{k}\,\Pr_{\pi}\!\big(G^{(n)}_{s,a,s^{\prime},k}\mid B_{k}^{c}\big).\end{split}
$$

Moreover, conditional on 

$$
B_{k}
$$

 (resp. 

$$
B_{k}^{c}
$$

), 

$$
\pi
$$

 selects the disjunct with larger (resp. smaller) optimal satisfaction probability, so the corresponding success probability under 

$$
\pi
$$

 is at most the optimal success probability of that selected disjunct.
Hence,

$$
\begin{split}&V^{\pi}(s_{0};G^{(n)}_{s,a,s^{\prime},k})\\
&\leq(1-w_{k})\,\max\!\Big\{V^{\star}(s_{0};G^{(n,1)}_{s,a,s^{\prime},k}),\,V^{\star}(s_{0};G^{(n,2)}_{s,a,s^{\prime},k})\Big\}\\
&\quad\;\;+w_{k}\,\min\!\Big\{V^{\star}(s_{0};G^{(n,1)}_{s,a,s^{\prime},k}),\,V^{\star}(s_{0};G^{(n,2)}_{s,a,s^{\prime},k})\Big\}\\
&=(1-w_{k})\bigl(\tfrac{1}{2}+m_{k}\bigr)+w_{k}\bigl(\tfrac{1}{2}-m_{k}\bigr).\end{split}
$$

Applying Lemma [1] with the identification

$$
\begin{split}&u_{L}=F(k),\qquad u_{R}=1-F(k),\\
&m=m_{k},\qquad w=w_{k},\end{split}
$$

we obtain

$$
\delta_{s,a,s^{\prime},k}(\pi;s_{0}):=1-\frac{V^{\pi}}{V^{\star}}\;\geq\;w_{k}\,\frac{4m_{k}}{1+2m_{k}}.
$$

In particular, on the event 

$$
\{m_{k}\geq\gamma\}
$$

,

$$
w_{k}\;\leq\;\frac{\delta_{s,a,s^{\prime},k}(\pi;s_{0})}{c(\gamma)}.
$$

(31)

2. Estimating the binomial median from the policy’s disjunct probabilities.
Let 

$$
k_{\mathrm{med}}
$$

 be the (lower) median index of 

$$
X
$$

, i.e.

$$
k_{\mathrm{med}}:=\min\{k:F(k)\geq\tfrac{1}{2}\}.
$$

By definition of 

$$
k_{\mathrm{med}}
$$

, the disjunct with larger optimal satisfaction probability is 

$$
G^{(n,2)}_{s,a,s^{\prime},k}
$$

 for 

$$
k

$$
\widehat{k}_{\mathrm{med}}\;:=\;\sum_{k=0}^{n}(1-q_{s,a,s^{\prime},k}),
$$

(32)

which is the expected number of thresholds at which the policy 

$$
\pi
$$

 selects the disjunct 

$$
G^{(n,2)}_{s,a,s^{\prime},k}
$$

, by definition of 

$$
q_{s,a,s^{\prime},k}
$$

.
If 

$$
\pi
$$

 were optimal on these binary choices, 

$$
(1-q_{s,a,s^{\prime},k})
$$

 would equal 

$$
\mathbf{1}\{k

In general,

$$
\begin{split}\big|\widehat{k}_{\mathrm{med}}-k_{\mathrm{med}}\big|&=\Big|\sum_{k=0}^{n}\Big((1-q_{s,a,s^{\prime},k})-\mathbf{1}\{k

Split 

$$
\{0,\dots,n\}
$$

 into 

$$
K_{\gamma}:=\{k:m_{k}<\gamma\}
$$

 and its complement 

$$
K_{\gamma}^{c}:=\{k:m_{k}\geq\gamma\}
$$

.
Using the trivial bound 

$$
w_{k}\leq 1
$$

 on 

$$
K_{\gamma}
$$

, where 

$$
m_{k}<\gamma
$$

 and the disjuncts become indistinguishable as 

$$
m_{k}\to 0
$$

, so regret cannot constrain the policy’s choice, and the regret-based bound ([31]) on 

$$
K_{\gamma}^{c}
$$

,

$$
\begin{split}\big|\widehat{k}_{\mathrm{med}}-k_{\mathrm{med}}\big|&\;\leq\;|K_{\gamma}|\;+\;\frac{1}{c(\gamma)}\sum_{k\notin K_{\gamma}}\delta_{s,a,s^{\prime},k}(\pi;s_{0})\\
&\;\leq\;|K_{\gamma}|\;+\;\frac{1}{c(\gamma)}\sum_{k=0}^{n}\delta_{s,a,s^{\prime},k}(\pi;s_{0}).\end{split}
$$

(33)

3. Controlling 

$$
|K_{\gamma}|
$$

.
Let 

$$
\mu:=\mathbb{E}[X]=np
$$

 and 

$$
\sigma^{2}:=\mathrm{Var}(X)=np(1-p)
$$

.
For any 

$$
t>0
$$

, if 

$$
k\geq\mu+t\sigma
$$

, then by the one-sided Chebyshev inequality,

$$
\Pr[X\geq k]=\Pr[X-\mu\geq t\sigma]\;\leq\;\frac{1}{1+t^{2}},
$$

and hence

$$
F(k)=\Pr[X\leq k]\;\geq\;1-\frac{1}{1+t^{2}}=\frac{t^{2}}{1+t^{2}}.
$$

If 

$$
t\geq 1
$$

, then 

$$
F(k)\geq\tfrac{1}{2}
$$

 in this regime.
Thus, it follows that

$$
m_{k}=F(k)-\tfrac{1}{2}\;\geq\;\frac{t^{2}}{1+t^{2}}-\tfrac{1}{2}=\frac{t^{2}-1}{2(1+t^{2})}.
$$

(34)

Choosing

$$
t_{\gamma}:=\sqrt{\frac{1+2\gamma}{1-2\gamma}}\;\geq 1,
$$

since 

$$
\gamma>0
$$

, makes the right-hand side of ([34]) equal to 

$$
\gamma
$$

, so 

$$
m_{k}\geq\gamma
$$

 whenever 

$$
k\geq\mu+t_{\gamma}\sigma
$$

.

By symmetry, applying the same argument to 

$$
-X
$$

 yields that 

$$
m_{k}\geq\gamma
$$

 whenever 

$$
k\leq\mu-t_{\gamma}\sigma
$$

.
Equivalently, by contraposition,

$$
k\in K_{\gamma}=\{k:m_{k}<\gamma\}\quad\Longrightarrow\quad|k-\mu|

Therefore,

$$
K_{\gamma}\;\subseteq\;(\mu-t_{\gamma}\sigma,\;\mu+t_{\gamma}\sigma),
$$

and since 

$$
k
$$

 ranges over integers, the number of such indices is bounded by

$$
\begin{split}|K_{\gamma}|&\;\leq\;\big\lceil 2t_{\gamma}\sigma\big\rceil+1\\
&\;\leq\;2t_{\gamma}\sigma+2\\
&=2t_{\gamma}\sqrt{np(1-p)}+2.\end{split}
$$

(35)

Note that this Chebyshev step is deliberately distribution-free and can be loose for small 

$$
n
$$

; sharper binomial concentration would improve constants without changing the selection argument.

4. From median error to transition-probability error.
Define 

$$
\widehat{p}:=\widehat{P}_{ss^{\prime}}(a)
$$

 as in ([8]), i.e. 

$$
\widehat{p}=\frac{1}{n}(\widehat{k}_{\mathrm{med}}-\tfrac{1}{2})
$$

 by definition ([32]).
A standard binomial fact is that the median differs from the mean by at most 

$$
1
$$

: 

$$
|k_{\mathrm{med}}-np|\leq 1
$$

; equivalently, 

$$
k_{\mathrm{med}}\in\{\lfloor np\rfloor,\lceil np\rceil\}
$$

.
Hence,

$$
\begin{split}|\widehat{p}-p|&\;\leq\;\Big|\widehat{p}-\frac{k_{\mathrm{med}}}{n}\Big|+\Big|\frac{k_{\mathrm{med}}}{n}-p\Big|\\
&\;\leq\;\frac{|\widehat{k}_{\mathrm{med}}-k_{\mathrm{med}}|+\tfrac{1}{2}}{n}+\frac{1}{n}\\
&\;\leq\;\frac{|\widehat{k}_{\mathrm{med}}-k_{\mathrm{med}}|}{n}+O\left(\frac{1}{n}\right).\end{split}
$$

Combining ([33]) and ([35]) gives, for this fixed 

$$
(s,a,s^{\prime})
$$

,

$$
\begin{split}|\widehat{p}-p|\;\leq&\;2t_{\gamma}\sqrt{\frac{p(1-p)}{n}}\;+\;\frac{1}{nc(\gamma)}\sum_{k=0}^{n}\delta_{s,a,s^{\prime},k}(\pi;s_{0})\\
&\;+\;O\left(\frac{1}{n}\right).\end{split}
$$

Finally, average over 

$$
(s,a,s^{\prime})\sim\mathrm{Unif}(\mathcal{S}\times\mathcal{A}\times\mathcal{S})
$$

 and use the global assumption ([9]) to bound

$$
\begin{split}&\mathbb{E}_{(s,a,s^{\prime})}\Big[\frac{1}{n}\sum_{k=0}^{n}\delta_{s,a,s^{\prime},k}(\pi;s_{0})\Big]\\
&=\frac{n+1}{n}\,\mathbb{E}_{(s,a,s^{\prime},k)}[\delta_{s,a,s^{\prime},k}(\pi;s_{0})]\\
&\;\leq\;\frac{n+1}{n}\bar{\delta},\end{split}
$$

which yields ([10]).
∎

## Appendix C Proof of Corollaries [1] and [2]

### C.1 Proof of Corollary [1]

Proof.

By the *

$$
\varepsilon_{\mathrm{cMP}}
$$

-approximate* causal Markov-process assumption ([11]), for each 

$$
(s,a,s^{\prime})
$$

 we have 

$$
|P_{ss^{\prime}}(a)-P^{\mathrm{do}}_{ss^{\prime}}(a)|\leq\varepsilon_{\mathrm{cMP}}
$$

.
Thus, by the triangle inequality,

$$
\begin{split}|\widehat{P}_{ss^{\prime}}(a)-P^{\mathrm{do}}_{ss^{\prime}}(a)|&\leq|\widehat{P}_{ss^{\prime}}(a)-P_{ss^{\prime}}(a)|+|P_{ss^{\prime}}(a)-P^{\mathrm{do}}_{ss^{\prime}}(a)|\\
&\leq|\widehat{P}_{ss^{\prime}}(a)-P_{ss^{\prime}}(a)|+\varepsilon_{\mathrm{cMP}}.\end{split}
$$

Taking expectations over 

$$
(s,a,s^{\prime})\sim\mathrm{Unif}(\mathcal{S}\times\mathcal{A}\times\mathcal{S})
$$

, the bound follows immediately from Theorem [1] by substitution.
∎

### C.2 Proof of Corollary [2]

Proof.

Two structural causal models can share the same interventional kernel

$$
P(S_{t+1}\mid S_{t}=s,\mathrm{do}(A_{t}=a))
$$

 for all 

$$
(s,a)
$$

while differing in counterfactual couplings.

Fix a single state 

$$
s
$$

, binary actions 

$$
\{0,1\}
$$

, and binary next state.
Let 

$$
U\sim\mathrm{Bernoulli}(1/2)
$$

.
Model (I): 

$$
S_{t+1}=U
$$

.
Model (II): 

$$
S_{t+1}=A_{t}\oplus U
$$

.

Both satisfy 

$$
P(S_{t+1}=1\mid S_{t}=s,\mathrm{do}(A_{t}=a))=1/2
$$

 for 

$$
a\in\{0,1\}
$$

, so their interventional kernels coincide.
However, conditioning on 

$$
A_{t}=0
$$

 and 

$$
S_{t+1}=1
$$

 (hence 

$$
U=1
$$

), the counterfactual under 

$$
A_{t}=1
$$

 gives 

$$
S_{t+1}^{1}=1
$$

 in Model (I) but 

$$
S_{t+1}^{1}=0
$$

 in Model (II).
Thus Level 3 counterfactuals are not identified by the interventional kernel.
∎

## Appendix D Proof of Theorem [2]

Proof.

Fix 

$$
(h,T)
$$

 and write 

$$
p:=p_{T}(h)
$$

, 

$$
m:=m_{T}(h)
$$

, 

$$
q:=q_{T}(h)
$$

.
If 

$$
p\geq\tfrac{1}{2}
$$

 then 

$$
p=\tfrac{1}{2}+m
$$

 and the suboptimal mass is 

$$
w_{T}(h)=1-q
$$

.
Using ([13])-([14]):

$$
\begin{split}&V^{\pi}(h;g_{T})=q(\tfrac{1}{2}+m)+(1-q)(\tfrac{1}{2}-m)=\tfrac{1}{2}-m+2mq,\\
&V^{\star}(h;g_{T})=\tfrac{1}{2}+m.\end{split}
$$

Thus

$$
\begin{split}\delta_{T}(\pi;h)=1-\frac{\tfrac{1}{2}-m+2mq}{\tfrac{1}{2}+m}&=\frac{2m(1-q)}{\tfrac{1}{2}+m}\\
&=w_{T}(h)\frac{4m}{1+2m}.\end{split}
$$

(36)

If 

$$
p<\tfrac{1}{2}
$$

, the symmetric calculation yields the same identity 

$$
\delta_{T}(\pi;h)=w_{T}(h)\cdot\frac{4m}{1+2m}
$$

 (now 

$$
w_{T}(h)=q
$$

).
Therefore, on the event 

$$
\{m\geq\gamma\}
$$

 we have

$$
\delta_{T}(\pi;h)\;\geq\;w_{T}(h)\cdot\frac{4\gamma}{1+2\gamma}\;=\;w_{T}(h)\,c(\gamma).
$$

Taking expectations over 

$$
h\sim\mathcal{H}
$$

 and 

$$
T\sim D
$$

 and using ([15]):

$$
\begin{split}\bar{\delta}\geq\ \mathbb{E}[\delta_{T}(\pi;h)]&\geq\mathbb{E}[\delta_{T}(\pi;h)\,\mathbf{1}\{m_{T}(h)\geq\gamma\}]\\
&\geq\ c(\gamma)\,\mathbb{E}[w_{T}(h)\,\mathbf{1}\{m_{T}(h)\geq\gamma\}],\end{split}
$$

which proves ([17]).
The conditional bound ([18]) follows by dividing by 

$$
q_{\gamma}=\Pr(m_{T}(H)\geq\gamma)
$$

.
∎

## Appendix E Proof of Proposition [1]

Proof.

Fix any 

$$
p,q\in(\tfrac{1}{2},1)
$$

 with 

$$
p\neq q
$$

.
Let 

$$
\mathcal{A}
$$

 be any finite action space with 

$$
|\mathcal{A}|\geq 2
$$

.
For each 

$$
r\in\{p,q\}
$$

, define a POMDP 

$$
E_{r}=(\mathcal{X},\mathcal{A},\mathcal{O},T,Z,\mu_{0})
$$

 as follows:

$$
\mathcal{X}=\{x_{0},x_{1},y_{0},y_{1}\},\qquad\mathcal{O}=\{u,0,1\},
$$

with initial distribution

$$
\mu_{0}(x_{0})=r,\qquad\mu_{0}(x_{1})=1-r,\qquad\mu_{0}(y_{0})=\mu_{0}(y_{1})=0.
$$

The observation kernel is

$$
Z(u\mid x_{0})=Z(u\mid x_{1})=1,\qquad Z(0\mid y_{0})=1,\qquad Z(1\mid y_{1})=1.
$$

For every action 

$$
a\in\mathcal{A}
$$

, the transition kernel is

$$
T(y_{0}\mid x_{0},a)=1,\qquad T(y_{1}\mid x_{1},a)=1,\qquad T(y_{0}\mid y_{0},a)=1,\qquad T(y_{1}\mid y_{1},a)=1.
$$

Let 

$$
h=(u)
$$

 be the initial history.
Fix any test 

$$
T=(\alpha,W)
$$

 with 

$$
|\alpha|=k
$$

.
Since actions do not affect the dynamics, conditional on 

$$
h
$$

 the future observation sequence is deterministically either 

$$
0^{k}
$$

 or 

$$
1^{k}
$$

.
Therefore

$$
p_{T}^{E_{r}}(h)=r\,\mathbf{1}\{0^{k}\in W\}+(1-r)\,\mathbf{1}\{1^{k}\in W\}.
$$

(37)

Hence 

$$
p_{T}^{E_{r}}(h)
$$

 can only take one of the four values

$$
0,\qquad 1-r,\qquad r,\qquad 1.
$$

Since 

$$
r>\tfrac{1}{2}
$$

, the unique optimal fair bet is:

- • 

report 

$$
L
$$

 if 

$$
0^{k}\in W
$$

;

- • 

report 

$$
R
$$

 if 

$$
0^{k}\notin W
$$

.

This rule is independent of the value of 

$$
r\in(\tfrac{1}{2},1)
$$

.
Therefore every optimal policy for the fair betting goals 

$$
g_{T}
$$

 induces exactly the same answers on all tests at 

$$
h
$$

 in 

$$
E_{p}
$$

 and 

$$
E_{q}
$$

.

On the other hand, if 

$$
T^{\star}=(\alpha^{\star},\{0^{|\alpha^{\star}|}\})
$$

 for any fixed action sequence 

$$
\alpha^{\star}
$$

, then by ([37]),

$$
p_{T^{\star}}^{E_{p}}(h)=p\qquad\text{and}\qquad p_{T^{\star}}^{E_{q}}(h)=q,
$$

so 

$$
p_{T^{\star}}^{E_{p}}(h)\neq p_{T^{\star}}^{E_{q}}(h)
$$

.
Thus

$$
\eta_{\mathcal{T}}^{E_{p}}(h)\neq\eta_{\mathcal{T}}^{E_{q}}(h).
$$

This proves that exact optimal query access to the fair betting goals does not, in general, identify the predictive state.
∎

## Appendix F Proof of Theorem [3]

Proof.

Fix 

$$
(h,T)
$$

 and write

$$
p:=p_{T}(h),\qquad q_{k}:=q_{T,\lambda_{k}}(h),\qquad\hat{p}:=\frac{1}{K}\sum_{k=1}^{K}q_{k}.
$$

Let

$$
r_{k}:=V^{\star}(h;g_{T,\lambda_{k}})-V^{\pi}(h;g_{T,\lambda_{k}})
$$

denote the unnormalized regret at threshold 

$$
\lambda_{k}
$$

.
Then

$$
r_{k}=\begin{cases}(1-q_{k})(p-\lambda_{k}),&\lambda_{k}\leq p,\\[4.0pt]
q_{k}(\lambda_{k}-p),&\lambda_{k}>p.\end{cases}
$$

(38)

Let

$$
J:=\#\{k:\lambda_{k}\leq p\}=\Big\lfloor Kp+\frac{1}{2}\Big\rfloor.
$$

Averaging ([38]) over 

$$
k
$$

 gives

$$
R:=\frac{1}{K}\sum_{k=1}^{K}r_{k}=\frac{1}{K}\sum_{k\leq J}(p-\lambda_{k})-p\hat{p}+\frac{1}{K}\sum_{k=1}^{K}\lambda_{k}q_{k}.
$$

(39)

We now bound the two terms on the right-hand side of ([39]).

First,

$$
\frac{1}{K}\sum_{k\leq J}(p-\lambda_{k})=\frac{Jp}{K}-\frac{1}{K}\sum_{k=1}^{J}\frac{k-\tfrac{1}{2}}{K}=\frac{Jp}{K}-\frac{J^{2}}{2K^{2}}.
$$

Since

$$
\frac{Jp}{K}-\frac{J^{2}}{2K^{2}}=\frac{p^{2}}{2}-\frac{(Kp-J)^{2}}{2K^{2}},
$$

and 

$$
|Kp-J|\leq\tfrac{1}{2}
$$

, it follows that

$$
\frac{1}{K}\sum_{k\leq J}(p-\lambda_{k})\geq\frac{p^{2}}{2}-\frac{1}{8K^{2}}.
$$

(40)

Second, among all choices 

$$
q_{k}\in[0,1]
$$

 with fixed average 

$$
\hat{p}
$$

, the weighted sum 

$$
\sum_{k}\lambda_{k}q_{k}
$$

 is minimized by placing as much mass as possible on the smallest thresholds.
Let 

$$
L=\lfloor K\hat{p}\rfloor
$$

 and 

$$
\beta=K\hat{p}-L\in[0,1]
$$

.
The minimum is attained by

$$
q_{1}=\cdots=q_{L}=1,\qquad q_{L+1}=\beta,\qquad q_{L+2}=\cdots=q_{K}=0,
$$

(with the convention that if 

$$
\beta=0
$$

 the partial entry is omitted), and equals

$$
\displaystyle\frac{1}{K}\sum_{k=1}^{K}\lambda_{k}q_{k}
$$

$$
\displaystyle\geq\frac{1}{K}\left(\sum_{k=1}^{L}\frac{k-\tfrac{1}{2}}{K}+\beta\frac{L+\tfrac{1}{2}}{K}\right)
$$

$$
\displaystyle=\frac{(L+\beta)^{2}+\beta(1-\beta)}{2K^{2}}
$$

$$
\displaystyle\geq\frac{\hat{p}^{2}}{2}.
$$

(41)

Substituting ([40]) and ([41]) into ([39]) yields

$$
R\geq\frac{p^{2}}{2}-\frac{1}{8K^{2}}-p\hat{p}+\frac{\hat{p}^{2}}{2}=\frac{(\hat{p}-p)^{2}}{2}-\frac{1}{8K^{2}}.
$$

(42)

Now

$$
r_{k}=\delta_{T,\lambda_{k}}(\pi;h)\,V^{\star}(h;g_{T,\lambda_{k}})\leq\delta_{T,\lambda_{k}}(\pi;h),
$$

since 

$$
V^{\star}(h;g_{T,\lambda_{k}})\leq 1
$$

.
Therefore

$$
R\leq\frac{1}{K}\sum_{k=1}^{K}\delta_{T,\lambda_{k}}(\pi;h).
$$

(43)

Combining ([42]) and ([43]),

$$
\big(\hat{p}-p_{T}(h)\big)^{2}\leq 2\Big(\frac{1}{K}\sum_{k=1}^{K}\delta_{T,\lambda_{k}}(\pi;h)\Big)+\frac{1}{4K^{2}}.
$$

(44)

Finally, average ([44]) over 

$$
h\sim\mathcal{H}
$$

 and 

$$
T\sim D
$$

, and use ([20]), obtaining

$$
\mathbb{E}_{h\sim\mathcal{H}}\,\mathbb{E}_{T\sim D}\Big[\big(\hat{p}_{T}(h)-p_{T}(h)\big)^{2}\Big]\leq 2\bar{\delta}_{K}+\frac{1}{4K^{2}},
$$

which proves ([21]).

For the vector statement, if 

$$
D
$$

 is uniform on 

$$
\mathcal{T}_{\ell}=\{T_{1},\dots,T_{d}\}
$$

 then

$$
\displaystyle\mathbb{E}_{h\sim\mathcal{H}}\Big[\frac{1}{d}\big\|\hat{\eta}_{\mathcal{T}_{\ell}}(h)-\eta_{\mathcal{T}_{\ell}}(h)\big\|_{2}^{2}\Big]
$$

$$
\displaystyle=\mathbb{E}_{h\sim\mathcal{H}}\Big[\frac{1}{d}\sum_{j=1}^{d}\big(\hat{p}_{T_{j}}(h)-p_{T_{j}}(h)\big)^{2}\Big]
$$

$$
\displaystyle=\mathbb{E}_{h\sim\mathcal{H}}\,\mathbb{E}_{T\sim D}\Big[\big(\hat{p}_{T}(h)-p_{T}(h)\big)^{2}\Big]
$$

$$
\displaystyle\leq 2\bar{\delta}_{K}+\frac{1}{4K^{2}},
$$

proving ([22]).
∎

## Appendix G Proof of Theorem [4]

Proof.

Apply Theorem [3] with 

$$
\mathcal{H}
$$

 uniform on 

$$
\{h^{1},\dots,h^{d}\}
$$

 and with the test family defined as the indexed collection

$$
\mathcal{T}^{+}_{\mathrm{idx}}:=\{T_{1},\dots,T_{d}\}\;\cup\;\{\sigma\circ T_{j}:\sigma\in\mathcal{A}\times\mathcal{O},\;1\leq j\leq d\},
$$

counting each pair 

$$
(\sigma,j)
$$

 separately.
Then

$$
|\mathcal{T}^{+}_{\mathrm{idx}}|=d\bigl(1+|\mathcal{A}||\mathcal{O}|\bigr).
$$

By ([21]),

$$
\frac{1}{d\,|\mathcal{T}^{+}_{\mathrm{idx}}|}\sum_{i=1}^{d}\sum_{T\in\mathcal{T}^{+}_{\mathrm{idx}}}\left(\hat{p}_{T}(h^{i})-p_{T}(h^{i})\right)^{2}\;\leq\;\varepsilon_{K}.
$$

(45)

By construction, the sum over 

$$
T\in\mathcal{T}^{+}_{\mathrm{idx}}
$$

 exactly enumerates all entries of 

$$
S
$$

 (from 

$$
T_{j}
$$

) and all entries of each 

$$
Y_{\sigma}
$$

 (from 

$$
\sigma\circ T_{j}
$$

), so the left-hand side of ([45]) equals

$$
\frac{1}{d^{2}(1+|\mathcal{A}||\mathcal{O}|)}\left(\|\hat{S}-S\|_{F}^{2}+\sum_{\sigma}\|\hat{Y}_{\sigma}-Y_{\sigma}\|_{F}^{2}\right),
$$

which proves ([24]).

Let 

$$
\kappa:=\|S^{-1}\|_{2}
$$

.
From ([24]),

$$
\|\hat{S}-S\|_{2}\leq\|\hat{S}-S\|_{F}\leq d\sqrt{(1+|\mathcal{A}||\mathcal{O}|)\,\varepsilon_{K}}.
$$

Under ([25]), this implies

$$
\|S^{-1}(\hat{S}-S)\|_{2}\leq\frac{1}{2}.
$$

Hence 

$$
\hat{S}
$$

 is invertible, and the standard Neumann series perturbation bound gives

$$
\|\hat{S}^{-1}\|_{2}\leq 2\kappa,\qquad\|\hat{S}^{-1}-S^{-1}\|_{2}\leq 2\kappa^{2}\|\hat{S}-S\|_{F}.
$$

(46)

For each 

$$
\sigma
$$

,

$$
\hat{B}_{\sigma}-B_{\sigma}=(\hat{Y}_{\sigma}-Y_{\sigma})\hat{S}^{-1}+Y_{\sigma}(\hat{S}^{-1}-S^{-1}).
$$

Using ([46]),

$$
\|\hat{B}_{\sigma}-B_{\sigma}\|_{F}\leq 2\kappa\,\|\hat{Y}_{\sigma}-Y_{\sigma}\|_{F}+2\kappa^{2}\,\|Y_{\sigma}\|_{2}\,\|\hat{S}-S\|_{F}.
$$

Squaring and using 

$$
(u+v)^{2}\leq 2u^{2}+2v^{2}
$$

,

$$
\|\hat{B}_{\sigma}-B_{\sigma}\|_{F}^{2}\leq 8\kappa^{2}\|\hat{Y}_{\sigma}-Y_{\sigma}\|_{F}^{2}+8\kappa^{4}\|Y_{\sigma}\|_{2}^{2}\|\hat{S}-S\|_{F}^{2}.
$$

Summing over 

$$
\sigma
$$

 and applying ([24]) yields ([26]).
∎

## Appendix H Proof of Theorem [5]

Proof.

Fix any 

$$
M
$$

-based policy 

$$
\pi
$$

.
Consider any pair 

$$
(h,h^{\prime})
$$

 with 

$$
(h,h^{\prime})\in\mathsf{Alias}_{M}
$$

.
Because 

$$
\pi
$$

 is 

$$
M
$$

-based and 

$$
M(h)=M(h^{\prime})
$$

, for every test 

$$
T
$$

 we have identical bet distributions: 

$$
q_{T}(h)=q_{T}(h^{\prime})=:q_{T}
$$

.

Now fix a test 

$$
T\in S_{\gamma}(h,h^{\prime})
$$

.
By assumption, 

$$
p_{T}(h)\geq\tfrac{1}{2}+\gamma
$$

 so the optimal bet at 

$$
h
$$

 is 

$$
L
$$

 and thus 

$$
w_{T}(h)=1-q_{T}
$$

; while 

$$
p_{T}(h^{\prime})\leq\tfrac{1}{2}-\gamma
$$

 so the optimal bet at 

$$
h^{\prime}
$$

 is 

$$
R
$$

 and thus 

$$
w_{T}(h^{\prime})=q_{T}
$$

.
Therefore,

$$
\frac{1}{2}\big(w_{T}(h)+w_{T}(h^{\prime})\big)\;=\;\frac{1}{2}.
$$

By the pointwise identity ([36]) from the proof of Theorem [2], when 

$$
m_{T}(\cdot)\geq\gamma
$$

 we have

$$
\delta_{T}(\pi;\cdot)\geq c(\gamma)\,w_{T}(\cdot)
$$

.
Hence for 

$$
T\in S_{\gamma}(h,h^{\prime})
$$

,

$$
\begin{split}&\frac{1}{2}\big(\delta_{T}(\pi;h)+\delta_{T}(\pi;h^{\prime})\big)\\
&\geq\frac{1}{2}\,c(\gamma)\big(w_{T}(h)+w_{T}(h^{\prime})\big)\ =\ \frac{c(\gamma)}{2}.\end{split}
$$

Taking expectations over 

$$
(h,h^{\prime})\sim\mathcal{P}
$$

 and 

$$
T\sim D
$$

 and restricting to the event 

$$
\{(h,h^{\prime})\in\mathsf{Alias}_{M},\ T\in S_{\gamma}(h,h^{\prime})\}
$$

 yields

$$
\bar{\delta}_{\mathcal{P}}(\pi)\ \geq\ q^{\mathsf{Alias}}_{\gamma}(M)\cdot\frac{c(\gamma)}{2},
$$

which proves ([27]).
∎

## Appendix I Proof of Corollary [3]

Proof.

For each 

$$
i
$$

, define the *blockwise* pair-averaged regret

$$
\bar{\delta}_{\mathcal{P},i}(\pi):=\mathbb{E}_{(h,h^{\prime})\sim\mathcal{P}}\ \frac{1}{2}\Big(\mathbb{E}_{T\sim D_{i}}[\delta_{T}(\pi;h)]+\mathbb{E}_{T\sim D_{i}}[\delta_{T}(\pi;h^{\prime})]\Big).
$$

Applying Theorem [5] with test distribution 

$$
D_{i}
$$

 yields

$$
\bar{\delta}_{\mathcal{P},i}(\pi)\ \geq\ q^{\mathsf{Alias}}_{\gamma,i}(M)\frac{c(\gamma)}{2},
$$

so

$$
q^{\mathsf{Alias}}_{\gamma,i}(M)\leq\frac{2\,\bar{\delta}_{\mathcal{P},i}(\pi)}{c(\gamma)}.
$$

(47)

Now relate 

$$
\bar{\delta}_{\mathcal{P}}(\pi)
$$

 (under 

$$
D
$$

) to the 

$$
\bar{\delta}_{\mathcal{P},i}(\pi)
$$

.
Because 

$$
D=\sum_{i=1}^{K}p_{i}D_{i}
$$

, for any fixed history 

$$
h
$$

 we have

$$
\mathbb{E}_{T\sim D}[\delta_{T}(\pi;h)]=\sum_{i=1}^{K}p_{i}\,\mathbb{E}_{T\sim D_{i}}[\delta_{T}(\pi;h)].
$$

Substituting this identity into the definition of 

$$
\bar{\delta}_{\mathcal{P}}(\pi)
$$

 and exchanging sums/expectations gives

$$
\bar{\delta}_{\mathcal{P}}(\pi)=\sum_{i=1}^{K}p_{i}\,\bar{\delta}_{\mathcal{P},i}(\pi).
$$

Since all terms are nonnegative, 

$$
\bar{\delta}_{\mathcal{P}}(\pi)\geq p_{i}\,\bar{\delta}_{\mathcal{P},i}(\pi)
$$

, hence

$$
\bar{\delta}_{\mathcal{P},i}(\pi)\ \leq\ \frac{\bar{\delta}_{\mathcal{P}}(\pi)}{p_{i}}.
$$

(48)

Combining ([47]) and ([48]) yields

$$
q^{\mathsf{Alias}}_{\gamma,i}(M)\ \leq\ \frac{2}{c(\gamma)}\cdot\frac{\bar{\delta}_{\mathcal{P}}(\pi)}{p_{i}},
$$

as claimed.
∎

## Appendix J Proof of Corollaries [4] and [5]

For the next two corollaries, it will be useful to have the following lemma:

Lemma 2 (Low pair-regret 

$$
\Rightarrow
$$

 small aliasing mass on 

$$
\gamma
$$

-separations).

Work in the setting of Theorem [5] with 

$$
(\mathcal{P},D,\gamma)
$$

 and witness sets 

$$
S_{\gamma}(h,h^{\prime})
$$

.
Let 

$$
\pi
$$

 be 

$$
M
$$

-based.
Then

$$
\begin{split}&\Pr_{(h,h^{\prime})\sim\mathcal{P},\ T\sim D}\Big(M(h)=M(h^{\prime})\ \wedge\ T\in S_{\gamma}(h,h^{\prime})\Big)\\
&\leq\frac{2\,\bar{\delta}_{\mathcal{P}}(\pi)}{c(\gamma)}.\end{split}
$$

Equivalently,

$$
\mathbb{E}_{(h,h^{\prime})\sim\mathcal{P}}\Big[\mathbf{1}\{M(h)=M(h^{\prime})\}\cdot D(S_{\gamma}(h,h^{\prime}))\Big]\ \leq\ \frac{2\,\bar{\delta}_{\mathcal{P}}(\pi)}{c(\gamma)}.
$$

In particular, if 

$$
\bar{\delta}_{\mathcal{P}}(\pi)=0
$$

 then 

$$
\mathbf{1}\{M(h)=M(h^{\prime})\}\cdot D(S_{\gamma}(h,h^{\prime}))=0
$$

 for 

$$
\mathcal{P}
$$

 almost everywhere on 

$$
(h,h^{\prime})
$$

.

Proof.

Theorem [5] gives the lower bound

$$
\bar{\delta}_{\mathcal{P}}(\pi)\ \geq\ q^{\mathsf{Alias}}_{\gamma}(M)\cdot\frac{c(\gamma)}{2},
$$

where

$$
\begin{split}&q^{\mathsf{Alias}}_{\gamma}(M)\\
&=\Pr_{(h,h^{\prime})\sim\mathcal{P},\ T\sim D}\Big(M(h)=M(h^{\prime})\ \wedge\ T\in S_{\gamma}(h,h^{\prime})\Big).\end{split}
$$

Rearranging yields the first inequality.
For the second display, note that

$$
\begin{split}&q^{\mathsf{Alias}}_{\gamma}(M)\\
&=\mathbb{E}_{(h,h^{\prime})\sim\mathcal{P}}\Big[\mathbf{1}\{M(h)=M(h^{\prime})\}\cdot D(S_{\gamma}(h,h^{\prime}))\Big],\end{split}
$$

by the law of total expectation over 

$$
T\sim D
$$

.
The final claim follows because a nonnegative random variable with zero expectation is zero almost surely.
∎

### J.1 Proof of Corollary [4]

Proof.

By assumption, the witness set is supported on regime-mismatched pairs in the sense that

$$
T\in S_{\gamma}(h,h^{\prime})\ \Longrightarrow\ I(h)\neq I(h^{\prime}).
$$

Therefore the event in the corollary simplifies:

$$
\begin{split}&\{M(h)=M(h^{\prime})\ \wedge\ I(h)\neq I(h^{\prime})\ \wedge\ T\in S_{\gamma}(h,h^{\prime})\}\\
&=\{M(h)=M(h^{\prime})\ \wedge\ T\in S_{\gamma}(h,h^{\prime})\},\end{split}
$$

since 

$$
T\in S_{\gamma}(h,h^{\prime})
$$

 already implies 

$$
I(h)\neq I(h^{\prime})
$$

.
Taking probabilities under 

$$
(h,h^{\prime})\sim\mathcal{P}
$$

 and 

$$
T\sim D
$$

 yields

$$
\begin{split}&\Pr\big(M(h)=M(h^{\prime})\ \wedge\ I(h)\neq I(h^{\prime})\ \wedge\ T\in S_{\gamma}(h,h^{\prime})\big)\\
&=\Pr\big(M(h)=M(h^{\prime})\ \wedge\ T\in S_{\gamma}(h,h^{\prime})\big).\end{split}
$$

Now apply Lemma [2] with the same 

$$
(\mathcal{P},D,\gamma,S_{\gamma})
$$

 to obtain

$$
\begin{split}&\Pr_{(h,h^{\prime})\sim\mathcal{P},\ T\sim D}\Big(M(h)=M(h^{\prime})\ \wedge\ T\in S_{\gamma}(h,h^{\prime})\Big)\\
&\leq\ \frac{2\,\bar{\delta}_{\mathcal{P}}(\pi)}{c(\gamma)}.\end{split}
$$

∎

### J.2 Proof of Corollary [5]

Proof.

For convenience, write 

$$
\ell(h):=\ell_{D}^{\gamma}(h)
$$

.

1. (ii) implies each 

$$
M_{j}
$$

 is a function of 

$$
\ell
$$

.
Fix 

$$
j\in\{1,2\}
$$

.
Assumption (ii) says 

$$
\ell(h)=\ell(h^{\prime})\Rightarrow M_{j}(h)=M_{j}(h^{\prime})
$$

, so we may define a map 

$$
a_{j}
$$

 on the range of 

$$
\ell
$$

 by 

$$
a_{j}(\ell(h)):=M_{j}(h)
$$

; this is well-defined by (ii).
Thus,

$$
M_{j}(h)=a_{j}(\ell(h)),
$$

(49)

almost surely under the history distribution.

2. (i) vanishing pair-regret + (iii) implies 

$$
\ell
$$

 is a function of each 

$$
M_{j}
$$

.
Fix 

$$
j
$$

.
By (i) and Lemma [2] applied to 

$$
\pi_{j}
$$

 and 

$$
M_{j}
$$

,

$$
\begin{split}&\mathbb{E}_{(h,h^{\prime})\sim\mathcal{P}}\Big[\mathbf{1}\{M_{j}(h)=M_{j}(h^{\prime})\}\cdot D(S_{\gamma}(h,h^{\prime}))\Big]\\
&\leq\ \frac{2\,\bar{\delta}_{\mathcal{P}}(\pi_{j})}{c(\gamma)}\ \to\ 0.\end{split}
$$

Since the integrand is nonnegative, this implies

$$
\mathbf{1}\{M_{j}(h)=M_{j}(h^{\prime})\}\cdot D(S_{\gamma}(h,h^{\prime}))=0,
$$

(50)

for 

$$
\mathcal{P}
$$

 almost everywhere on 

$$
(h,h^{\prime})
$$

.
Now suppose (for 

$$
\mathcal{P}
$$

 almost everywhere pairs) that 

$$
M_{j}(h)=M_{j}(h^{\prime})
$$

.
Then ([50]) gives 

$$
D(S_{\gamma}(h,h^{\prime}))=0
$$

.
By 

$$
\gamma
$$

-completeness (iii), 

$$
D(S_{\gamma}(h,h^{\prime}))=0
$$

 implies 

$$
\ell(h)=\ell(h^{\prime})
$$

 (contrapositive).
Therefore, 

$$
M_{j}(h)=M_{j}(h^{\prime})\Rightarrow\ell(h)=\ell(h^{\prime})
$$

 for 

$$
\mathcal{P}
$$

 almost everywhere on 

$$
(h,h^{\prime})
$$

, which means that 

$$
\ell
$$

 is almost surely a function of 

$$
M_{j}
$$

.
Concretely, we can define 

$$
b_{j}
$$

 on the range of 

$$
M_{j}
$$

 by 

$$
b_{j}(M_{j}(h)):=\ell(h)
$$

; this is well-defined almost surely because 

$$
M_{j}(h)=M_{j}(h^{\prime})
$$

 forces 

$$
\ell(h)=\ell(h^{\prime})
$$

.
Hence

$$
\ell(h)=b_{j}(M_{j}(h)),
$$

(51)

almost surely.

3. Composition to obtain mutual recodings.
Using ([49]) for 

$$
j=1
$$

 and ([51]) for 

$$
j=2
$$

,

$$
M_{1}(h)=a_{1}(\ell(h))=a_{1}(b_{2}(M_{2}(h)))\ :=\ \varphi(M_{2}(h)),
$$

where 

$$
\varphi:=a_{1}\circ b_{2}
$$

. Symmetrically,

$$
M_{2}(h)=a_{2}(\ell(h))=a_{2}(b_{1}(M_{1}(h)))\ :=\ \psi(M_{1}(h)),
$$

where 

$$
\psi:=a_{2}\circ b_{1}
$$

.
This proves the claimed mutual recodability, almost surely on the support of 

$$
\mathcal{P}
$$

.
∎

# 第二部分：解析（深度解读）
## 核心论点

随着智能体越来越 capable，一个根本问题是：在不确定性下要「称职地行动」，其内部结构有哪些是**被强制要求**的？经典结果只说明最优控制「可以」用信念状态或世界模型来实现，却没证明它们「必须」存在。本文给出定量**选择定理（selection theorems）**：当任务表现足够强（平均后悔低）时，会迫使 agent 具备世界模型、类信念记忆；而在任务混合下，还需要持续的「状态跟踪变量」——作者指出其功能类似情绪的认知原语。

## 关键概念

1. **选择定理**：从「表现好」反推「内部必须有什么表示」的一类定理。
2. **平均后悔（average-case regret）**：衡量任务表现的指标，用作强制条件。
3. **世界模型恢复 / 部分可观测**：在完全/部分可观测下，证明世界模型与记忆的必要性。
4. **情绪作为信息状态**：任务混合下的持久状态跟踪变量，功能上对应情绪。

## 技术趋势与判断

- 为「agent 必须知道什么」提供理论下限，连接强化学习/控制论与认知科学，对构建可靠 agent 有指导意义。
- 与「知识外置 vs 内在世界模型」的讨论直接相关：本文从理论层面论证内在世界模型/记忆的必要性。

## 与本站其他文章的连接

- 与 AI agent/决策主线、以及「模型效率/知识存储」讨论互补——本文从理论说明某些「知识」必须内化为世界模型。

## 风险提示

- 理论结果依赖所设定的世界/任务分布；外推到真实开放域 agent 需谨慎。
