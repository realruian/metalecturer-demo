"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Camera,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Clock3,
  FileText,
  Headphones,
  LoaderCircle,
  NotebookPen,
  Pause,
  Play,
  RotateCcw,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { recordLearning, useLearningEvents } from "@/lib/learning";
import "./classroom.css";

const chapters = [
  {
    title: "建立轴线",
    subtitle: "先让观众看懂空间",
    copy: "两个人物之间的连线，就是我们组织镜头的轴线。先建立位置关系，再决定摄影机放在哪里。",
    eyebrow: "01 / 空间关系",
    angle: 60,
  },
  {
    title: "同侧机位",
    subtitle: "保持稳定的画面方向",
    copy: "摄影机始终留在轴线同一侧，人物在画面中的左右位置就保持一致。试着在 0°–180° 之间移动机位。",
    eyebrow: "02 / 180° 原则",
    angle: 120,
  },
  {
    title: "越轴实验",
    subtitle: "亲手移动一次摄影机",
    copy: "把机位拖过 180°，观察 A、B 的画面位置。即使人物没有移动，突然切到轴线另一侧，也会改变观众理解的空间关系。",
    eyebrow: "03 / 互动实验",
    angle: 230,
  },
  {
    title: "合理越轴",
    subtitle: "给观众一个空间过渡",
    copy: "需要跨过轴线时，可以用连续运动镜头展示机位变化，或用轴线上的中性镜头作为过渡。关键是让新的空间关系被看见。",
    eyebrow: "04 / 镜头调度",
    angle: 180,
  },
  {
    title: "小结练习",
    subtitle: "把理解变成一个判断",
    copy: "轴线帮助观众理解方向，并非不能打破的禁令。完成下面的练习，检验你是否能为一组对话选择合适的机位。",
    eyebrow: "05 / 学以致用",
    angle: 75,
  },
];
type Source = { id: string; title: string; excerpt: string; chapter: number };
type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  sources?: Source[];
  error?: boolean;
  question?: string;
};
type ClassroomProps = {
  onBack: () => void;
  onKnowledge: () => void;
  onAnalytics: () => void;
};
const timeLabel = (seconds: number) =>
  `${Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0")}:${Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0")}`;

