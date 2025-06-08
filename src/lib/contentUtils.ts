// /src/lib/contentUtils.ts

type ContentObject = { output?: string; data?: { output?: string } };

export const normalizeContent = (
  content: string | ContentObject | null
): string => {
  if (!content) return "";
  if (typeof content === "string") return content;
  if (typeof content === "object") {
    return content.output || content.data?.output || JSON.stringify(content);
  }
  return String(content);
};
