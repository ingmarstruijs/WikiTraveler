"use client";

import { useLocale } from "@wikitraveler/ui";
import { clearNodeAuth } from "../lib/persistNodeAuth";

export function SignOutButton() {
  const { t } = useLocale();

  function signOut() {
    clearNodeAuth();
    window.location.href = "/login";
  }

  return (
    <button type="button" onClick={signOut} className="wt-toolbar-btn" title={t("ui.signOut")} aria-label={t("ui.signOut")}>
      {t("ui.signOut")}
    </button>
  );
}
