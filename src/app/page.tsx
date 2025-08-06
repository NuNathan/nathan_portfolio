import HomeClient from "./HomeClient";
import { getHomePage } from "@/api/homePage";
import { checkStrapiHealth } from "@/api/strapi";
import ErrorBoundary from "@/components/error/ErrorBoundary";
import ApiErrorPage from "@/components/error/ApiErrorPage";

// Helper function to check if data is fallback
function isFallbackData(data: any): boolean {
  return data?.documentId === "fallback";
}

export default async function Home() {
  try {
    const homePageData = await getHomePage();

    // Check if we got fallback data (indicates API issues)
    if (isFallbackData(homePageData.data)) {
      // Double-check API health before showing error
      const apiHealthy = await checkStrapiHealth();

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
