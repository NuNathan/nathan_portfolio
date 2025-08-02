import HomeClient from "./HomeClient";
import { getHomePage } from "@/api/homePage";
import ErrorBoundary from "@/components/error/ErrorBoundary";
import ApiErrorPage from "@/components/error/ApiErrorPage";

// Check if we're in a state where API is likely down
async function checkApiHealth(): Promise<boolean> {
  try {
    // Simple health check - just try to reach the API
    const response = await fetch(`${process.env.STRAPI_API_URL}/posts?pagination[pageSize]=1`, {
      headers: {
        'Authorization': `Bearer ${process.env.STRAPI_TOKEN}`,
      },
      // Short timeout for health check
      signal: AbortSignal.timeout(5000),
    });
    return response.ok;
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
}

export default async function Home() {
  try {
    const homePageData = await getHomePage();

    // Check if we got fallback data (indicates API issues)
    const isUsingFallbackData = homePageData.data.documentId === "fallback";

    if (isUsingFallbackData) {
      // Double-check API health
      const apiHealthy = await checkApiHealth();

      if (!apiHealthy) {
        return (
          <ApiErrorPage
            title="Portfolio Temporarily Unavailable"
            message="We're experiencing connectivity issues with our content management system. The portfolio will be back online shortly."
          />
        );
      }
    }

    return (
      <ErrorBoundary>
        <div className="relative h-screen overflow-hidden">
          <HomeClient homePageData={homePageData} />
        </div>
      </ErrorBoundary>
    );
  } catch (error) {
    console.error('Critical error in Home page:', error);
    return (
      <ApiErrorPage
        title="Portfolio Temporarily Unavailable"
        message="We're experiencing technical difficulties. Please try refreshing the page or come back in a few minutes."
      />
    );
  }
}
