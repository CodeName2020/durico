'use client'
import FarmDetails from '@/components/FarmDetails';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

const Farm = () => {
    let router = useRouter();
    useEffect(() => {
        let token = sessionStorage.getItem('Token')
        if (!token) {
            router.push('/')
        }
    }, [router,])
    return (
        <div className='flex min-h-screen flex-col items-center space-y-6 p-6'>
            <div className='text-start w-full space-y-4 font-bold'>
                <div className='text-4xl'>
                    <div>ผลผลิต</div>
                    <div>จากฟาร์มทุเรียน</div>
                </div>
                <div>
                    24 มิ.ย. 2566
                </div>
            </div>
            {/* <div className="w-full flex flex-col items-center mb-4">
                <h1 className="text-4xl text-center mb-4 w-full">เก็บแล้วรวม  ลูก</h1>
                <div className="w-full h-12 border-black border-2 px-1.5 p-1 rounded-full overflow-hidden">
                    <div className="bg-primary h-full w-3/4 rounded-full"></div>
                </div>
                <div className='mt-1'>
                    <div className='border-l-[50px] border-r-[50px] border-l-transparent border-b-[35px] border-b-primary border-r-transparent'></div>
                    <div className='bg-primary'>
                        <p className="text-4xl text-white font-bold text-center p-2">90%</p>
                    </div>
                </div>
            </div> */}
            <div className='w-full text-center space-y-2'>
                <h1 className='text-3xl font-semibold'>collected 100 n.</h1>
                <progress className="progress progress-primary w-full h-6" value="60" max="100"></progress>
            </div>
            <FarmDetails />
        </div>
    )
}

export default Farm