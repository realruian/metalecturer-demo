export type KnowledgeSnippet = {
  id: string;
  title: string;
  excerpt: string;
  chapter: number;
  keywords: string[];
};

export const chapterTitles = [
  "建立轴线",
  "同侧机位",
  "越轴实验",
  "合理越轴",
  "小结练习",
];

// 示例讲义是可检索的数据源；回答只摘录这些内容，不调用或冒充语言模型。
export const knowledgeSnippets: KnowledgeSnippet[] = [
  {
    id: "axis-definition",
    chapter: 0,
    title: "先找到人物之间的轴线",
    excerpt:
      "在这节双人对话课里，把角色 A 与角色 B 之间的连线作为轴线。俯视图中的虚线帮助我们区分摄影机所在的两个半区。轴线是组织拍摄方位的假想线，不是画面中需要出现的实体。",
    keywords: [
      "轴线",
      "连线",
      "180",
      "一百八十",
      "定义",
      "假想线",
      "是什么",
      "建立",
      "双人对话",
      "对话轴线",
      "axis",
      "line of action",
    ],
  },
  {
    id: "axis-plan",
    chapter: 0,
    title: "拍摄前的空间草图",
    excerpt:
      "本课的准备练习：在纸上标出 A、B 的位置，连接两点，再把计划使用的机位画在同一侧。给每个机位编号，并记录 A 和 B 在画面中的左右位置。先完成这张草图，再尝试切换机位。",
    keywords: [
      "草图",
      "准备",
      "拍摄前",
      "建立轴线",
      "怎么画",
      "画线",
      "规划",
      "分镜",
      "俯视",
      "机位图",
    ],
  },
  {
    id: "same-side",
    chapter: 1,
    title: "同侧机位保持方向关系",
    excerpt:
      "对本课固定站位的 A、B，从轴线同一侧选择机位，能保持两个人稳定的画面方向关系。机位可以改变景别和角度，但每次切换后都要检查人物左右位置与看向是否连贯。",
    keywords: [
      "同侧",
      "同一侧",
      "180度",
      "180°",
      "180原则",
      "180规则",
      "一百八十度",
      "空间连续性",
      "连续性",
      "机位",
      "方向",
      "保持",
      "左右",
    ],
  },
  {
    id: "reverse-shot",
    chapter: 1,
    title: "正反打与视线检查",
    excerpt:
      "本课练习用两个同侧机位交替呈现 A 和 B 的对话。观察 A 看向画面右方时，B 的视线是否朝向画面左方；再回到双人画面核对空间关系。检查的是这一组镜头能否让人理解谁在对谁说话。",
    keywords: [
      "正反打",
      "反打",
      "视线",
      "视线匹配",
      "看向",
      "对话",
      "过肩",
      "正打",
      "shot reverse shot",
      "眼神",
    ],
  },
  {
    id: "cross-effect",
    chapter: 2,
    title: "跨到另一侧会发生什么",
    excerpt:
      "在本课的俯视实验中，把摄影机从下半区移到上半区，同时保持 A、B 站位不变。对照两个机位的画面，人物的左右关系会反转。观众可能把这个切换理解为人物换了位置，因此需要特别留意剪辑衔接。",
    keywords: [
      "越轴",
      "跨轴",
      "跳轴",
      "跨线",
      "另一侧",
      "换边",
      "反转",
      "左右颠倒",
      "为什么",
      "混乱",
      "后果",
      "实验",
      "crossing",
    ],
  },
  {
    id: "cross-compare",
    chapter: 2,
    title: "一次对照实验怎么做",
    excerpt:
      "先选择同侧机位，记下人物左右；再选择越轴机位，对照变化。最后回到原机位，观察空间关系恢复的过程。课堂的小测会要求你判断两个机位是否在同一半区，判断依据是它们与轴线的位置关系。",
    keywords: [
      "实验",
      "对照",
      "滑块",
      "移动",
      "怎么操作",
      "怎么判断",
      "半区",
      "机位选择",
      "操作",
      "判断越轴",
    ],
  },
  {
    id: "neutral-shot",
    chapter: 3,
    title: "用中性镜头交代新方向",
    excerpt:
      "本课将接近轴线方向的正面或背面机位称作中性机位。练习时，先经过这个机位再切向另一侧，观察方向转换是否更容易理解。中性镜头并不自动保证衔接成立，还要结合前后镜头的视线、动作和空间信息判断。",
    keywords: [
      "中性镜头",
      "中性机位",
      "中性",
      "正面",
      "背面",
      "过渡",
      "合理越轴",
      "怎么越轴",
      "如何越轴",
      "安全",
      "neutral",
    ],
  },
  {
    id: "motivated-cross",
    chapter: 3,
    title: "让越轴有清楚的叙事理由",
    excerpt:
      "180° 规则服务于空间理解，并非任何时候都不可打破。若连续运动镜头清楚展示摄影机跨线的过程，观众可以跟随新的方位；也可以有意利用方向变化表达失衡。练习时先说明越轴的理由，再检查观众是否获得了足够的空间线索。",
    keywords: [
      "合理越轴",
      "运动镜头",
      "运动",
      "移动镜头",
      "连续",
      "有意",
      "什么时候",
      "可以越轴",
      "能不能越轴",
      "打破",
      "叙事",
      "理由",
      "怎么越轴",
      "如何越轴",
    ],
  },
  {
    id: "review-checklist",
    chapter: 4,
    title: "三个问题完成拍摄检查",
    excerpt:
      "本课小结：① A、B 之间的轴线在哪里？② 当前与下一个机位位于轴线哪一侧？③ 如果要跨线，哪个镜头交代了方位的变化？把这三个问题写在分镜旁，逐一核对后再决定镜头顺序。",
    keywords: [
      "小结",
      "总结",
      "复习",
      "检查",
      "清单",
      "三个问题",
      "镜头顺序",
      "重点",
      "知识点",
    ],
  },
  {
    id: "practice-card",
    chapter: 4,
    title: "用两张机位草图练习",
    excerpt:
      "练习一：A、B 的站位固定，两个机位都在轴线下侧，判断是否保持同侧。练习二：一个机位在下侧、一个在上侧，说明画面方向可能如何变化。提交前请用自己的话写出依据，回答时要同时提到轴线和机位。",
    keywords: [
      "练习",
      "小测",
      "测试",
      "作业",
      "题目",
      "考试",
      "答案",
      "自测",
      "巩固",
    ],
  },
];

