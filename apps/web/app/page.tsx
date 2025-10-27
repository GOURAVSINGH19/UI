import Home from "../components/Home";
import Notificaton from "@workspace/ui/components/notification";
const ComponentLibraryDemo = () => {
  return (
    <main className="w-screen h-screen bg_svg">
      <div className="w-full h-full absolute top-[-10rem] left-0 -z-10">
        <img src="/home_svg.svg" alt="Description" className="h-[30rem] w-full" />
      </div>
      {/* <div className=" max-w-screen-xl mx-auto p-[.8rem] px-[2rem] h-full">
        <Home />
      </div> */}
      <Notificaton/>
    </main>
  );
};

export default ComponentLibraryDemo;