import Svg from "@/components/svg";
import Home from "../components/Home";
import { UploadedFile } from "@/components/ui/Uploading";
const ComponentLibraryDemo = () => {
  return (
    <main className="w-screen h-screen bg_svg">
      <Svg />
      <div className=" max-w-screen-xl mx-auto p-[.8rem] px-[2rem]">
        <Home />
      </div>
      <UploadedFile/>
    </main>
  );
};

export default ComponentLibraryDemo;