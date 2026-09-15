import { answerQuestion, validateQuestion } from "@/lib/knowledge";

const maxBodyBytes = 8192;

export async function POST(request: Request) {
  if (
    request.headers
      .get("content-type")
      ?.split(";", 1)[0]
      .trim()
      .toLowerCase() !== "application/json"
  ) {
    return Response.json(
      { error: "请使用 application/json 提交问题。" },
      { status: 415 },
    );
  }
  const size = Number(request.headers.get("content-length"));
  if (Number.isFinite(size) && size > maxBodyBytes)
    return Response.json({ error: "提交内容过长。" }, { status: 413 });
  try {
    // 流式检查实际字节数，不能依赖客户端填写的 Content-Length。
    const reader = request.body?.getReader();
    if (!reader)
      return Response.json({ error: "请提供问题内容。" }, { status: 400 });
    const decoder = new TextDecoder("utf-8", { fatal: true });
    let total = 0;
    let text = "";
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        total += value.byteLength;
        if (total > maxBodyBytes) {
          await reader.cancel();
          return Response.json({ error: "提交内容过长。" }, { status: 413 });
        }
        text += decoder.decode(value, { stream: true });
      }
      text += decoder.decode();
    } catch (error) {
      await reader.cancel().catch(() => undefined);
      throw error;
    } finally {
      reader.releaseLock();
    }
    const input = validateQuestion(JSON.parse(text));
    if ("error" in input) return Response.json(input, { status: 400 });
    return Response.json(answerQuestion(input.question), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return Response.json(
      { error: "无法读取问题，请检查提交格式。" },
      { status: 400 },
    );
  }
}
