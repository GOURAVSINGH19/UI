import Svg from "@/components/svg";
import Home from "../components/Home";
import Footer from "@/components/Footer";
import LatestComponent from "@/components/Newcomponent";
import { Techsection } from "@/components/Tech";

const ComponentLibraryDemo = () => {
  return (
    <main className="w-screen h-full bg_svg">
      <Svg />
      <div className=" z-[10] max-w-screen-sm w-full md:max-w-screen-xl mx-auto md:p-[.8rem] px-[.5rem] md:px-[2rem]">
        <Home />
        <LatestComponent />
        <Techsection />
        <Footer />
      </div>
    </main>
  );
};

export default ComponentLibraryDemo;