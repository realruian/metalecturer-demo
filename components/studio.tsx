"use client";
import { useEffect, useState } from "react";
import {
  ArrowDownToLine,
  ArrowRight,
  Camera,
  Check,
  ChevronDown,
  ChevronUp,
  Clapperboard,
  Film,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

type Shot = {
  id: string;
  size: string;
  camera: string;
  description: string;
  duration: string;
};
const initialShots: Shot[] = [
  {
    id: "1",
    size: "全景",
    camera: "固定机位",
    description: "咖啡馆靠窗的位置。A 与 B 相对而坐，建立两个人的空间关系。",
    duration: "5",
  },
  {
    id: "2",
    size: "中景",
    camera: "同侧反打",
    description: "A 看向画面右侧的 B，开始讲述自己的故事。",
    duration: "8",
  },
  {
    id: "3",
    size: "近景",
    camera: "同侧反打",
    description: "B 看向画面左侧，微笑着回应 A。",
    duration: "4",
  },
];
export function Studio({ onClassroom }: { onClassroom: () => void }) {
  const [shots, setShots] = useState<Shot[]>(initialShots);
  const [title, setTitle] = useState("窗边的对话");
  const [loaded, setLoaded] = useState(false);
  const [status, setStatus] = useState("本地草稿");
  const [reset, setReset] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("metalecturer.storyboard");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (
          typeof parsed.title === "string" &&
          Array.isArray(parsed.shots) &&
          parsed.shots.every(
            (s: Shot) =>
              typeof s.id === "string" && typeof s.description === "string",
          )
        ) {
          setTitle(parsed.title);
          setShots(parsed.shots);
        }
      }
    } catch {}
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(
        "metalecturer.storyboard",
        JSON.stringify({ title, shots }),
      );
      setStatus("已保存到此浏览器");
    } catch {
      setStatus("保存失败，可导出备份");
    }
  }, [shots, title, loaded]);
  function update(id: string, key: keyof Shot, value: string) {
    setShots(shots.map((s) => (s.id === id ? { ...s, [key]: value } : s)));
  }
  function move(i: number, d: number) {
    const next = [...shots];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    setShots(next);
  }
  function exportShots() {
    const text =
      `# ${title}\n\n` +
      shots
        .map(
          (s, i) =>
            `## 镜头 ${String(i + 1).padStart(2, "0")}\n景别：${s.size}\n机位：${s.camera}\n时长：${s.duration} 秒\n画面：${s.description}\n`,
        )
        .join("\n");
    const url = URL.createObjectURL(
      new Blob([text], { type: "text/markdown;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/[\\/:*?"<>|]/g, "-") || "分镜计划"}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <section className="studio-page">
      <div className="page-heading">
        <div>
          <span className="section-eyebrow">FROM LEARNING TO MAKING</span>
          <h1>让故事，发生在镜头里。</h1>
          <p>把课堂里的第一份灵感，写成一张可以拍摄的分镜表。</p>
        </div>
        <Button variant="outline" onClick={onClassroom}>
          回顾镜头轴线
          <ArrowRight size={16} />
        </Button>
      </div>
      <div className="studio-layout">
        <aside className="studio-sidebar">
          <div className="studio-sidebar-icon">
            <Clapperboard size={30} />
          </div>
          <h2>分镜工作台</h2>
          <p>
            一个场景，一段对话。
            <br />
            试着用三个镜头讲清楚。
          </p>
          <div className="studio-step active">
            <span>01</span>建立空间
          </div>
          <div className="studio-step">
            <span>02</span>组织对话
          </div>
          <div className="studio-step">
            <span>03</span>导出拍摄计划
          </div>
          <div className="studio-tip">
            <Camera size={19} />
            <h3>留意你的机位</h3>
            <p>正反打时，把摄影机留在轴线同一侧，让视线自然衔接。</p>
          </div>
        </aside>
        <div className="storyboard">
          <div className="storyboard-toolbar">
            <div>
              <span>STORYBOARD / 001</span>
              <input
                aria-label="分镜项目名称"
                value={title}
                maxLength={60}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <Button size="sm" onClick={exportShots}>
              <ArrowDownToLine size={15} />
              导出分镜
            </Button>
          </div>
          <div className="storyboard-info">
            <span>
              <i />
              {status}
            </span>
            <span>
              {shots.length} 个镜头 · 预计{" "}
              {shots.reduce((n, s) => n + (Number(s.duration) || 0), 0)} 秒
            </span>
          </div>
          <div className="shot-list">
            {shots.map((s, i) => (
              <article className="shot-row" key={s.id}>
                <div className="shot-number">
                  <span>SHOT</span>
                  <strong>{String(i + 1).padStart(2, "0")}</strong>
                  <Film size={22} />
                </div>
                <div className="shot-content">
                  <div className="shot-fields">
                    <label>
                      景别
                      <select
                        value={s.size}
                        onChange={(e) => update(s.id, "size", e.target.value)}
                      >
                        {["远景", "全景", "中景", "近景", "特写"].map((v) => (
                          <option key={v}>{v}</option>
                        ))}
                      </select>
                    </label>
                    <label>
                      机位
                      <select
                        value={s.camera}
                        onChange={(e) => update(s.id, "camera", e.target.value)}
                      >
                        {["固定机位", "同侧反打", "运动镜头", "中性机位"].map(
                          (v) => (
                            <option key={v}>{v}</option>
                          ),
                        )}
                      </select>
                    </label>
                    <label className="shot-duration">
                      时长 / 秒
                      <input
                        type="number"
                        min="1"
                        max="600"
                        value={s.duration}
                        onChange={(e) =>
                          update(
                            s.id,
                            "duration",
                            String(
                              Math.max(
                                1,
                                Math.min(600, Number(e.target.value) || 1),
                              ),
                            ),
                          )
                        }
                      />
                    </label>
                  </div>
                  <textarea
                    value={s.description}
                    maxLength={1000}
                    aria-label={`镜头${i + 1}画面描述`}
                    placeholder="描写人物、动作、画面和声音…"
                    onChange={(e) =>
                      update(s.id, "description", e.target.value)
                    }
                  />
                </div>
                <div className="shot-actions">
                  <button
                    aria-label={`上移镜头${i + 1}`}
                    disabled={i === 0}
                    onClick={() => move(i, -1)}
                  >
                    <ChevronUp size={17} />
                  </button>
                  <button
                    aria-label={`下移镜头${i + 1}`}
                    disabled={i === shots.length - 1}
                    onClick={() => move(i, 1)}
                  >
                    <ChevronDown size={17} />
                  </button>
                  <button
                    aria-label={`删除镜头${i + 1}`}
                    onClick={() => setShots(shots.filter((x) => x.id !== s.id))}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </article>
            ))}
          </div>
          <button
            className="add-shot"
            disabled={shots.length >= 30}
            onClick={() =>
              setShots([
                ...shots,
                {
                  id: crypto.randomUUID(),
                  size: "中景",
                  camera: "固定机位",
                  description: "",
                  duration: "5",
                },
              ])
            }
          >
            <Plus size={18} />
            添加一个镜头
          </button>
          <div className="storyboard-footer">
            <span>你写下的每个镜头，都是故事的起点。</span>
            <button onClick={() => setReset(true)}>恢复示例</button>
          </div>
        </div>
      </div>
      <Dialog open={reset} onOpenChange={setReset}>
        <DialogContent
          title="恢复示例分镜？"
          description="当前分镜会被替换。你可以先导出分镜保留自己的创作。"
        >
          <div className="dialog-actions">
            <Button variant="outline" onClick={() => setReset(false)}>
              继续编辑
            </Button>
            <Button
              onClick={() => {
                setShots(initialShots);
                setTitle("窗边的对话");
                setReset(false);
              }}
            >
              恢复示例
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
