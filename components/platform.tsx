"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  ShoppingCart,
  UserRound,
  Trash2,
  BookOpen,
  Bookmark,
  Check,
  CircleHelp,
  Clapperboard,
  Clock3,
  GraduationCap,
  Lightbulb,
  Play,
  Search,
  Settings2,
  Star,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { courses, type Course } from "@/lib/courses";
import { Classroom } from "@/components/classroom";
import { Knowledge } from "@/components/knowledge";
import { Analytics } from "@/components/analytics";
import { LearningPath } from "@/components/learning-path";
import { Studio } from "@/components/studio";
import { Home } from "@/components/home";
import { NewsPage, CommunityPage } from "@/components/discovery";

type View =
  | "home"
  | "courses"
  | "path"
  | "knowledge"
  | "analytics"
  | "classroom"
  | "studio"
  | "news"
  | "community";
const views: View[] = [
  "home",
  "courses",
  "path",
  "knowledge",
  "analytics",
  "classroom",
  "studio",
  "news",
  "community",
];


export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`brand ${compact ? "brand-compact" : ""}`}>
      <Image src="/icon.svg" width={35} height={35} alt="" />
      <span>
        MetaLecturer
      </span>
    </span>
  );
}

export function Platform() {
  const [view, setView] = useState<View>("home");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [filter, setFilter] = useState("全部分类");
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState<string[]>([]);
  const [savedOnly, setSavedOnly] = useState(false);
  const [about, setAbout] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<string[]>([]);
  const [newsId, setNewsId] = useState<string | undefined>();
  const [searchOpen, setSearchOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const [notice, setNotice] = useState("");
  const [sort, setSort] = useState("recommended");

  useEffect(() => {
    const read = () => {
      const hash = window.location.hash.slice(1) as View;
      setView(views.includes(hash) ? hash : "home");
      setSelectedCourse(null);
      setSearchOpen(false);
      setCartOpen(false);
      setAbout(false);
    };
    read();
    try {
      const stored: unknown = JSON.parse(localStorage.getItem("metalecturer.cart") || "[]");
      if (Array.isArray(stored)) setCart([...new Set(stored.filter((id): id is string => typeof id === "string" && courses.some(course => course.id === id && course.price !== undefined)))]);
    } catch { /* 默认空购物车。 */ }
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
    document.title = `${view === "home" ? "让每一次学习，都有回应" : { courses: "探索课程", path: "学习路径", knowledge: "课程知识库", analytics: "学习数据", classroom: "数字教授课堂", studio: "创作中心", news: "行业资讯", community: "创作社区" }[view]} · MetaLecturer`;
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
  function updateCart(next: string[]) {
    setCart(next);
    try { localStorage.setItem("metalecturer.cart", JSON.stringify(next)); }
    catch { setNotice("本次选课已保留，浏览器暂时无法持久保存"); }
  }
  function addToCart(course: Course) {
    if (!cart.includes(course.id)) updateCart([...cart, course.id]);
    setNotice("已加入购物车");
  }
  function openNews(id?: string) {
    setNewsId(id);
    navigate("news");
  }
  const cartCourses = cart.map(id => courses.find(course => course.id === id)).filter((course): course is Course => Boolean(course));

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
      <header className="portal-header">
        <div className="portal-header-inner">
          <button className="portal-brand" onClick={() => navigate("home")} aria-label="MetaLecturer 首页"><Brand /></button>
          <nav className="portal-nav" aria-label="主导航">
            {([
              { id: "home", label: "首页" }, { id: "courses", label: "课程" },
              { id: "path", label: "学习路径" }, { id: "news", label: "行业资讯" },
              { id: "community", label: "创作社区" }, { id: "knowledge", label: "资源库" },
            ] as { id: View; label: string }[]).map(item => (
              <button key={item.id} className={view === item.id ? "active" : ""} onClick={() => item.id === "courses" ? showCourses() : item.id === "news" ? openNews() : navigate(item.id)}>{item.label}</button>
            ))}
            <button className={`portal-studio-mobile ${view === "studio" ? "active" : ""}`} onClick={() => navigate("studio")}>创作中心</button>
          </nav>
          <div className="portal-tools">
            <button className="portal-search" aria-label="搜索课程" onClick={() => setSearchOpen(true)}><span>搜索课程、老师、技能</span><Search size={16} /></button>
            <button className="portal-studio" onClick={() => navigate("studio")}><Clapperboard size={15} />创作中心</button>
            <button className="portal-cart" aria-label="购物车" onClick={() => setCartOpen(true)}><ShoppingCart size={22} />{cart.length > 0 && <span>{cart.length}</span>}</button>
            <button className="portal-profile" aria-label="Alex 的学习数据" onClick={() => navigate("analytics")}><span><UserRound size={21} /></span><span>Alex</span></button>
          </div>
        </div>
      </header>

      <main className={`site-main ${view === "home" ? "home-main" : ""}`}>
        {view === "home" && <Home onExplore={showCourses} onCourse={setSelectedCourse} onClassroom={openClassroom} onPath={() => navigate("path")} onNews={openNews} />}

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
                  "剪辑包装",
                  "影视后期",
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

        {view === "news" && <NewsPage initialId={newsId} onClassroom={openClassroom} onStudio={() => navigate("studio")} />}
        {view === "community" && <CommunityPage onClassroom={openClassroom} onStudio={() => navigate("studio")} />}
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
              {selectedCourse.price !== undefined && <div className="detail-price"><span>¥{selectedCourse.price}</span><del>¥{selectedCourse.originalPrice}</del><small>演示价格</small></div>}
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
                {selectedCourse.price !== undefined && <Button variant="secondary" onClick={() => addToCart(selectedCourse)}><ShoppingCart size={16} />{cart.includes(selectedCourse.id) ? "已加入购物车" : "加入购物车"}</Button>}
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

      <Dialog open={cartOpen} onOpenChange={setCartOpen}>
        <DialogContent title="我的购物车" description="演示选课清单 · 价格为示例，不产生订单或扣款">
          {cartCourses.length ? <>
            <div className="cart-list">{cartCourses.map(course => <div className="cart-item" key={course.id}>
              <Image src={course.image} alt="" width={48} height={64} />
              <div><strong>{course.title}</strong><span>¥{course.price} · {course.lessons} 课时</span></div>
              <button className="icon-button" aria-label={`移除${course.title}`} onClick={() => updateCart(cart.filter(id => id !== course.id))}><Trash2 size={17} /></button>
            </div>)}</div>
            <div className="cart-summary"><span>示例合计</span><strong>¥{cartCourses.reduce((sum, course) => sum + (course.price || 0), 0)}</strong></div>
            <div className="dialog-actions"><Button variant="outline" onClick={() => { setCartOpen(false); showCourses(); }}>继续选课</Button><Button onClick={() => { setCartOpen(false); openClassroom(); }}><Play size={15} />体验示例课堂</Button></div>
          </> : <div className="cart-empty"><ShoppingCart size={36} /><p>还没有加入课程。<br />浏览课程详情，把感兴趣的内容加入选课清单。</p><div className="dialog-actions"><Button onClick={() => { setCartOpen(false); showCourses(); }}>去探索课程<ArrowRight size={15} /></Button></div></div>}
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
