"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Bookmark, BookOpen, Check, Clapperboard, Clock3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import "./discovery.css";

export const newsItems = [
  {
    id: "cannes",
    title: "第76届戛纳电影节获奖名单公布",
    time: "2 小时前",
    category: "电影观察",
    summary: "从电影节片单出发，练习观察导演如何用镜头建立人物与空间的关系。",
    body: [
      "这是一篇用于界面演示的示例资讯，标题沿用参考设计；不提供实时新闻或经过核实的获奖名单。",
      "在看片练习中，可以先选择一段双人对话：记录全景、中景和特写的切换，再观察人物视线是否保持连贯。",
      "把观察到的机位画成俯视图，可以帮助你理解镜头之间的空间关系。在互动课堂中，移动摄影机，便能直接比较同侧拍摄与越轴的差别。",
    ],
  },
  {
    id: "aigc-trends",
    title: "AIGC 在影视制作中的应用趋势",
    time: "5 小时前",
    category: "创作工具",
    summary: "把灵感拆成镜头，再思考哪些创作步骤适合借助 AI 完成。",
    body: [
      "这是一篇用于演示阅读流程的示例稿，不是行业研究报告。",
      "以一场双人对话为例，先确定故事目标、角色位置与情绪变化，再写出每个镜头的景别和机位。清晰的分镜能帮助创作者表达画面意图。",
      "你可以进入分镜工作台，调整镜头顺序、时长与画面描述，并导出一份 Markdown 分镜稿，作为下一步创作的起点。",
    ],
  },
  {
    id: "virtual-production",
    title: "国内首部虚拟制片电影即将上映",
    time: "1 天前",
    category: "制作现场",
    summary: "用一个场景练习，理解虚拟背景、摄影机与人物调度之间的关系。",
    body: [
      "这是一篇界面示例稿，标题沿用参考设计；“首部”与上映信息仅作演示文案，不代表已核实的新闻事实。",
      "在场景设计练习中，可以把环境、人物和摄影机分别标注出来。背景再丰富，也需要通过构图、运动与剪辑服务于故事。",
      "先用互动课堂理解轴线，再将机位安排写进分镜。这样，一段抽象的拍摄想法就有了可讨论、可修改的结构。",
    ],
  },
];

type DiscoveryActions = {
  onClassroom: () => void;
  onStudio: () => void;
};

