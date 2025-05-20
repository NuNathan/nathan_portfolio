'use client';

import ProjectSlide from "@/components/project-slide/ProjectSlide";
import { useRouter } from "next/navigation";
import data from "@/data/projects.json"


export default function Projects() {
  const router = useRouter()

  return (
    <>
      {data && Object.entries(data).map(([key, value]) => (
        <ProjectSlide right={true} title={key} description={value.description} img={value.img}/>
      ))}
    </>
  );
}
