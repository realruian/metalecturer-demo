"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight, Play, TrendingUp } from "lucide-react";
import { heroCourses, recommendedCourses, type Course } from "@/lib/courses";
import { CategoryArtwork, GlassCrystal, GlassRibbon, PathArtwork } from "@/components/reference-art";
import { newsItems } from "@/components/discovery";
import "./home.css";

const categories = ["剪辑包装", "摄影摄像", "导演编剧", "影视后期", "三维动画", "声音设计", "AIGC", "全部分类"];

type Props = {
  onExplore: (category?: string) => void;
  onCourse: (course: Course) => void;
  onClassroom: () => void;
  onPath: () => void;
  onNews: (id?: string) => void;
};

export function Home({ onExplore, onCourse, onClassroom, onPath, onNews }: Props) {
  const [slide, setSlide] = useState(0);
  const [offset, setOffset] = useState(0);
  const ordered = [...recommendedCourses.slice(offset), ...recommendedCourses.slice(0, offset)];
  return (
    <div className="landing">
      <GlassRibbon className="landing-ribbon" />
      <GlassCrystal className="landing-crystal" />
      <section className="landing-hero" aria-label="精选课程">
        <div className="landing-intro">
          <span className="landing-tag">系统学习 · 项目实战 · 行业接轨</span>
          <h1>未来 · 影像 · 无限</h1>
          <p>MetaLecturer 让你的影视创作想象力落地</p>
          <button className="landing-explore" onClick={() => onExplore()}>
            探索课程 <span><ArrowRight size={18} /></span>
          </button>
          <div className="landing-statistics" aria-label="示例平台规模">
            <div><strong>1200+</strong><span>优质课程</span></div><i />
            <div><strong>300+</strong><span>行业导师</span></div><i />
            <div><strong>10W+</strong><span>学习者</span></div>
          </div>
        </div>
        <div className="landing-carousel" aria-roledescription="轮播">
          <div className="landing-slides">
            {heroCourses.map((course, index) => {
              const distance = (index - slide + heroCourses.length) % heroCourses.length;
              const position = distance === 0 ? "current" : distance === 1 ? "next" : distance === heroCourses.length - 1 ? "previous" : "hidden";
              return (
                <article key={course.id} className={`landing-slide ${position} landing-slide-${course.id}`} aria-hidden={distance !== 0}>
                  <Image src={course.image} fill alt={`${course.title}课程封面`} sizes="(max-width: 700px) 90vw, (max-width: 1500px) 55vw, 800px" priority={index === 0} />
                  {course.id === "c4d" && <GlassRibbon className="landing-c4d-art" />}
                  <div className="landing-slide-shade" />
                  <span className="landing-slide-badge">{index === 0 ? "热播推荐" : course.tag}</span>
                  <div className="landing-slide-copy">
                    <h2>{course.id === "c4d" ? <>C4D &amp;<br />影视级三维</> : course.title}</h2>
                    <p>{course.subtitle}</p>
                    <div className="landing-slide-bottom">
                      <div className="landing-instructor">
                        <Image src="/assets/reference-instructor.png" width={30} height={30} alt="示例讲师形象" />
                        <span><strong>{course.instructor} <small>{course.category === "导演编剧" ? "导演 / 编剧" : course.category}</small></strong><span>进阶 · {course.lessons} 课时 · 示例课程</span></span>
                      </div>
                      <button className="landing-preview" tabIndex={distance === 0 ? 0 : -1} onClick={() => course.id === "director" ? onClassroom() : onCourse(course)}><Play size={13} fill="currentColor" />试看</button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          <button className="landing-carousel-arrow landing-carousel-prev" aria-label="上一门课程" onClick={() => setSlide((slide + heroCourses.length - 1) % heroCourses.length)}><ChevronLeft size={24} /></button>
          <button className="landing-carousel-arrow landing-carousel-next" aria-label="下一门课程" onClick={() => setSlide((slide + 1) % heroCourses.length)}><ChevronRight size={24} /></button>
          <div className="landing-dots" aria-label="选择精选课程">
            {heroCourses.map((course, index) => <button key={course.id} className={slide === index ? "active" : ""} aria-label={`展示${course.title}`} aria-pressed={slide === index} onClick={() => setSlide(index)} />)}
          </div>
        </div>
      </section>
      <section className="landing-discover" aria-label="课程分类与学习路径">
        <div className="landing-categories">
          {categories.map((category, index) => <button key={category} onClick={() => onExplore(category)}><span className="landing-category-art"><CategoryArtwork index={index} /></span><span>{category}</span></button>)}
        </div>
        <button className="landing-path" onClick={onPath}>
          <span><strong>学习路径规划</strong><small>定制你的成长路线图</small></span>
          <PathArtwork className="landing-path-art" />
        </button>
      </section>
      <section className="landing-lower">
        <div className="landing-recommendations">
          <div className="landing-section-heading"><h2>为你推荐</h2><button onClick={() => setOffset((offset + 1) % recommendedCourses.length)}><TrendingUp size={13} />换一批</button></div>
          <div className="landing-course-grid">
            {ordered.map(course => <button key={course.id} className="landing-course" onClick={() => onCourse(course)} aria-label={`查看${course.title}`}>
              <span className="landing-course-cover"><Image src={course.image} alt="" fill sizes="200px" /></span>
              <span className="landing-course-info"><strong title={course.title}>{course.title}</strong><span title={course.subtitle}>{course.subtitle}</span><small>{course.level} · {course.lessons} 课时</small><span className="landing-price">¥{course.price}<del>¥{course.originalPrice}</del></span></span>
            </button>)}
          </div>
        </div>
        <aside className="landing-news" aria-label="行业快讯">
          <div className="landing-news-heading"><h2>行业快讯</h2><button onClick={() => onNews()}>更多<ChevronRight size={15} /></button></div>
          {newsItems.map(item => <button className="landing-news-item" key={item.id} onClick={() => onNews(item.id)}><span title={item.title}>{item.title}</span><time>{item.time}</time></button>)}
        </aside>
      </section>
      <p className="landing-demo-note">交互演示版 · 平台规模、课程价格及资讯均为界面示例。点击「试看」可体验完整互动课堂。</p>
    </div>
  );
}
