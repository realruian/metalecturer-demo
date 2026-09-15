"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  ArrowDownToLine,
  ArrowRight,
  Bell,
  BookOpen,
  Bookmark,
  Box,
  Camera,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clapperboard,
  Clock3,
  Film,
  FolderOpen,
  GraduationCap,
  Headphones,
  LayoutGrid,
  Lightbulb,
  MessageCircle,
  Mic2,
  Play,
  Plus,
  Search,
  Settings2,
  Sparkles,
  Star,
  TrendingUp,
  WandSparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { courses, type Course } from "@/lib/courses";
import { useLearningEvents } from "@/lib/learning";
import { Classroom } from "@/components/classroom";
import { Knowledge } from "@/components/knowledge";
import { Analytics } from "@/components/analytics";
import { LearningPath } from "@/components/learning-path";
import { Studio } from "@/components/studio";

type View =
  | "home"
  | "courses"
  | "path"
  | "knowledge"
  | "analytics"
  | "classroom"
  | "studio";
const views: View[] = [
  "home",
  "courses",
  "path",
  "knowledge",
  "analytics",
  "classroom",
  "studio",
];
const categoryItems = [
  { label: "剪辑包装", icon: Film },
  { label: "摄影摄像", icon: Camera },
  { label: "导演编剧", icon: Clapperboard },
  { label: "影视后期", icon: WandSparkles },
  { label: "三维动画", icon: Box },
  { label: "声音设计", icon: Headphones },
  { label: "AIGC", icon: Sparkles },
  { label: "全部分类", icon: LayoutGrid },
];

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`brand ${compact ? "brand-compact" : ""}`}>
      <Image src="/icon.svg" width={35} height={35} alt="" />
      <span>
        MetaLecturer<span className="brand-dot">.</span>
      </span>
    </span>
  );
}

