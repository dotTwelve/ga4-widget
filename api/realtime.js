const { BetaAnalyticsDataClient } = require("@google-analytics/data");

const propertyId = "272795322";

const credentials = {
  client_email: process.env.GA_CLIENT_EMAIL,
  private_key: process.env.GA_PRIVATE_KEY.replace(/\\n/g, "\n"),
};

const analyticsDataClient = new BetaAnalyticsDataClient({ credentials });

module.exports = async (req, res) => {
  try {
    // Realtime - aktivní uživatelé teď
    const [realtime] = await analyticsDataClient.runRealtimeReport({
      property: `properties/${propertyId}`,
      metrics: [{ name: "activeUsers" }],
    });

    // Posledních 15 minut
    const [report] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      metrics: [{ name: "activeUsers" }],
      dateRanges: [{ startDate: "today", endDate: "today" }],
      minuteRanges: [{ startMinutesAgo: 15, endMinutesAgo: 0 }],
    });

    const activeNow = realtime.rows?.[0]?.metricValues?.[0]?.value || "0";
    const last15min = report.rows?.[0]?.metricValues?.[0]?.value || "0";

    res.status(200).json({
      activeUsers: parseInt(activeNow),
      last15min: parseInt(last15min),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
