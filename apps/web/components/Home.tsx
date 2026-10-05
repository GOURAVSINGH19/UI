'use client'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { motion } from 'motion/react'

const fadeUp = {
    hidden: { opacity: 0, y: 12, filter: 'blur(4px)' },
    visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
    },
}

const Home = () => {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        >
            <motion.div variants={fadeUp}>
                <Link
                    href="/docs/components/simple-search"
                    className='group btn btn-secondary h-7 gap-2 pr-3 pl-1 text-xs'
                >
                    <span className='rounded-full bg-ui-inverse px-2 py-0.5 text-[10px] font-medium text-ui-on-inverse'>New</span>
                    Simple Search component
                    <ArrowRight className='size-3 transition-transform group-hover:translate-x-0.5' />
                </Link>
            </motion.div>

            <motion.h1
                variants={fadeUp}
                className='mt-6 font-serif text-4xl leading-[1.1] text-ui-heading md:text-5xl'
            >
                Build beautiful interfaces,{' '}
                <span className='text-ui-hint italic'>fast.</span>
            </motion.h1>

            <motion.p
                variants={fadeUp}
                className='mt-heading-text text-base tracking-tight text-ui-body'
            >
                Kinetik is a set of free, open source React components built with
                Tailwind CSS and Motion. Copy them into your project, make them
                yours, and ship consistent UI without starting from scratch.
            </motion.p>

            <motion.div variants={fadeUp} className='mt-8 flex flex-wrap items-center gap-3'>
                <Link
                    href="/components"
                    data-press
                    className='btn btn-primary h-9 px-4 text-sm'
                >
                    Browse components
                    <ArrowRight className='size-3.5' />
                </Link>
            </motion.div>
        </motion.div>
    )
}

export default Home
