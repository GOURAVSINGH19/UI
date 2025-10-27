import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Home = () => {
    return (
        <section className='w-full h-1/2 flex items-center mt-[4vw] flex-col mb-10'>
            <div className='w-full flex-col flex justify-center items-center'>
                <div className='mt-10 w-fit backdrop-blur-2xl bg-white/10 border border-white/10 lg:w-[30%] px-4 py-1/2 rounded-2xl flex items-center justify-center gap-3 mb-5 shadow-[var(--shadow-sm)]'>
                    <div className='w-2 h-2 rounded-full bg-purple-800'></div>
                    <p className='text-[10px]'>A modern UI library designed for speed, flexibility, and simplicity.</p>
                    <ArrowRight className='w-3 font-light' />
                </div>
                <h1 className='text-[4.5vw] line-clamp-2 leading-[110%] capitalize'>Build beautiful</h1>
                <h1 className='text-[3.5vw] line-clamp-2 leading-[110%] capitalize mb-5'>consistent UIs — fast.</h1>
                <p className='text-[10px] font-medium leading-[110%] capitalize text-[#d4d4d4]'>Get started with our documentation and examples.</p>
            </div>
            <div className='btn_container w-full leading-[130%] flex justify-center items-center gap-5 mt-8'>
                <Link href="/docs/getting-started/introduction">
                    <button className='btn_primary bg-[var(--bg)] dark:bg-[#fff] text-white dark:text-black dark:shadow-[#fff] dark:shadow-sm inset-ring-[var(--shadow-md)] shadow-[var(--shadow-md)] hover:bg-[var(--bg-light)] transition-all duration-200 ease-in-out text-[12px] cursor-pointer px-6 py-2 rounded-lg'>Get Started</button>
                </Link>
                <Link href="https://github.com/your-repo">
                    <button className='btn_secondary border border-white/20 dark:shadow-[#ffffff1f] dark:shadow-sm shadow-[var(--shadow-md)] hover:border-white/40 transition-all duration-200 ease-in-out text-[12px] px-6 py-2 rounded-lg cursor-pointer'>View on GitHub</button>
                </Link>
            </div>
        </section>
    )
}

export default Home