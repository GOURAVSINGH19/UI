"use client"
import Image from "next/image";
const Svg = () => {
    return (
        <>
            <div className="w-full h-full absolute top-[-10rem] left-0 -z-10">
                <Image
                    src="/home_svg.svg"
                    alt="Description"
                    className="h-[30rem] w-full"
                    width={100}
                    height={100}
                />
            </div>
        </>
    )
}

export default Svg;