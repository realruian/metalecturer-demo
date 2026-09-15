# 第三方依赖与素材来源

本文件记录本 Demo 的直接依赖和素材来源。下列版本及许可名称已按当前安装包的 `package.json` 和 LICENSE 文件核对；完整依赖版本以 `package-lock.json` 为准。

## 运行依赖

| 依赖                                                        | 已安装版本 | 许可                           | 本地许可文件                                                   |
| ----------------------------------------------------------- | ---------- | ------------------------------ | -------------------------------------------------------------- |
| [Next.js](https://github.com/vercel/next.js)                | 16.3.5     | MIT                            | `node_modules/next/license.md`                                 |
| [React / React DOM](https://github.com/facebook/react)      | 19.3.0     | MIT                            | `node_modules/react/LICENSE`、`node_modules/react-dom/LICENSE` |
| [Radix Dialog](https://github.com/radix-ui/primitives)      | 1.1.23     | MIT                            | `node_modules/@radix-ui/react-dialog/LICENSE`                  |
| [Radix Slot](https://github.com/radix-ui/primitives)        | 1.3.3      | MIT                            | `node_modules/@radix-ui/react-slot/LICENSE`                    |
| [class-variance-authority](https://github.com/joe-bell/cva) | 0.7.1      | Apache-2.0                     | `node_modules/class-variance-authority/LICENSE`                |
| [clsx](https://github.com/lukeed/clsx)                      | 2.1.1      | MIT                            | `node_modules/clsx/license`                                    |
| [Lucide React](https://github.com/lucide-icons/lucide)      | 0.577.0    | ISC；源自 Feather 的部分为 MIT | `node_modules/lucide-react/LICENSE`                            |
| [tailwind-merge](https://github.com/dcastil/tailwind-merge) | 3.7.0      | MIT                            | `node_modules/tailwind-merge/LICENSE.md`                       |

## 构建与开发依赖

| 依赖                                                                                  | 已安装版本 | 许可       | 本地许可文件                                                                    |
| ------------------------------------------------------------------------------------- | ---------- | ---------- | ------------------------------------------------------------------------------- |
| [Tailwind CSS / PostCSS 插件](https://github.com/tailwindlabs/tailwindcss)            | 4.3.3      | MIT        | `node_modules/tailwindcss/LICENSE`、`node_modules/@tailwindcss/postcss/LICENSE` |
| [TypeScript](https://github.com/microsoft/TypeScript)                                 | 5.9.3      | Apache-2.0 | `node_modules/typescript/LICENSE.txt`                                           |
| [tsx](https://github.com/privatenumber/tsx)                                           | 4.23.13    | MIT        | `node_modules/tsx/LICENSE`                                                      |
| [@types/node](https://github.com/DefinitelyTyped/DefinitelyTyped)                     | 22.20.2    | MIT        | `node_modules/@types/node/LICENSE`                                              |
| [@types/react / @types/react-dom](https://github.com/DefinitelyTyped/DefinitelyTyped) | 19.3.0     | MIT        | `node_modules/@types/react/LICENSE`、`node_modules/@types/react-dom/LICENSE`    |

这些依赖由各自作者维护，其版权与许可声明保留在安装包中。本表列出直接依赖；传递依赖及其原始声明随对应 npm 包提供。

## 界面、图片与课程内容

- **原始方案**：项目以提供的 `MetaLecturer-Interactive-Demo 3(2).html` 和产品设定图片作为界面与交互参考。原 HTML 保留在本地项目根目录，不随运行源码发布，也不作为当前应用的运行入口。
- **图片**：`public/assets/` 内图片提取自原 HTML。本次未另行核实这些图片的原始来源与使用权限，文件被保留用于对应的面试 Demo。
- **课程内容**：`lib/knowledge.ts` 内讲义和知识片段为本 Demo 自编示例教学内容。导出讲义包含延伸阅读链接，内容并非外部文章的全文复制。
- **讲解音频**：`public/media/lesson-1.mp3` 至 `lesson-5.mp3` 使用 macOS Tingting 系统语音，根据示例讲解文本预生成。音频不是教师真人录音，也不表示具有实时数字人合成能力。
- **人物与数据**：平台中的教授设定、课程目录与班级统计用于演示；个人学习记录来自当前浏览器的实际操作。

## 调研参考与实际使用范围

OpenMAIC、React Bits 等项目仅用于方案或原型参考；本仓库未引入它们的源码或 SDK。AI Elements 未作为组件依赖接入。当前共享 Button / Dialog 和产品页面由本项目实现，实际使用的基础依赖已列在上表。
