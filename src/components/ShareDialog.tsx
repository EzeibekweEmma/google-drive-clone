import { updateShareSettings } from "@/API/Firestore";
import React from "react";

function ShareDialog({
  file,
  onClose,
}: {
  file: FileListProps;
  onClose: () => void;
}) {
  const [isShared, setIsShared] = React.useState(!!file.isShared);
  const [shareToken, setShareToken] = React.useState(file.shareToken ?? "");
  const [isSaving, setIsSaving] = React.useState(false);
  const accessMode = isShared ? "public" : "private";
  const shareUrl =
    typeof window !== "undefined" && shareToken
      ? `${window.location.origin}/share/${shareToken}`
      : "";

  const enableSharing = async () => {
    setIsSaving(true);
    const nextToken = shareToken || crypto.randomUUID();

    try {
      await updateShareSettings(file.id, true, nextToken);
      setIsShared(true);
      setShareToken(nextToken);
    } finally {
      setIsSaving(false);
    }
  };

  const disableSharing = async () => {
    setIsSaving(true);

    try {
      await updateShareSettings(file.id, false, "");
      setIsShared(false);
      setShareToken("");
    } finally {
      setIsSaving(false);
    }
  };

  const copyLink = async () => {
    if (!shareUrl) return;

    try {
      await navigator.clipboard.writeText(shareUrl);
      window.alert("Share link copied.");
    } catch {
      window.prompt("Copy this link", shareUrl);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-darkC2/40"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="w-[30rem] space-y-5 rounded-xl bg-white p-5 shadow-lg shadow-[#bbb]"
      >
        <div className="space-y-1">
          <h2 className="text-2xl">Copy link</h2>
          <p className="text-sm text-textC">
            Choose who can open "{file.fileName}" from its link.
          </p>
        </div>

        <div className="rounded-xl border border-[#ddd] p-4">
          <div className="mb-4 space-y-3">
            <p className="font-medium text-textC">General access</p>
            <button
              type="button"
              onClick={() => void disableSharing()}
              disabled={isSaving || accessMode === "private"}
              className={`flex w-full items-start justify-between rounded-xl border px-4 py-3 text-left transition ${
                accessMode === "private"
                  ? "border-[#1a73e8] bg-[#e8f0fe]"
                  : "border-[#ddd] hover:bg-darkC2"
              } disabled:cursor-not-allowed disabled:opacity-60`}
            >
              <div>
                <p className="font-medium text-textC">Only you</p>
                <p className="text-sm text-textC/70">Only your account can open this file.</p>
              </div>
              <span className="text-sm font-medium text-textC/70">
                {accessMode === "private" ? "Selected" : ""}
              </span>
            </button>
            <button
              type="button"
              onClick={() => void enableSharing()}
              disabled={isSaving}
              className={`flex w-full items-start justify-between rounded-xl border px-4 py-3 text-left transition ${
                accessMode === "public"
                  ? "border-[#1a73e8] bg-[#e8f0fe]"
                  : "border-[#ddd] hover:bg-darkC2"
              } disabled:cursor-not-allowed disabled:opacity-60`}
            >
              <div>
                <p className="font-medium text-textC">Anyone with the link</p>
                <p className="text-sm text-textC/70">Anyone who has the link can view this file.</p>
              </div>
              <span className="text-sm font-medium text-textC/70">
                {accessMode === "public" ? "Selected" : ""}
              </span>
            </button>
          </div>

          {isShared && shareUrl ? (
            <div className="space-y-3">
              <div className="rounded-lg bg-darkC2 px-3 py-2 text-sm text-textC">
                <span className="block truncate">{shareUrl}</span>
              </div>
              <button
                type="button"
                onClick={() => void copyLink()}
                className="rounded-full bg-[#1a73e8] px-4 py-2 text-sm font-medium text-white hover:bg-[#1557b0]"
              >
                Copy link
              </button>
            </div>
          ) : (
            <div className="rounded-lg bg-darkC2 px-3 py-2 text-sm text-textC/70">
              Link copying is available after you switch access to "Anyone with the link".
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-3 py-2 font-medium text-textC2 hover:bg-darkC2"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShareDialog;
