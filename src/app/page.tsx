import HomeClient from "./HomeClient";
import { getHomePage } from "@/api/homePage";

export default async function Home() {
  // Fetch home page data server-side
  // TODO: understand code, remove comments, and add metadata/SSO
  const homePageData = await getHomePage();

  return (
    <div className="relative h-screen overflow-hidden">
      <HomeClient homePageData={homePageData} />
    </div>
  );
}