export function NewsPage({ initialId, onClassroom, onStudio }: DiscoveryActions & { initialId?: string }) {
  const [category, setCategory] = useState("全部资讯");
  const [selectedId, setSelectedId] = useState<string | null>(initialId ?? null);
  useEffect(() => { setSelectedId(initialId ?? null); }, [initialId]);
  const article = newsItems.find((item) => item.id === selectedId);
  const categories = ["全部资讯", ...new Set(newsItems.map((item) => item.category))];
  const visibleItems = newsItems.filter((item) => category === "全部资讯" || item.category === category);

  return (
    <div className="discovery-page">
      <header className="discovery-heading">
        <div><h1>行业资讯</h1><p>关注影像创作，发现下一次灵感。</p></div>
        <span className="discovery-demo-badge">示例资讯</span>
      </header>
      <div className="discovery-news-layout">
        <section aria-label={article ? "资讯正文" : "资讯列表"} className="discovery-news-main">
          {article ? (
            <article className="discovery-article">
              <button className="discovery-back" onClick={() => setSelectedId(null)}><ArrowLeft size={16} />返回全部资讯</button>
              <div className="discovery-article-meta"><span>{article.category}</span><span>示例稿 · 约 1 分钟阅读</span></div>
              <h2>{article.title}</h2>
              <p className="discovery-article-summary">{article.summary}</p>
              <div className="discovery-article-body">{article.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
              <div className="discovery-article-actions"><Button onClick={article.id === "aigc-trends" ? onStudio : onClassroom}>{article.id === "aigc-trends" ? "打开分镜工作台" : "进入互动课堂"}<ArrowRight size={16} /></Button></div>
            </article>
          ) : (
            <>
              <div className="discovery-filters" aria-label="资讯分类">{categories.map((item) => <button key={item} aria-pressed={category === item} className={category === item ? "is-active" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div>
              <div className="discovery-news-list">{visibleItems.map((item) => <button key={item.id} className="discovery-news-card" onClick={() => setSelectedId(item.id)}><span className="discovery-news-card-top"><span className="discovery-category">{item.category}</span><span className="discovery-news-time"><Clock3 size={13} />{item.time} · 示例</span></span><strong>{item.title}</strong><span className="discovery-news-summary">{item.summary}</span><span className="discovery-read-more">阅读全文<ArrowRight size={15} /></span></button>)}</div>
              <p className="discovery-source-note">标题与相对时间用于还原参考界面，内容为演示示例，不作为实时新闻。</p>
            </>
          )}
        </section>
        <DiscoveryAside onClassroom={onClassroom} onStudio={onStudio} />
      </div>
    </div>
  );
}

function DiscoveryAside({ onClassroom, onStudio }: DiscoveryActions) {
  return <aside className="discovery-aside"><div className="discovery-aside-illustration" aria-hidden="true"><Clapperboard size={34} /><BookOpen size={28} /></div><h2>让灵感进入镜头</h2><p>理解一条镜头规则，再试着完成自己的第一份分镜。</p><Button onClick={onClassroom}>体验互动课堂<ArrowRight size={16} /></Button><Button variant="outline" onClick={onStudio}>打开分镜工作台</Button></aside>;
}

const communityProjects = [
  { id: "conversation", title: "一场对话，三个机位", category: "导演练习", image: "/assets/original-01.png", description: "用全景与正反打，保持人物之间的空间关系。", shots: "3 个镜头", detail: "先用全景建立两个人物的位置，再分别拍摄同一侧的两个近景。这个示例帮助你把轴线规则转化为一份可以执行的分镜。", points: ["全景建立人物与环境关系", "保持机位在轴线同一侧", "用近景承接人物的情绪变化"] },
  { id: "light", title: "黄昏里的光影叙事", category: "摄影练习", image: "/assets/original-04.jpeg", description: "观察光线方向，为一个安静的场景安排镜头。", shots: "4 个镜头", detail: "这个示例以黄昏场景为创作起点，通过远景、人物中景和环境细节组织画面。进入分镜工作台后，可以把自己的光线观察写进镜头描述。", points: ["确定光线方向和主体位置", "用远近景变化组织视觉节奏", "记录每个镜头的画面与时长"] },
  { id: "future", title: "未来展厅的影像提案", category: "AIGC 创作", image: "/assets/original-03.jpeg", description: "把一个空间概念拆成可讨论、可修改的镜头。", shots: "5 个镜头", detail: "从一句概念描述开始，分别思考空间全貌、人物动作与局部细节。这个示例呈现创作提案的组织方法，示例图片不代表已生成的完整影片。", points: ["用一句话明确场景的视觉目标", "拆分空间、人物与细节镜头", "导出分镜稿作为后续创作依据"] },
];
const savedProjectsKey = "metalecturer-community-saved";

export function CommunityPage({ onClassroom, onStudio }: DiscoveryActions) {
  const [category, setCategory] = useState("全部作品");
  const [saved, setSaved] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  useEffect(() => {
    try {
      const value: unknown = JSON.parse(localStorage.getItem(savedProjectsKey) ?? "[]");
      if (Array.isArray(value)) setSaved(value.filter((id): id is string => typeof id === "string" && communityProjects.some((project) => project.id === id)));
    } catch { /* 本地存储不可用时仍可浏览示例。 */ }
  }, []);
  const toggleSaved = (id: string) => {
    const next = saved.includes(id) ? saved.filter((item) => item !== id) : [...saved, id];
    setSaved(next);
    try { localStorage.setItem(savedProjectsKey, JSON.stringify(next)); } catch { /* 收藏仍保留在当前页面状态。 */ }
  };
  const selected = communityProjects.find((project) => project.id === selectedId);
  const categories = ["全部作品", "导演练习", "摄影练习", "AIGC 创作", "我的收藏"];
  const visibleProjects = communityProjects.filter((project) => category === "全部作品" || (category === "我的收藏" ? saved.includes(project.id) : project.category === category));

  return <div className="discovery-page">
    <header className="discovery-heading"><div><h1>创作社区</h1><p>从一个想法开始，让每一份练习都有画面。</p></div><Button onClick={onStudio}>开始创作<ArrowRight size={16} /></Button></header>
    <div className="discovery-community-intro"><span className="discovery-demo-badge">示例作品</span><p>浏览三份创作练习，收藏灵感，或进入工作台完成自己的分镜。</p></div>
    <div className="discovery-filters" aria-label="作品分类">{categories.map((item) => <button key={item} aria-pressed={category === item} className={category === item ? "is-active" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div>
    {visibleProjects.length > 0 ? <div className="discovery-project-grid">{visibleProjects.map((project) => <article className="discovery-project" key={project.id}><button className="discovery-project-open" onClick={() => setSelectedId(project.id)}><div className="discovery-project-cover"><img src={project.image} alt="" /><span>示例作品</span></div><div className="discovery-project-copy"><span className="discovery-category">{project.category}</span><h2>{project.title}</h2><p>{project.description}</p></div></button><div className="discovery-project-footer"><span>{project.shots} · 练习提案</span><button aria-label={`${saved.includes(project.id) ? "取消收藏" : "收藏"}${project.title}`} aria-pressed={saved.includes(project.id)} onClick={() => toggleSaved(project.id)}><Bookmark size={16} fill={saved.includes(project.id) ? "currentColor" : "none"} />{saved.includes(project.id) ? "已收藏" : "收藏"}</button></div></article>)}</div> : <div className="discovery-empty"><Bookmark size={28} /><h2>还没有收藏的作品</h2><p>浏览示例作品，把喜欢的创作练习放在这里。</p><Button variant="outline" onClick={() => setCategory("全部作品")}>浏览全部作品</Button></div>}
    <p className="discovery-source-note">作品均为 Demo 创作示例；收藏保存在当前浏览器。工作台提供独立的分镜练习。</p>
    <Dialog open={!!selected} onOpenChange={(open) => { if (!open) setSelectedId(null); }}><DialogContent title={selected?.title ?? "作品详情"} description="示例创作提案" className="discovery-project-dialog">{selected && <><img className="discovery-dialog-cover" src={selected.image} alt="" /><p className="discovery-dialog-description">{selected.detail}</p><ul className="discovery-project-points">{selected.points.map((point) => <li key={point}><Check size={15} />{point}</li>)}</ul><div className="discovery-dialog-actions"><Button onClick={() => { setSelectedId(null); onStudio(); }}>打开分镜工作台<ArrowRight size={16} /></Button><Button variant="outline" onClick={() => { setSelectedId(null); onClassroom(); }}>先学镜头语言</Button></div></>}</DialogContent></Dialog>
  </div>;
}
