'use client'
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

const Detail = () => {
    let router = useRouter();
    useEffect(() => {
        let token = sessionStorage.getItem('Token')
        if (!token) {
            router.push('/')
        }
    }, [router,])
    return (
        <div className='flex min-h-screen flex-col items-center space-y-6 p-6'>
        </div>
    )
}

export default Detail
