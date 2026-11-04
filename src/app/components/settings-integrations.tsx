import { useState } from "react";
import { ChevronLeft, Plus, Search, X, Trash2, Eye, EyeOff, Settings as SettingsGearIcon, Pencil, Info } from "lucide-react";
import { Checkbox } from "./ui/checkbox";

// ─── Types ────────────────────────────────────────────────────────────────────

interface IntegrationCatalogEntry {
  id: string;
  name: string;
  description: string;
  logoBg: string;
  logoText: string;
}

export interface EmailAccountEntry {
  id: string;
  email: string;
  password: string;
  userIds: string[];
}

interface ConnectedIntegration {
  catalogId: string;
  apiKey: string;
  status: "Active" | "Inactive";
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const INTEGRATION_CATALOG: IntegrationCatalogEntry[] = [
  {
    id: "coach-solutions",
    name: "Coach Solutions",
    description: "Vessel tracking & noon report data",
    logoBg: "bg-blue-600",
    logoText: "CS",
  },
  {
    id: "navis",
    name: "Navis",
    description: "Bluetracker One vessel performance data",
    logoBg: "bg-teal-600",
    logoText: "N",
  },
  {
    id: "email",
    name: "Email",
    description: "Connect shared mailboxes for the Smart Inbox",
    logoBg: "bg-rose-600",
    logoText: "EM",
  },
];

const USER_DIRECTORY = [
  "Tester Adminren",
  "Rahul R - Chartering (UHL)",
  "Neethu V Mohan - Chartering (UHL)",
  "Sajith Salim - Chartering (UHL)",
  "Femina Joseph - Chartering (UHL)",
  "Priya Nair - Chartering (UHL)",
  "Deepak Anthraper - Chartering (UHL)",
];

// Demo seed: pre-connected mailbox so Smart Inbox opens directly after every reload.
export const DEFAULT_EMAIL_ACCOUNTS: EmailAccountEntry[] = [
  {
    id: "email-demo-1",
    email: "chartering@uhl.com",
    password: "demo-password",
    userIds: USER_DIRECTORY,
  },
];

// ─── Logo badge ───────────────────────────────────────────────────────────────

function LogoBadge({ entry, size = "md" }: { entry: IntegrationCatalogEntry; size?: "sm" | "md" }) {
  const dim = size === "sm" ? "size-8 text-[11px]" : "size-10 text-[13px]";
  return (
    <div className={`${dim} ${entry.logoBg} rounded-lg flex items-center justify-center text-white font-bold shrink-0`}>
      {entry.logoText}
    </div>
  );
}

// ─── Available Integrations modal ────────────────────────────────────────────

interface AvailableIntegrationsModalProps {
  search: string;
  onSearchChange: (v: string) => void;
  entries: IntegrationCatalogEntry[];
  onSelect: (entry: IntegrationCatalogEntry) => void;
  onClose: () => void;
}

function AvailableIntegrationsModal({ search, onSearchChange, entries, onSelect, onClose }: AvailableIntegrationsModalProps) {
  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-[400]" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-[410]">
        <div className="bg-white rounded-xl shadow-2xl w-[420px] max-h-[80vh] flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
            <h3 className="text-[15px] font-semibold text-gray-900">Available Integrations</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
              <X className="size-4" />
            </button>
          </div>

          <div className="p-3 border-b border-gray-100 shrink-0">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input
                autoFocus
                type="text"
                placeholder="Search integrations"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-8 pr-3 h-9 border border-gray-200 rounded text-[13px] bg-white focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {entries.length === 0 ? (
              <div className="py-10 text-center text-gray-400 text-[13px]">No integrations found</div>
            ) : (
              entries.map((entry) => (
                <button
                  key={entry.id}
                  onClick={() => onSelect(entry)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <LogoBadge entry={entry} size="sm" />
                  <span className="text-[14px] font-medium text-gray-800">{entry.name}</span>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Add / Edit Integration modal ─────────────────────────────────────────────

type TestStatus = "idle" | "testing" | "success" | "error";

interface AddIntegrationModalProps {
  entry: IntegrationCatalogEntry;
  initialApiKey: string;
  isEditing: boolean;
  onClose: () => void;
  onSave: (apiKey: string) => void;
  onRemove: () => void;
}

function AddIntegrationModal({ entry, initialApiKey, isEditing, onClose, onSave, onRemove }: AddIntegrationModalProps) {
  const [apiKey, setApiKey] = useState(initialApiKey);
  const [testStatus, setTestStatus] = useState<TestStatus>("idle");
  const [confirmingRemove, setConfirmingRemove] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  const handleTest = () => {
    if (!apiKey.trim()) {
      setTestStatus("error");
      return;
    }
    setTestStatus("testing");
    setTimeout(() => setTestStatus("success"), 700);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-[420]" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-[430]">
        <div className="bg-white rounded-xl shadow-2xl w-[440px] p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <LogoBadge entry={entry} size="sm" />
              <h3 className="text-[16px] font-semibold text-gray-900">
                {isEditing ? entry.name : `Add ${entry.name}`}
              </h3>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
              <X className="size-4" />
            </button>
          </div>

          <label className="text-[13px] font-medium text-gray-700 mb-1.5 block">API Key</label>
          <div className="relative">
            <input
              type={showApiKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setTestStatus("idle");
              }}
              placeholder="Paste your API key"
              className="w-full pl-3 pr-9 h-9 border border-gray-200 rounded text-[13px] font-mono focus:outline-none focus:border-blue-400"
            />
            <button
              type="button"
              onClick={() => setShowApiKey((v) => !v)}
              title={showApiKey ? "Hide API key" : "Show API key"}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showApiKey ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>

          {testStatus === "testing" && (
            <div className="mt-1.5 text-[12px] text-gray-400">Testing...</div>
          )}
          {testStatus === "success" && (
            <div className="mt-1.5 text-[12px] text-green-600 font-medium">Test success</div>
          )}
          {testStatus === "error" && (
            <div className="mt-1.5 text-[12px] text-red-600 font-medium">Error</div>
          )}

          <div className="flex items-center justify-between mt-5">
            <div className="flex items-center gap-2">
              <button
                onClick={handleTest}
                disabled={testStatus === "testing"}
                className="px-3 h-8 border border-gray-200 rounded text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Test API
              </button>
              {isEditing && (
                <button
                  onClick={() => setConfirmingRemove(true)}
                  className="flex items-center gap-1 px-3 h-8 rounded text-[13px] font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="size-3.5" />
                  Remove
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={onClose} className="px-3 h-8 text-[13px] font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Cancel
              </button>
              <button
                onClick={() => onSave(apiKey)}
                disabled={testStatus !== "success"}
                title={testStatus !== "success" ? "Run Test API successfully before saving" : undefined}
                className="px-4 h-8 bg-[#fde047] hover:bg-[#facc15] rounded text-[13px] font-semibold text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isEditing ? "Save" : "Add"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Remove confirmation */}
      {confirmingRemove && (
        <>
          <div className="fixed inset-0 bg-black/30 z-[440]" onClick={() => setConfirmingRemove(false)} />
          <div className="fixed inset-0 flex items-center justify-center z-[450]">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-[380px]">
              <h3 className="text-[15px] font-semibold text-gray-900 mb-2">Remove {entry.name}?</h3>
              <p className="text-[13px] text-gray-500 mb-5">
                This disconnects the integration and removes its saved API key. This can't be undone.
              </p>
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => setConfirmingRemove(false)}
                  className="px-3 h-8 text-[13px] font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={onRemove}
                  className="px-4 h-8 bg-red-600 hover:bg-red-700 rounded text-[13px] font-semibold text-white transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

// ─── Add / Edit Email Account modal ──────────────────────────────────────────

interface AddEmailAccountModalProps {
  initial?: EmailAccountEntry;
  onClose: () => void;
  onSave: (account: { email: string; password: string; userIds: string[] }) => void;
  onRemove?: () => void;
}

function AddEmailAccountModal({ initial, onClose, onSave, onRemove }: AddEmailAccountModalProps) {
  const [email, setEmail] = useState(initial?.email ?? "");
  const [password, setPassword] = useState(initial?.password ?? "");
  const [showPassword, setShowPassword] = useState(false);
  const [userIds, setUserIds] = useState<string[]>(initial?.userIds ?? []);
  const [confirmingRemove, setConfirmingRemove] = useState(false);

  const isEditing = !!initial;
  const canSave = email.trim() !== "" && password.trim() !== "";

  const toggleUser = (user: string) => {
    setUserIds((prev) => (prev.includes(user) ? prev.filter((u) => u !== user) : [...prev, user]));
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-[420]" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-[430]">
        <div className="bg-white rounded-xl shadow-2xl w-[440px] p-6 max-h-[85vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[16px] font-semibold text-gray-900">{isEditing ? "Edit Email" : "Add Email"}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
              <X className="size-4" />
            </button>
          </div>

          <label className="text-[13px] font-medium text-gray-700 mb-1.5 block">Email ID</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            className="w-full px-3 h-9 border border-gray-200 rounded text-[13px] focus:outline-none focus:border-blue-400 mb-4"
          />

          <label className="text-[13px] font-medium text-gray-700 mb-1.5 block">Password</label>
          <div className="relative mb-2">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full pl-3 pr-9 h-9 border border-gray-200 rounded text-[13px] focus:outline-none focus:border-blue-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              title={showPassword ? "Hide password" : "Show password"}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          <div className="flex items-start gap-1.5 bg-blue-50 border border-blue-100 rounded px-2.5 py-2 mb-4">
            <Info className="size-3.5 text-blue-500 mt-0.5 shrink-0" />
            <p className="text-[11px] text-blue-700 leading-snug">
              Mockup only. In production this should use OAuth or an app-specific token instead of storing the mailbox password directly.
            </p>
          </div>

          <label className="text-[13px] font-medium text-gray-700 mb-1.5 block">Users with Access</label>
          <div className="border border-gray-200 rounded max-h-40 overflow-y-auto divide-y divide-gray-100 mb-1">
            {USER_DIRECTORY.map((user) => (
              <label key={user} className="flex items-center gap-2 px-3 py-2 text-[13px] text-gray-700 cursor-pointer hover:bg-gray-50">
                <Checkbox checked={userIds.includes(user)} onCheckedChange={() => toggleUser(user)} />
                {user}
              </label>
            ))}
          </div>
          <p className="text-[11px] text-gray-400 mb-5">
            {userIds.length} user{userIds.length !== 1 ? "s" : ""} selected
          </p>

          <div className="flex items-center justify-between">
            <div>
              {isEditing && onRemove && (
                <button
                  onClick={() => setConfirmingRemove(true)}
                  className="flex items-center gap-1 px-3 h-8 rounded text-[13px] font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="size-3.5" />
                  Remove
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={onClose} className="px-3 h-8 text-[13px] font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Cancel
              </button>
              <button
                onClick={() => onSave({ email: email.trim(), password, userIds })}
                disabled={!canSave}
                className="px-4 h-8 bg-[#fde047] hover:bg-[#facc15] rounded text-[13px] font-semibold text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isEditing ? "Save" : "Add Email"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {confirmingRemove && onRemove && (
        <>
          <div className="fixed inset-0 bg-black/30 z-[440]" onClick={() => setConfirmingRemove(false)} />
          <div className="fixed inset-0 flex items-center justify-center z-[450]">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-[380px]">
              <h3 className="text-[15px] font-semibold text-gray-900 mb-2">Remove {email}?</h3>
              <p className="text-[13px] text-gray-500 mb-5">
                This disconnects the mailbox and removes it from the Smart Inbox for every user it was shared with. This can't be undone.
              </p>
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => setConfirmingRemove(false)}
                  className="px-3 h-8 text-[13px] font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={onRemove}
                  className="px-4 h-8 bg-red-600 hover:bg-red-700 rounded text-[13px] font-semibold text-white transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

// ─── Email Integration edit overlay (manage multiple mailboxes) ─────────────

interface EmailIntegrationEditOverlayProps {
  accounts: EmailAccountEntry[];
  onClose: () => void;
  onAddAccount: (account: { email: string; password: string; userIds: string[] }) => void;
  onUpdateAccount: (id: string, account: { email: string; password: string; userIds: string[] }) => void;
  onRemoveAccount: (id: string) => void;
}

function EmailIntegrationEditOverlay({
  accounts,
  onClose,
  onAddAccount,
  onUpdateAccount,
  onRemoveAccount,
}: EmailIntegrationEditOverlayProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const editingAccount = editingId ? accounts.find((a) => a.id === editingId) ?? null : null;

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-[400]" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-[410]">
        <div className="bg-white rounded-xl shadow-2xl w-[520px] max-h-[80vh] flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
            <div className="flex items-center gap-3">
              <div className="size-8 bg-rose-600 rounded-lg flex items-center justify-center text-white font-bold text-[11px] shrink-0">
                EM
              </div>
              <h3 className="text-[15px] font-semibold text-gray-900">Email</h3>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
              <X className="size-4" />
            </button>
          </div>

          <div className="flex items-center justify-between px-5 pt-4 shrink-0">
            <p className="text-[12px] text-gray-500">Connected mailboxes</p>
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-1.5 bg-[#fde047] hover:bg-[#facc15] text-gray-900 px-3 h-8 rounded text-[13px] font-semibold transition-colors"
            >
              <Plus className="size-3.5" />
              Add Email
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-2">
            {accounts.length === 0 ? (
              <div className="py-10 text-center text-gray-400 text-[13px]">No mailboxes connected yet</div>
            ) : (
              accounts.map((account) => (
                <div key={account.id} className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3">
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-gray-900 truncate">{account.email}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {account.userIds.length === 0
                        ? "No users assigned"
                        : `${account.userIds.length} user${account.userIds.length > 1 ? "s" : ""} with access`}
                    </p>
                  </div>
                  <button
                    onClick={() => setEditingId(account.id)}
                    title="Edit"
                    className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors shrink-0"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {showAdd && (
        <AddEmailAccountModal
          onClose={() => setShowAdd(false)}
          onSave={(account) => {
            onAddAccount(account);
            setShowAdd(false);
          }}
        />
      )}

      {editingAccount && (
        <AddEmailAccountModal
          initial={editingAccount}
          onClose={() => setEditingId(null)}
          onSave={(account) => {
            onUpdateAccount(editingAccount.id, account);
            setEditingId(null);
          }}
          onRemove={() => {
            onRemoveAccount(editingAccount.id);
            setEditingId(null);
          }}
        />
      )}
    </>
  );
}

// ─── Integrations home ─────────────────────────────────────────────────────────

interface SettingsIntegrationsProps {
  onBack: () => void;
  emailAccounts: EmailAccountEntry[];
  onEmailAccountsChange: (accounts: EmailAccountEntry[]) => void;
}

export function SettingsIntegrations({ onBack, emailAccounts, onEmailAccountsChange }: SettingsIntegrationsProps) {
  const [connected, setConnected] = useState<ConnectedIntegration[]>([]);
  const [showAvailable, setShowAvailable] = useState(false);
  const [addFor, setAddFor] = useState<IntegrationCatalogEntry | null>(null);
  const [showEmailEdit, setShowEmailEdit] = useState(false);
  const [search, setSearch] = useState("");

  const hasEmailIntegration = emailAccounts.length > 0;
  const emailCatalogEntry = INTEGRATION_CATALOG.find((c) => c.id === "email")!;

  const availableCatalog = INTEGRATION_CATALOG.filter((c) =>
    c.id === "email" ? !hasEmailIntegration : !connected.some((k) => k.catalogId === c.id)
  );
  const filteredCatalog = availableCatalog.filter(
    (c) => !search || c.name.toLowerCase().includes(search.toLowerCase())
  );

  const openAddForNew = (entry: IntegrationCatalogEntry) => {
    setShowAvailable(false);
    setSearch("");
    setAddFor(entry);
  };

  const openEditApiKey = (conn: ConnectedIntegration) => {
    const entry = INTEGRATION_CATALOG.find((c) => c.id === conn.catalogId);
    if (entry) setAddFor(entry);
  };

  const handleSave = (catalogId: string, apiKey: string) => {
    setConnected((prev) => {
      const exists = prev.some((c) => c.catalogId === catalogId);
      if (exists) {
        return prev.map((c) => (c.catalogId === catalogId ? { ...c, apiKey } : c));
      }
      return [...prev, { catalogId, apiKey, status: "Active" as const }];
    });
    setAddFor(null);
  };

  const handleRemove = (catalogId: string) => {
    setConnected((prev) => prev.filter((c) => c.catalogId !== catalogId));
    setAddFor(null);
  };

  const handleSaveNewEmailIntegration = (account: { email: string; password: string; userIds: string[] }) => {
    const newAccount: EmailAccountEntry = { id: `email-${Date.now()}`, ...account };
    onEmailAccountsChange([...emailAccounts, newAccount]);
    setAddFor(null);
  };

  const addEmailAccountToIntegration = (account: { email: string; password: string; userIds: string[] }) => {
    const newAccount: EmailAccountEntry = { id: `email-${Date.now()}`, ...account };
    onEmailAccountsChange([...emailAccounts, newAccount]);
  };

  const updateEmailAccountInIntegration = (id: string, account: { email: string; password: string; userIds: string[] }) => {
    onEmailAccountsChange(emailAccounts.map((a) => (a.id === id ? { ...a, ...account } : a)));
  };

  const removeEmailAccountFromIntegration = (id: string) => {
    onEmailAccountsChange(emailAccounts.filter((a) => a.id !== id));
  };

  const existingConnection = addFor ? connected.find((c) => c.catalogId === addFor.id) : undefined;
  const existingApiKey = existingConnection?.apiKey ?? "";

  return (
    <div className="flex flex-col h-full bg-[#efefef]">

      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-8 py-3 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-[13px] text-gray-600 hover:text-gray-900 font-medium transition-colors"
        >
          <ChevronLeft className="size-4" />
          BACK
        </button>
        <button
          onClick={() => setShowAvailable(true)}
          className="flex items-center gap-1.5 bg-[#fde047] hover:bg-[#facc15] text-gray-900 px-3 h-8 rounded text-[13px] font-semibold transition-colors"
        >
          <Plus className="size-3.5" />
          Add New
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <h1 className="text-[18px] font-semibold text-gray-800 mb-5">Integrations</h1>

        {connected.length === 0 && !hasEmailIntegration ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <p className="text-sm font-medium">No integrations added yet</p>
            <p className="text-xs mt-1">Click "+ Add New" to connect a service</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {connected.map((conn) => {
              const entry = INTEGRATION_CATALOG.find((c) => c.id === conn.catalogId);
              if (!entry) return null;
              return (
                <div key={conn.catalogId} className="bg-white border border-gray-200 rounded-lg p-5 relative">
                  <button
                    onClick={() => openEditApiKey(conn)}
                    title="Settings"
                    className="absolute top-3 right-3 p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    <SettingsGearIcon className="size-4" />
                  </button>
                  <LogoBadge entry={entry} />
                  <div className="text-[15px] font-semibold text-gray-900 mt-3 mb-1.5">{entry.name}</div>
                  <div className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-green-500" />
                    <span className="text-[12px] text-gray-500 font-medium">Active</span>
                  </div>
                </div>
              );
            })}

            {hasEmailIntegration && (
              <div
                onClick={() => setShowEmailEdit(true)}
                className="bg-white border border-gray-200 rounded-lg p-5 relative cursor-pointer hover:border-gray-300 transition-colors"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowEmailEdit(true);
                  }}
                  title="Settings"
                  className="absolute top-3 right-3 p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                >
                  <SettingsGearIcon className="size-4" />
                </button>
                <LogoBadge entry={emailCatalogEntry} />
                <div className="text-[15px] font-semibold text-gray-900 mt-3 mb-1.5">{emailCatalogEntry.name}</div>
                <div className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-green-500" />
                  <span className="text-[12px] text-gray-500 font-medium">
                    {emailAccounts.length} mailbox{emailAccounts.length === 1 ? "" : "es"} connected
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Available Integrations picker */}
      {showAvailable && (
        <AvailableIntegrationsModal
          search={search}
          onSearchChange={setSearch}
          entries={filteredCatalog}
          onSelect={openAddForNew}
          onClose={() => {
            setShowAvailable(false);
            setSearch("");
          }}
        />
      )}

      {/* Add / Edit Integration (API-key based) */}
      {addFor && addFor.id !== "email" && (
        <AddIntegrationModal
          key={addFor.id}
          entry={addFor}
          initialApiKey={existingApiKey}
          isEditing={!!existingConnection}
          onClose={() => setAddFor(null)}
          onSave={(apiKey) => handleSave(addFor.id, apiKey)}
          onRemove={() => handleRemove(addFor.id)}
        />
      )}

      {/* Add first mailbox for a brand new Email integration */}
      {addFor && addFor.id === "email" && (
        <AddEmailAccountModal onClose={() => setAddFor(null)} onSave={handleSaveNewEmailIntegration} />
      )}

      {/* Manage mailboxes for an already-connected Email integration */}
      {showEmailEdit && hasEmailIntegration && (
        <EmailIntegrationEditOverlay
          accounts={emailAccounts}
          onClose={() => setShowEmailEdit(false)}
          onAddAccount={addEmailAccountToIntegration}
          onUpdateAccount={updateEmailAccountInIntegration}
          onRemoveAccount={removeEmailAccountFromIntegration}
        />
      )}
    </div>
  );
}
