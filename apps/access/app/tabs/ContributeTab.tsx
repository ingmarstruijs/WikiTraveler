"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale } from "@wikitraveler/ui";
import { fetchContributorStats } from "../lib/accessApi";
import { AccessPageHero } from "../components/AccessPageHero";
import { RecentPropertiesSection } from "../components/RecentPropertiesSection";

interface Props {
  homeNodeUrl: string;
}

export function ContributeTab({ homeNodeUrl }: Props) {
  const { t } = useLocale();
  const [stats, setStats] = useState<Awaited<ReturnType<typeof fetchContributorStats>>>(null);

  useEffect(() => {
    fetchContributorStats(homeNodeUrl).then(setStats);
  }, [homeNodeUrl]);

  return (
    <div className="tab-content fk-contribute-tab">
      <AccessPageHero
        notifyNodeUrl={homeNodeUrl}
        sectionTitle={t("ui.contributeTitle")}
        sectionSubtitle={t("ui.contributeSubtitle")}
      />
      <div className="fk-page-body fk-contribute-body">
        <div className="fk-contribute-layout">
          <div className="fk-contribute-primary">
            <p className="fk-contribute-lead">{t("ui.contributeBody")}</p>

            <Link href="/properties/new" className="fk-contribute-cta">
              <span className="fk-contribute-cta__icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="12" cy="12" r="9" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
              </span>
              <span className="fk-contribute-cta__copy">
                <strong>{t("ui.addProperty")}</strong>
                <span>{t("ui.contributeCtaHint")}</span>
              </span>
              <svg className="fk-contribute-cta__chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <polyline points="9 6 15 12 9 18" />
              </svg>
            </Link>

            <section className="fk-contribute-impact" aria-label={t("ui.contributeImpact")}>
              <h2 className="fk-contribute-impact__title">{t("ui.contributeImpact")}</h2>
              <div className="fk-contribute-stats">
                <StatCard label={t("ui.contributeAudits")} value={stats?.auditsSubmitted ?? 0} />
                <StatCard label={t("ui.contributeReports")} value={stats?.signals.submitted ?? 0} />
                <StatCard label={t("ui.contributeResolved")} value={stats?.signals.resolved ?? 0} />
              </div>
            </section>
          </div>

          <section className="fk-contribute-recent card">
            <RecentPropertiesSection homeNodeUrl={homeNodeUrl} compact maxItems={8} showEmpty />
          </section>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="fk-contribute-stat">
      <div className="fk-contribute-stat__value">{value}</div>
      <div className="fk-contribute-stat__label">{label}</div>
    </div>
  );
}
