import { C as VINEXT_MOUNTED_SLOTS_HEADER, D as __toESM, E as stripBasePath, S as require_react, _ as toSameOriginAppPath, d as createRscRequestHeaders, f as createRscRequestUrl, g as toBrowserNavigationHref, m as isHashOnlyBrowserUrlChange, p as notifyAppRouterTransitionStart, t as require_jsx_runtime, u as ReadonlyURLSearchParams, w as VINEXT_PARAMS_HEADER, x as AppElementsWire, y as assertSafeNavigationUrl } from "../index.js";
import Link from "./link-7tfMQaQT.js";
//#region node_modules/.pnpm/vinext@0.0.50_@vitejs+plugi_6558342ba0b940cbd621b36b626ca262/node_modules/vinext/dist/shims/navigation.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var _SERVER_INSERTED_HTML_CTX_KEY = Symbol.for("vinext.serverInsertedHTMLContext");
function getServerInsertedHTMLContext() {
	if (typeof import_react.createContext !== "function") return null;
	const globalState = globalThis;
	if (!globalState[_SERVER_INSERTED_HTML_CTX_KEY]) globalState[_SERVER_INSERTED_HTML_CTX_KEY] = import_react.createContext(null);
	return globalState[_SERVER_INSERTED_HTML_CTX_KEY] ?? null;
}
getServerInsertedHTMLContext();
var isServer = typeof window === "undefined";
function getCurrentInterceptionContext() {
	if (isServer) return null;
	return stripBasePath(window.location.pathname, "");
}
/** Get or create the shared in-memory RSC prefetch cache on window. */
function getPrefetchCache() {
	if (isServer) return /* @__PURE__ */ new Map();
	if (!window.__VINEXT_RSC_PREFETCH_CACHE__) window.__VINEXT_RSC_PREFETCH_CACHE__ = /* @__PURE__ */ new Map();
	return window.__VINEXT_RSC_PREFETCH_CACHE__;
}
/**
* Get or create the shared set of already-prefetched RSC URLs on window.
* Keyed by interception-aware cache key so distinct source routes do not alias.
*/
function getPrefetchedUrls() {
	if (isServer) return /* @__PURE__ */ new Set();
	if (!window.__VINEXT_RSC_PREFETCHED_URLS__) window.__VINEXT_RSC_PREFETCHED_URLS__ = /* @__PURE__ */ new Set();
	return window.__VINEXT_RSC_PREFETCHED_URLS__;
}
/**
* Evict prefetch cache entries if at capacity.
* First sweeps expired entries, then falls back to FIFO eviction.
*/
function evictPrefetchCacheIfNeeded() {
	const cache = getPrefetchCache();
	if (cache.size < 50) return;
	const now = Date.now();
	const prefetched = getPrefetchedUrls();
	for (const [key, entry] of cache) if (now - entry.timestamp >= 3e4) {
		cache.delete(key);
		prefetched.delete(key);
	}
	while (cache.size >= 50) {
		const oldest = cache.keys().next().value;
		if (oldest !== void 0) {
			cache.delete(oldest);
			prefetched.delete(oldest);
		} else break;
	}
}
/**
* Snapshot an RSC response to an ArrayBuffer for caching and replay.
* Consumes the response body and stores it with content-type and URL metadata.
*/
async function snapshotRscResponse(response) {
	return {
		buffer: await response.arrayBuffer(),
		contentType: response.headers.get("content-type") ?? "text/x-component",
		mountedSlotsHeader: response.headers.get(VINEXT_MOUNTED_SLOTS_HEADER),
		paramsHeader: response.headers.get(VINEXT_PARAMS_HEADER),
		url: response.url
	};
}
/**
* Prefetch an RSC response and snapshot it for later consumption.
* Stores the in-flight promise so immediate clicks can await it instead
* of firing a duplicate fetch.
* Enforces a maximum cache size to prevent unbounded memory growth on
* link-heavy pages.
*/
function prefetchRscResponse(rscUrl, fetchPromise, interceptionContext = null, mountedSlotsHeader = null) {
	const cacheKey = AppElementsWire.encodeCacheKey(rscUrl, interceptionContext);
	const cache = getPrefetchCache();
	const prefetched = getPrefetchedUrls();
	const entry = {
		outcome: "pending",
		timestamp: Date.now()
	};
	entry.pending = fetchPromise.then(async (response) => {
		if (response.ok) entry.snapshot = {
			...await snapshotRscResponse(response),
			mountedSlotsHeader
		};
		else {
			prefetched.delete(cacheKey);
			cache.delete(cacheKey);
		}
	}).catch(() => {
		prefetched.delete(cacheKey);
		cache.delete(cacheKey);
	}).finally(() => {
		entry.pending = void 0;
		if (entry.snapshot) entry.outcome = "cache-seeded";
	});
	cache.set(cacheKey, entry);
	evictPrefetchCacheIfNeeded();
}
var _CLIENT_NAV_STATE_KEY = Symbol.for("vinext.clientNavigationState");
var _MOUNTED_SLOTS_HEADER_KEY = Symbol.for("vinext.mountedSlotsHeader");
function getMountedSlotsHeader() {
	if (isServer) return null;
	return window[_MOUNTED_SLOTS_HEADER_KEY] ?? null;
}
function getClientNavigationState() {
	if (isServer) return null;
	const globalState = window;
	globalState[_CLIENT_NAV_STATE_KEY] ??= {
		listeners: /* @__PURE__ */ new Set(),
		cachedSearch: window.location.search,
		cachedReadonlySearchParams: new ReadonlyURLSearchParams(window.location.search),
		cachedPathname: stripBasePath(window.location.pathname, ""),
		clientParams: {},
		clientParamsJson: "{}",
		pendingClientParams: null,
		pendingClientParamsJson: null,
		pendingPathname: null,
		pendingPathnameNavId: null,
		originalPushState: window.history.pushState.bind(window.history),
		originalReplaceState: window.history.replaceState.bind(window.history),
		patchInstalled: false,
		hasPendingNavigationUpdate: false,
		suppressUrlNotifyCount: 0,
		navigationSnapshotActiveCount: 0
	};
	return globalState[_CLIENT_NAV_STATE_KEY];
}
function notifyNavigationListeners() {
	const state = getClientNavigationState();
	if (!state) return;
	for (const fn of state.listeners) fn();
}
function syncCommittedUrlStateFromLocation() {
	const state = getClientNavigationState();
	if (!state) return false;
	let changed = false;
	const pathname = stripBasePath(window.location.pathname, "");
	if (pathname !== state.cachedPathname) {
		state.cachedPathname = pathname;
		changed = true;
	}
	const search = window.location.search;
	if (search !== state.cachedSearch) {
		state.cachedSearch = search;
		state.cachedReadonlySearchParams = new ReadonlyURLSearchParams(search);
		changed = true;
	}
	return changed;
}
/**
* Check if a href is an external URL (any URL scheme per RFC 3986, or protocol-relative).
*/
function isExternalUrl(href) {
	return /^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith("//");
}
/**
* Check if a href is only a hash change relative to the current URL.
*/
function isHashOnlyChange(href) {
	if (typeof window === "undefined") return false;
	if (href.startsWith("#")) return true;
	return isHashOnlyBrowserUrlChange(href, window.location.href, "");
}
/**
* Scroll to a hash target element, or to the top if no hash.
*/
function scrollToHash(hash) {
	if (!hash || hash === "#") {
		window.scrollTo(0, 0);
		return;
	}
	const id = hash.slice(1);
	const element = document.getElementById(id);
	if (element) element.scrollIntoView({ behavior: "auto" });
}
function withSuppressedUrlNotifications(fn) {
	const state = getClientNavigationState();
	if (!state) return fn();
	state.suppressUrlNotifyCount += 1;
	try {
		return fn();
	} finally {
		state.suppressUrlNotifyCount -= 1;
	}
}
/**
* Commit pending client navigation state to committed snapshots.
*
* navId is optional: callers that don't own pendingPathname (for example,
* superseded pre-paint cleanup) may pass undefined to flush URL/params state
* without clearing pendingPathname owned by the active navigation. Such callers
* must opt in explicitly if they also own an activated render snapshot.
*/
function commitClientNavigationState(navId, options) {
	if (isServer) return;
	const state = getClientNavigationState();
	if (!state) return;
	if ((navId !== void 0 || options?.releaseSnapshot === true) && state.navigationSnapshotActiveCount > 0) state.navigationSnapshotActiveCount -= 1;
	const urlChanged = syncCommittedUrlStateFromLocation();
	if (state.pendingClientParams !== null && state.pendingClientParamsJson !== null) {
		state.clientParams = state.pendingClientParams;
		state.clientParamsJson = state.pendingClientParamsJson;
		state.pendingClientParams = null;
		state.pendingClientParamsJson = null;
	}
	if (state.pendingPathnameNavId === null || navId !== void 0 && state.pendingPathnameNavId === navId) {
		state.pendingPathname = null;
		state.pendingPathnameNavId = null;
	}
	const shouldNotify = urlChanged || state.hasPendingNavigationUpdate;
	state.hasPendingNavigationUpdate = false;
	if (shouldNotify) notifyNavigationListeners();
}
function pushHistoryStateWithoutNotify(data, unused, url) {
	withSuppressedUrlNotifications(() => {
		getClientNavigationState()?.originalPushState.call(window.history, data, unused, url);
	});
}
function replaceHistoryStateWithoutNotify(data, unused, url) {
	withSuppressedUrlNotifications(() => {
		getClientNavigationState()?.originalReplaceState.call(window.history, data, unused, url);
	});
}
/**
* Save the current scroll position into the current history state.
* Called before every navigation to enable scroll restoration on back/forward.
*
* Uses replaceHistoryStateWithoutNotify to avoid triggering the patched
* history.replaceState interception (which would cause spurious re-renders).
*/
function saveScrollPosition() {
	replaceHistoryStateWithoutNotify({
		...window.history.state ?? {},
		__vinext_scrollX: window.scrollX,
		__vinext_scrollY: window.scrollY
	}, "");
}
/**
* Restore scroll position from a history state object (used on popstate).
*
* When an RSC navigation is in flight (back/forward triggers both this
* handler and the browser entry's popstate handler which calls
* __VINEXT_RSC_NAVIGATE__), we must wait for the new content to render
* before scrolling. Otherwise the user sees old content flash at the
* restored scroll position.
*
* This handler fires before the browser entry's popstate handler (because
* navigation.ts is loaded before hydration completes), so we defer via a
* microtask to give the browser entry handler a chance to set
* __VINEXT_RSC_PENDING__. Promise.resolve() schedules a microtask
* that runs after all synchronous event listeners have completed.
*/
function restoreScrollPosition(state) {
	if (state && typeof state === "object" && "__vinext_scrollY" in state) {
		const { __vinext_scrollX: x, __vinext_scrollY: y } = state;
		Promise.resolve().then(() => {
			const pending = window.__VINEXT_RSC_PENDING__ ?? null;
			if (pending) pending.then(() => {
				requestAnimationFrame(() => {
					window.scrollTo(x, y);
				});
			});
			else requestAnimationFrame(() => {
				window.scrollTo(x, y);
			});
		});
	}
}
/**
* Navigate to a URL, handling external URLs, hash-only changes, and RSC navigation.
*/
async function navigateClientSide(href, mode, scroll, programmaticTransition = false) {
	let normalizedHref = href;
	if (isExternalUrl(href)) {
		const localPath = toSameOriginAppPath(href, "");
		if (localPath == null) {
			if (mode === "replace") window.location.replace(href);
			else window.location.assign(href);
			return;
		}
		normalizedHref = localPath;
	}
	const fullHref = toBrowserNavigationHref(normalizedHref, window.location.href, "");
	notifyAppRouterTransitionStart(fullHref, mode);
	if (mode === "push") saveScrollPosition();
	if (isHashOnlyChange(fullHref)) {
		const hash = fullHref.includes("#") ? fullHref.slice(fullHref.indexOf("#")) : "";
		if (mode === "replace") replaceHistoryStateWithoutNotify(null, "", fullHref);
		else pushHistoryStateWithoutNotify(null, "", fullHref);
		commitClientNavigationState();
		if (scroll) scrollToHash(hash);
		return;
	}
	const hashIdx = fullHref.indexOf("#");
	const hash = hashIdx !== -1 ? fullHref.slice(hashIdx) : "";
	if (typeof window.__VINEXT_RSC_NAVIGATE__ === "function") await window.__VINEXT_RSC_NAVIGATE__(fullHref, 0, "navigate", mode, void 0, programmaticTransition);
	else {
		if (mode === "replace") replaceHistoryStateWithoutNotify(null, "", fullHref);
		else pushHistoryStateWithoutNotify(null, "", fullHref);
		commitClientNavigationState();
	}
	if (scroll) if (hash) scrollToHash(hash);
	else window.scrollTo(0, 0);
}
/**
* App Router public router instance. Mirrors Next.js's
* `publicAppRouterInstance` from
* `packages/next/src/client/components/app-router-instance.ts`.
*
* Exported so the App Router browser entry can install it on
* `window.next.router` for Next.js parity (see `client/window-next.ts`).
* Internal callers in this file continue to use `_appRouter` for brevity.
*/
var _appRouter = {
	bfcacheId: "0",
	push(href, options) {
		assertSafeNavigationUrl(href);
		if (isServer) return;
		import_react.startTransition(() => {
			navigateClientSide(href, "push", options?.scroll !== false, true);
		});
	},
	replace(href, options) {
		assertSafeNavigationUrl(href);
		if (isServer) return;
		import_react.startTransition(() => {
			navigateClientSide(href, "replace", options?.scroll !== false, true);
		});
	},
	back() {
		if (isServer) return;
		window.history.back();
	},
	forward() {
		if (isServer) return;
		window.history.forward();
	},
	refresh() {
		if (isServer) return;
		const clearCaches = window.__VINEXT_CLEAR_NAV_CACHES__;
		if (typeof clearCaches === "function") clearCaches();
		const rscNavigate = window.__VINEXT_RSC_NAVIGATE__;
		if (typeof rscNavigate === "function") {
			const navigate = () => {
				rscNavigate(window.location.href, 0, "refresh", void 0, void 0, true);
			};
			import_react.startTransition(navigate);
		}
	},
	prefetch(href) {
		assertSafeNavigationUrl(href);
		if (isServer) return;
		(async () => {
			let prefetchHref = href;
			if (href.startsWith("http://") || href.startsWith("https://") || href.startsWith("//")) {
				const localPath = toSameOriginAppPath(href, "");
				if (localPath == null) return;
				prefetchHref = localPath;
			}
			const fullHref = toBrowserNavigationHref(prefetchHref, window.location.href, "");
			const interceptionContext = getCurrentInterceptionContext();
			const mountedSlotsHeader = getMountedSlotsHeader();
			const headers = createRscRequestHeaders({ interceptionContext });
			if (mountedSlotsHeader) headers.set(VINEXT_MOUNTED_SLOTS_HEADER, mountedSlotsHeader);
			const rscUrl = await createRscRequestUrl(fullHref, headers);
			const cacheKey = AppElementsWire.encodeCacheKey(rscUrl, interceptionContext);
			const prefetched = getPrefetchedUrls();
			if (prefetched.has(cacheKey)) return;
			prefetched.add(cacheKey);
			prefetchRscResponse(rscUrl, fetch(rscUrl, {
				headers,
				credentials: "include",
				priority: "low"
			}), interceptionContext, mountedSlotsHeader);
		})().catch((error) => {
			console.error("[vinext] RSC prefetch setup error:", error);
		});
	}
};
/**
* App Router's useRouter — returns push/replace/back/forward/refresh.
* Different from Pages Router's useRouter (next/router).
*
* Returns a stable singleton: the same object reference on every call,
* matching Next.js behavior so components using referential equality
* (e.g. useMemo / useEffect deps, React.memo) don't re-render unnecessarily.
*/
function useRouter() {
	return _appRouter;
}
if (!isServer) {
	const state = getClientNavigationState();
	if (state && !state.patchInstalled) {
		state.patchInstalled = true;
		window.addEventListener("popstate", (event) => {
			if (typeof window.__VINEXT_RSC_NAVIGATE__ !== "function") {
				commitClientNavigationState();
				restoreScrollPosition(event.state);
			}
		});
		window.history.pushState = function patchedPushState(data, unused, url) {
			state.originalPushState.call(window.history, data, unused, url);
			if (state.suppressUrlNotifyCount === 0) commitClientNavigationState();
		};
		window.history.replaceState = function patchedReplaceState(data, unused, url) {
			state.originalReplaceState.call(window.history, data, unused, url);
			if (state.suppressUrlNotifyCount === 0) commitClientNavigationState();
		};
	}
}
//#endregion
//#region app/portfolio-data.ts
var projects = [
	{
		slug: "ludo-schema",
		number: "01",
		title: "LUDO//SCHEMA",
		cartridgeTitle: "LUDO//SCHEMA",
		kicker: "AI 游戏生成与玩法验证平台",
		short: "把自然语言创意翻译成结构化蓝图与可玩 Demo。",
		summary: "针对大模型难以稳定理解复杂游戏创意的问题，我设计 Game Schema 抽象模型，打通“创意输入—结构化蓝图—可玩 Demo”的生成链路。",
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
		tools: [
			"DeepSeek API",
			"Game Schema",
			"Canvas",
			"Cloudflare",
			"AI Workflow"
		],
		highlights: [
			"先将自然语言创意拆成核心循环、实体、规则、资源和状态转换，用 Game Schema 为 AI 建立明确的理解边界。",
			"把一次生成拆成“需求澄清—结构化蓝图—Demo 生成—运行检查”多阶段流程，避免依赖单次长 Prompt。",
			"通过结构化输出约束、生成代码检查和服务端安全控制，提高 AI 结果的可执行性与稳定性。",
			"将运行错误和试玩反馈重新整理为修正任务，驱动最多两轮自动修复，并用版本历史与 A/B 对比验证改动。"
		],
		results: [
			{
				value: "2",
				label: "生成路径"
			},
			{
				value: "4",
				label: "安全控制层"
			},
			{
				value: "∞",
				label: "可迭代版本"
			}
		],
		sections: [
			{
				title: "产品目标",
				text: "让没有完整开发团队的创作者，也能把一句模糊的游戏想法转化为可检查、可修改、可试玩的系统。"
			},
			{
				title: "核心设计",
				text: "将游戏拆解为核心循环、实体、系统、规则、资源、胜负条件与平衡参数，并建立从需求到实现的追踪关系。"
			},
			{
				title: "AI 工作流",
				text: "通过需求澄清、结构化输出、Prompt 约束、结果检查、运行错误捕获和自动修复，提高 Demo 的可运行性与需求一致性。"
			}
		]
	},
	{
		slug: "bababoi",
		number: "02",
		title: "Bababoi · 巴巴博弈",
		cartridgeTitle: "BABABOI",
		kicker: "双人对战卡牌游戏",
		short: "出牌、猜测、反制与揭牌构成的魔术师心理博弈。",
		summary: "从零设计并完成双人魔术师对战卡牌游戏，围绕攻击、防御、状态三类卡牌建立可读、可配置、可联机测试的对抗系统。",
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
		tools: [
			"Godot",
			"AI Agent",
			"C#",
			"Git",
			"Windows Export"
		],
		highlights: [
			"先由我定义攻击、防御、状态三类卡牌的对抗关系，再把规则拆成费用、触发条件、技能效果和联机响应任务交给 AI 实现。",
			"将 21 项技能与 22 张卡牌整理成统一数据结构，让 AI 按配置扩展内容，减少重复代码和修改成本。",
			"把功能拆成手牌、揭示、日志、图鉴和舞台反馈等小任务，逐项生成、运行和验收，避免一次修改影响整个系统。",
			"把报错信息、复现步骤和预期结果一起提供给 AI 定位问题，再通过双窗口联机与多分辨率测试确认修复结果。"
		],
		results: [
			{
				value: "22",
				label: "张卡牌"
			},
			{
				value: "21",
				label: "项技能"
			},
			{
				value: "36",
				label: "项核心测试"
			}
		],
		sections: [
			{
				title: "玩法构想",
				text: "两名魔术师通过隐藏出牌、猜测意图、反制与揭牌争夺胜利，让信息差成为每一轮决策的核心张力。"
			},
			{
				title: "系统设计",
				text: "设计卡牌费用、能量、技能效果、状态与联机响应规则，并整理为可配置数据结构，方便扩展和 AI 修改。"
			},
			{
				title: "交付验证",
				text: "完成 1280×720 与 1920×1080 双窗口联机测试、36 项核心测试及 Windows 版本导出。"
			}
		]
	},
	{
		slug: "merge-monster",
		number: "03",
		title: "Monster Merge Battle",
		cartridgeTitle: "MERGE MONSTER",
		kicker: "怪诞手绘合成塔防",
		short: "购买、召唤、合成怪物，构筑阵容并击败连续 Boss。",
		summary: "从零设计并完成合成塔防游戏，通过购买、召唤与合成怪物组建队伍，在连续遭遇中选择 Buff、解锁物种并调整阵容。",
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
		tools: [
			"Godot",
			"AI Agent",
			"C#",
			"Game Design",
			"Playtest"
		],
		highlights: [
			"先用策划文档明确核心循环、关卡阶段和系统依赖，再将购买、召唤、合成、战斗与奖励拆成可独立验收的 AI 开发任务。",
			"为固定契约、阵容槽位和怪物等级建立统一规则，要求 AI 在既有数据结构内实现功能，避免玩法逻辑失控。",
			"将试玩中发现的流程问题转化为具体修改指令，补齐新手引导、奖励选择、免费刷新、存档续玩与 Boss 解锁。",
			"由 AI 辅助程序、UI 和资源配置，我负责判断玩法是否成立、检查运行结果并决定下一轮迭代优先级。"
		],
		results: [
			{
				value: "4",
				label: "场连续遭遇"
			},
			{
				value: "5",
				label: "个阵容槽"
			},
			{
				value: "3",
				label: "阶段战斗节奏"
			}
		],
		sections: [
			{
				title: "核心循环",
				text: "购买怪物、召唤上阵、同物种合成、自动战斗、领取奖励，再根据下一场遭遇调整阵容。"
			},
			{
				title: "关卡节奏",
				text: "用早中晚三阶段战斗与普通关、Boss 关交替组织四场连续遭遇，让构筑选择持续产生反馈。"
			},
			{
				title: "完整体验",
				text: "补齐引导、奖励选择、免费刷新、存档续玩和 Boss 解锁，使 Demo 从单一战斗升级为完整可玩流程。"
			}
		]
	},
	{
		slug: "slap",
		number: "04",
		title: "Slap! · 蟑螂与人之战",
		cartridgeTitle: "SLAP!",
		kicker: "双人同机漫画对战",
		short: "节奏快速、反馈夸张的双人同机 PK 小游戏。",
		summary: "以人类与蟑螂的荒诞对决为主题，制作双人同机 PK 小游戏，用漫画分镜、速度线和夸张反馈强化即时对抗。",
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
		tools: [
			"秒哒",
			"Game Design",
			"Rapid Prototype",
			"Playtest"
		],
		highlights: [
			"先把荒诞主题压缩为双方目标、操作方式、胜负条件和核心反馈，让 AI 生成平台获得清晰且有限的实现范围。",
			"按照“先完成双人对抗闭环，再补充漫画反馈”的顺序推进，优先验证玩法而不是同时堆叠功能。",
			"把速度线、拟声词和击打停顿描述为可执行的视觉反馈规则，减少 AI 对“漫画感”的模糊理解。",
			"通过快速试玩检查操作是否易懂、胜负是否明确，再针对具体体验问题调整生成要求并完成原型。"
		],
		results: [
			{
				value: "2P",
				label: "同机对战"
			},
			{
				value: "17s",
				label: "高密度演示"
			},
			{
				value: "1",
				label: "完整快速原型"
			}
		],
		sections: [
			{
				title: "创意方向",
				text: "用人类与蟑螂的荒诞身份差制造天然冲突，让玩家无需说明就能理解对抗关系。"
			},
			{
				title: "交互表达",
				text: "用速度线、拟声词、网点和强烈击打停顿建立漫画感，让每一次操作都拥有即时反馈。"
			},
			{
				title: "快速落地",
				text: "控制玩法范围，在短周期内完成双人操作、胜负规则、视觉反馈和演示版本。"
			}
		]
	}
];
var abilities = [
	{
		index: "1",
		icon: "⌁",
		title: "规则拆解器",
		english: "SYSTEM ABSTRACTION",
		description: "把模糊创意拆成核心循环、实体、资源、状态、规则与胜负条件，让复杂机制可以被团队与 AI 共同执行。",
		evidence: [
			"Game Schema 抽象模型",
			"21 项技能数据配置",
			"需求—规则—实现追踪"
		]
	},
	{
		index: "2",
		icon: "✣",
		title: "AI 协作引擎",
		english: "AGENT COLLABORATION",
		description: "将产品需求转化为结构化任务与 Agent 指令，通过检查、反馈和修正闭环推进开发与内容生产。",
		evidence: [
			"多阶段 AI 工作流",
			"运行错误捕获与自动修复",
			"AI 视频全流程制作"
		]
	},
	{
		index: "3",
		icon: "▶",
		title: "原型制造器",
		english: "RAPID PROTOTYPING",
		description: "从策划方案到可运行 Demo，持续用试玩、测试与版本对比验证玩法，而不是停留在概念文档。",
		evidence: [
			"4 个可运行项目",
			"36 项核心测试",
			"Windows 版本与线上产品交付"
		]
	}
];
//#endregion
//#region app/page.tsx
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const router = useRouter();
	const [selectedSlug, setSelectedSlug] = (0, import_react.useState)("ludo-schema");
	const [soundOn, setSoundOn] = (0, import_react.useState)(false);
	const [launching, setLaunching] = (0, import_react.useState)(false);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const audioContext = (0, import_react.useRef)(null);
	const selected = projects.find((project) => project.slug === selectedSlug);
	function blip(frequency = 320, duration = .055) {
		if (!soundOn || typeof window === "undefined") return;
		const AudioCtx = window.AudioContext || window.webkitAudioContext;
		audioContext.current ??= new AudioCtx();
		const context = audioContext.current;
		const oscillator = context.createOscillator();
		const gain = context.createGain();
		oscillator.type = "square";
		oscillator.frequency.setValueAtTime(frequency, context.currentTime);
		gain.gain.setValueAtTime(.035, context.currentTime);
		gain.gain.exponentialRampToValueAtTime(1e-4, context.currentTime + duration);
		oscillator.connect(gain);
		gain.connect(context.destination);
		oscillator.start();
		oscillator.stop(context.currentTime + duration);
	}
	function chooseProject(slug) {
		setSelectedSlug(slug);
		blip(250 + projects.findIndex((project) => project.slug === slug) * 90);
	}
	function openProject() {
		blip(120, .11);
		setLaunching(true);
		const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		window.setTimeout(() => router.push(`/projects/${selected.slug}`), reduced ? 0 : 480);
	}
	async function copyEmail() {
		await navigator.clipboard.writeText("982846249@qq.com");
		setCopied(true);
		blip(520);
		window.setTimeout(() => setCopied(false), 1600);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: `site-shell theme-${selected.theme} ${launching ? "is-launching" : ""}`,
		style: {
			"--project": selected.color,
			"--project-dark": selected.dark,
			"--project-soft": selected.soft
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "topbar",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						className: "brand-lockup",
						href: "#top",
						"aria-label": "返回首页顶部",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "brand-chip",
							children: "MP"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "MADE PLAYABLE" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "YIN TIANJIAO / PORTFOLIO" })] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						"aria-label": "主导航",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#work",
								children: "作品"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#skills",
								children: "核心能力"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#experience",
								children: "经历"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "/resume-yin-tianjiao.pdf",
								target: "_blank",
								children: "简历"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#contact",
								children: "联系"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: `sound-toggle ${soundOn ? "is-on" : ""}`,
						type: "button",
						"aria-pressed": soundOn,
						onClick: () => setSoundOn((value) => !value),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								"aria-hidden": "true",
								children: soundOn ? "●" : "○"
							}),
							"声音 ",
							soundOn ? "开" : "关"
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "hero",
				id: "top",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hero-copy",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "eyebrow",
							children: ["AI-NATIVE GAME PRODUCT DESIGNER", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "AVAILABLE FOR INTERNSHIP" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", { children: [
							"让创意，",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "变得可玩。" })
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "hero-lead",
							children: "我是阴天骄，希望从事 AI 产品经理相关工作。我具备玩法抽象、规则设计和 AI 协作开发经验，能够将模糊想法梳理为结构化需求，并推进为可运行、可测试的产品原型。"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hero-actions",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								className: "button button-primary",
								href: "#work",
								children: ["选择作品卡带 ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "↓" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								className: "button button-ghost",
								href: "/resume-yin-tianjiao.pdf",
								target: "_blank",
								children: "查看简历 ↗"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "hero-proof",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: "个完整项目" })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "25+" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: "条投放素材" })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "564.8w" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: "累计曝光" })] })
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "prototype-wrap",
					id: "work",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "machine-shadow" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "prototype-machine",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "machine-top",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "machine-label",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "THE PROTOTYPE MACHINE" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "MODEL MP-04" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "status-lights",
									"aria-label": "机器运行中",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "machine-screen",
								onDragOver: (event) => event.preventDefault(),
								onDrop: (event) => {
									event.preventDefault();
									const slug = event.dataTransfer.getData("text/plain");
									if (projects.some((project) => project.slug === slug)) chooseProject(slug);
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "screen-screws",
										"aria-hidden": "true",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "screen-header",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["NOW PLAYING / ", selected.number] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "live-indicator",
											children: "● LIVE PREVIEW"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "preview-frame",
										children: [
											selected.preview ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
												autoPlay: true,
												muted: true,
												loop: true,
												playsInline: true,
												poster: selected.poster,
												"aria-label": `${selected.title} 项目预览`,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("source", {
													src: selected.preview,
													type: "video/webm"
												})
											}, selected.preview) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "schema-demo",
												"aria-label": "LUDO Schema 抽象模型演示",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "schema-orbit orbit-one" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "schema-orbit orbit-two" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "schema-node node-a",
														children: "IDEA"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "schema-node node-b",
														children: "RULES"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "schema-node node-c",
														children: "LOOP"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "schema-node node-d",
														children: "DEMO"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "L//S" })
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "preview-scanline" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "preview-caption",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: selected.kicker }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: selected.title }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: selected.short })
												]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "project-readout",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "ROLE" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: selected.role })] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "PERIOD" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: selected.period })] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "OUTPUT" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: selected.output })] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: openProject,
												children: ["打开项目 ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "↗" })]
											})
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "cartridge-bay",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bay-slot",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "INSERT PROJECT" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "machine-knob",
									"aria-hidden": "true",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "cartridge-shelf",
								"aria-label": "选择作品",
								children: projects.map((project) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: `cartridge cartridge-${project.theme} ${selected.slug === project.slug ? "is-selected" : ""}`,
									type: "button",
									draggable: true,
									"aria-pressed": selected.slug === project.slug,
									onDragStart: (event) => {
										event.dataTransfer.setData("text/plain", project.slug);
										event.dataTransfer.effectAllowed = "move";
									},
									onMouseEnter: () => chooseProject(project.slug),
									onFocus: () => chooseProject(project.slug),
									onClick: () => chooseProject(project.slug),
									style: { "--card-color": project.color },
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "cartridge-grip" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "cartridge-number",
											children: project.number
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: project.cartridgeTitle }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: project.genre }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: project.symbol })
									]
								}, project.slug))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "machine-hint",
								children: "点击或拖拽卡带 · 选择作品后打开完整档案"
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "capabilities section-block",
				id: "skills",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "section-heading",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "CORE MODULES / 03" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", { children: [
							"这些能力，",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							"来自实际项目。"
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "点击模块，查看对应的项目与工作内容。" })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "module-grid",
					children: abilities.map((ability) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
						className: `ability-module module-${ability.index}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
							onClick: () => blip(380 + Number(ability.index) * 50),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "module-index",
									children: ["0", ability.index]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "module-icon",
									"aria-hidden": "true",
									children: ability.icon
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: ability.title }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: ability.english }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: "+" })
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "module-content",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: ability.description }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: ability.evidence.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: item }, item)) })]
						})]
					}, ability.title))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "experience section-block",
				id: "experience",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "section-heading compact",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "ACTIVITY LOG / 2023—NOW" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", { children: [
						"从课堂创作，",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						"到真实产品与投放。"
					] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "activity-board",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "activity-feature",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "activity-pin",
								children: "CURRENT"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "2026.03 — 至今" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "点点互动（北京）科技有限公司" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "AI 创意生成实习" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "activity-copy",
								children: "将产品卖点拆解为脚本、分镜、镜头和节奏，使用 AI 工具完成视频素材全流程制作， 并根据投放反馈持续优化表达。"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "result-tape",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "25+" }), " 条素材"] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "564.8w" }), " 曝光"] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "3000+" }), " 下载"] })
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "activity-stack",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "2023 — 2027" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "中国传媒大学" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "艺术与科技 · 本科" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "游戏心理学 / 用户体验分析 / 游戏数据分析 / 游戏项目管理" })
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "TOOLS & LANGUAGES" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "我的制作工具箱" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Godot · Unity · C# · Codex · Claude · ChatGPT" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Figma / Axure / Git / 飞书文档 / Excel · CET-6" })
						] })]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "contact-panel",
				id: "contact",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "READY FOR THE NEXT BUILD?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", { children: [
					"一起把下一个想法，",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
					"做成可以验证的产品。"
				] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "contact-actions",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "button button-primary",
							type: "button",
							onClick: copyEmail,
							children: copied ? "邮箱已复制 ✓" : "复制邮箱"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							className: "button button-ghost",
							href: "mailto:982846249@qq.com",
							children: "发送邮件 ↗"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							className: "button button-resume",
							href: "/resume-yin-tianjiao.pdf",
							download: true,
							children: "下载简历 ↓"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "982846249@qq.com · 北京" })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "MADE PLAYABLE © 2026 YIN TIANJIAO" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				href: "/projects/ludo-schema",
				children: "从旗舰项目开始 ↗"
			})] })
		]
	});
}
//#endregion
export { Home as default };