export const knowledgeDocuments = chapterTitles.map((title, chapter) => ({
  id: `chapter-${chapter}`,
  chapter,
  title: `${String(chapter + 1).padStart(2, "0")} · ${title}`,
  description: [
    "从人物连线建立空间坐标",
    "理解正反打与视线关系",
    "亲手比较同侧与越轴机位",
    "中性镜头与有意的方向转换",
    "用两次判断巩固课堂知识",
  ][chapter],
  snippets: knowledgeSnippets.filter((snippet) => snippet.chapter === chapter),
}));

export type KnowledgeDocument = (typeof knowledgeDocuments)[number];
export type KnowledgeAnswer = {
  answer: string;
  sources: Pick<KnowledgeSnippet, "id" | "title" | "excerpt" | "chapter">[];
  mode: "local";
};

const normalize = (value: string) =>
  value.toLowerCase().replace(/[\s，。！？、：；,.!?:;“”"'（）()°-]/g, "");
const courseTerms = [
  "轴线",
  "越轴",
  "跨轴",
  "跳轴",
  "跨线",
  "机位",
  "同侧",
  "正反打",
  "反打",
  "视线",
  "过肩",
  "镜头",
  "分镜",
  "双人对话",
  "空间连续性",
  "左右颠倒",
  "人物换边",
  "本课",
  "这节课",
  "课堂",
  "小测",
  "知识点",
];
const snippetTopics: Record<string, string[]> = {
  "axis-definition": ["轴线", "假想线", "双人对话"],
  "axis-plan": [
    "草图",
    "建立轴线",
    "画轴线",
    "分镜",
    "俯视图",
    "机位图",
    "拍摄前",
  ],
  "same-side": ["同侧", "同一侧", "空间连续性", "机位"],
  "reverse-shot": ["正反打", "反打", "视线", "过肩", "正打"],
  "cross-effect": ["越轴", "跨轴", "跳轴", "跨线", "人物换边", "左右颠倒"],
  "cross-compare": ["越轴实验", "机位实验", "机位选择", "判断越轴", "半区"],
  "neutral-shot": ["中性镜头", "中性机位", "合理越轴", "怎么越轴", "如何越轴"],
  "motivated-cross": [
    "合理越轴",
    "运动镜头",
    "移动镜头",
    "连续镜头",
    "可以越轴",
    "能不能越轴",
    "怎么越轴",
    "如何越轴",
  ],
  "review-checklist": [
    "小结",
    "总结",
    "复习",
    "三个问题",
    "镜头顺序",
    "重点",
    "知识点",
    "检查清单",
  ],
  "practice-card": ["小测", "练习", "自测", "巩固"],
};

export function searchKnowledge(
  question: string,
  limit = 3,
): KnowledgeSnippet[] {
  const query = normalize(question);
  if (!query || !Number.isFinite(limit) || limit <= 0) return [];
  // 数字必须带度数或规则语境；英文必须是完整单词，避免身高 180、taxis 等误中。
  const hasRule =
    /(?:^|\D)180\s*(?:[°度]|-?\s*degree\b|rule\b|规则|原则)/i.test(question) ||
    /一百八十(?:度|规则|原则)/.test(query);
  const hasEnglishAxis = /\baxis\b|\bline[\s-]+of[\s-]+action\b/i.test(
    question,
  );
  const hasEnglishReverse = /\bshot[\s-]+reverse[\s-]+shot\b/i.test(question);
  const hasEnglishNeutral = /\bneutral[\s-]+(?:shot|camera)\b/i.test(question);
  if (
    !hasRule &&
    !hasEnglishAxis &&
    !hasEnglishReverse &&
    !hasEnglishNeutral &&
    !courseTerms.some((term) => query.includes(term))
  )
    return [];
  return knowledgeSnippets
    .map((snippet) => {
      const isTopic =
        snippetTopics[snippet.id].some((topic) => query.includes(topic)) ||
        (snippet.id === "axis-definition" && (hasRule || hasEnglishAxis)) ||
        (snippet.id === "same-side" && hasRule) ||
        (snippet.id === "reverse-shot" && hasEnglishReverse) ||
        (snippet.id === "neutral-shot" && hasEnglishNeutral) ||
        (snippet.id === "cross-compare" &&
          /越轴|机位/.test(query) &&
          /实验|对照|滑块|操作|判断/.test(query)) ||
        (snippet.id === "motivated-cross" &&
          /越轴|跨轴|跳轴/.test(query) &&
          /什么时候|能否|可以|合理|有意|打破|理由/.test(query));
      if (!isTopic) return { snippet, score: 0 };
      const matches = snippet.keywords.filter((keyword) =>
        query.includes(normalize(keyword)),
      );
      // 单独的通用词不作为依据；长的具体概念优先于宽泛匹配。
      const strong = matches.filter(
        (keyword) =>
          normalize(keyword).length >= 2 &&
          ![
            "是什么",
            "为什么",
            "怎么操作",
            "可以",
            "安全",
            "答案",
            "保持",
            "方向",
            "连续",
            "左右",
            "检查",
          ].includes(keyword),
      );
      const score =
        1 +
        (strong.length
          ? matches.reduce(
              (total, keyword) =>
                total + Math.min(normalize(keyword).length, 7),
              0,
            )
          : 0) +
        (normalize(snippet.title).includes(query) ? 6 : 0);
      return { snippet, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.min(limit, knowledgeSnippets.length))
    .map(({ snippet }) => snippet);
}

export function answerQuestion(question: string): KnowledgeAnswer {
  const snippets = searchKnowledge(question, 2);
  if (!snippets.length) {
    return {
      answer:
        "当前课程资料中没有找到足够相关的依据。这门微课覆盖轴线、同侧机位、正反打、越轴和练习。可以试着问「为什么要遵守 180° 规则？」或「中性镜头如何帮助越轴？」。",
      sources: [],
      mode: "local",
    };
  }
  return {
    answer: `在课程讲义中找到了以下相关内容：\n\n${snippets.map((snippet, index) => `${index + 1}. ${snippet.excerpt}`).join("\n\n")}\n\n你可以打开下方依据，回到对应章节继续学习。`,
    sources: snippets.map(({ id, title, excerpt, chapter }) => ({
      id,
      title,
      excerpt,
      chapter,
    })),
    mode: "local",
  };
}

export function validateQuestion(
  body: unknown,
): { question: string } | { error: string } {
  if (
    !body ||
    typeof body !== "object" ||
    Array.isArray(body) ||
    !("question" in body) ||
    typeof body.question !== "string"
  )
    return { error: "请提供文字形式的 question。" };
  const question = body.question.trim();
  if (question.length < 2) return { error: "请至少输入 2 个字符。" };
  if (question.length > 500) return { error: "问题请控制在 500 个字符以内。" };
  if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(question))
    return { error: "问题中包含无法处理的控制字符。" };
  return { question };
}

export function documentMarkdown(document: KnowledgeDocument) {
  return `# ${document.title}\n\n导演思维与镜头语言 · MetaLecturer 示例课程讲义\n\n${document.description}\n\n${document.snippets.map((snippet) => `## ${snippet.title}\n\n${snippet.excerpt}`).join("\n\n")}\n\n---\n\n本讲义为 Demo 自编教学内容，供课堂演示和检索练习使用。\n延伸阅读：Adobe · 180-degree rule\nhttps://www.adobe.com/creativecloud/video/discover/what-is-the-180-degree-rule.html\n`;
}
