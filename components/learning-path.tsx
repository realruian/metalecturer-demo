"use client";

import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Camera,
  Check,
  CheckCheck,
  Clapperboard,
  Compass,
  FileText,
  FlaskConical,
  Lightbulb,
  Play,
  Route,
  Sparkles,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLearningEvents } from "@/lib/learning";
import { courses } from "@/lib/courses";
import "./learning-path.css";

const goals = {
  director: {
    label: "导演叙事",
    icon: Clapperboard,
    title: "让每一个镜头，都有表达。",
    text: "从理解镜头的空间关系开始，练习用画面组织信息与情绪。",
    recommendation:
      "先理解人物关系，再决定摄影机站在哪里。每一次机位选择，都应该帮助观众读懂故事。",
  },
  camera: {
    label: "摄影构图",
    icon: Camera,
    title: "用摄影机，建立你的观看方式。",
    text: "观察人物、机位与轴线的关系，让每个画面的方向清晰、衔接自然。",
    recommendation:
      "在轴线实验中多尝试不同的机位，对照人物视线与运动方向，建立稳定的空间感。",
  },
  ai: {
    label: "AI 影像创作",
    icon: Sparkles,
    title: "让生成的画面，讲得通故事。",
    text: "先掌握镜头语言，再把空间关系、景别与方向写进你的创作提示。",
    recommendation:
      "把实验中的机位与方向写成一段镜头描述，为生成连续、有逻辑的 AI 影像打下基础。",
  },
};

