"use client";

import { useId, useMemo, useState } from "react";
import {
  ArrowDownToLine,
  ArrowRight,
  BookOpen,
  Check,
  CircleHelp,
  Clock3,
  FileText,
  FlaskConical,
  Layers3,
  MessageCircle,
  RotateCcw,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { courses } from "@/lib/courses";
import {
  resetLearning,
  useLearningEvents,
  type LearningEvent,
} from "@/lib/learning";
import "./analytics.css";

type DayData = { label: string; minutes: number; questions: number };
const eventNames: Record<LearningEvent["type"], string> = {
  lesson: "课堂学习",
  question: "课堂提问",
  experiment: "轴线实验",
  quiz: "知识练习",
  note: "学习笔记",
};
const eventIcons = {
  lesson: BookOpen,
  question: MessageCircle,
  experiment: FlaskConical,
  quiz: Check,
  note: FileText,
};
const sampleDays: DayData[] = [
  { label: "周一", minutes: 28, questions: 12 },
  { label: "周二", minutes: 42, questions: 19 },
  { label: "周三", minutes: 35, questions: 15 },
  { label: "周四", minutes: 58, questions: 24 },
  { label: "周五", minutes: 46, questions: 21 },
  { label: "周六", minutes: 68, questions: 32 },
  { label: "周日", minutes: 54, questions: 27 },
];

function dayKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}
function duration(seconds: number) {
  return seconds < 60
    ? `${Math.round(seconds)} 秒`
    : `${Math.floor(seconds / 60)} 分钟`;
}
function downloadRecords(events: LearningEvent[], format: "json" | "csv") {
  const quote = (value: unknown) => {
    let text = String(value ?? "");
    if (/^[=+@\-]/.test(text)) text = `'${text}`;
    return `"${text.replaceAll('"', '""')}"`;
  };
  const content =
    format === "json"
      ? JSON.stringify(
          {
            exportedAt: new Date().toISOString(),
            source: "MetaLecturer 本浏览器学习记录",
            events,
          },
          null,
          2,
        )
      : "\uFEFF" +
        [
          ["时间", "活动", "课程", "内容", "数值（听课为秒，练习为0或1）"],
          ...events.map((event) => [
            event.createdAt,
            eventNames[event.type],
            courses.find((course) => course.id === event.courseId)?.title ??
              event.courseId,
            event.label,
            event.value,
          ]),
        ]
          .map((row) => row.map(quote).join(","))
          .join("\r\n");
  const url = URL.createObjectURL(
    new Blob([content], {
      type:
        format === "json"
          ? "application/json;charset=utf-8"
          : "text/csv;charset=utf-8",
    }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = `MetaLecturer-学习记录-${new Date().toISOString().slice(0, 10)}.${format}`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function LearningChart({
  days,
  metric,
  sample,
}: {
  days: DayData[];
  metric: "minutes" | "questions";
  sample: boolean;
}) {
  const gradient = useId().replaceAll(":", "");
  const width = 660,
    height = 210,
    left = 36,
    right = 18,
    top = 20,
    bottom = 32;
  const values = days.map((day) => day[metric]);
  const max = Math.max(
    metric === "minutes" ? 1 : 4,
    Math.ceil(Math.max(...values) * 1.2),
  );
  const points = values.map((value, index) => ({
    x: left + (index / Math.max(1, days.length - 1)) * (width - left - right),
    y: height - bottom - (value / max) * (height - top - bottom),
  }));
  const line = points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x},${point.y}`)
    .join(" ");
  const area = `${line} L${width - right},${height - bottom} L${left},${height - bottom} Z`;
  return (
    <svg
      className="analytics-chart"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`${sample ? "班级示例" : "个人真实记录"}：${metric === "minutes" ? "每日听课分钟数" : "每日提问次数"}`}
    >
      <defs>
        <linearGradient id={gradient} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#8572ef" stopOpacity=".22" />
          <stop offset="100%" stopColor="#8572ef" stopOpacity=".01" />
        </linearGradient>
      </defs>
      {[0, 1, 2, 3, 4].map((tick) => {
        const value = (max * tick) / 4;
        const y = height - bottom - (tick / 4) * (height - top - bottom);
        return (
          <g key={tick}>
            <line
              x1={left}
              x2={width - right}
              y1={y}
              y2={y}
              stroke="#ecebf4"
              strokeDasharray={tick === 0 ? undefined : "4 5"}
            />
            <text
              x={left - 10}
              y={y + 4}
              textAnchor="end"
              fill="#9d99ae"
              fontSize="10"
            >
              {Number.isInteger(value) ? value : value.toFixed(1)}
            </text>
          </g>
        );
      })}
      <path d={area} fill={`url(#${gradient})`} />
      <path
        d={line}
        fill="none"
        stroke="#8670e7"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {points.map((point, index) => (
        <g key={index}>
          <circle
            cx={point.x}
            cy={point.y}
            r={days.length > 10 ? 2 : 4}
            fill="#fff"
            stroke="#8670e7"
            strokeWidth="2"
          >
            <title>
              {days[index].label}：{Number(values[index].toFixed(1))}{" "}
              {metric === "minutes" ? "分钟" : "次提问"}
            </title>
          </circle>
          {(days.length <= 7 ||
            index % 5 === 0 ||
            index === days.length - 1) && (
            <text
              x={point.x}
              y={height - 9}
              textAnchor="middle"
              fill="#9d99ae"
              fontSize="10"
            >
              {days[index].label}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}

export function Analytics({ onClassroom }: { onClassroom: () => void }) {
  const events = useLearningEvents();
  const [view, setView] = useState<"personal" | "sample">("personal");
  const [range, setRange] = useState<7 | 30>(7);
  const [metric, setMetric] = useState<"minutes" | "questions">("minutes");
  const [resetOpen, setResetOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const filtered = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - range + 1);
    return events.filter(
      (event) => new Date(event.createdAt).getTime() >= start.getTime(),
    );
  }, [events, range]);
  const days = useMemo(
    () =>
      Array.from({ length: range }, (_, index) => {
        const date = new Date();
        date.setDate(date.getDate() - range + index + 1);
        const dayEvents = filtered.filter(
          (event) => dayKey(new Date(event.createdAt)) === dayKey(date),
        );
        return {
          label: `${date.getMonth() + 1}/${date.getDate()}`,
          minutes:
            dayEvents
              .filter((event) => event.type === "lesson")
              .reduce((sum, event) => sum + (event.value ?? 0), 0) / 60,
          questions: dayEvents.filter((event) => event.type === "question")
            .length,
        };
      }),
    [filtered, range],
  );
  const watchSeconds = filtered
    .filter((event) => event.type === "lesson")
    .reduce((sum, event) => sum + (event.value ?? 0), 0);
  const questionCount = filtered.filter(
    (event) => event.type === "question",
  ).length;
  const experimentCount = filtered.filter(
    (event) => event.type === "experiment",
  ).length;
  const notesCount = filtered.filter((event) => event.type === "note").length;
  const quizzes = filtered.filter((event) => event.type === "quiz");
  const correct = quizzes.filter((event) => event.value === 1).length;
  const isSample = view === "sample";
  const sample =
    range === 7
      ? sampleDays
      : Array.from({ length: 30 }, (_, index) => ({
          label: `第${index + 1}天`,
          minutes: 20 + ((index * 13) % 48),
          questions: 8 + ((index * 7) % 26),
        }));
  const stats = [
    {
      label: "听课时长",
      value: isSample
        ? sample
            .reduce((total, day) => total + day.minutes, 0)
            .toLocaleString("zh-CN")
        : watchSeconds < 60
          ? Math.round(watchSeconds).toString()
          : Math.floor(watchSeconds / 60).toString(),
      unit: isSample || watchSeconds >= 60 ? "分钟" : "秒",
      detail: isSample ? "班级日均听课时长之和 · 示例" : "课堂实际播放时间",
      icon: Clock3,
      color: "purple",
    },
    {
      label: "课堂提问",
      value: isSample
        ? sample
            .reduce((total, day) => total + day.questions, 0)
            .toLocaleString("zh-CN")
        : String(questionCount),
      unit: "次",
      detail: isSample
        ? "班级提问数 · 示例"
        : questionCount
          ? "每一个问题，都让理解更进一步"
          : "在课堂中向数字教授提问",
      icon: MessageCircle,
      color: "blue",
    },
    {
      label: "互动实验",
      value: isSample ? (range === 7 ? "86" : "328") : String(experimentCount),
      unit: "次",
      detail: isSample ? "班级实验次数 · 示例" : `${notesCount} 条笔记已保存`,
      icon: FlaskConical,
      color: "orange",
    },
    {
      label: "练习正确率",
      value: isSample
        ? "82"
        : quizzes.length
          ? String(Math.round((correct / quizzes.length) * 100))
          : "—",
      unit: isSample || quizzes.length ? "%" : "",
      detail: isSample
        ? "示例练习成绩，不代表实际掌握度"
        : quizzes.length
          ? `${correct} / ${quizzes.length} 次作答正确`
          : "完成练习后生成",
      icon: Check,
      color: "green",
    },
  ];
  const recent = [...filtered]
    .reverse()
    .filter((event) => event.type !== "lesson" || (event.value ?? 0) > 0)
    .slice(0, 5);
  return (
    <section className="analytics-page">
      <div className="analytics-heading">
        <div>
          <div className="analytics-eyebrow">
            <span /> LEARNING INSIGHTS
          </div>
          <h1>
            让每一次学习，都有迹可循<span>。</span>
          </h1>
          <p>看见你的投入与探索，把学习反馈带回下一次课堂。</p>
        </div>
        <div className="analytics-heading-actions">
          <Button
            variant="outline"
            onClick={() => setExportOpen(true)}
            disabled={!events.length}
          >
            <ArrowDownToLine size={16} /> 导出个人记录
          </Button>
          <button
            className="analytics-reset"
            onClick={() => setResetOpen(true)}
            disabled={!events.length}
            title="清除本浏览器保存的全部学习记录"
          >
            <RotateCcw size={16} />
            <span>重置</span>
          </button>
        </div>
      </div>
      <div className="analytics-toolbar">
        <div className="analytics-tabs" role="group" aria-label="数据视角">
          <button
            aria-pressed={!isSample}
            className={!isSample ? "is-active" : ""}
            onClick={() => setView("personal")}
          >
            本次体验
          </button>
          <button
            aria-pressed={isSample}
            className={isSample ? "is-active" : ""}
            onClick={() => setView("sample")}
          >
            班级示例 <span>DEMO</span>
          </button>
        </div>
        <div className="analytics-range" role="group" aria-label="统计时间范围">
          {([7, 30] as const).map((days) => (
            <button
              key={days}
              aria-pressed={range === days}
              onClick={() => setRange(days)}
              className={range === days ? "is-active" : ""}
            >
              近 {days} 天
            </button>
          ))}
        </div>
      </div>
      <div className={`analytics-context ${isSample ? "is-sample" : ""}`}>
        <CircleHelp size={14} />
        {isSample
          ? "这里展示班级数据的产品效果，全部为示例数据；不会计入你的学习记录。"
          : "基于本浏览器保存的真实体验记录，随课堂操作更新。清除浏览器数据后记录会丢失。"}
      </div>
      <div className="analytics-stat-grid">
        {stats.map((stat) => (
          <article className="analytics-stat" key={stat.label}>
            <div className="analytics-stat-top">
              <span>{stat.label}</span>
              <div className={`analytics-stat-icon ${stat.color}`}>
                <stat.icon size={18} />
              </div>
            </div>
            <div className="analytics-stat-value">
              {stat.value}
              <span>{stat.unit}</span>
            </div>
            <p>{stat.detail}</p>
          </article>
        ))}
      </div>
      <div className="analytics-main-grid">
        <article className="analytics-panel analytics-trend">
          <div className="analytics-panel-heading">
            <div>
              <h2>学习的节奏</h2>
              <p>
                {isSample
                  ? "示例趋势，帮助理解数据回流的呈现方式"
                  : `近 ${range} 天的每一次投入`}
              </p>
            </div>
            <div
              className="analytics-chart-switch"
              role="group"
              aria-label="趋势指标"
            >
              <button
                className={metric === "minutes" ? "is-active" : ""}
                aria-pressed={metric === "minutes"}
                onClick={() => setMetric("minutes")}
              >
                听课时长
              </button>
              <button
                className={metric === "questions" ? "is-active" : ""}
                aria-pressed={metric === "questions"}
                onClick={() => setMetric("questions")}
              >
                问答次数
              </button>
            </div>
          </div>
          {!isSample && !filtered.length ? (
            <div className="analytics-chart-empty">
              <div className="analytics-empty-illustration">
                <span />
                <span />
                <span />
                <span />
                <span />
                <TrendingUp size={28} />
              </div>
              <h3>你的学习曲线，从这里开始</h3>
              <p>
                进入课堂听一段讲解、问一个问题，
                <br />
                这里就会留下你的第一份学习记录。
              </p>
              <Button onClick={onClassroom}>
                开始第一段学习 <ArrowRight size={15} />
              </Button>
            </div>
          ) : (
            <>
              <div className="analytics-chart-unit">
                {metric === "minutes" ? "分钟" : "次"}
                {isSample && <span>示例数据</span>}
              </div>
              <LearningChart
                days={isSample ? sample : days}
                metric={metric}
                sample={isSample}
              />
              <div className="analytics-chart-foot">
                <span className="analytics-legend-dot" />
                {metric === "minutes"
                  ? isSample
                    ? "班级日均听课时长"
                    : "实际听课时长"
                  : "课堂提问次数"}
                <span className="analytics-chart-note">
                  {isSample
                    ? "仅用于展示，不代表实际运营数据"
                    : "将鼠标移到数据点查看数值"}
                </span>
              </div>
            </>
          )}
        </article>
        <article className="analytics-panel analytics-focus">
          <div className="analytics-panel-heading">
            <div>
              <h2>{isSample ? "知识点关注分布" : "你的学习足迹"}</h2>
              <p>
                {isSample ? "班级问题聚合 · 示例" : "把观看、探索和思考连起来"}
              </p>
            </div>
            <Layers3 size={19} />
          </div>
          {isSample ? (
            <div className="analytics-topic-list">
              {[
                { name: "镜头轴线与空间关系", value: 42 },
                { name: "景别与情绪表达", value: 28 },
                { name: "连续性剪辑", value: 18 },
                { name: "镜头运动", value: 12 },
              ].map((topic) => (
                <div key={topic.name}>
                  <div>
                    <span>{topic.name}</span>
                    <strong>{topic.value}%</strong>
                  </div>
                  <div className="analytics-topic-track">
                    <span style={{ width: `${topic.value * 2}%` }} />
                  </div>
                </div>
              ))}
              <div className="analytics-small-insight">
                <Sparkles size={16} />
                <p>示例反馈：下次课程可增加轴线变化的对照讲解。</p>
              </div>
            </div>
          ) : (
            <>
              <div className="analytics-footprints">
                {[
                  {
                    label: "观看讲解",
                    detail: duration(watchSeconds),
                    active: watchSeconds > 0,
                    Icon: BookOpen,
                  },
                  {
                    label: "主动提问",
                    detail: `${questionCount} 次`,
                    active: questionCount > 0,
                    Icon: MessageCircle,
                  },
                  {
                    label: "动手实验",
                    detail: `${experimentCount} 次`,
                    active: experimentCount > 0,
                    Icon: FlaskConical,
                  },
                  {
                    label: "留下思考",
                    detail: `${notesCount} 条笔记`,
                    active: notesCount > 0,
                    Icon: FileText,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={item.active ? "is-done" : ""}
                  >
                    <span className="analytics-footprint-icon">
                      <item.Icon size={17} />
                    </span>
                    <span>{item.label}</span>
                    <strong>{item.detail}</strong>
                  </div>
                ))}
              </div>
              <div className="analytics-small-insight">
                <Sparkles size={16} />
                <p>
                  {filtered.length
                    ? "记录展示已发生的学习行为，不将使用次数直接换算为知识掌握度。"
                    : "从一堂互动微课开始，试着把一个知识点讲给自己听。"}
                </p>
              </div>
            </>
          )}
        </article>
      </div>
      <article className="analytics-panel analytics-activity">
        <div className="analytics-panel-heading">
          <div>
            <h2>{isSample ? "数据如何回到课堂" : "最近的学习活动"}</h2>
            <p>
              {isSample
                ? "从学习行为，找到下一次教学的改进方向"
                : "你的提问、练习和笔记，都值得被留下"}
            </p>
          </div>
          {!isSample && (
            <span className="analytics-count">{filtered.length} 条记录</span>
          )}
        </div>
        {isSample ? (
          <div className="analytics-feedback-flow">
            {[
              {
                n: "01",
                title: "收集问题",
                text: "保留学生的问题与课程上下文",
              },
              {
                n: "02",
                title: "发现共性",
                text: "按知识点归类，查看集中疑问",
              },
              { n: "03", title: "补充讲解", text: "为高频问题准备案例与练习" },
            ].map((item) => (
              <div key={item.n}>
                <span>{item.n}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        ) : recent.length ? (
          <div className="analytics-event-list">
            {recent.map((event) => {
              const Icon = eventIcons[event.type] ?? BookOpen;
              return (
                <div className="analytics-event" key={event.id}>
                  <span className={`analytics-event-icon ${event.type}`}>
                    <Icon size={17} />
                  </span>
                  <div>
                    <strong>{event.label}</strong>
                    <p>
                      {eventNames[event.type]}
                      <span>·</span>
                      {courses.find((course) => course.id === event.courseId)
                        ?.title ?? "互动课堂"}
                      {event.type === "lesson" &&
                        ` · ${duration(event.value ?? 0)}`}
                    </p>
                  </div>
                  <time dateTime={event.createdAt}>
                    {new Date(event.createdAt).toLocaleString("zh-CN", {
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </time>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="analytics-activity-empty">
            <FileText size={22} />
            <span>还没有学习活动。完成一次课堂互动后，记录会出现在这里。</span>
            <button onClick={onClassroom}>
              前往课堂 <ArrowRight size={14} />
            </button>
          </div>
        )}
      </article>
      <p className="analytics-status" role="status">
        {notice}
      </p>
      <Dialog open={resetOpen} onOpenChange={setResetOpen}>
        <DialogContent
          title="重置学习记录？"
          description="将清除本浏览器中的听课、问答、实验、练习与笔记记录。清除后无法恢复，你可以先导出一份记录。"
        >
          <div className="analytics-dialog-actions">
            <Button variant="outline" onClick={() => setResetOpen(false)}>
              保留记录
            </Button>
            <Button
              onClick={() => {
                resetLearning();
                setResetOpen(false);
                setNotice("学习记录已重置，可以开始一次新的体验。");
              }}
            >
              确认重置
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={exportOpen} onOpenChange={setExportOpen}>
        <DialogContent
          title="带走你的学习记录"
          description={`导出本浏览器保存的全部 ${events.length} 条真实记录，包含活动类型、内容与时间。班级示例数据不会导出。`}
        >
          <div className="analytics-export-options">
            <button
              onClick={() => {
                downloadRecords(events, "csv");
                setExportOpen(false);
                setNotice("已生成 CSV 学习记录。");
              }}
            >
              <FileText size={25} />
              <strong>CSV 表格</strong>
              <span>适合用 Excel、飞书表格查看</span>
              <ArrowDownToLine size={17} />
            </button>
            <button
              onClick={() => {
                downloadRecords(events, "json");
                setExportOpen(false);
                setNotice("已生成 JSON 学习记录。");
              }}
            >
              <Layers3 size={25} />
              <strong>JSON 数据</strong>
              <span>保留每条记录的完整字段</span>
              <ArrowDownToLine size={17} />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
