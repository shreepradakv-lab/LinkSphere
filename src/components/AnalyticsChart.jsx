
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  Link2,
  MousePointerClick,
  TrendingUp,
  Award,
  RefreshCw,
  BarChart3,
  Clock3,
  ExternalLink
} from "lucide-react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import { supabase } from "../lib/supabase";

function AnalyticsChart() {
  const [links, setLinks] = useState([]);
  const [clicks, setClicks] = useState([]);
  const [period, setPeriod] = useState("7d");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [linksResult, clicksResult] = await Promise.all([
        supabase.functions.invoke("list-links", { body: {} }),
        supabase.functions.invoke("get-analytics", { body: {} })
      ]);

      if (linksResult.error) throw linksResult.error;
      if (clicksResult.error) throw clicksResult.error;

      if (!linksResult.data?.success) {
        throw new Error(
          linksResult.data?.message || "Unable to load links."
        );
      }

      if (!clicksResult.data?.success) {
        throw new Error(
          clicksResult.data?.message || "Unable to load click history."
        );
      }

      setLinks(linksResult.data.data || []);
      setClicks(clicksResult.data.data || []);
    } catch (err) {
      console.error("Analytics error:", err);
      setError(err.message || "Unable to load analytics.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const totalLinks = links.length;

  const totalClicks = links.reduce(
    (total, link) => total + Number(link.clicks || 0),
    0
  );

  const averageClicks = totalLinks
    ? (totalClicks / totalLinks).toFixed(1)
    : "0.0";

  const sortedLinks = [...links].sort(
    (a, b) => Number(b.clicks || 0) - Number(a.clicks || 0)
  );

  const topLinks = sortedLinks.slice(0, 5);

  const filteredClicks = useMemo(() => {
    const now = new Date();

    if (period === "all") return clicks;

    const days = period === "7d" ? 7 : 30;
    const cutoff = new Date(now);
    cutoff.setDate(now.getDate() - (days - 1));
    cutoff.setHours(0, 0, 0, 0);

    return clicks.filter((click) => {
      const date = new Date(click.clicked_at);
      return !Number.isNaN(date.getTime()) && date >= cutoff;
    });
  }, [clicks, period]);

  const chartData = useMemo(() => {
    const grouped = {};

    filteredClicks.forEach((click) => {
      const date = new Date(click.clicked_at);

      if (Number.isNaN(date.getTime())) return;

      const key = [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0")
      ].join("-");

      grouped[key] = (grouped[key] || 0) + 1;
    });

    if (period === "all") {
      return Object.entries(grouped)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, count]) => ({
          date,
          label: new Date(`${date}T00:00:00`).toLocaleDateString(
            "en-IN",
            { day: "numeric", month: "short" }
          ),
          clicks: count
        }));
    }

    const days = period === "7d" ? 7 : 30;
    const result = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      const key = [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0")
      ].join("-");

      result.push({
        date: key,
        label: date.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short"
        }),
        clicks: grouped[key] || 0
      });
    }

    return result;
  }, [filteredClicks, period]);

  const recentClicks = clicks.slice(0, 6);

  const getShortCode = (click) => {
    const relation = Array.isArray(click.links)
      ? click.links[0]
      : click.links;

    return relation?.short_code || "Unknown link";
  };

  const getOriginalUrl = (click) => {
    const relation = Array.isArray(click.links)
      ? click.links[0]
      : click.links;

    return relation?.original_url || "";
  };

  const formatDate = (value) => {
    if (!value) return "Unknown date";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "Unknown date";

    return date.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <section className="analytics-page">
        <div className="analytics-loading">
          <RefreshCw className="loading-spin" size={20} />
          Loading your analytics...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="analytics-page">
        <div className="analytics-heading">
          <div>
            <span className="section-number">04 / PERFORMANCE</span>
            <h2>Link analytics</h2>
          </div>

          <button className="refresh-links" onClick={fetchAnalytics}>
            <RefreshCw size={16} />
            Retry
          </button>
        </div>

        <div className="links-message links-error">{error}</div>
      </section>
    );
  }

  return (
    <section className="analytics-page">
      <div className="analytics-heading">
        <div>
          <span className="section-number">04 / PERFORMANCE</span>
          <h2>Link analytics</h2>
          <p>Understand how your links perform over time.</p>
        </div>

        <button className="refresh-links" onClick={fetchAnalytics}>
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="analytics-stats">
        <article className="analytics-card">
          <div className="analytics-card-icon"><Link2 size={20} /></div>
          <span>Total links</span>
          <h3>{totalLinks}</h3>
          <p>Links created</p>
        </article>

        <article className="analytics-card">
          <div className="analytics-card-icon"><MousePointerClick size={20} /></div>
          <span>Total clicks</span>
          <h3>{totalClicks.toLocaleString("en-IN")}</h3>
          <p>Recorded link visits</p>
        </article>

        <article className="analytics-card">
          <div className="analytics-card-icon"><TrendingUp size={20} /></div>
          <span>Average clicks</span>
          <h3>{averageClicks}</h3>
          <p>Clicks per link</p>
        </article>

        <article className="analytics-card">
          <div className="analytics-card-icon"><Award size={20} /></div>
          <span>Most popular link</span>
          <h3 className="analytics-top-code">
            {topLinks[0]?.shortCode || "—"}
          </h3>
          <p>
            {topLinks[0]
              ? `${topLinks[0].clicks || 0} clicks`
              : "No link activity yet"}
          </p>
        </article>
      </div>

      <div className="analytics-chart-section">
        <div className="analytics-chart-heading">
          <div>
            <span className="section-number">CLICK ACTIVITY</span>
            <h3>Traffic overview</h3>
            <p>
              {filteredClicks.length.toLocaleString("en-IN")} recorded
              clicks in this view
            </p>
          </div>

          <div className="analytics-periods">
            {["7d", "30d", "all"].map((item) => (
              <button
                key={item}
                className={period === item ? "active" : ""}
                onClick={() => setPeriod(item)}
              >
                {item === "7d" ? "7 days" : item === "30d" ? "30 days" : "All"}
              </button>
            ))}
          </div>
        </div>

        <div className="analytics-chart">
          {filteredClicks.length === 0 ? (
            <div className="analytics-chart-empty">
              <BarChart3 size={32} />
              <strong>No click activity in this period</strong>
              <span>Share your shortened links to start collecting data.</span>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 12, right: 12, left: -18, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="clickGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#c46e51" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#c46e51" stopOpacity={0.01} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 5"
                  vertical={false}
                  stroke="var(--analytics-grid)"
                />

                <XAxis
                  dataKey="label"
                  tick={{ fill: "var(--analytics-muted)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  minTickGap={period === "7d" ? 8 : 24}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{ fill: "var(--analytics-muted)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  contentStyle={{
                    background: "var(--analytics-tooltip)",
                    border: "1px solid var(--analytics-border)",
                    borderRadius: "12px",
                    color: "var(--analytics-text)"
                  }}
                  labelStyle={{ color: "var(--analytics-text)" }}
                  formatter={(value) => [`${value} clicks`, "Activity"]}
                />

                <Area
                  type="monotone"
                  dataKey="clicks"
                  stroke="#c46e51"
                  strokeWidth={2.5}
                  fill="url(#clickGradient)"
                  activeDot={{ r: 5, strokeWidth: 0 }}
                  isAnimationActive
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="analytics-lower-grid">
        <div className="analytics-table-section">
          <div className="analytics-table-heading">
            <div>
              <span className="section-number">TOP PERFORMERS</span>
              <h3>Popular links</h3>
            </div>
            <BarChart3 size={21} />
          </div>

          {topLinks.length === 0 ? (
            <div className="analytics-chart-empty compact">
              <Link2 size={28} />
              <strong>No links created yet</strong>
            </div>
          ) : (
            <div className="analytics-link-list">
              {topLinks.map((link, index) => (
                <article className="analytics-link-row" key={link.id}>
                  <div className="analytics-rank">{index + 1}</div>

                  <div className="analytics-link-details">
                    <strong>{link.shortCode}</strong>
                    <span title={link.originalUrl}>{link.originalUrl}</span>
                  </div>

                  <div className="analytics-click-count">
                    <strong>{link.clicks || 0}</strong>
                    <span>clicks</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="analytics-table-section">
          <div className="analytics-table-heading">
            <div>
              <span className="section-number">LATEST RECORDS</span>
              <h3>Recent activity</h3>
            </div>
            <Clock3 size={21} />
          </div>

          {recentClicks.length === 0 ? (
            <div className="analytics-chart-empty compact">
              <Clock3 size={28} />
              <strong>No recent activity</strong>
            </div>
          ) : (
            <div className="analytics-activity-list">
              {recentClicks.map((click) => (
                <article className="analytics-activity-row" key={click.id}>
                  <div className="activity-dot" />

                  <div className="activity-details">
                    <strong>{getShortCode(click)}</strong>
                    <span>{formatDate(click.clicked_at)}</span>
                  </div>

                  <a
                    href={getOriginalUrl(click)}
                    target="_blank"
                    rel="noreferrer"
                    title="Open original URL"
                    className="activity-open"
                  >
                    <ExternalLink size={15} />
                  </a>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      <p className="analytics-note">
        Click activity is based on recorded database events. The activity
        chart and recent records use the latest 1,000 click records returned
        by the analytics function.
      </p>
    </section>
  );
}

export default AnalyticsChart;
