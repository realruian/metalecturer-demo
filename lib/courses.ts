export type Course = {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  image: string;
  instructor: string;
  role: string;
  lessons: number;
  duration: string;
  color: string;
  tag: string;
  description: string;
};
export const courses: Course[] = [
  {
    id: "director",
    title: "导演思维与镜头语言",
    subtitle: "从故事板到银幕表达",
    category: "导演编剧",
    image: "/assets/original-01.png",
    instructor: "林知远",
    role: "数字教授 · 导演方向",
    lessons: 5,
    duration: "互动微课",
    color: "#6a5af9",
    tag: "编辑精选",
    description:
      "用镜头讲好一个故事。从空间关系到机位调度，在数字教授的引导下，亲手理解电影语言。",
  },
  {
    id: "c4d",
    title: "C4D 与影视级三维",
    subtitle: "让想象拥有形状",
    category: "三维动画",
    image: "/assets/original-02.png",
    instructor: "李木子",
    role: "数字教授 · 三维方向",
    lessons: 24,
    duration: "6 小时",
    color: "#8d91e7",
    tag: "全新课程",
    description: "从基础建模、材质光照到动态视觉，建立属于你的三维创作方法。",
  },
  {
    id: "aigc",
    title: "生成式 AI 与影像表达",
    subtitle: "把灵感变成下一帧",
    category: "AIGC",
    image: "/assets/original-03.jpeg",
    instructor: "陈予安",
    role: "数字教授 · AI 创作",
    lessons: 16,
    duration: "4 小时",
    color: "#9180d3",
    tag: "AI 前沿",
    description:
      "理解提示词、视觉一致性和生成式工作流，探索技术与创意之间的更多可能。",
  },
  {
    id: "cinema",
    title: "光影叙事与电影摄影",
    subtitle: "用光线写下故事",
    category: "摄影摄像",
    image: "/assets/original-04.jpeg",
    instructor: "周予",
    role: "数字教授 · 摄影方向",
    lessons: 20,
    duration: "5 小时",
    color: "#b38b68",
    tag: "大师课堂",
    description:
      "观察光线的方向、质感与色彩，用摄影机组织空间，让每个画面都服务于叙事。",
  },
];
