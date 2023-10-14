'use client'
import Register from '@/components/Register'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import mainPic from '../../public/mainpic.png'
import {PageLogo} from '@/components/Svg';

export default function Home() {
  let router = useRouter();
  useEffect(() => {
    let token = sessionStorage.getItem('Token')

    if (token) {
      router.push('/farm')
    }
  }, [router])

  return (
    <main className="flex min-h-screen flex-col items-center space-y-8 p-8">
      <PageLogo />
      <div>
        <div className='font-bold text-sm'>
          แพลตฟอร์มฟาร์มทุเรียนที่ถูกออกแบบเพื่อให้บริการ อย่างครบวงจรแก่เจ้าของฟาร์มทุเรียน เพื่อช่วยให้
          พวกเขาปรับปรุงการดำเนินงาน เพื่อผลผลิตสูงสุด
        </div>
      </div>
      <div className="xl:w-1/2">
        <div>
          <Image src={mainPic} alt={'Main Picture of Home'} priority />
        </div>
      </div>
      <Register />
    </main>
  )
}
