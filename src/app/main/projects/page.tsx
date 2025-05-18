'use client';

import ProjectSlide from "@/components/project-slide/ProjectSlide";
import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";


export default function Projects() {
  const router = useRouter()

  return (
    <ProjectSlide/>
  );
}
