"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { abilities, projects } from "./portfolio-data";

export default function Home() {
  const router = useRouter();
  const [selectedSlug, setSelectedSlug] = useState("ludo-schema");
  const [soundOn, setSoundOn] = useState(false);
  const [launching, setLaunching] = useState(false);
  const [copied, setCopied] = useState(false);
  const audioContext = useRef<AudioContext | null>(null);
  const selected = projects.find((project) => project.slug === selectedSlug)!;

  function blip(frequency = 320, duration = 0.055) {
    if (!soundOn || typeof window === "undefined") return;
    const AudioCtx =
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    audioContext.current ??= new AudioCtx();
    const context = audioContext.current;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(frequency, context.currentTime);
    gain.gain.setValueAtTime(0.035, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      context.currentTime + duration,
    );
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + duration);
  }

  function chooseProject(slug: string) {
    setSelectedSlug(slug);
    blip(250 + projects.findIndex((project) => project.slug === slug) * 90);
  }

  function openProject() {
    blip(120, 0.11);
    setLaunching(true);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(
      () => router.push(`/projects/${selected.slug}`),
      reduced ? 0 : 480,
    );
  }

  async function copyEmail() {
    await navigator.clipboard.writeText("982846249@qq.com");
    setCopied(true);
    blip(520);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <main
      className={`site-shell theme-${selected.theme} ${launching ? "is-launching" : ""}`}
      style={
        {
          "--project": selected.color,
          "--project-dark": selected.dark,
          "--project-soft": selected.soft,
        } as React.CSSProperties
      }
    >
      <header className="topbar">
        <a className="brand-lockup" href="#top" aria-label="返回首页顶部">
          <span className="brand-chip">MP</span>
          <span>
            <strong>MADE PLAYABLE</strong>
            <small>YIN TIANJIAO / PORTFOLIO</small>
          </span>
        </a>
        <nav aria-label="主导航">
          <a href="#work">作品</a>
          <a href="#skills">核心能力</a>
          <a href="#experience">经历</a>
          <a href="/resume-yin-tianjiao.pdf" target="_blank">
            简历
          </a>
          <a href="#contact">联系</a>
        </nav>
        <button
          className={`sound-toggle ${soundOn ? "is-on" : ""}`}
          type="button"
          aria-pressed={soundOn}
          onClick={() => setSoundOn((value) => !value)}
        >
          <span aria-hidden="true">{soundOn ? "●" : "○"}</span>
          声音 {soundOn ? "开" : "关"}
        </button>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">
            AI-NATIVE GAME PRODUCT DESIGNER
            <span>AVAILABLE FOR INTERNSHIP</span>
          </p>
          <h1>
            让创意，
            <br />
            <em>变得可玩。</em>
          </h1>
          <p className="hero-lead">
            我是阴天骄，希望从事 AI 产品经理相关工作。我具备玩法抽象、规则设计和
            AI 协作开发经验，能够将模糊想法梳理为结构化需求，并推进为可运行、可测试的产品原型。
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#work">
              选择作品卡带 <span>↓</span>
            </a>
            <a
              className="button button-ghost"
              href="/resume-yin-tianjiao.pdf"
              target="_blank"
            >
              查看简历 ↗
            </a>
          </div>
          <dl className="hero-proof">
            <div>
              <dt>4</dt>
              <dd>个完整项目</dd>
            </div>
            <div>
              <dt>25+</dt>
              <dd>条投放素材</dd>
            </div>
            <div>
              <dt>564.8w</dt>
              <dd>累计曝光</dd>
            </div>
          </dl>
        </div>

        <div className="prototype-wrap" id="work">
          <div className="machine-shadow" />
          <div className="prototype-machine">
            <div className="machine-top">
              <div className="machine-label">
                <span>THE PROTOTYPE MACHINE</span>
                <strong>MODEL MP-04</strong>
              </div>
              <div className="status-lights" aria-label="机器运行中">
                <i />
                <i />
                <i />
              </div>
            </div>

            <div
              className="machine-screen"
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                const slug = event.dataTransfer.getData("text/plain");
                if (projects.some((project) => project.slug === slug)) {
                  chooseProject(slug);
                }
              }}
            >
              <div className="screen-screws" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
              </div>
              <div className="screen-header">
                <span>NOW PLAYING / {selected.number}</span>
                <span className="live-indicator">● LIVE PREVIEW</span>
              </div>
              <div className="preview-frame">
                {selected.preview ? (
                  <video
                    key={selected.preview}
                    autoPlay
                    muted
                    loop
                    playsInline
                    poster={selected.poster}
                    aria-label={`${selected.title} 项目预览`}
                  >
                    <source src={selected.preview} type="video/webm" />
                  </video>
                ) : (
                  <div className="schema-demo" aria-label="LUDO Schema 抽象模型演示">
                    <div className="schema-orbit orbit-one" />
                    <div className="schema-orbit orbit-two" />
                    <span className="schema-node node-a">IDEA</span>
                    <span className="schema-node node-b">RULES</span>
                    <span className="schema-node node-c">LOOP</span>
                    <span className="schema-node node-d">DEMO</span>
                    <strong>L//S</strong>
                  </div>
                )}
                <div className="preview-scanline" />
                <div className="preview-caption">
                  <p>{selected.kicker}</p>
                  <h2>{selected.title}</h2>
                  <span>{selected.short}</span>
                </div>
              </div>

              <div className="project-readout">
                <div>
                  <span>ROLE</span>
                  <strong>{selected.role}</strong>
                </div>
                <div>
                  <span>PERIOD</span>
                  <strong>{selected.period}</strong>
                </div>
                <div>
                  <span>OUTPUT</span>
                  <strong>{selected.output}</strong>
                </div>
                <button type="button" onClick={openProject}>
                  打开项目 <span>↗</span>
                </button>
              </div>
            </div>

            <div className="cartridge-bay">
              <div className="bay-slot">
                <span>INSERT PROJECT</span>
                <i />
              </div>
              <div className="machine-knob" aria-hidden="true">
                <span />
              </div>
            </div>

            <div className="cartridge-shelf" aria-label="选择作品">
              {projects.map((project) => (
                <button
                  key={project.slug}
                  className={`cartridge cartridge-${project.theme} ${
                    selected.slug === project.slug ? "is-selected" : ""
                  }`}
                  type="button"
                  draggable
                  aria-pressed={selected.slug === project.slug}
                  onDragStart={(event) => {
                    event.dataTransfer.setData("text/plain", project.slug);
                    event.dataTransfer.effectAllowed = "move";
                  }}
                  onMouseEnter={() => chooseProject(project.slug)}
                  onFocus={() => chooseProject(project.slug)}
                  onClick={() => chooseProject(project.slug)}
                  style={{ "--card-color": project.color } as React.CSSProperties}
                >
                  <span className="cartridge-grip" />
                  <span className="cartridge-number">{project.number}</span>
                  <strong>{project.cartridgeTitle}</strong>
                  <small>{project.genre}</small>
                  <i>{project.symbol}</i>
                </button>
              ))}
            </div>
            <p className="machine-hint">
              点击或拖拽卡带 · 选择作品后打开完整档案
            </p>
          </div>
        </div>
      </section>

      <section className="capabilities section-block" id="skills">
        <header className="section-heading">
          <p>CORE MODULES / 03</p>
          <h2>这些能力，<br />来自实际项目。</h2>
          <span>点击模块，查看对应的项目与工作内容。</span>
        </header>
        <div className="module-grid">
          {abilities.map((ability) => (
            <details className={`ability-module module-${ability.index}`} key={ability.title}>
              <summary onClick={() => blip(380 + Number(ability.index) * 50)}>
                <span className="module-index">0{ability.index}</span>
                <span className="module-icon" aria-hidden="true">{ability.icon}</span>
                <strong>{ability.title}</strong>
                <small>{ability.english}</small>
                <i>+</i>
              </summary>
              <div className="module-content">
                <p>{ability.description}</p>
                <ul>
                  {ability.evidence.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            </details>
          ))}
        </div>
      </section>

      <section className="experience section-block" id="experience">
        <header className="section-heading compact">
          <p>ACTIVITY LOG / 2023—NOW</p>
          <h2>从课堂创作，<br />到真实产品与投放。</h2>
        </header>
        <div className="activity-board">
          <article className="activity-feature">
            <div className="activity-pin">CURRENT</div>
            <p>2026.03 — 至今</p>
            <h3>点点互动（北京）科技有限公司</h3>
            <strong>AI 创意生成实习</strong>
            <p className="activity-copy">
              将产品卖点拆解为脚本、分镜、镜头和节奏，使用 AI 工具完成视频素材全流程制作，
              并根据投放反馈持续优化表达。
            </p>
            <div className="result-tape">
              <span><b>25+</b> 条素材</span>
              <span><b>564.8w</b> 曝光</span>
              <span><b>3000+</b> 下载</span>
            </div>
          </article>
          <div className="activity-stack">
            <article>
              <span>2023 — 2027</span>
              <h3>中国传媒大学</h3>
              <p>艺术与科技 · 本科</p>
              <small>游戏心理学 / 用户体验分析 / 游戏数据分析 / 游戏项目管理</small>
            </article>
            <article>
              <span>TOOLS & LANGUAGES</span>
              <h3>我的制作工具箱</h3>
              <p>Godot · Unity · C# · Codex · Claude · ChatGPT</p>
              <small>Figma / Axure / Git / 飞书文档 / Excel · CET-6</small>
            </article>
          </div>
        </div>
      </section>

      <section className="contact-panel" id="contact">
        <div>
          <p>READY FOR THE NEXT BUILD?</p>
          <h2>一起把下一个想法，<br />做成可以验证的产品。</h2>
        </div>
        <div className="contact-actions">
          <button className="button button-primary" type="button" onClick={copyEmail}>
            {copied ? "邮箱已复制 ✓" : "复制邮箱"}
          </button>
          <a className="button button-ghost" href="mailto:982846249@qq.com">
            发送邮件 ↗
          </a>
          <a
            className="button button-resume"
            href="/resume-yin-tianjiao.pdf"
            download
          >
            下载简历 ↓
          </a>
          <small>982846249@qq.com · 北京</small>
        </div>
      </section>

      <footer>
        <span>MADE PLAYABLE © 2026 YIN TIANJIAO</span>
        <Link href="/projects/ludo-schema">从旗舰项目开始 ↗</Link>
      </footer>
    </main>
  );
}
