"use client"
import { motion } from "framer-motion"
const Svg = () => {
    return (
        <>
            <div className="w-full h-full absolute top-[-10rem] left-0 -z-10">
                <motion.img
                    src="/home_svg.svg"
                    alt="Description"
                    className="h-[30rem] w-full"
                />
            </div>
        </>
    )
}

export default Svg;