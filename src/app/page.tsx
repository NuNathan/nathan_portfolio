import HomeClient from "./HomeClient";
import { getHomePage } from "@/api/homePage";

export default async function Home() {
  // TODO: understand code, remove comments, and add metadata/SSO
  // fix post page
  // add custom error page(404)
  const homePageData = await getHomePage();

  return (
    <div className="relative h-screen overflow-hidden">
      <HomeClient homePageData={homePageData} />
    </div>
  );
}
