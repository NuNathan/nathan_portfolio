import HomeClient from "./HomeClient";
import { getHomePage } from "@/api/homePage";
import { checkStrapiHealth } from "@/api/strapi";
import ErrorBoundary from "@/components/error/ErrorBoundary";
import ApiErrorPage from "@/components/error/ApiErrorPage";

export default async function Home() {
  try {
    const homePageData = await getHomePage();

    // Check if we got fallback data (indicates API issues)
    const isUsingFallbackData = homePageData.data.documentId === "fallback";

    if (isUsingFallbackData) {
      // Double-check API health
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