export function Classroom({
  onBack,
  onKnowledge,
  onAnalytics,
}: ClassroomProps) {
  const [chapter, setChapter] = useState(0);
  const [angle, setAngle] = useState(60);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioError, setAudioError] = useState("");
  const [playerStatus, setPlayerStatus] = useState("");
  const [panel, setPanel] = useState<"chat" | "notes">("chat");
  const [question, setQuestion] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [note, setNote] = useState("");
  const [noteSaved, setNoteSaved] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizChoice, setQuizChoice] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [crossed, setCrossed] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const chatBottom = useRef<HTMLDivElement>(null);
  const requestRef = useRef<AbortController | null>(null);
  const lessonRef = useRef(0);
  const lastTime = useRef(0);
  const lastWallTime = useRef(0);
  const listenedSeconds = useRef(0);
  const playbackActive = useRef(false);
  const seeking = useRef(false);
  const autoplayChapter = useRef<number | null>(null);
  const mounted = useRef(true);
  const sendingRef = useRef(false);
  const events = useLearningEvents();
  const notes = events.filter(
    (event) => event.type === "note" && event.courseId === "director",
  );
  const completed = new Set(
    events
      .filter(
        (event) =>
          event.type === "lesson" &&
          event.courseId === "director" &&
          event.label.startsWith("完成 · "),
      )
      .map((event) => event.label.replace("完成 · ", ""))
      .filter((title) => chapters.some((item) => item.title === title)),
  );
  const progress = Math.round((completed.size / chapters.length) * 100);
  const reversed = angle > 180 && angle < 360;
  const onAxis = angle === 0 || angle === 180 || angle === 360;
  const cameraX = 220 + Math.cos((angle * Math.PI) / 180) * 150;
  const cameraY = 115 + Math.sin((angle * Math.PI) / 180) * 76;

  function flushLearning() {
    if (listenedSeconds.current >= 0.01) {
      const seconds = Math.round(listenedSeconds.current * 100) / 100;
      listenedSeconds.current = 0;
      recordLearning({
        type: "lesson",
        courseId: "director",
        label: chapters[lessonRef.current].title,
        value: seconds,
      });
    }
  }

  function capturePlayback(audio: HTMLAudioElement | null = audioRef.current) {
    if (!audio) return;
    const now = performance.now();
    const delta = audio.currentTime - lastTime.current;
    const elapsed = (now - lastWallTime.current) / 1000;
    // 只累计实际播放的时间，跳转进度不计入听课时长。
    if (
      playbackActive.current &&
      !seeking.current &&
      delta > 0 &&
      delta <= elapsed * audio.playbackRate + 0.35
    ) {
      listenedSeconds.current += delta;
      if (listenedSeconds.current >= 5) flushLearning();
    }
    lastTime.current = audio.currentTime;
    lastWallTime.current = now;
  }

  useEffect(() => {
    mounted.current = true;
    const audio = audioRef.current;
    const saveBeforeLeave = () => {
      capturePlayback(audio);
      flushLearning();
    };
    window.addEventListener("pagehide", saveBeforeLeave);
    return () => {
      mounted.current = false;
      requestRef.current?.abort();
      autoplayChapter.current = null;
      capturePlayback(audio);
      playbackActive.current = false;
      audio?.pause();
      flushLearning();
      window.removeEventListener("pagehide", saveBeforeLeave);
    };
  }, []);
  useEffect(() => {
    chatBottom.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [messages, busy]);

  function selectChapter(index: number, continuePlayback = false) {
    if (
      !Number.isInteger(index) ||
      index < 0 ||
      index >= chapters.length ||
      index === chapter
    )
      return;
    capturePlayback();
    playbackActive.current = false;
    audioRef.current?.pause();
    flushLearning();
    lastTime.current = 0;
    lastWallTime.current = performance.now();
    seeking.current = false;
    autoplayChapter.current = continuePlayback ? index : null;
    lessonRef.current = index;
    setChapter(index);
    setAngle(chapters[index].angle);
    setCurrentTime(0);
    setDuration(0);
    setAudioError("");
    setPlayerStatus("");
    setPlaying(false);
  }

  function pauseLesson() {
    autoplayChapter.current = null;
    capturePlayback();
    playbackActive.current = false;
    audioRef.current?.pause();
    setPlaying(false);
    flushLearning();
  }

  async function toggleAudio() {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.paused) {
      pauseLesson();
      return;
    }
    setAudioError("");
    setPlayerStatus("");
    try {
      await audio.play();
    } catch {
      setAudioError("讲解暂时无法播放，请重试。你可以继续操作机位实验。");
    }
  }

  function updatePlayback() {
    const audio = audioRef.current;
    if (!audio) return;
    capturePlayback(audio);
    setCurrentTime(audio.currentTime);
  }

  function finishLesson() {
    capturePlayback();
    playbackActive.current = false;
    setPlaying(false);
    flushLearning();
    const audio = audioRef.current;
    let coveredSeconds = 0;
    if (audio)
      for (let index = 0; index < audio.played.length; index++)
        coveredSeconds += audio.played.end(index) - audio.played.start(index);
    const listenedThrough =
      !!audio &&
      Number.isFinite(audio.duration) &&
      audio.duration > 0 &&
      coveredSeconds >= audio.duration * 0.9;
    if (listenedThrough) {
      if (!completed.has(chapters[chapter].title))
        recordLearning({
          type: "lesson",
          courseId: "director",
          label: `完成 · ${chapters[chapter].title}`,
          value: 0,
        });
      if (chapter < chapters.length - 1) {
        selectChapter(chapter + 1, true);
        setPlayerStatus(
          `「${chapters[chapter].title}」已完成，接下来学习「${chapters[chapter + 1].title}」。`,
        );
      } else
        setPlayerStatus("本课讲解已完成。做一道随堂练习，看看自己的理解吧。");
    } else
      setPlayerStatus("已播放至本节结尾。听完主要内容后，将更新章节进度。");
  }

  async function continueLesson() {
    if (autoplayChapter.current !== chapter) return;
    autoplayChapter.current = null;
    try {
      await audioRef.current?.play();
    } catch {
      setPlayerStatus("下一节已准备好，点击播放继续学习。");
    }
  }

  function seekTo(value: number) {
    const audio = audioRef.current;
    if (!audio) return;
    capturePlayback(audio);
    audio.currentTime = value;
    lastTime.current = value;
    lastWallTime.current = performance.now();
    setCurrentTime(value);
    setPlayerStatus("");
  }

  function moveCamera(next: number) {
    setAngle(next);
    if (next > 180 && next < 360 && !crossed) {
      setCrossed(true);
      recordLearning({
        type: "experiment",
        courseId: "director",
        label: "移动摄影机跨越轴线，观察人物左右关系变化",
        value: 1,
      });
    }
  }

  async function ask(value: string) {
    const text = value.trim();
    if (!text || sendingRef.current) return;
    if (text.length > 500) {
      setMessages((previous) => [
        ...previous,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: "问题请控制在 500 字以内，再发送即可。",
          error: true,
        },
      ]);
      return;
    }
    pauseLesson();
    setPanel("chat");
    setQuestion("");
    sendingRef.current = true;
    setBusy(true);
    const request = new AbortController();
    requestRef.current = request;
    const timeout = window.setTimeout(() => request.abort(), 20000);
    setMessages((previous) => [
      ...previous,
      { id: crypto.randomUUID(), role: "user", text },
    ]);
    recordLearning({ type: "question", courseId: "director", label: text });
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text }),
        signal: request.signal,
      });
      const data: { answer?: string; sources?: Source[]; error?: string } =
        await response.json().catch(() => ({}));
      if (!response.ok)
        throw new Error(data.error || "课程资料暂时无法读取，请稍后重试。");
      if (typeof data.answer !== "string")
        throw new Error("课程资料返回不完整，请重新检索。");
      if (!mounted.current) return;
      const answer = data.answer;
      setMessages((previous) => [
        ...previous,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: answer,
          sources: Array.isArray(data.sources) ? data.sources : [],
        },
      ]);
    } catch (error) {
      if (!mounted.current) return;
      const message = request.signal.aborted
        ? "检索等待时间较长，请检查网络后重试。"
        : error instanceof TypeError
          ? "这次没有连接上课程资料，请检查网络后重试。"
          : error instanceof Error
            ? error.message
            : "课程资料暂时无法读取，请稍后重试。";
      setMessages((previous) => [
        ...previous,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: message,
          error: true,
          question: text,
        },
      ]);
    } finally {
      window.clearTimeout(timeout);
      if (mounted.current) setBusy(false);
      sendingRef.current = false;
    }
  }

  function submitQuestion(event: FormEvent) {
    event.preventDefault();
    void ask(question);
  }
  function saveNote(event: FormEvent) {
    event.preventDefault();
    if (!note.trim()) return;
    recordLearning({
      type: "note",
      courseId: "director",
      label: `${chapters[chapter].title}｜${note.trim()}`,
    });
    setNote("");
    setNoteSaved(true);
  }
  function submitQuiz() {
    if (quizChoice === null || quizSubmitted) return;
    setQuizSubmitted(true);
    recordLearning({
      type: "quiz",
      courseId: "director",
      label: "180° 轴线原则：选择保持空间关系的机位",
      value: quizChoice === 1 ? 1 : 0,
    });
  }
  function leave(action: () => void) {
    pauseLesson();
    action();
  }

  return (
    <div className="classroom-page">
      <header className="classroom-topbar">
        <div className="classroom-topbar-left">
          <button
            className="classroom-back"
            onClick={() => leave(onBack)}
            aria-label="返回课程首页"
          >
            <ArrowLeft size={19} />
          </button>
          <span className="classroom-topbar-divider" />
          <div>
            <div className="classroom-course-name">
              导演思维与镜头语言 <span>互动课堂</span>
            </div>
            <p>从故事板到银幕表达</p>
          </div>
        </div>
        <div className="classroom-topbar-actions">
          <span className="classroom-autosave">
            <span />
            学习记录自动保存
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => leave(onAnalytics)}
          >
            学习反馈 <ArrowRight size={14} />
          </Button>
        </div>
      </header>

      <div className="classroom-layout">
        <aside className="classroom-chapters">
          <div className="classroom-chapters-heading">
            <BookOpen size={17} />
            <h2>课程章节</h2>
            <span>5 节</span>
          </div>
          <div className="classroom-course-progress">
            <div>
              <span>本课进度</span>
              <strong>{progress}%</strong>
            </div>
            <div className="classroom-progress-track">
              <i style={{ width: `${progress}%` }} />
            </div>
          </div>
          <nav aria-label="课程章节">
            {chapters.map((item, index) => (
              <button
                key={item.title}
                className={`classroom-chapter ${chapter === index ? "classroom-chapter-active" : ""}`}
                onClick={() => selectChapter(index)}
                aria-current={chapter === index ? "step" : undefined}
              >
                <span className="classroom-chapter-number">
                  {completed.has(item.title) ? (
                    <Check size={14} />
                  ) : (
                    `${index + 1}`.padStart(2, "0")
                  )}
                </span>
                <span>
                  <strong>{item.title}</strong>
                  <small>{item.subtitle}</small>
                </span>
                {chapter === index && (
                  <span className="classroom-chapter-playing">
                    <i />
                    <i />
                    <i />
                  </span>
                )}
              </button>
            ))}
          </nav>
          <div className="classroom-chapter-bottom">
            <div className="classroom-chapter-bottom-icon">
              <FileText size={21} />
            </div>
            <h3>把知识留在手边</h3>
            <p>
              讲稿、案例和课程依据，
              <br />
              随时回来查阅。
            </p>
            <button onClick={() => leave(onKnowledge)}>
              打开课程知识库 <ArrowRight size={14} />
            </button>
          </div>
          <div className="classroom-lesson-type">
            <Headphones size={14} />
            语音讲解 · 互动演示
          </div>
        </aside>

        <main className="classroom-main">
          <div className="classroom-stage-title">
            <div>
              <span className="classroom-section-label">
                DIRECTOR’S CLASSROOM
              </span>
              <h1>
                {chapters[chapter].title}
                <span> / 镜头轴线</span>
              </h1>
            </div>
            <button
              className="classroom-text-action"
              onClick={() => {
                setAngle(chapters[chapter].angle);
                setCrossed(false);
              }}
            >
              <RotateCcw size={14} />
              重置机位
            </button>
          </div>

          <section className="classroom-stage" aria-label="180度轴线交互实验">
            <div className="classroom-stage-top">
              <span>
                <span className="classroom-stage-dot" />
                互动实验室
              </span>
              <span>
                180° RULE <span className="classroom-stage-top-dash">/</span>{" "}
                CAMERA & SPACE
              </span>
            </div>
            <div className="classroom-experiment">
              <div className="classroom-preview">
                <div className="classroom-preview-label">
                  <Camera size={12} /> 当前摄影机画面 <span>CAM 01</span>
                </div>
                <div className="classroom-preview-grid" />
                <div
                  className="classroom-person"
                  style={{
                    left: `${50 - Math.sin((angle * Math.PI) / 180) * 25}%`,
                    zIndex: Math.cos((angle * Math.PI) / 180) > 0 ? 2 : 1,
                  }}
                >
                  <div className="classroom-person-head" />
                  <div className="classroom-person-body" />
                  <span>A</span>
                </div>
                <div
                  className="classroom-person classroom-person-b"
                  style={{
                    left: `${50 + Math.sin((angle * Math.PI) / 180) * 25}%`,
                    zIndex: Math.cos((angle * Math.PI) / 180) > 0 ? 1 : 2,
                  }}
                >
                  <div className="classroom-person-head" />
                  <div className="classroom-person-body" />
                  <span>B</span>
                </div>
                <span className="classroom-preview-caption">
                  {onAxis
                    ? "中性机位 · 人物趋于前后关系"
                    : reversed
                      ? "越过轴线后：B 在左，A 在右"
                      : "轴线同侧：A 在左，B 在右"}
                </span>
                <div className="classroom-frame-corner classroom-corner-tl" />
                <div className="classroom-frame-corner classroom-corner-tr" />
                <div className="classroom-frame-corner classroom-corner-bl" />
                <div className="classroom-frame-corner classroom-corner-br" />
              </div>
              <div className="classroom-overhead">
                <div className="classroom-overhead-title">
                  <span>场景俯视图</span>
                  <span
                    className={
                      reversed
                        ? "classroom-axis-badge classroom-axis-reversed"
                        : "classroom-axis-badge"
                    }
                  >
                    {onAxis
                      ? "中性机位"
                      : reversed
                        ? "已跨越轴线"
                        : "保持空间关系"}
                  </span>
                </div>
                <svg
                  viewBox="0 0 440 224"
                  className="classroom-camera-map"
                  role="img"
                  aria-label={`摄影机角度 ${angle} 度，${reversed ? "位于轴线另一侧" : "位于轴线同侧"}`}
                >
                  <defs>
                    <linearGradient
                      id="classroom-side-gradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#8c76f5" stopOpacity=".04" />
                      <stop
                        offset="100%"
                        stopColor="#8c76f5"
                        stopOpacity=".17"
                      />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 58 115 A 162 88 0 0 0 382 115 Z"
                    fill="url(#classroom-side-gradient)"
                  />
                  <ellipse
                    cx="220"
                    cy="115"
                    rx="150"
                    ry="76"
                    fill="none"
                    stroke="#514569"
                    strokeDasharray="4 6"
                  />
                  <line
                    x1="30"
                    y1="115"
                    x2="410"
                    y2="115"
                    stroke="#b7a4f8"
                    strokeWidth="1.5"
                    strokeDasharray="5 5"
                  />
                  <text x="378" y="101" fill="#bca6ec" fontSize="10">
                    轴线
                  </text>
                  <path
                    d={`M ${cameraX} ${cameraY} L 167 115 L 273 115 Z`}
                    fill={reversed ? "#df9a8330" : "#9c84ff20"}
                  />
                  <circle cx="167" cy="115" r="17" fill="#8975d5" />
                  <circle cx="273" cy="115" r="17" fill="#bb9567" />
                  <text
                    x="167"
                    y="119"
                    textAnchor="middle"
                    fill="white"
                    fontSize="11"
                    fontWeight="600"
                  >
                    A
                  </text>
                  <text
                    x="273"
                    y="119"
                    textAnchor="middle"
                    fill="white"
                    fontSize="11"
                    fontWeight="600"
                  >
                    B
                  </text>
                  <text
                    x="220"
                    y="152"
                    textAnchor="middle"
                    fill="#8676a7"
                    fontSize="10"
                  >
                    同侧机位区域
                  </text>
                  <g transform={`translate(${cameraX} ${cameraY})`}>
                    <circle
                      r="18"
                      fill={reversed ? "#e9ad83" : "#aa8dff"}
                      opacity=".18"
                    />
                    <rect
                      x="-11"
                      y="-9"
                      width="19"
                      height="17"
                      rx="5"
                      fill={reversed ? "#e6a680" : "#aa8dff"}
                    />
                    <path
                      d="M 7 -4 L 14 -7 L 14 6 L 7 3 Z"
                      fill={reversed ? "#e6a680" : "#aa8dff"}
                    />
                    <circle cx="-1" cy="-1" r="3" fill="#292036" />
                  </g>
                  <text
                    x="62"
                    y="117"
                    textAnchor="end"
                    fill="#766b8c"
                    fontSize="10"
                  >
                    180°
                  </text>
                  <text x="385" y="130" fill="#766b8c" fontSize="10">
                    0°
                  </text>
                </svg>
              </div>
            </div>
            <div className="classroom-camera-controls">
              <div>
                <span>
                  <Camera size={14} />
                  拖动机位，观察画面变化
                </span>
                <strong>{angle}°</strong>
              </div>
              <input
                aria-label="摄影机角度"
                type="range"
                min="0"
                max="360"
                step="1"
                value={angle}
                onChange={(event) => moveCamera(Number(event.target.value))}
              />
              <div className="classroom-range-ticks">
                <span>0°</span>
                <span>同侧机位</span>
                <span>180°</span>
                <span>跨越轴线</span>
                <span>360°</span>
              </div>
            </div>
            <div className="classroom-professor">
              <img src="/assets/original-05.png" alt="数字教授林知远" />
              <div>
                <strong>
                  林知远<span>数字教授</span>
                </strong>
                <p>
                  {playing
                    ? "正在为你讲解这一节课程…"
                    : "点击播放讲解，一起理解镜头背后的空间关系。"}
                </p>
              </div>
              <div
                className={`classroom-voicewave ${playing ? "classroom-voicewave-active" : ""}`}
                aria-hidden="true"
              >
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>
            </div>
          </section>

          <div className="classroom-player">
            <button
              className="classroom-play-button"
              onClick={() => void toggleAudio()}
              aria-label={playing ? "暂停课程讲解" : "播放课程讲解"}
            >
              {playing ? (
                <Pause size={17} fill="currentColor" />
              ) : (
                <Play size={17} fill="currentColor" />
              )}
            </button>
            <span className="classroom-player-time">
              {timeLabel(currentTime)}
            </span>
            <input
              type="range"
              aria-label="课程播放进度"
              min="0"
              max={duration || 1}
              step=".1"
              value={Math.min(currentTime, duration || 1)}
              disabled={!duration}
              onChange={(event) => seekTo(Number(event.target.value))}
            />
            <span className="classroom-player-time">{timeLabel(duration)}</span>
            <button
              className="classroom-volume"
              onClick={() => setMuted(!muted)}
              aria-label={muted ? "取消静音" : "静音"}
            >
              {muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
            </button>
          </div>
          {audioError && (
            <p className="classroom-audio-error" role="alert">
              {audioError}
              <button
                onClick={() => {
                  audioRef.current?.load();
                  void toggleAudio();
                }}
              >
                重试
              </button>
            </p>
          )}
          {playerStatus && !audioError && (
            <p className="classroom-player-status" role="status">
              {playerStatus}
            </p>
          )}
          <audio
            ref={audioRef}
            src={`/media/lesson-${chapter + 1}.mp3`}
            preload="metadata"
            muted={muted}
            onLoadedMetadata={() =>
              setDuration(
                Number.isFinite(audioRef.current?.duration)
                  ? audioRef.current!.duration
                  : 0,
              )
            }
            onCanPlay={() => void continueLesson()}
            onTimeUpdate={updatePlayback}
            onPlay={() => {
              playbackActive.current = true;
              lastTime.current = audioRef.current?.currentTime || 0;
              lastWallTime.current = performance.now();
              setPlaying(true);
            }}
            onPause={() => {
              capturePlayback();
              playbackActive.current = false;
              setPlaying(false);
              flushLearning();
            }}
            onSeeking={() => {
              seeking.current = true;
              lastTime.current = audioRef.current?.currentTime || 0;
              lastWallTime.current = performance.now();
            }}
            onSeeked={() => {
              seeking.current = false;
              lastTime.current = audioRef.current?.currentTime || 0;
              lastWallTime.current = performance.now();
            }}
            onEnded={finishLesson}
            onError={() =>
              setAudioError(
                "讲解暂时无法播放，请重试。你可以继续操作机位实验。",
              )
            }
          />

          <div className="classroom-lesson-summary">
            <div>
              <span>{chapters[chapter].eyebrow}</span>
              <h2>让每一个机位，都有叙事的理由。</h2>
              <p>{chapters[chapter].copy}</p>
            </div>
            <button
              onClick={() => {
                pauseLesson();
                setQuizOpen(true);
              }}
            >
              <span className="classroom-quiz-icon">
                <CircleHelp size={19} />
              </span>
              <span>
                <strong>来一道随堂练习</strong>
                <small>用一个问题，检查你的理解</small>
              </span>
              <ChevronRight size={17} />
            </button>
          </div>
          <div className="classroom-lesson-bottom">
            <span>
              <Clock3 size={13} /> 学习按自己的节奏发生
            </span>
            {chapter < 4 ? (
              <button onClick={() => selectChapter(chapter + 1)}>
                下一节：{chapters[chapter + 1].title}
                <ArrowRight size={14} />
              </button>
            ) : (
              <button onClick={() => leave(onAnalytics)}>
                查看本次学习反馈
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </main>

        <aside className="classroom-assistant">
          <div
            className="classroom-assistant-tabs"
            role="tablist"
            aria-label="课堂辅助面板"
          >
            <button
              id="classroom-chat-tab"
              role="tab"
              aria-selected={panel === "chat"}
              aria-controls="classroom-chat-panel"
              className={panel === "chat" ? "classroom-tab-active" : ""}
              onClick={() => setPanel("chat")}
            >
              <Sparkles size={15} />
              课堂问答
            </button>
            <button
              id="classroom-notes-tab"
              role="tab"
              aria-selected={panel === "notes"}
              aria-controls="classroom-notes-panel"
              className={panel === "notes" ? "classroom-tab-active" : ""}
              onClick={() => setPanel("notes")}
            >
              <NotebookPen size={15} />
              我的笔记{notes.length > 0 && <span>{notes.length}</span>}
            </button>
          </div>
          {panel === "chat" ? (
            <div
              className="classroom-chat-panel"
              id="classroom-chat-panel"
              role="tabpanel"
              aria-labelledby="classroom-chat-tab"
            >
              <div className="classroom-assistant-intro">
                <div className="classroom-assistant-avatar">
                  <Sparkles size={21} />
                </div>
                <strong>好奇，是学习的开始。</strong>
                <p>
                  关于这堂课的任何疑问，
                  <br />
                  都可以在这里找找答案。
                </p>
                <span>
                  <span />
                  课程资料检索
                </span>
              </div>
              <div className="classroom-chat-messages" aria-live="polite">
                {messages.length === 0 && (
                  <div className="classroom-question-starters">
                    <span>试着问问</span>
                    {[
                      "为什么不能随意越轴？",
                      "正反打应该怎么拍？",
                      "什么时候可以越轴？",
                    ].map((text) => (
                      <button key={text} onClick={() => void ask(text)}>
                        {text}
                        <ArrowRight size={13} />
                      </button>
                    ))}
                    <div className="classroom-qa-tip">
                      <BookOpen size={14} />
                      <p>
                        回答来自本课资料，并附上出处。你可以点击引用，回到对应章节。
                      </p>
                    </div>
                  </div>
                )}
                {messages.map((message) => (
                  <div
                    className={`classroom-message classroom-message-${message.role} ${message.error ? "classroom-message-error" : ""}`}
                    key={message.id}
                  >
                    {message.role === "assistant" && (
                      <div className="classroom-message-author">
                        <Sparkles size={13} />
                        课程助手
                      </div>
                    )}
                    <p>{message.text}</p>
                    {message.sources && message.sources.length > 0 && (
                      <div className="classroom-sources">
                        <span>课程依据</span>
                        {message.sources.map((source, index) => (
                          <button
                            key={source.id}
                            onClick={() => selectChapter(source.chapter)}
                            title={source.excerpt}
                          >
                            <span>{index + 1}</span>
                            <span>{source.title}</span>
                            <ChevronRight size={12} />
                          </button>
                        ))}
                      </div>
                    )}
                    {message.error && message.question && (
                      <button
                        className="classroom-retry"
                        disabled={busy}
                        onClick={() => void ask(message.question || "")}
                      >
                        <RotateCcw size={12} />
                        重新检索
                      </button>
                    )}
                  </div>
                ))}
                {busy && (
                  <div className="classroom-thinking">
                    <LoaderCircle size={14} />
                    正在查阅课程资料…
                  </div>
                )}
                <div ref={chatBottom} />
              </div>
              <form
                className="classroom-question-form"
                onSubmit={submitQuestion}
              >
                <label
                  className="classroom-sr-only"
                  htmlFor="classroom-question"
                >
                  输入课程问题
                </label>
                <textarea
                  id="classroom-question"
                  maxLength={500}
                  rows={2}
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  placeholder="关于这堂课，我想问…"
                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter" &&
                      !event.shiftKey &&
                      !event.nativeEvent.isComposing
                    ) {
                      event.preventDefault();
                      void ask(question);
                    }
                  }}
                />
                <div>
                  <span>Enter 发送 · Shift + Enter 换行</span>
                  <button
                    type="submit"
                    disabled={!question.trim() || busy}
                    aria-label="发送问题"
                  >
                    {busy ? <LoaderCircle size={15} /> : <Send size={15} />}
                  </button>
                </div>
              </form>
              <p className="classroom-assistant-disclaimer">
                基于课程材料检索 · 非大模型生成
              </p>
            </div>
          ) : (
            <div
              className="classroom-notes-panel"
              id="classroom-notes-panel"
              role="tabpanel"
              aria-labelledby="classroom-notes-tab"
            >
              <div className="classroom-notes-intro">
                <NotebookPen size={22} />
                <h3>记录你的「原来如此」</h3>
                <p>
                  笔记保存在当前浏览器，
                  <br />
                  也会汇入本次学习反馈。
                </p>
              </div>
              <form onSubmit={saveNote}>
                <label htmlFor="classroom-note">
                  {chapters[chapter].title}
                  <span>当前章节</span>
                </label>
                <textarea
                  id="classroom-note"
                  value={note}
                  onChange={(event) => {
                    setNote(event.target.value);
                    setNoteSaved(false);
                  }}
                  placeholder="这个知识点，我的理解是…"
                  maxLength={2000}
                  rows={5}
                />
                <Button type="submit" size="sm" disabled={!note.trim()}>
                  <Check size={14} />
                  保存笔记
                </Button>
                {noteSaved && (
                  <span className="classroom-note-saved" role="status">
                    已保存
                  </span>
                )}
              </form>
              <div className="classroom-saved-notes">
                <h4>
                  全部笔记 <span>{notes.length}</span>
                </h4>
                {notes.length ? (
                  [...notes].reverse().map((item) => (
                    <article key={item.id}>
                      <span>
                        {new Date(item.createdAt).toLocaleDateString("zh-CN", {
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                      <p>{item.label}</p>
                    </article>
                  ))
                ) : (
                  <p className="classroom-notes-empty">
                    留下一条笔记，
                    <br />
                    让这次灵感有迹可循。
                  </p>
                )}
              </div>
            </div>
          )}
        </aside>
      </div>

      <Dialog open={quizOpen} onOpenChange={setQuizOpen}>
        <DialogContent
          title="用一个镜头，检验你的理解"
          description="随堂练习 · 180° 轴线原则"
          className="classroom-quiz-dialog"
        >
          <div className="classroom-quiz-question">
            <span>01 / 单项选择</span>
            <h3>
              拍摄 A、B 两个人的对话时，如何让正反打镜头保持稳定的空间关系？
            </h3>
          </div>
          <div className="classroom-quiz-options">
            {[
              "每次切换镜头，都把摄影机放到轴线另一侧",
              "将正反打机位安排在人物轴线的同一侧",
              "只要焦距不变，摄影机放在哪里都可以",
            ].map((option, index) => (
              <button
                key={option}
                disabled={quizSubmitted}
                className={`${quizChoice === index ? "classroom-quiz-selected" : ""} ${quizSubmitted && index === 1 ? "classroom-quiz-correct" : ""} ${quizSubmitted && quizChoice === index && index !== 1 ? "classroom-quiz-incorrect" : ""}`}
                onClick={() => setQuizChoice(index)}
              >
                <span>{String.fromCharCode(65 + index)}</span>
                {option}
                {quizSubmitted && index === 1 && <CheckCircle2 size={18} />}
              </button>
            ))}
          </div>
          {quizSubmitted && (
            <div className="classroom-quiz-feedback" role="status">
              <strong>
                {quizChoice === 1
                  ? "理解到位！"
                  : "再看一次空间关系，就能理解了。"}
              </strong>
              <p>
                正反打机位位于轴线同一侧，能保持人物画面位置与视线方向的连续性。需要越轴时，应给观众明确的空间过渡。
              </p>
              <button
                onClick={() => {
                  setQuizOpen(false);
                  selectChapter(1);
                }}
              >
                回到「同侧机位」
                <ArrowRight size={13} />
              </button>
            </div>
          )}
          <div className="classroom-quiz-footer">
            {quizSubmitted ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setQuizChoice(null);
                    setQuizSubmitted(false);
                  }}
                >
                  再做一次
                </Button>
                <Button
                  onClick={() => {
                    setQuizOpen(false);
                    leave(onAnalytics);
                  }}
                >
                  查看学习反馈
                  <ArrowRight size={14} />
                </Button>
              </>
            ) : (
              <>
                <span>完成后可查看解析</span>
                <Button disabled={quizChoice === null} onClick={submitQuiz}>
                  提交答案
                  <ArrowRight size={14} />
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
