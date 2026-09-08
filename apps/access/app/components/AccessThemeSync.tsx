"use client";

import { useEffect } from "react";
import { useTheme } from "@wikitraveler/ui";
import { AUTH_CHANGED_EVENT } from "../lib/authStorage";
import { SYNCED_EVENT } from "../lib/profileSyncEvents";
import { syncAccessTheme, writeAccessThemePreference } from "../lib/themePreference";

/** Keep theme per signed-in user; login/register always use the standard theme. */
export function AccessThemeSync() {
  const { setMode } = useTheme();

  useEffect(() => {
    syncAccessTheme(setMode);

    const onAuthChange = () => syncAccessTheme(setMode);
    const onSynced = () => syncAccessTheme(setMode);
    window.addEventListener(AUTH_CHANGED_EVENT, onAuthChange);
    window.addEventListener(SYNCED_EVENT, onSynced);
    return () => {
      window.removeEventListener(AUTH_CHANGED_EVENT, onAuthChange);
      window.removeEventListener(SYNCED_EVENT, onSynced);
    };
  }, [setMode]);

  return null;
}

export function persistAccessTheme(mode: Parameters<typeof writeAccessThemePreference>[0]) {
  writeAccessThemePreference(mode);
}
