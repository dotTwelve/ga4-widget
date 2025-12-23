const { BetaAnalyticsDataClient } = require("@google-analytics/data");

const propertyId = "272795322";

const credentials = {
  client_email: process.env.GA_CLIENT_EMAIL,
  private_key: process.env.GA_PRIVATE_KEY.replace(/\\n/g, "\n"),
};

const analyticsDataClient = new BetaAnalyticsDataClient({ credentials });

module.exports = async (req, res) => {
  try {
    const [response] = await analyticsDataClient.runRealtimeReport({
      property: `properties/${propertyId}`,
      metrics: [{ name: "activeUsers" }],
    });

    const activeUsers = response.rows?.[0]?.metricValues?.[0]?.value || "0";

    res.status(200).json({
      activeUsers: parseInt(activeUsers),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