export function Platform() {
  const [view, setView] = useState<View>("home");
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [filter, setFilter] = useState("全部分类");
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState<string[]>([]);
  const [savedOnly, setSavedOnly] = useState(false);
  const [about, setAbout] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const [notice, setNotice] = useState("");
  const [recommendedOffset, setRecommendedOffset] = useState(0);
  const [sort, setSort] = useState("recommended");
  const events = useLearningEvents();

  useEffect(() => {
    const read = () => {
      const hash = window.location.hash.slice(1) as View;
      setView(views.includes(hash) ? hash : "home");
      setSelectedCourse(null);
      setSearchOpen(false);
      setNotifications(false);
      setAbout(false);
    };
    read();
    window.addEventListener("hashchange", read);
    try {
      const ids: unknown = JSON.parse(
        localStorage.getItem("metalecturer.saved") || "[]",
      );
      if (Array.isArray(ids))
        setSaved([
          ...new Set(
            ids.filter(
              (id): id is string =>
                typeof id === "string" && courses.some((c) => c.id === id),
            ),
          ),
        ]);
    } catch {
      /* 默认空收藏。 */
    }
    return () => window.removeEventListener("hashchange", read);
  }, []);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 2600);
    return () => clearTimeout(timer);
  }, [notice]);
  useEffect(() => {
    document.title = `${view === "home" ? "让每一次学习，都有回应" : { courses: "探索课程", path: "学习路径", knowledge: "课程知识库", analytics: "学习数据", classroom: "数字教授课堂", studio: "创作中心" }[view]} · MetaLecturer`;
  }, [view]);

  function navigate(next: View) {
    setView(next);
    window.location.hash = next;
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  function openClassroom() {
    setSelectedCourse(null);
    navigate("classroom");
  }
  function toggleSaved(course: Course) {
    const next = saved.includes(course.id)
      ? saved.filter((id) => id !== course.id)
      : [...saved, course.id];
    setSaved(next);
    try {
      localStorage.setItem("metalecturer.saved", JSON.stringify(next));
    } catch {
      setNotice("浏览器暂时无法保存收藏");
      return;
    }
    setNotice(
      next.includes(course.id) ? "已加入我的学习清单" : "已从学习清单移除",
    );
  }
  function showCourses(category = "全部分类") {
    setFilter(category);
    setSavedOnly(false);
    setQuery("");
    navigate("courses");
  }
  const filtered = courses.filter(
    (c) =>
      (filter === "全部分类" || c.category === filter) &&
      (!savedOnly || saved.includes(c.id)) &&
      `${c.title}${c.subtitle}${c.category}${c.instructor}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const visibleCourses =
    sort === "short"
      ? [...filtered].sort((a, b) => a.lessons - b.lessons)
      : filtered;
  const watchedSeconds = events
    .filter((e) => e.type === "lesson")
    .reduce((sum, e) => sum + (e.value || 0), 0);
  const completedChapters = new Set(
    events
      .filter(
        (e) =>
          e.type === "lesson" &&
          e.courseId === "director" &&
          e.label.startsWith("完成 · "),
      )
      .map((e) => e.label),
  ).size;

  if (view === "classroom")
    return (
      <Classroom
        onBack={() => navigate("home")}
        onKnowledge={() => navigate("knowledge")}
        onAnalytics={() => navigate("analytics")}
      />
    );

  return (
    <div className="platform">
      <header className="site-header">
        <div className="header-inner">
          <button
            className="brand-button"
            onClick={() => navigate("home")}
            aria-label="MetaLecturer 首页"
          >
            <Brand />
          </button>
          <nav className="main-navigation" aria-label="主导航">
            {(
              [
                { id: "home", label: "首页" },
                { id: "courses", label: "课程" },
                { id: "path", label: "学习路径" },
                { id: "studio", label: "创作中心" },
                { id: "knowledge", label: "资源库" },
              ] as { id: View; label: string }[]
            ).map((n) => (
              <button
                key={n.id}
                className={view === n.id ? "active" : ""}
                onClick={() =>
                  n.id === "courses" ? showCourses() : navigate(n.id)
                }
              >
                {n.label}
                {view === n.id && <i />}
              </button>
            ))}
          </nav>
          <div className="header-actions">
            <button
              className="search-trigger"
              aria-label="搜索课程"
              onClick={() => setSearchOpen(true)}
            >
              <Search size={16} />
              <span>搜索课程、老师、技能</span>
              <kbd>⌕</kbd>
            </button>
            <button
              className="icon-button notification-button"
              onClick={() => setNotifications(true)}
              aria-label="学习通知"
            >
              <Bell size={19} />
              <i />
            </button>
            <button
              className="profile-button"
              onClick={() => navigate("analytics")}
              aria-label="Alex 的学习数据"
            >
              <span className="profile-avatar">A</span>
              <span>Alex</span>
              <ChevronDown size={13} />
            </button>
          </div>
        </div>
      </header>

      <main className={`site-main ${view === "home" ? "home-main" : ""}`}>
        {view === "home" && (
          <>
            <section className="home-hero" aria-label="精选课程">
              <div className="hero-intro">
                <div className="eyebrow-chip">
                  <span />
                  为创作者而生的 AI 课堂
                </div>
                <h1>
                  未来<span> · </span>影像<span> · </span>无限
                </h1>
                <p>
                  让每一次学习，都有回应。
                  <br />
                  与数字教授一起，把想象变成作品。
                </p>
                <Button
                  onClick={() => showCourses()}
                  className="explore-button"
                >
                  探索课程
                  <ArrowRight size={17} />
                </Button>
                <div className="hero-statistics">
                  <div>
                    <strong>
                      4<span> 门</span>
                    </strong>
                    <small>精选示例课程</small>
                  </div>
                  <i />
                  <div>
                    <strong>
                      5<span> 个</span>
                    </strong>
                    <small>课堂互动章节</small>
                  </div>
                  <i />
                  <div>
                    <strong>随时</strong>
                    <small>提问 · 探索 · 创作</small>
                  </div>
                </div>
              </div>
              <div className="course-carousel">
                <div className="carousel-ambient" />
                <div className="carousel-cards">
                  {courses.map((c, index) => {
                    const diff =
                      (index - activeSlide + courses.length) % courses.length;
                    const position =
                      diff === 0
                        ? "current"
                        : diff === 1
                          ? "next"
                          : diff === courses.length - 1
                            ? "previous"
                            : "hidden-card";
                    return (
                      <article
                        className={`hero-course ${position}`}
                        key={c.id}
                        aria-hidden={diff !== 0}
                      >
                        <Image
                          src={c.image}
                          alt={`${c.title}课程封面`}
                          fill
                          sizes="(max-width: 700px) 90vw, 650px"
                          priority={index === 0}
                        />
                        <div className="hero-course-shade" />
                        <span className="hero-course-badge">
                          {index === 0 ? (
                            <>
                              <span />
                              精选推荐
                            </>
                          ) : (
                            c.tag
                          )}
                        </span>
                        <div className="hero-course-content">
                          <div className="hero-course-kicker">
                            {index === 0
                              ? "THE ART OF VISUAL STORYTELLING"
                              : index === 1
                                ? "CREATE IN ANOTHER DIMENSION"
                                : index === 2
                                  ? "IMAGINATION MEETS INTELLIGENCE"
                                  : "LIGHT MAKES THE STORY"}
                          </div>
                          <h2>{c.title}</h2>
                          <p>{c.subtitle}</p>
                          <div className="hero-course-bottom">
                            <div className="instructor">
                              <Image
                                src="/assets/original-05.png"
                                width={29}
                                height={29}
                                alt="数字教授形象"
                              />
                              <span>
                                <b>
                                  {c.instructor}
                                  <small>数字教授</small>
                                </b>
                                <small>
                                  {c.category} · {c.lessons} 节课程
                                </small>
                              </span>
                            </div>
                            <button
                              className="hero-play"
                              tabIndex={diff === 0 ? 0 : -1}
                              onClick={() =>
                                c.id === "director"
                                  ? openClassroom()
                                  : setSelectedCourse(c)
                              }
                            >
                              <Play size={13} fill="currentColor" />
                              {c.id === "director" ? "进入课堂" : "课程详情"}
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
                <button
                  className="carousel-arrow carousel-prev"
                  aria-label="上一门课程"
                  onClick={() => setActiveSlide((activeSlide + 3) % 4)}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  className="carousel-arrow carousel-next"
                  aria-label="下一门课程"
                  onClick={() => setActiveSlide((activeSlide + 1) % 4)}
                >
                  <ChevronRight size={20} />
                </button>
                <div className="carousel-pagination">
                  {courses.map((c, i) => (
                    <button
                      key={c.id}
                      aria-label={`展示${c.title}`}
                      aria-pressed={activeSlide === i}
                      className={activeSlide === i ? "active" : ""}
                      onClick={() => setActiveSlide(i)}
                    />
                  ))}
                  <span>
                    0{activeSlide + 1}
                    <i> / 04</i>
                  </span>
                </div>
              </div>
            </section>

            <section className="category-and-path" aria-label="课程分类">
              <div className="category-list">
                {categoryItems.map(({ label, icon: Icon }, i) => (
                  <button key={label} onClick={() => showCourses(label)}>
                    <span className={`category-icon category-icon-${i}`}>
                      <Icon size={24} strokeWidth={1.6} />
                    </span>
                    <span>{label}</span>
                  </button>
                ))}
              </div>
              <button className="path-teaser" onClick={() => navigate("path")}>
                <div>
                  <span className="tiny-label">YOUR NEXT STEP</span>
                  <h3>
                    找到你的学习路径
                    <ArrowRight size={16} />
                  </h3>
                  <p>每一步，都更靠近创作目标</p>
                </div>
                <div className="path-graphic">
                  <span />
                  <span />
                  <span />
                  <ArrowRight size={29} />
                </div>
              </button>
            </section>

            <section className="continue-strip">
              <div className="continue-icon">
                <Play size={17} fill="currentColor" />
              </div>
              <div className="continue-description">
                <span>
                  {watchedSeconds > 0
                    ? "继续你的学习旅程"
                    : "你的第一堂 AI 互动课"}
                </span>
                <h3>
                  镜头轴线与空间连续性
                  <span>与林知远教授一起，亲手移动机位</span>
                </h3>
              </div>
              <div className="continue-progress">
                <span>
                  {watchedSeconds > 0
                    ? `已学习 ${watchedSeconds < 60 ? `${Math.round(watchedSeconds)} 秒` : `${Math.floor(watchedSeconds / 60)} 分钟`}`
                    : "5 个章节 · 交互微课"}
                </span>
                <div>
                  <i
                    style={{
                      width: `${Math.min(100, (completedChapters / 5) * 100)}%`,
                    }}
                  />
                </div>
              </div>
              <Button variant="secondary" size="sm" onClick={openClassroom}>
                {watchedSeconds > 0 ? "继续学习" : "开始体验"}
                <ArrowRight size={15} />
              </Button>
            </section>

            <section className="recommendations-section">
              <div className="section-title">
                <div>
                  <span className="section-eyebrow">CURATED FOR YOU</span>
                  <h2>
                    下一次灵感，从这里开始<span>为你推荐</span>
                  </h2>
                </div>
                <button
                  className="text-button"
                  onClick={() =>
                    setRecommendedOffset((recommendedOffset + 1) % 4)
                  }
                >
                  换一批
                  <TrendingUp size={15} />
                </button>
              </div>
              <div className="course-grid">
                {[
                  ...courses.slice(recommendedOffset),
                  ...courses.slice(0, recommendedOffset),
                ].map((c) => (
                  <CourseCard
                    key={c.id}
                    course={c}
                    saved={saved.includes(c.id)}
                    onOpen={() => setSelectedCourse(c)}
                    onSave={() => toggleSaved(c)}
                  />
                ))}
              </div>
            </section>

            <section className="platform-promise">
              <div className="promise-intro">
                <span className="section-eyebrow">LEARNING, REIMAGINED</span>
                <h2>一堂课，更多可能。</h2>
                <p>从听懂，到真正会用。</p>
              </div>
              <div className="promise-features">
                {[
                  {
                    icon: Mic2,
                    title: "数字人授课",
                    text: "知识有声音，课堂有陪伴",
                    target: "classroom",
                  },
                  {
                    icon: FolderOpen,
                    title: "课程知识库",
                    text: "每个知识点，都有迹可循",
                    target: "knowledge",
                  },
                  {
                    icon: MessageCircle,
                    title: "随时问答",
                    text: "让好奇心，及时得到回应",
                    target: "classroom",
                  },
                  {
                    icon: TrendingUp,
                    title: "学习数据",
                    text: "看见每一次理解与进步",
                    target: "analytics",
                  },
                ].map(({ icon: Icon, title, text, target }) => (
                  <button key={title} onClick={() => navigate(target as View)}>
                    <span>
                      <Icon size={23} strokeWidth={1.6} />
                    </span>
                    <h3>
                      {title}
                      <ArrowRight size={14} />
                    </h3>
                    <p>{text}</p>
                  </button>
                ))}
              </div>
            </section>

            <section className="editorial-section">
              <div className="section-title">
                <div>
                  <span className="section-eyebrow">
                    THE CREATOR'S NOTEBOOK
                  </span>
                  <h2>把学到的，变成自己的。</h2>
                </div>
              </div>
              <div className="editorial-grid">
                <button
                  className="editorial-card dark"
                  onClick={() => navigate("studio")}
                >
                  <span className="editorial-number">01 / PRACTICE</span>
                  <div>
                    <Clapperboard size={27} />
                    <h3>
                      你的下一个故事
                      <br />
                      从一个镜头开始
                    </h3>
                    <p>
                      打开分镜工作台，把灵感写进拍摄计划。
                      <ArrowRight size={17} />
                    </p>
                  </div>
                  <div className="editorial-decoration">
                    REC <i />
                  </div>
                </button>
                <button
                  className="editorial-card light"
                  onClick={() => navigate("knowledge")}
                >
                  <span className="editorial-number">02 / EXPLORE</span>
                  <div>
                    <BookOpen size={27} />
                    <h3>好问题，值得追根究底。</h3>
                    <p>
                      走进课程知识库，重新认识镜头背后的逻辑。
                      <ArrowRight size={17} />
                    </p>
                  </div>
                  <span className="editorial-lines" />
                </button>
              </div>
            </section>
          </>
        )}

        {view === "courses" && (
          <section className="catalog-page">
            <div className="page-heading">
              <div>
                <span className="section-eyebrow">
                  EXPLORE YOUR NEXT CHAPTER
                </span>
                <h1>给创作，多一点可能。</h1>
                <p>选择一个方向，和数字教授一起开始。</p>
              </div>
              <Button
                variant={savedOnly ? "default" : "outline"}
                onClick={() => setSavedOnly(!savedOnly)}
              >
                <Bookmark size={16} />
                {savedOnly ? "查看全部课程" : `我的学习清单 · ${saved.length}`}
              </Button>
            </div>
            <div className="catalog-filters">
              <div className="filter-pills">
                {[
                  "全部分类",
                  "导演编剧",
                  "摄影摄像",
                  "三维动画",
                  "AIGC",
                  "剪辑包装",
                  "影视后期",
                  "声音设计",
                ].map((c) => (
                  <button
                    key={c}
                    className={filter === c ? "active" : ""}
                    onClick={() => setFilter(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <div className="catalog-toolbar">
                <label className="catalog-search">
                  <Search size={17} />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="查找感兴趣的课程"
                    aria-label="查找课程"
                  />
                  {query && (
                    <button aria-label="清空搜索" onClick={() => setQuery("")}>
                      <X size={15} />
                    </button>
                  )}
                </label>
                <span>{visibleCourses.length} 门课程</span>
                <label className="sort-select">
                  <Settings2 size={15} />
                  <select
                    aria-label="课程排序"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                  >
                    <option value="recommended">精选推荐</option>
                    <option value="short">课时从少到多</option>
                  </select>
                </label>
              </div>
            </div>
            {visibleCourses.length ? (
              <div className="course-grid catalog-grid">
                {visibleCourses.map((c) => (
                  <CourseCard
                    key={c.id}
                    course={c}
                    saved={saved.includes(c.id)}
                    onOpen={() => setSelectedCourse(c)}
                    onSave={() => toggleSaved(c)}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <BookOpen size={38} />
                <h3>
                  {savedOnly
                    ? "这里还没有收藏的课程"
                    : "这个方向的课程正在准备中"}
                </h3>
                <p>
                  {query
                    ? "试试其他关键词，或者浏览全部课程。"
                    : "先从镜头语言、摄影或 AI 创作开始探索。"}
                </p>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSavedOnly(false);
                    setFilter("全部分类");
                    setQuery("");
                  }}
                >
                  浏览全部课程
                  <ArrowRight size={16} />
                </Button>
              </div>
            )}
            <div className="catalog-note">
              <Lightbulb size={18} />
              <p>
                体验提示：导演课程提供完整的互动微课，其余课程可浏览详情并加入学习清单。
              </p>
            </div>
          </section>
        )}

        {view === "knowledge" && <Knowledge onClassroom={openClassroom} />}
        {view === "analytics" && <Analytics onClassroom={openClassroom} />}
        {view === "path" && <LearningPath onClassroom={openClassroom} />}
        {view === "studio" && <Studio onClassroom={openClassroom} />}
      </main>

      <footer className="site-footer">
        <Brand compact />
        <span>让知识，成为创作的一部分。</span>
        <div>
          <span className="demo-label">
            <i />
            交互演示版
          </span>
          <button onClick={() => setAbout(true)}>关于本次体验</button>
          <span>© 2026 MetaLecturer</span>
        </div>
      </footer>

      <Dialog
        open={!!selectedCourse}
        onOpenChange={(open) => !open && setSelectedCourse(null)}
      >
        <DialogContent
          title={selectedCourse?.title || "课程详情"}
          description={selectedCourse?.subtitle}
          className="course-detail-dialog"
        >
          {selectedCourse && (
            <>
              <div className="course-detail-cover">
                <Image
                  src={selectedCourse.image}
                  alt={selectedCourse.title}
                  fill
                  sizes="650px"
                />
                <span>{selectedCourse.tag}</span>
              </div>
              <div className="detail-meta">
                <span>
                  <GraduationCap size={16} />
                  {selectedCourse.instructor} · 数字教授
                </span>
                <span>
                  <BookOpen size={15} />
                  {selectedCourse.lessons} 个章节
                </span>
                <span>
                  <Clock3 size={15} />
                  {selectedCourse.duration}
                </span>
              </div>
              <p className="detail-description">{selectedCourse.description}</p>
              <h3 className="detail-subheading">你将在这里探索</h3>
              <div className="detail-topics">
                {(selectedCourse.id === "director"
                  ? [
                      "建立人物与镜头的空间关系",
                      "亲手完成一次机位越轴实验",
                      "用课程依据回答自己的问题",
                    ]
                  : selectedCourse.id === "c4d"
                    ? [
                        "基础几何与三维空间",
                        "材质、光照与画面质感",
                        "运动设计与镜头表达",
                      ]
                    : selectedCourse.id === "aigc"
                      ? [
                          "视觉提示词与创意表达",
                          "角色与画面的一致性",
                          "生成式影像工作流",
                        ]
                      : [
                          "观察自然光与人工光",
                          "景别、焦距与空间组织",
                          "用色彩与光线表达情绪",
                        ]
                ).map((t) => (
                  <p key={t}>
                    <Check size={16} />
                    {t}
                  </p>
                ))}
              </div>
              {selectedCourse.id !== "director" && (
                <p className="detail-preview-note">
                  课程规划预览 · 本次完整课堂体验为「导演思维与镜头语言」。
                </p>
              )}
              <div className="dialog-actions">
                <Button
                  variant="outline"
                  onClick={() => toggleSaved(selectedCourse)}
                >
                  <Bookmark
                    size={16}
                    fill={
                      saved.includes(selectedCourse.id)
                        ? "currentColor"
                        : "none"
                    }
                  />
                  {saved.includes(selectedCourse.id)
                    ? "已加入学习清单"
                    : "加入学习清单"}
                </Button>
                <Button onClick={openClassroom}>
                  <Play size={16} />
                  {selectedCourse.id === "director"
                    ? "进入互动课堂"
                    : "体验示例课堂"}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent
          title="发现你的下一堂课"
          description="搜索课程名称、方向或数字教授"
          className="search-dialog"
        >
          <label className="global-search-input">
            <Search size={20} />
            <input
              autoFocus
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="试试「镜头」「AI」或「三维」"
            />
          </label>
          <div className="search-results">
            {courses
              .filter((c) =>
                `${c.title}${c.category}${c.instructor}`
                  .toLowerCase()
                  .includes(globalSearch.toLowerCase()),
              )
              .map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setSearchOpen(false);
                    setSelectedCourse(c);
                  }}
                >
                  <Image src={c.image} alt="" width={80} height={50} />
                  <span>
                    <b>{c.title}</b>
                    <small>
                      {c.category} · {c.instructor}
                    </small>
                  </span>
                  <ArrowRight size={17} />
                </button>
              ))}
            {!courses.some((c) =>
              `${c.title}${c.category}${c.instructor}`
                .toLowerCase()
                .includes(globalSearch.toLowerCase()),
            ) && (
              <div className="search-empty">
                没有找到相关课程，试试其他关键词。
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={notifications} onOpenChange={setNotifications}>
        <DialogContent title="学习通知" description="你的学习旅程，从这里继续">
          <div className="notification-item">
            <span>
              <Sparkles size={21} />
            </span>
            <div>
              <h3>欢迎来到 MetaLecturer</h3>
              <p>
                你的第一堂互动课已准备好。移动机位、随时提问，用一次小实验理解镜头轴线。
              </p>
              <Button
                size="sm"
                onClick={() => {
                  setNotifications(false);
                  openClassroom();
                }}
              >
                进入课堂
                <ArrowRight size={14} />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={about} onOpenChange={setAbout}>
        <DialogContent
          title="关于本次体验"
          description="MetaLecturer · AI 产品经理面试 Demo"
        >
          <div className="about-content">
            <p>
              这是一套可交互的产品演示。课程、数字人物与班级数据均为示例，不代表真实运营成果。
            </p>
            <div>
              <Check size={17} />
              <p>
                <b>可以真实体验</b>
                <br />
                中文语音讲解、机位互动、课程资料检索与引用、笔记与学习记录、分镜编辑和文件导出。
              </p>
            </div>
            <div>
              <CircleHelp size={17} />
              <p>
                <b>当前实现边界</b>
                <br />
                问答使用本地课程资料检索，未调用大语言模型。数字教授使用示例形象与预生成系统语音。个人记录保存在当前浏览器。
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {notice && (
        <div className="app-toast" role="status">
          <Check size={17} />
          {notice}
        </div>
      )}
    </div>
  );
}

function CourseCard({
  course,
  saved,
  onOpen,
  onSave,
}: {
  course: Course;
  saved: boolean;
  onOpen: () => void;
  onSave: () => void;
}) {
  return (
    <article className="course-card">
      <button
        className="course-card-cover"
        onClick={onOpen}
        aria-label={`查看${course.title}`}
      >
        <Image
          src={course.image}
          alt={course.title}
          fill
          sizes="(max-width: 600px) 90vw, (max-width:1000px) 45vw, 320px"
        />
        <span className="course-card-tag">{course.tag}</span>
        <span className="course-card-preview">
          <Play size={16} fill="currentColor" />
          {course.id === "director" ? "互动课堂" : "课程预览"}
        </span>
      </button>
      <div className="course-card-body">
        <div className="course-card-category">
          <span>{course.category}</span>
          <span>
            <Star size={12} fill="currentColor" />
            精选课程
          </span>
        </div>
        <button className="course-title-button" onClick={onOpen}>
          <h3>{course.title}</h3>
        </button>
        <p>{course.subtitle}</p>
        <div className="course-card-footer">
          <span>
            <Image
              src="/assets/original-05.png"
              alt=""
              width={23}
              height={23}
            />
            {course.instructor}
            <i /> {course.lessons} 节
          </span>
          <button
            className={`save-button ${saved ? "saved" : ""}`}
            onClick={onSave}
            aria-label={`${saved ? "取消收藏" : "收藏"}${course.title}`}
            aria-pressed={saved}
          >
            <Bookmark size={17} fill={saved ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
    </article>
  );
}
