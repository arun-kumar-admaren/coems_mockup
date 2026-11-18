import React from "react";
import { ChevronLeft, Check, AlertTriangle } from "lucide-react";
import { MailText } from "./eta-mail-text";
import {
  DEFAULT_TEMPLATE,
  OPERATIONS_MAILBOX,
  TEMPLATE_TOKENS,
  etaActions,
  renderBody,
  renderSubject,
  useEtaState,
  type NoticeValues,
} from "./eta-notice-store";

// Settings → ETA Notice Template (Version 2.0). One global template for all clients; admins edit it here,
// operators can still change the subject and the remark per notice in the ETA notice dialog.

const SAMPLE: NoticeValues = {
  vessel: "UHL FRESH",
  voyage: "FRS 2604",
  port: "Cuxhaven",
  eta: "24.11.2026",
  fixture: "UHL-F-2026-1356",
  loadPort: "Tuticorin",
  dischargePort: "Cuxhaven, Emden",
  client: "Nordex",
  remark: "Vessel on schedule",
  signatory: "Tester Adminren",
};

export function SettingsEtaNotice({ onBack }: { onBack: () => void }) {
  const st = useEtaState();
  const [subject, setSubject] = React.useState(st.template.subject);
  const [body, setBody] = React.useState(st.template.body);
  const [saved, setSaved] = React.useState(false);
  const dirty = subject !== st.template.subject || body !== st.template.body;

  const save = () => {
    etaActions.setTemplate({ subject, body });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };
  const reset = () => {
    setSubject(DEFAULT_TEMPLATE.subject);
    setBody(DEFAULT_TEMPLATE.body);
  };

  return (
    <div className="flex h-full flex-col bg-[#efefef]">
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-8 py-3">
        <button onClick={onBack} className="flex items-center gap-1 text-[13px] font-medium text-gray-600 transition-colors hover:text-gray-900">
          <ChevronLeft className="size-4" />
          BACK
        </button>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="flex items-center gap-1 text-[12px] text-green-700">
              <Check className="size-3.5" /> Saved
            </span>
          )}
          <button onClick={reset} className="h-8 rounded border border-gray-300 bg-white px-3 text-[12px] font-medium text-gray-700 hover:bg-gray-50">
            Reset to default
          </button>
          <button
            onClick={save}
            disabled={!dirty}
            className="h-8 rounded bg-blue-600 px-4 text-[12px] font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            Save template
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <h1 className="text-[18px] font-semibold text-gray-800">ETA Notice Template</h1>
        <p className="mt-1 mb-6 text-[13px] text-gray-500">
          One template for all clients. Placeholders in curly brackets are filled in per notice. A subject part or a body line whose placeholders are all empty is dropped.
        </p>

        <div className="grid grid-cols-[1fr_380px] gap-6">
          <div className="space-y-5">
            <div className="rounded-lg border border-gray-200 bg-white p-5">
              <label className="mb-1 block text-[12px] font-semibold text-gray-800">Subject</label>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="h-9 w-full rounded border border-gray-300 px-3 text-[13px] outline-none focus:border-blue-500"
              />
              <p className="mt-1 text-[11px] text-gray-500">Parts are separated by " – ". Example: parts for fixture and ports disappear when no fixture is chosen.</p>

              <label className="mt-5 mb-1 block text-[12px] font-semibold text-gray-800">
                Body <span className="font-normal text-gray-500">· put ** around a text to make it bold, as in the remark line</span>
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={18}
                className="w-full rounded border border-gray-300 px-3 py-2 font-mono text-[12px] leading-relaxed outline-none focus:border-blue-500"
              />
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-5">
              <h2 className="mb-3 text-[13px] font-semibold text-gray-800">Preview with sample data</h2>
              <div className="text-[13px] font-semibold text-gray-900 underline">{renderSubject(subject, SAMPLE)}</div>
              <MailText text={renderBody(body, SAMPLE)} className="mt-3 whitespace-pre-wrap font-sans text-[12px] leading-relaxed text-gray-800" />
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-lg border border-gray-200 bg-white p-5">
              <h2 className="mb-3 text-[13px] font-semibold text-gray-800">Placeholders</h2>
              <ul className="space-y-2">
                {TEMPLATE_TOKENS.map((t) => (
                  <li key={t.token} className="text-[12px]">
                    <code className="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] text-gray-800">{t.token}</code>
                    <span className="ml-2 text-gray-600">{t.desc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-amber-300 bg-amber-50 p-5">
              <h2 className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-amber-900">
                <AlertTriangle className="size-4" /> Sending mailbox
              </h2>
              <p className="text-[12px] text-amber-900">
                Notices are sent from the operations mailbox <b>{OPERATIONS_MAILBOX}</b>. SMTP access is still to be granted, so this mockup uses a test sender.
                Each sent e-mail should also appear in that mailbox's Sent Items.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
