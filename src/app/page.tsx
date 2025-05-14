import Image from "next/image";
import ResizableBlob from "@/components/ResizableBlob"

export default function Home() {
  return (
    <div>
      <ResizableBlob/>
      <div>
        Welcome to Nathan's Potfolio
      </div>
    </div>
  );
}
