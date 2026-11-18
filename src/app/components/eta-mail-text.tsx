import React from "react";

// The text of an ETA notice e-mail is kept as plain text where **...** marks bold (the given remark is bold in the
// default template). The operator never sees the marks: the editor below shows the bold directly.

/** Shows the text of an e-mail, bold where marked. */
export function MailText({ text, className }: { text: string; className?: string }) {
  const parts = text.split(/(\*\*[^*\n]+\*\*)/g);
  return (
    <div className={className ?? "whitespace-pre-wrap font-sans text-[12px] leading-relaxed text-gray-800"}>
      {parts.map((p, i) =>
        p.length > 4 && p.startsWith("**") && p.endsWith("**") ? <strong key={i}>{p.slice(2, -2)}</strong> : <React.Fragment key={i}>{p}</React.Fragment>
      )}
    </div>
  );
}

const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const textToHtml = (text: string) =>
  escapeHtml(text)
    .replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br>");

/** Reads the editor back into plain text with ** around the bold parts. */
const elementToText = (root: HTMLElement) => {
  const walk = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) return node.nodeValue ?? "";
    const el = node as HTMLElement;
    if (el.tagName === "BR") return "\n";
    const inner = Array.from(el.childNodes).map(walk).join("");
    if (el.tagName === "STRONG" || el.tagName === "B") return inner.trim() ? `**${inner}**` : inner;
    if (el.tagName === "DIV" || el.tagName === "P") return "\n" + inner.replace(/\n$/, "");
    return inner;
  };
  return walk(root).replace(/^\n/, "");
};

/**
 * The e-mail text as the recipient sees it, editable in place: the remark stays bold while the operator types.
 * Changes from outside (template, date, remark) are shown as long as the operator has not edited the text.
 */
export function MailEditor({
  value,
  onChange,
  readOnly,
  className,
}: {
  value: string;
  onChange: (text: string) => void;
  readOnly?: boolean;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const last = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (ref.current && value !== last.current) {
      ref.current.innerHTML = textToHtml(value);
      last.current = value;
    }
  }, [value]);

  return (
    <div
      ref={ref}
      contentEditable={!readOnly}
      suppressContentEditableWarning
      onInput={() => {
        if (!ref.current) return;
        const text = elementToText(ref.current);
        last.current = text;
        onChange(text);
      }}
      className={
        className ??
        "min-h-[180px] max-h-[360px] overflow-y-auto whitespace-pre-wrap rounded border border-gray-300 bg-white p-2 font-sans text-[12px] leading-relaxed text-gray-800 outline-none focus:border-blue-500"
      }
    />
  );
}
