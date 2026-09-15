import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "MetaLecturer · 让每一次学习，都有回应",
  description:
    "AI 数字教授课堂。探索影视课程，在交互实验中学习，随时提问，让知识成为创作的一部分。",
  icons: { icon: "/icon.svg" },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
