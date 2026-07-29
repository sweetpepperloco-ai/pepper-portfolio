import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "../../portfolio-data";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  return project
    ? {
        title: project.title,
        description: project.summary,
      }
    : {};
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();

  return (
    <main
      className={`project-page project-${project.theme}`}
      style={
        {
          "--project": project.color,
          "--project-dark": project.dark,
          "--project-soft": project.soft,
        } as React.CSSProperties
      }
    >
      <header className="project-nav">
        <Link href="/#work" className="back-button">
          ← 返回原型机
        </Link>
        <span>MADE PLAYABLE / CASE {project.number}</span>
        <a href="/resume-yin-tianjiao.pdf" target="_blank">
          查看简历 ↗
        </a>
      </header>

      <section className="project-hero">
        <div className="project-title-block">
          <p>{project.kicker}</p>
          <h1>{project.title}</h1>
          <span>{project.short}</span>
        </div>
        <div className="project-meta-grid">
          <div><small>ROLE</small><strong>{project.role}</strong></div>
          <div><small>PERIOD</small><strong>{project.period}</strong></div>
          <div><small>OUTPUT</small><strong>{project.output}</strong></div>
        </div>
      </section>

      <section className="project-media">
        {project.bvid ? (
          <iframe
            src={`https://player.bilibili.com/player.html?bvid=${project.bvid}&page=1&high_quality=1&danmaku=0`}
            title={`${project.title} 完整演示视频`}
            allowFullScreen
          />
        ) : (
          <div className="detail-schema">
            <span>IDEA</span><i>→</i><span>SCHEMA</span><i>→</i><span>DEMO</span>
            <strong>L//S</strong>
          </div>
        )}
        <aside>
          <p>PROJECT BRIEF</p>
          <h2>项目说明</h2>
          <p>{project.summary}</p>
          <div className="project-links">
            {project.liveUrl && (
              <a className="button button-primary" href={project.liveUrl} target="_blank" rel="noreferrer">
                体验线上产品 ↗
              </a>
            )}
            {project.bvid && (
              <a
                className="button button-ghost"
                href={`https://www.bilibili.com/video/${project.bvid}/`}
                target="_blank"
                rel="noreferrer"
              >
                在 B 站观看 ↗
              </a>
            )}
          </div>
        </aside>
      </section>

      <section className="project-results">
        {project.results.map((result) => (
          <div key={result.label}>
            <strong>{result.value}</strong>
            <span>{result.label}</span>
          </div>
        ))}
      </section>

      <section className="project-story">
        <div className="story-heading">
          <p>HOW IT WAS MADE</p>
          <h2>从想法到可玩产品</h2>
        </div>
        <div className="story-steps">
          {project.sections.map((section, index) => (
            <article key={section.title}>
              <span>0{index + 1}</span>
              <h3>{section.title}</h3>
              <p>{section.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="project-evidence">
        <div>
          <p>AI COLLABORATION LOGIC</p>
          <h2>我的 AI 协作开发方法</h2>
          <p className="evidence-intro">
            我先完成产品判断与系统拆解，再把结构化任务交给 AI；
            通过分步执行、运行验证和反馈修正，提高产出的可控性与完成度。
          </p>
        </div>
        <ul>
          {project.highlights.map((highlight, index) => (
            <li key={highlight}>
              <span>0{index + 1}</span>
              {highlight}
            </li>
          ))}
        </ul>
      </section>

      <section className="tool-strip">
        <span>TOOLBOX</span>
        {project.tools.map((tool) => <b key={tool}>{tool}</b>)}
      </section>

      <nav className="next-project" aria-label="下一个项目">
        {(() => {
          const index = projects.findIndex((item) => item.slug === project.slug);
          const next = projects[(index + 1) % projects.length];
          return (
            <Link href={`/projects/${next.slug}`}>
              <span>NEXT CASE / {next.number}</span>
              <strong>{next.title}</strong>
              <i>→</i>
            </Link>
          );
        })()}
      </nav>
    </main>
  );
}
