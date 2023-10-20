'use client'
import { addDoc, collection, doc, getDoc, getDocs, serverTimestamp } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from '../../../../firebase'

import Image from 'next/image';
import Icon1 from '../../../../public/ico1.png'
import Icon2 from '../../../../public/ico2.png'

type Props = {
    params: { id: string }
}

const PageDetail = ({ params }: Props) => {
    const dbRef = doc(db, 'Farm', params.id);
    const treeRef = collection(db, 'Tree')
    const [farmData, setFarmData] = useState<any | null>(null);
    const [tree_collected, setTreeCollected] = useState<Number | null>(null)
    const [tree_ready, setTreeReady] = useState<Number | null>(null)
    const [tree_notReady, setTreeNotReady] = useState<Number | null>(null)
    const [tree_data, setTreeData] = useState<any[]>([])

    useEffect(() => {
        const getData = async () => {
            const docSnap = await getDoc(dbRef);
            if (docSnap.exists()) {
                setFarmData({ ...docSnap.data(), id: docSnap.id });
            } else {
                console.log("No such document!");
            }
        }
        getData();
    }, [dbRef])

    useEffect(() => {
        const getTreeData = async () => {
            const querySnapshot = await getDocs(treeRef);
            const treedata = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id}))
            setTreeData(treedata)
        }
        getTreeData();
    }, [treeRef])

    if (!farmData) {
        return <div>Loading...</div>;
    }

    const pollinationDate = farmData.farm_pollination_date ? farmData.farm_pollination_date.toDate() : null;
    const monthNames = [
        'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
        'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ];
    const formattedDate = pollinationDate ?
        `${pollinationDate.getDate()} ${monthNames[pollinationDate.getMonth()]} ${pollinationDate.getFullYear()}`
        : null;

    const generateTreeList = (numTrees: number) => {
        const treeList = [];
        for (let i = 1; i <= numTrees; i++) {
            treeList.push(
                <svg key={i} viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg" className={`fill-success opacity-50 hover:opacity-100 w-full`}>
                    <path d="M28.2919 2.24677C23.5961 3.90987 17.7264 9.19261 15.2807 13.8884C14.2046 16.1385 11.4654 19.4646 9.31314 21.3234C7.16091 23.1821 4.42171 26.9974 3.14993 29.6388C-1.15453 38.9325 0.508558 47.6393 8.1392 55.1721C13.7154 60.8462 18.1177 62.5093 27.118 62.5093H33.0855V66.9116C33.0855 71.1182 33.1833 71.3138 36.0204 71.3138H38.9552V61.8245V52.2372L45.9989 45.1936L53.0426 38.0521L50.8903 35.8998L48.7381 33.7476L43.8467 38.5412L38.9552 43.3348V30.9106V18.4863H36.0204H33.0855V27.9757V37.4651L28.1941 32.6715L23.3026 27.8779L21.1504 30.0301L18.9982 32.1824L26.0418 39.3239C32.9877 46.2697 33.0855 46.4654 33.0855 51.5524V56.6395H27.2158C17.6286 56.6395 11.7589 53.4112 8.53051 46.3675C5.00868 38.6391 7.16091 30.0301 13.9111 25.2365C16.3568 23.3778 18.8025 20.3451 20.3678 17.2146C27.118 3.22506 44.9228 3.32289 51.673 17.2146C53.1404 20.2473 55.5861 23.2799 57.5427 24.5517C61.6515 27.2909 65.369 34.2368 65.369 39.0304C65.369 43.0413 62.532 49.5959 59.8906 51.9438C57.1514 54.3895 51.2817 56.6395 47.7598 56.6395C45.1184 56.6395 44.825 56.933 44.825 59.5744C44.825 62.2158 45.1184 62.5093 47.8576 62.5093C56.7601 62.5093 67.619 54.5851 70.0648 46.2697C72.7061 37.1716 69.9669 27.5844 62.7276 21.3234C60.5754 19.4646 57.8362 16.1385 56.7601 13.9862C51.4773 3.61638 38.8574 -1.56854 28.2919 2.24677Z" />
                </svg>
            );
        }
        return treeList;
    }

    const addTreeInfo = async () => {
        const treeData = {
            farm_id: params.id,
            tree_collected: tree_collected,
            tree_ready: tree_ready,
            tree_notReady: tree_notReady,
            created_at: serverTimestamp()
        };

        try {
            const treeRef = await addDoc(collection(db, 'Tree'), treeData);
            console.log("Tree added with ID: ", treeRef.id);
            setTreeCollected(null);
            setTreeReady(null);
            setTreeNotReady(null);
        } catch (error) {
            console.error("Error adding tree: ", error);
        }
    }
    

    return (
        <div className='flex min-h-screen flex-col items-center space-y-8 p-4'>
            {/* 1 */}
            <div className='text-start w-full space-y-2 font-bold'>
                <div className='text-4xl'>
                    <div>ฟาร์มทุเรียน</div>
                    <div className='text-primary'>
                        {farmData.farm_name}
                    </div>
                </div>
                <div className='text-lg font-semibold'>
                    <div className='inline-flex w-full'>
                        สถานะ: <div style={{ color: farmData.farm_status ? '#22c55e' : '#e11d48' }}>{farmData.farm_status ? 'พร้อมที่จะทำการเก็บเกี่ยวแล้ว' : 'ยังไม่พร้อมให้เก็บเกี่ยว'}</div>
                    </div>
                </div>
                <div>
                    <img src={farmData.farm_photo} alt="Farm Photo" />
                </div>
                <div className='font-medium'>
                    {tree_data.map((data) => {
                        return (
                            <div key={data.id}>
                                <div>เก็บแล้ว {data.tree_collected} ลูก</div>
                                <div>พร้อมที่จะเก็บ {data.tree_ready} ลูก</div>
                                <div>ยังไม่พร้อมที่จะเก็บ {data.tree_notReady} ลูก</div>
                            </div>
                        )
                    })}
                </div>
                <div>
                    {formattedDate && <div>ผสมเกสรเมื่อ {formattedDate}</div>}
                </div>
                <div>
                    <div className='inline-flex space-x-2 w-full'>
                        <div>
                            <Image src={Icon1} alt={'icon1'} className='w-[18px] h-[22px]' priority={true} />
                        </div>
                        <div className='font-medium'>
                            จำนวนต้นทุเรียน {farmData.farm_tree} ต้น
                        </div>
                    </div>
                    <div className='inline-flex space-x-2 w-full'>
                        <div>
                            <Image src={Icon2} alt={'icon2'} className='w-[18px] h-[20px]' priority={true} />
                        </div>
                        <div className='font-medium'>
                            จำนวนผล {farmData.durian_amount} ลูก
                        </div>
                    </div>
                </div>
            </div>

            {farmData.farm_tree && (
                <div className='grid grid-cols-6'>
                    {generateTreeList(farmData.farm_tree)}
                </div>
            )}

            {/* <div className="tooltip" data-tip="hello">
                <button className="btn">Hover me</button>
            </div> */}

            <div className='space-y-2'>
                <div className='space-y-2'>
                    <input type="number" placeholder='Collected amount'
                        className="input input-bordered input-primary w-full max-w-xs col-span-2"
                        value={tree_collected?.toString() || ''}
                        onChange={even => setTreeCollected(Number(even.target.value))}
                    />
                    <input type="number" placeholder='Collected amount'
                        className="input input-bordered input-primary w-full max-w-xs col-span-2"
                        value={tree_ready?.toString() || ''}
                        onChange={even => setTreeReady(Number(even.target.value))}
                    />
                    <input type="number" placeholder='Collected amount' 
                        className="input input-bordered input-primary w-full max-w-xs col-span-2"
                        value={tree_notReady?.toString() || ''}
                        onChange={even => setTreeNotReady(Number(even.target.value))}
                    />
                </div>
                <div>
                    <button onClick={addTreeInfo} className="btn">Button</button>
                </div>
            </div>
        </div>
    )
}

export default PageDetail


