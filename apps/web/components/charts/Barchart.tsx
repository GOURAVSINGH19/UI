'use client'
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Jan', value: 2400 },
    { name: 'Feb', value: 3200 },
    { name: 'Mar', value: 2800 },
    { name: 'Apr', value: 4200 },
    { name: 'May', value: 3800 },
    { name: 'Jun', value: 5240 },
    { name: 'Jul', value: 4800 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-zinc-900/90 backdrop-blur-md border border-zinc-700 p-3 rounded-xl shadow-xl">
                <p className="text-zinc-400 text-xs mb-1">{label}</p>
                <p className="text-white font-bold text-lg">
                    {payload[0].value.toLocaleString()}
                    <span className="text-purple-400 text-xs ml-2">+12%</span>
                </p>
            </div>
        );
    }
    return null;
};

export const AnalyticsLineChart = () => {
    return (
        <div className="w-120 h-90 flex flex-col bg-zinc-900/40 backdrop-blur-xl  shadow-[var(--shadow-s)] rounded-2xl p-6 md:p-8 relative overflow-hidden group">
            <div className="flex justify-between items-start mb-6 z-10">
                <div className="flex flex-col">
                    <div className="flex items-center space-x-2">
                        <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold tracking-wider">
                            MAU
                        </span>
                        <span className="text-zinc-500 text-xs font-medium">JAN 2023</span>
                    </div>
                    <div className="flex items-baseline mt-2">
                        <h3 className="text-5xl font-medium tracking-tight text-white">5.24k</h3>
                        <span className="ml-3 text-green-400 text-sm font-semibold flex items-center">
                            ▲ 25%
                        </span>
                    </div>
                </div>
            </div>
            <div className="absolute top-8 right-8 flex space-x-1 z-10 hidden md:flex">
                <button className="px-3 py-1 text-xs font-medium text-white bg-zinc-800 rounded-lg border border-zinc-700">Daily active users</button>
                <button className="px-3 py-1 text-xs font-medium text-zinc-500 hover:text-zinc-300 transition-colors">Last 28 days</button>
            </div>
            <div className="flex-1 w-full min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorMau" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#52525b', fontSize: 12 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#52525b', fontSize: 12 }} />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#8b5cf6', strokeWidth: 1, strokeDasharray: '5 5' }} />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#8b5cf6"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorMau)"
                            activeDot={{ r: 6, strokeWidth: 0, fill: '#fff' }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="absolute -bottom-20 -right-20 w-64 h-64 blur-3xl rounded-full pointer-events-none"></div>
        </div>
    );
};
