export type Project = {
  slug: string;
  number: string;
  title: string;
  cartridgeTitle: string;
  kicker: string;
  short: string;
  summary: string;
  role: string;
  period: string;
  output: string;
  genre: string;
  symbol: string;
  theme: string;
  color: string;
  dark: string;
  soft: string;
  preview?: string;
  poster?: string;
  bvid?: string;
  liveUrl?: string;
  tools: string[];
  highlights: string[];
  results: { value: string; label: string }[];
  sections: { title: string; text: string }[];
};

export const projects: Project[] = [
  {
    slug: "ludo-schema",
    number: "01",
    title: "LUDO//SCHEMA",
    cartridgeTitle: "LUDO//SCHEMA",
    kicker: "AI 游戏生成与玩法验证平台",
    short: "把自然语言创意翻译成结构化蓝图与可玩 Demo。",
    summary:
      "针对大模型难以稳定理解复杂游戏创意的问题，我设计 Game Schema 抽象模型，打通“创意输入—结构化蓝图—可玩 Demo”的生成链路。",
    role: "独立项目负责人",
    period: "2026.06—07",
    output: "ONLINE PRODUCT",
    genre: "AI PRODUCT",
    symbol: "◇",
    theme: "schema",
    color: "#8067ff",
    dark: "#35236d",
    soft: "#ded8ff",
    liveUrl: "https://ludo-schema-game-lab.ludo-schema-yintianjiao.workers.dev/",
    tools: ["DeepSeek API", "Game Schema", "Canvas", "Cloudflare", "AI Workflow"],
    highlights: [
      "先将自然语言创意拆成核心循环、实体、规则、资源和状态转换，用 Game Schema 为 AI 建立明确的理解边界。",
      "把一次生成拆成“需求澄清—结构化蓝图—Demo 生成—运行检查”多阶段流程，避免依赖单次长 Prompt。",
      "通过结构化输出约束、生成代码检查和服务端安全控制，提高 AI 结果的可执行性与稳定性。",
      "将运行错误和试玩反馈重新整理为修正任务，驱动最多两轮自动修复，并用版本历史与 A/B 对比验证改动。",
    ],
    results: [
      { value: "2", label: "生成路径" },
      { value: "4", label: "安全控制层" },
      { value: "∞", label: "可迭代版本" },
    ],
    sections: [
      {
        title: "产品目标",
        text: "让没有完整开发团队的创作者，也能把一句模糊的游戏想法转化为可检查、可修改、可试玩的系统。",
      },
      {
        title: "核心设计",
        text: "将游戏拆解为核心循环、实体、系统、规则、资源、胜负条件与平衡参数，并建立从需求到实现的追踪关系。",
      },
      {
        title: "AI 工作流",
        text: "通过需求澄清、结构化输出、Prompt 约束、结果检查、运行错误捕获和自动修复，提高 Demo 的可运行性与需求一致性。",
      },
    ],
  },
  {
    slug: "bababoi",
    number: "02",
    title: "Bababoi · 巴巴博弈",
    cartridgeTitle: "BABABOI",
    kicker: "双人对战卡牌游戏",
    short: "出牌、猜测、反制与揭牌构成的魔术师心理博弈。",
    summary:
      "从零设计并完成双人魔术师对战卡牌游戏，围绕攻击、防御、状态三类卡牌建立可读、可配置、可联机测试的对抗系统。",
    role: "独立策划 / AI 协作开发",
    period: "2026.06—07",
    output: "WINDOWS DEMO",
    genre: "CARD DUEL",
    symbol: "✦",
    theme: "magic",
    color: "#b858d1",
    dark: "#541c67",
    soft: "#f3d5f9",
    preview: "/projects/bababoi-preview.webm",
    poster: "/projects/bababoi-poster.jpg",
    bvid: "BV12a3F66ERq",
    tools: ["Godot", "AI Agent", "C#", "Git", "Windows Export"],
    highlights: [
      "先由我定义攻击、防御、状态三类卡牌的对抗关系，再把规则拆成费用、触发条件、技能效果和联机响应任务交给 AI 实现。",
      "将 21 项技能与 22 张卡牌整理成统一数据结构，让 AI 按配置扩展内容，减少重复代码和修改成本。",
      "把功能拆成手牌、揭示、日志、图鉴和舞台反馈等小任务，逐项生成、运行和验收，避免一次修改影响整个系统。",
      "把报错信息、复现步骤和预期结果一起提供给 AI 定位问题，再通过双窗口联机与多分辨率测试确认修复结果。",
    ],
    results: [
      { value: "22", label: "张卡牌" },
      { value: "21", label: "项技能" },
      { value: "36", label: "项核心测试" },
    ],
    sections: [
      {
        title: "玩法构想",
        text: "两名魔术师通过隐藏出牌、猜测意图、反制与揭牌争夺胜利，让信息差成为每一轮决策的核心张力。",
      },
      {
        title: "系统设计",
        text: "设计卡牌费用、能量、技能效果、状态与联机响应规则，并整理为可配置数据结构，方便扩展和 AI 修改。",
      },
      {
        title: "交付验证",
        text: "完成 1280×720 与 1920×1080 双窗口联机测试、36 项核心测试及 Windows 版本导出。",
      },
    ],
  },
  {
    slug: "merge-monster",
    number: "03",
    title: "Monster Merge Battle",
    cartridgeTitle: "MERGE MONSTER",
    kicker: "怪诞手绘合成塔防",
    short: "购买、召唤、合成怪物，构筑阵容并击败连续 Boss。",
    summary:
      "从零设计并完成合成塔防游戏，通过购买、召唤与合成怪物组建队伍，在连续遭遇中选择 Buff、解锁物种并调整阵容。",
    role: "独立策划 / AI 协作开发",
    period: "2026.05—06",
    output: "PLAYABLE DEMO",
    genre: "MERGE DEFENSE",
    symbol: "♣",
    theme: "survival",
    color: "#768b3f",
    dark: "#39451f",
    soft: "#e2e8c9",
    preview: "/projects/merge-preview.webm",
    poster: "/projects/merge-poster.jpg",
    bvid: "BV1Ta3F6rENq",
    tools: ["Godot", "AI Agent", "C#", "Game Design", "Playtest"],
    highlights: [
      "先用策划文档明确核心循环、关卡阶段和系统依赖，再将购买、召唤、合成、战斗与奖励拆成可独立验收的 AI 开发任务。",
      "为固定契约、阵容槽位和怪物等级建立统一规则，要求 AI 在既有数据结构内实现功能，避免玩法逻辑失控。",
      "将试玩中发现的流程问题转化为具体修改指令，补齐新手引导、奖励选择、免费刷新、存档续玩与 Boss 解锁。",
      "由 AI 辅助程序、UI 和资源配置，我负责判断玩法是否成立、检查运行结果并决定下一轮迭代优先级。",
    ],
    results: [
      { value: "4", label: "场连续遭遇" },
      { value: "5", label: "个阵容槽" },
      { value: "3", label: "阶段战斗节奏" },
    ],
    sections: [
      {
        title: "核心循环",
        text: "购买怪物、召唤上阵、同物种合成、自动战斗、领取奖励，再根据下一场遭遇调整阵容。",
      },
      {
        title: "关卡节奏",
        text: "用早中晚三阶段战斗与普通关、Boss 关交替组织四场连续遭遇，让构筑选择持续产生反馈。",
      },
      {
        title: "完整体验",
        text: "补齐引导、奖励选择、免费刷新、存档续玩和 Boss 解锁，使 Demo 从单一战斗升级为完整可玩流程。",
      },
    ],
  },
  {
    slug: "slap",
    number: "04",
    title: "Slap! · 蟑螂与人之战",
    cartridgeTitle: "SLAP!",
    kicker: "双人同机漫画对战",
    short: "节奏快速、反馈夸张的双人同机 PK 小游戏。",
    summary:
      "以人类与蟑螂的荒诞对决为主题，制作双人同机 PK 小游戏，用漫画分镜、速度线和夸张反馈强化即时对抗。",
    role: "游戏策划",
    period: "2026.06—07",
    output: "QUICK PROTOTYPE",
    genre: "LOCAL PARTY",
    symbol: "!",
    theme: "comic",
    color: "#ff513d",
    dark: "#7b1a10",
    soft: "#ffd7d0",
    preview: "/projects/slap-preview.webm",
    poster: "/projects/slap-poster.jpg",
    bvid: "BV1ry3F6aEKo",
    tools: ["秒哒", "Game Design", "Rapid Prototype", "Playtest"],
    highlights: [
      "先把荒诞主题压缩为双方目标、操作方式、胜负条件和核心反馈，让 AI 生成平台获得清晰且有限的实现范围。",
      "按照“先完成双人对抗闭环，再补充漫画反馈”的顺序推进，优先验证玩法而不是同时堆叠功能。",
      "把速度线、拟声词和击打停顿描述为可执行的视觉反馈规则，减少 AI 对“漫画感”的模糊理解。",
      "通过快速试玩检查操作是否易懂、胜负是否明确，再针对具体体验问题调整生成要求并完成原型。",
    ],
    results: [
      { value: "2P", label: "同机对战" },
      { value: "17s", label: "高密度演示" },
      { value: "1", label: "完整快速原型" },
    ],
    sections: [
      {
        title: "创意方向",
        text: "用人类与蟑螂的荒诞身份差制造天然冲突，让玩家无需说明就能理解对抗关系。",
      },
      {
        title: "交互表达",
        text: "用速度线、拟声词、网点和强烈击打停顿建立漫画感，让每一次操作都拥有即时反馈。",
      },
      {
        title: "快速落地",
        text: "控制玩法范围，在短周期内完成双人操作、胜负规则、视觉反馈和演示版本。",
      },
    ],
  },
];

export const abilities = [
  {
    index: "1",
    icon: "⌁",
    title: "规则拆解器",
    english: "SYSTEM ABSTRACTION",
    description:
      "把模糊创意拆成核心循环、实体、资源、状态、规则与胜负条件，让复杂机制可以被团队与 AI 共同执行。",
    evidence: ["Game Schema 抽象模型", "21 项技能数据配置", "需求—规则—实现追踪"],
  },
  {
    index: "2",
    icon: "✣",
    title: "AI 协作引擎",
    english: "AGENT COLLABORATION",
    description:
      "将产品需求转化为结构化任务与 Agent 指令，通过检查、反馈和修正闭环推进开发与内容生产。",
    evidence: ["多阶段 AI 工作流", "运行错误捕获与自动修复", "AI 视频全流程制作"],
  },
  {
    index: "3",
    icon: "▶",
    title: "原型制造器",
    english: "RAPID PROTOTYPING",
    description:
      "从策划方案到可运行 Demo，持续用试玩、测试与版本对比验证玩法，而不是停留在概念文档。",
    evidence: ["4 个可运行项目", "36 项核心测试", "Windows 版本与线上产品交付"],
  },
];
