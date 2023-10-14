'use client'
import FarmDetails from '@/components/FarmDetails';
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
            <FarmDetails />
        </div>
    )
}

export default Farm