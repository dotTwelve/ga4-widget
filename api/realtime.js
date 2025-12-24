const { BetaAnalyticsDataClient } = require("@google-analytics/data");

const propertyId = "272795322";

const credentials = {
  client_email: process.env.GA_CLIENT_EMAIL,
  private_key: process.env.GA_PRIVATE_KEY.replace(/\\n/g, "\n"),
};

const analyticsDataClient = new BetaAnalyticsDataClient({ credentials });

module.exports = async (req, res) => {
  try {
    // Realtime - posledních 15 minut
    const [realtime] = await analyticsDataClient.runRealtimeReport({
      property: `properties/${propertyId}`,
      metrics: [{ name: "activeUsers" }],
    });

    // Celkem za dnešek
    const [daily] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      metrics: [{ name: "totalUsers" }],
      dateRanges: [{ startDate: "today", endDate: "today" }],
    });

    const last15min = realtime.rows?.[0]?.metricValues?.[0]?.value || "0";
    const today = daily.rows?.[0]?.metricValues?.[0]?.value || "0";

    res.status(200).json({
      last15min: parseInt(last15min),
      today: parseInt(today),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
