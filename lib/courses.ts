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
  price?: number;
  originalPrice?: number;
  level?: string;
};
export const heroCourses: Course[] = [
  {
    id: "director",
    title: "导演思维与镜头语言",
    subtitle: "从故事板到银幕表达",
    category: "导演编剧",
    image: "/assets/reference-hero.png",
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
    subtitle: "从建模到动态视觉",
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

// 首页商业信息为界面示例；完整互动课堂仍为导演课程。
export const recommendedCourses: Course[] = [
  {
    id: "premiere", title: "Premiere Pro 2024", subtitle: "从入门到精通",
    category: "剪辑包装", image: "/assets/course-premiere.svg", instructor: "林知远",
    role: "剪辑课程讲师", lessons: 32, duration: "8 小时", color: "#7770ff",
    tag: "软件基础", level: "进阶", price: 299, originalPrice: 599,
    description: "了解素材管理、时间线剪辑、声音处理与成片输出，建立清晰的剪辑流程。本课程展示教学规划，可体验导演课程中的互动能力。",
  },
  {
    id: "resolve", title: "达芬奇调色大师课", subtitle: "电影级色彩科学",
    category: "影视后期", image: "/assets/course-resolve.svg", instructor: "周予",
    role: "调色课程讲师", lessons: 28, duration: "7 小时", color: "#7e77db",
    tag: "色彩创作", level: "进阶", price: 399, originalPrice: 799,
    description: "通过曝光、白平衡、色彩关系与风格化处理，学习组织影像的色彩表达。此处提供课程规划和选课演示。",
  },
  {
    id: "vfx", title: "影视视效全流程实战", subtitle: "从拍摄到合成",
    category: "影视后期", image: "/assets/original-04.jpeg", instructor: "李木子",
    role: "视效课程讲师", lessons: 40, duration: "10 小时", color: "#ad8359",
    tag: "项目实战", level: "高级", price: 499, originalPrice: 999,
    description: "认识现场素材采集、镜头跟踪、合成与交付之间的关系，用项目练习建立完整的视效制作思路。",
  },
  {
    id: "short-film", title: "短片创作实战训练营", subtitle: "从 0 到 1 完成一部短片",
    category: "导演编剧", image: "/assets/original-01.png", instructor: "林知远",
    role: "导演课程讲师", lessons: 14, duration: "4 小时", color: "#626b86",
    tag: "创作训练", level: "实战", price: 199, originalPrice: 399,
    description: "从一句故事梗概开始，完成场景设计、分镜计划与拍摄准备。你可以在创作中心真正编辑并导出自己的分镜表。",
  },
];
export const courses: Course[] = [...heroCourses, ...recommendedCourses];
