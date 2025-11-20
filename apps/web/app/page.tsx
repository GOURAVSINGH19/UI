import Svg from "@/components/svg";
import Home from "../components/Home";
import Footer from "@/components/Footer";
import { DottedContainer } from "@/components/dottedlines";
import LatestComponent from "@/components/Newcomponent";
const ComponentLibraryDemo = () => {
  return (
    <main className="w-screen h-screen bg_svg">
      <DottedContainer />
      <Svg />
      <div className=" z-[10] max-w-screen-sm w-full md:max-w-screen-xl mx-auto md:p-[.8rem] px-[.5rem] md:px-[2rem]">
        <Home />
        <Footer />
      </div>
    </main>
  );
};

export default ComponentLibraryDemo;