export function LearningPath({ onClassroom }: { onClassroom: () => void }) {
  const events = useLearningEvents();
  const [goal, setGoal] = useState<keyof typeof goals>("director");
  const directorEvents = events.filter(
    (event) => event.courseId === "director",
  );
  const seconds = directorEvents
    .filter((event) => event.type === "lesson")
    .reduce((sum, event) => sum + (event.value ?? 0), 0);
  const experiments = directorEvents.filter(
    (event) => event.type === "experiment",
  ).length;
  const quizzes = directorEvents.filter((event) => event.type === "quiz");
  const notes = directorEvents.filter((event) => event.type === "note").length;
  const questions = directorEvents.filter(
    (event) => event.type === "question",
  ).length;
  const steps = [
    {
      id: "watch",
      title: "认识镜头",
      category: "WATCH & DISCOVER",
      description:
        "跟随数字教授认识镜头轴线，建立人物、摄影机与空间之间的联系。",
      action: "进入课堂听讲",
      done: seconds > 0,
      detail:
        seconds > 0
          ? `已听课 ${seconds < 60 ? `${Math.round(seconds)} 秒` : `${Math.floor(seconds / 60)} 分钟`}`
          : "观看一段镜头语言讲解",
      Icon: Play,
      color: "purple",
      tip: "带着问题看：为什么两个镜头接在一起，有时会让人分不清方向？",
    },
    {
      id: "experiment",
      title: "亲手改变机位",
      category: "TRY & EXPLORE",
      description: "拖动摄影机，观察轴线两侧的画面变化。在尝试中理解空间关系。",
      action: "去做轴线实验",
      done: experiments > 0,
      detail: experiments
        ? `已完成 ${experiments} 次实验操作`
        : "在课堂中尝试一次轴线实验",
      Icon: FlaskConical,
      color: "orange",
      tip: "试着把摄影机移到轴线另一侧，观察人物在画面里的左右关系。",
    },
    {
      id: "practice",
      title: "检验你的理解",
      category: "THINK & PRACTICE",
      description: "用课堂练习检查自己的判断，看看能否解释机位选择的原因。",
      action: "前往课堂练习",
      done: quizzes.length > 0,
      detail: quizzes.length
        ? `已作答 ${quizzes.length} 次 · ${quizzes.filter((quiz) => quiz.value === 1).length} 次正确`
        : "完成一次知识点练习",
      Icon: CheckCheck,
      color: "blue",
      tip: "先给出你的判断，再看解析。答错也是定位疑问的一种方式。",
    },
    {
      id: "review",
      title: "留下自己的理解",
      category: "REFLECT & KEEP",
      description:
        "用自己的话保存一条课堂笔记，把刚刚学到的内容变成下次可用的经验。",
      action: "去课堂记一笔",
      done: notes > 0,
      detail: notes ? `已保存 ${notes} 条课堂笔记` : "写下并保存一条学习笔记",
      Icon: FileText,
      color: "green",
      tip: "可以记录：什么情况下需要保持轴线？如果要越轴，你会怎么处理？",
    },
  ];
  const count = steps.filter((step) => step.done).length;
  const nextIndex = steps.findIndex((step) => !step.done);
  const course = courses.find((item) => item.id === "director")!;
  const selectedGoal = goals[goal];
  return (
    <section className="path-page">
      <div className="path-heading">
        <div className="path-eyebrow">
          <Compass size={12} /> YOUR LEARNING JOURNEY
        </div>
        <h1>
          从一个镜头，开始你的创作之路<span>。</span>
        </h1>
        <p>一条清晰的小路径，把听懂、动手和自己的理解连在一起。</p>
      </div>
      <div className="path-hero">
        <div className="path-hero-copy">
          <div className="path-hero-label">
            <span /> 为你的创作目标，找到起点
          </div>
          <h2>{selectedGoal.title}</h2>
          <p>{selectedGoal.text}</p>
          <div className="path-goals" role="group" aria-label="选择学习目标">
            {(
              Object.entries(goals) as [
                keyof typeof goals,
                (typeof goals)[keyof typeof goals],
              ][]
            ).map(([id, item]) => (
              <button
                key={id}
                className={goal === id ? "is-active" : ""}
                aria-pressed={goal === id}
                onClick={() => setGoal(id)}
              >
                <item.icon size={14} />
                {item.label}
                {goal === id && <Check size={12} />}
              </button>
            ))}
          </div>
        </div>
        <div className="path-route-art" aria-hidden="true">
          <div className="path-art-orbit" />
          <svg viewBox="0 0 270 170">
            <path
              d="M 33 130 C 10 40, 110 174, 107 90 S 172 10, 174 73 S 250 130, 235 25"
              fill="none"
              stroke="#cfc1f3"
              strokeWidth="2"
              strokeDasharray="5 7"
            />
            <circle cx="34" cy="130" r="5" fill="#a18bd8" />
            <circle cx="235" cy="25" r="5" fill="#bca9e7" />
          </svg>
          <div className="path-art-card path-art-card-one">
            <Play size={21} />
            <span>从好奇出发</span>
          </div>
          <div className="path-art-card path-art-card-two">
            <FlaskConical size={25} />
            <span>在实践中理解</span>
          </div>
          <div className="path-art-spark">
            <Sparkles size={21} />
          </div>
          <span className="path-art-dot" />
        </div>
      </div>
      <div className="path-body">
        <div className="path-stages">
          <div className="path-section-heading">
            <div>
              <h2>镜头语言 · 四步入门</h2>
              <p>配合「导演思维与镜头语言」互动微课体验</p>
            </div>
            <span>
              <Route size={14} /> {count} / 4 已体验
            </span>
          </div>
          <div className="path-step-list">
            {steps.map((step, index) => (
              <article
                className={`path-step ${step.done ? "is-done" : ""} ${index === nextIndex ? "is-current" : ""}`}
                key={step.id}
              >
                <div className="path-step-rail">
                  <span>
                    {step.done ? (
                      <Check size={16} />
                    ) : (
                      String(index + 1).padStart(2, "0")
                    )}
                  </span>
                </div>
                <div className="path-step-card">
                  <div className={`path-step-icon ${step.color}`}>
                    <step.Icon size={23} />
                  </div>
                  <div className="path-step-content">
                    <div className="path-step-kicker">
                      {step.category}
                      {index === nextIndex && <span>下一步</span>}
                      {step.done && <span className="is-done">已体验</span>}
                    </div>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                    <div className="path-step-bottom">
                      <span>
                        {step.done && <Check size={12} />} {step.detail}
                      </span>
                      <button onClick={onClassroom}>
                        {step.done ? "回到课堂" : step.action}
                        <ArrowRight size={14} />
                      </button>
                    </div>
                    <div className="path-step-tip">
                      <Lightbulb size={13} />
                      {step.tip}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="path-progress-note">
            <CircleProgress count={count} />
            <p>
              进度来自本浏览器中的真实课堂操作。完成体验步骤，代表你做过这些练习；知识掌握需要继续实践。
            </p>
          </div>
        </div>
        <aside className="path-sidebar">
          <div className="path-course-card">
            <div className="path-course-image">
              <img src={course.image} alt="导演思维与镜头语言课程封面" />
              <span>
                <Play size={10} fill="currentColor" /> 互动微课
              </span>
            </div>
            <div className="path-course-content">
              <div className="path-course-eyebrow">你的起点课程</div>
              <h3>{course.title}</h3>
              <p>
                {course.instructor} <span>·</span> 数字教授
              </p>
              <div className="path-course-progress">
                <span>四步体验进度</span>
                <strong>{count * 25}%</strong>
              </div>
              <div className="path-progress-track">
                <span style={{ width: `${count * 25}%` }} />
              </div>
              <Button onClick={onClassroom}>
                {count === 0
                  ? "开启我的学习"
                  : count === 4
                    ? "回到课堂，继续探索"
                    : "继续我的课堂"}
                <ArrowRight size={15} />
              </Button>
              <span className="path-course-footnote">
                随时开始，按自己的节奏学习
              </span>
            </div>
          </div>
          <div className="path-recommendation">
            <div>
              <selectedGoal.icon size={17} />
              <span>{selectedGoal.label} · 学习建议</span>
            </div>
            <p>{selectedGoal.recommendation}</p>
          </div>
          <div className="path-pocket">
            <div className="path-pocket-heading">
              <BookOpen size={16} />
              <h3>你已经留下了</h3>
            </div>
            <div>
              <span>
                <strong>{questions}</strong>个问题
              </span>
              <span>
                <strong>{notes}</strong>条笔记
              </span>
            </div>
            <p>
              {questions || notes
                ? "好问题和自己的理解，是可以反复翻看的创作素材。"
                : "听课时遇到疑问，随时向数字教授提问，或记下你的灵感。"}
            </p>
          </div>
          <div className="path-goal-note">
            <Target size={15} />
            <p>选择目标会调整学习建议。当前三个方向共用这门镜头语言入门课。</p>
          </div>
        </aside>
      </div>
    </section>
  );
}

function CircleProgress({ count }: { count: number }) {
  return (
    <svg viewBox="0 0 30 30" width="30" height="30" aria-hidden="true">
      <circle
        cx="15"
        cy="15"
        r="11"
        fill="none"
        stroke="#e8e0f4"
        strokeWidth="2"
      />
      <circle
        cx="15"
        cy="15"
        r="11"
        fill="none"
        stroke="#a28acc"
        strokeWidth="2"
        strokeDasharray={`${(count / 4) * 69.1} 69.1`}
        transform="rotate(-90 15 15)"
        strokeLinecap="round"
      />
      {count === 4 ? (
        <path
          d="m10 15 3 3 7-7"
          fill="none"
          stroke="#a28acc"
          strokeWidth="1.5"
        />
      ) : (
        <circle cx="15" cy="15" r="2" fill="#a28acc" />
      )}
    </svg>
  );
}
