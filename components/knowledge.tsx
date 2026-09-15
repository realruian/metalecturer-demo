"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownToLine,
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  Database,
  FileText,
  FolderOpen,
  Layers3,
  Link2,
  Search,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  chapterTitles,
  documentMarkdown,
  knowledgeDocuments,
  knowledgeSnippets,
  searchKnowledge,
  type KnowledgeDocument,
} from "@/lib/knowledge";
import "./knowledge.css";

const bookmarkKey = "metalecturer-knowledge-bookmarks-v1";

export function Knowledge({ onClassroom }: { onClassroom: () => void }) {
  const [query, setQuery] = useState("");
  const [chapter, setChapter] = useState<number | null>(null);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [selected, setSelected] = useState<KnowledgeDocument | null>(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    try {
      const stored: unknown = JSON.parse(
        localStorage.getItem(bookmarkKey) || "[]",
      );
      if (Array.isArray(stored))
        setBookmarks([
          ...new Set(
            stored.filter(
              (id): id is string =>
                typeof id === "string" &&
                knowledgeDocuments.some((doc) => doc.id === id),
            ),
          ),
        ]);
    } catch {
      /* 存储不可用时，仍然可以阅读课程资料。 */
    }
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timeout = setTimeout(() => setNotice(""), 3500);
    return () => clearTimeout(timeout);
  }, [notice]);

  const documents = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    const matches = new Set(
      searchKnowledge(trimmed, knowledgeSnippets.length).map(
        (snippet) => snippet.chapter,
      ),
    );
    return knowledgeDocuments.filter(
      (doc) =>
        (chapter === null || doc.chapter === chapter) &&
        (!favoritesOnly || bookmarks.includes(doc.id)) &&
        (!trimmed ||
          matches.has(doc.chapter) ||
          `${doc.title} ${doc.description} ${doc.snippets.map((snippet) => snippet.excerpt).join(" ")}`
            .toLowerCase()
            .includes(trimmed)),
    );
  }, [query, chapter, favoritesOnly, bookmarks]);

  function toggleBookmark(document: KnowledgeDocument) {
    const next = bookmarks.includes(document.id)
      ? bookmarks.filter((id) => id !== document.id)
      : [...bookmarks, document.id];
    setBookmarks(next);
    try {
      localStorage.setItem(bookmarkKey, JSON.stringify(next));
    } catch {
      setNotice("本次收藏已更新，浏览器未允许持久保存。");
    }
  }

  function download(document: KnowledgeDocument) {
    const url = URL.createObjectURL(
      new Blob([documentMarkdown(document)], {
        type: "text/markdown;charset=utf-8",
      }),
    );
    const anchor = window.document.createElement("a");
    anchor.href = url;
    anchor.download = `MetaLecturer-${chapterTitles[document.chapter]}.md`;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice(`已生成「${chapterTitles[document.chapter]}」讲义下载。`);
  }

  function resetFilters() {
    setQuery("");
    setChapter(null);
    setFavoritesOnly(false);
  }
  function searchTopic(topic: string) {
    setQuery(topic);
    setChapter(null);
    setFavoritesOnly(false);
  }

  return (
    <div className="knowledge-page">
      <div className="knowledge-breadcrumb">
        <span>学习空间</span>
        <ChevronRight size={13} />
        <strong>课程知识库</strong>
      </div>
      <header className="knowledge-header">
        <div>
          <span className="knowledge-eyebrow">YOUR KNOWLEDGE, CONNECTED</span>
          <h1>
            让每一份知识，都有迹可循<span>。</span>
          </h1>
          <p>课程讲义、知识要点与课堂提问，在这里连接起来。</p>
        </div>
        <Button onClick={onClassroom} variant="outline">
          <BookOpen size={16} />
          进入课堂
          <ArrowRight size={16} />
        </Button>
      </header>

      <div className="knowledge-layout">
        <aside className="knowledge-sidebar" aria-label="知识库分类">
          <div className="knowledge-workspace-label">
            <span className="knowledge-workspace-icon">
              <Database size={18} />
            </span>
            <div>
              <strong>我的知识空间</strong>
              <small>PERSONAL WORKSPACE</small>
            </div>
          </div>
          <div className="knowledge-sidebar-section">
            <button
              className={`knowledge-nav-item ${!favoritesOnly && chapter === null ? "knowledge-nav-active" : ""}`}
              onClick={() => {
                setFavoritesOnly(false);
                setChapter(null);
              }}
            >
              <FolderOpen size={17} />
              <span>全部资料</span>
              <small>{knowledgeDocuments.length}</small>
            </button>
            <button
              className={`knowledge-nav-item ${favoritesOnly ? "knowledge-nav-active" : ""}`}
              onClick={() => {
                setFavoritesOnly(true);
                setChapter(null);
              }}
            >
              <Star size={17} />
              <span>我的收藏</span>
              <small>{bookmarks.length}</small>
            </button>
          </div>
          <div className="knowledge-sidebar-section knowledge-chapters">
            <div className="knowledge-sidebar-caption">
              课程目录<span>5 章</span>
            </div>
            <div className="knowledge-current-course">
              <span />
              <strong>导演思维与镜头语言</strong>
            </div>
            {chapterTitles.map((title, index) => (
              <button
                key={title}
                className={`knowledge-chapter-link ${chapter === index ? "knowledge-chapter-active" : ""}`}
                onClick={() => {
                  setChapter(index);
                  setFavoritesOnly(false);
                }}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                {title}
                {chapter === index && <ChevronRight size={13} />}
              </button>
            ))}
          </div>
          <div className="knowledge-sidebar-tip">
            <span className="knowledge-tip-icon">
              <Sparkles size={18} />
            </span>
            <strong>知识，让回答更有依据</strong>
            <p>课堂问答会检索这些讲义，并附上对应章节，方便随时回看。</p>
            <button onClick={onClassroom}>
              去课堂提个问题
              <ArrowRight size={14} />
            </button>
          </div>
          <div className="knowledge-storage">
            <span>
              <i />
              示例课程已就绪
            </span>
            <small>本地资料 · 随时可查</small>
          </div>
        </aside>

        <div className="knowledge-main">
          <section
            className="knowledge-course-banner"
            aria-label="当前课程资料"
          >
            <div className="knowledge-banner-copy">
              <span className="knowledge-course-kicker">
                <span />
                课程知识库
              </span>
              <h2>导演思维与镜头语言</h2>
              <p>先理解空间，再用镜头讲故事。</p>
              <div className="knowledge-banner-meta">
                <span>
                  <FileText size={13} />5 份课程讲义
                </span>
                <span>
                  <Layers3 size={13} />
                  10 个知识片段
                </span>
                <span>
                  <Check size={13} />
                  可检索
                </span>
              </div>
            </div>
            <div className="knowledge-banner-art" aria-hidden="true">
              <div className="knowledge-art-orbit" />
              <div className="knowledge-art-sheet knowledge-art-back" />
              <div className="knowledge-art-sheet knowledge-art-front">
                <span>
                  <BookOpen size={25} />
                </span>
                <i />
                <i />
                <i />
              </div>
              <div className="knowledge-art-spark">
                <Sparkles size={21} />
              </div>
            </div>
          </section>

          <div className="knowledge-content-grid">
            <section className="knowledge-document-panel">
              <div className="knowledge-section-heading">
                <div>
                  <h2>
                    {favoritesOnly
                      ? "我的收藏"
                      : chapter === null
                        ? "课程资料"
                        : chapterTitles[chapter]}
                  </h2>
                  <span>{documents.length} 份资料</span>
                </div>
                <span className="knowledge-live-status">
                  <i />
                  内容已索引
                </span>
              </div>
              <div className="knowledge-search">
                <Search size={18} />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="搜索知识点、关键词或资料名称"
                  aria-label="搜索课程知识库"
                />
                {query ? (
                  <button onClick={() => setQuery("")} aria-label="清空搜索">
                    <X size={15} />
                  </button>
                ) : (
                  <span>搜索</span>
                )}
              </div>
              <div className="knowledge-topics">
                <span>试试搜索</span>
                {["180° 规则", "正反打", "中性镜头"].map((topic) => (
                  <button key={topic} onClick={() => searchTopic(topic)}>
                    {topic}
                  </button>
                ))}
              </div>
              <div className="knowledge-list-heading">
                <span>资料名称</span>
                <span>关联章节</span>
                <span>操作</span>
              </div>
              <div className="knowledge-documents">
                {documents.map((doc) => (
                  <article className="knowledge-document-row" key={doc.id}>
                    <button
                      className="knowledge-document-main"
                      onClick={() => setSelected(doc)}
                    >
                      <span
                        className={`knowledge-file-icon knowledge-file-${doc.chapter % 3}`}
                      >
                        <FileText size={22} />
                        <small>MD</small>
                      </span>
                      <span>
                        <strong>{doc.title}</strong>
                        <small>{doc.description}</small>
                        <span className="knowledge-document-meta">
                          示例讲义<span>·</span>
                          {doc.snippets.length} 个知识片段
                        </span>
                      </span>
                    </button>
                    <span className="knowledge-chapter-badge">
                      第 {doc.chapter + 1} 章
                    </span>
                    <div className="knowledge-row-actions">
                      <button
                        className={
                          bookmarks.includes(doc.id)
                            ? "knowledge-is-bookmarked"
                            : ""
                        }
                        aria-label={`${bookmarks.includes(doc.id) ? "取消收藏" : "收藏"}${doc.title}`}
                        title={
                          bookmarks.includes(doc.id) ? "取消收藏" : "收藏资料"
                        }
                        onClick={() => toggleBookmark(doc)}
                      >
                        <Star
                          size={16}
                          fill={
                            bookmarks.includes(doc.id) ? "currentColor" : "none"
                          }
                        />
                      </button>
                      <button
                        aria-label={`下载${doc.title}`}
                        title="下载 Markdown 讲义"
                        onClick={() => download(doc)}
                      >
                        <ArrowDownToLine size={16} />
                      </button>
                    </div>
                  </article>
                ))}
                {!documents.length && (
                  <div className="knowledge-empty">
                    <Search size={30} />
                    <h3>
                      {favoritesOnly && !bookmarks.length
                        ? "还没有收藏资料"
                        : "没有找到相关资料"}
                    </h3>
                    <p>
                      {favoritesOnly && !bookmarks.length
                        ? "点击讲义旁的星标，把常用知识留在这里。"
                        : "试试「轴线」「机位」或「越轴」，也可以查看全部讲义。"}
                    </p>
                    <Button variant="outline" size="sm" onClick={resetFilters}>
                      查看全部资料
                    </Button>
                  </div>
                )}
              </div>
              <div className="knowledge-panel-footer">
                <Link2 size={13} />
                <span>每个知识片段都能关联到课堂中的具体章节</span>
              </div>
            </section>

            <aside className="knowledge-right-panel">
              <section className="knowledge-map-card">
                <div className="knowledge-mini-heading">
                  <h2>知识连接</h2>
                  <span>KNOWLEDGE MAP</span>
                </div>
                <p>从一个概念，发现更多关联。</p>
                <div className="knowledge-map">
                  <svg viewBox="0 0 280 245" aria-hidden="true">
                    <path d="M140 116 C 140 65, 75 70, 66 42 M140 116 C 169 56, 225 52, 226 47 M140 116 C 77 132, 57 145, 48 177 M140 116 C 204 132, 228 147, 234 178 M140 116 L140 222" />
                  </svg>
                  <button
                    className="knowledge-map-node knowledge-map-center"
                    onClick={() => searchTopic("轴线")}
                  >
                    <Layers3 size={17} />
                    镜头轴线
                  </button>
                  <button
                    className="knowledge-map-node knowledge-map-one"
                    onClick={() => searchTopic("180° 规则")}
                  >
                    180° 规则
                  </button>
                  <button
                    className="knowledge-map-node knowledge-map-two"
                    onClick={() => searchTopic("正反打")}
                  >
                    正反打
                  </button>
                  <button
                    className="knowledge-map-node knowledge-map-three"
                    onClick={() => searchTopic("空间连续性")}
                  >
                    空间连续性
                  </button>
                  <button
                    className="knowledge-map-node knowledge-map-four"
                    onClick={() => searchTopic("中性镜头")}
                  >
                    中性镜头
                  </button>
                  <button
                    className="knowledge-map-node knowledge-map-five"
                    onClick={() => searchTopic("合理越轴")}
                  >
                    合理越轴
                  </button>
                </div>
                <div className="knowledge-map-note">
                  <span />
                  点击知识点，查看关联资料
                </div>
              </section>
              <section className="knowledge-reading-card">
                <span className="knowledge-reading-icon">
                  <BookOpen size={18} />
                </span>
                <div>
                  <h3>延伸阅读</h3>
                  <p>了解 180° 规则如何帮助观众理解电影空间。</p>
                  <a
                    href="https://www.adobe.com/creativecloud/video/discover/what-is-the-180-degree-rule.html"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Adobe · 180-degree rule
                    <ArrowRight size={13} />
                  </a>
                </div>
              </section>
              <p className="knowledge-source-note">
                以上为 Demo
                自编示例讲义。课堂回答采用本地资料检索，不生成资料之外的结论。
              </p>
            </aside>
          </div>
        </div>
      </div>

      <Dialog
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent
          title={selected?.title || "课程讲义"}
          description="导演思维与镜头语言 · 示例课程讲义"
          className="knowledge-preview-dialog"
        >
          {selected && (
            <>
              <div className="knowledge-preview-toolbar">
                <span>
                  <FileText size={14} />
                  Markdown 讲义<span>·</span>
                  {selected.snippets.length} 个知识片段
                </span>
                <button
                  className={
                    bookmarks.includes(selected.id)
                      ? "knowledge-preview-favorite knowledge-is-bookmarked"
                      : "knowledge-preview-favorite"
                  }
                  onClick={() => toggleBookmark(selected)}
                >
                  <Star
                    size={15}
                    fill={
                      bookmarks.includes(selected.id) ? "currentColor" : "none"
                    }
                  />
                  {bookmarks.includes(selected.id) ? "已收藏" : "收藏"}
                </button>
              </div>
              <div className="knowledge-preview-body">
                <span className="knowledge-preview-eyebrow">
                  CHAPTER {String(selected.chapter + 1).padStart(2, "0")}
                </span>
                <h2>{selected.description}</h2>
                {selected.snippets.map((snippet, index) => (
                  <section key={snippet.id}>
                    <h3>
                      <span>{index + 1}</span>
                      {snippet.title}
                    </h3>
                    <p>{snippet.excerpt}</p>
                  </section>
                ))}
                <div className="knowledge-preview-tip">
                  <Sparkles size={17} />
                  <p>
                    带着问题回到课堂，切换机位、观察人物的方向变化，再用自己的话解释原因。
                  </p>
                </div>
                <p className="knowledge-preview-source">
                  资料来源：MetaLecturer Demo 自编示例课程讲义。
                </p>
              </div>
              <div className="knowledge-preview-footer">
                <Button variant="outline" onClick={() => download(selected)}>
                  <ArrowDownToLine size={16} />
                  下载讲义
                </Button>
                <Button onClick={onClassroom}>
                  进入课堂
                  <ArrowRight size={16} />
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      {notice && (
        <div className="knowledge-toast" role="status">
          <Check size={16} />
          {notice}
        </div>
      )}
    </div>
  );
}
