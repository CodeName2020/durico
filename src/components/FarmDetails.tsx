'use client'
import React, { useEffect, useState } from 'react'
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore'
import { db, storage } from '../../firebase'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'

const FarmDetails = () => {
    const [farm_name, setFarm_name] = useState('')
    const [farm_location, setFarm_location] = useState('')
    const [farm_province, setFarm_province] = useState('')
    const [farm_durian_species, setFarm_durian_species] = useState('')
    const [farm_photo, setFarm_photo] = useState<File | null>(null)
    const [farm_status, setFarm_status] = useState(false)
    const [farm_pollination_date, setFarm_pollination_date] = useState<Date | null>(null)
    const [farm_tree, setFarm_tree] = useState<Number | null>(null)
    const [farm_space, setFarm_space] = useState<Number | null>(null)
    const [durian_amount, setDurian_amount] = useState<Number | null>(null)
    const [clickedLatLng, setClickedLatLng] = useState({ lat: null, lng: null });
    const [modalOpen, setModalOpen] = useState(false);
    const [fireData, setFireData] = useState<any[]>([])
    const [isUpdate, setIsUpdate] = useState(false)
    const [ID, setID] = useState('')
    const [loading, setLoading] = useState(false);

    const dbRef = collection(db, 'Farm');

    const addFarmData = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (farm_photo) {
            setLoading(true)
            const name = new Date().getTime() + farm_photo.name;
            console.log(name);
            const storageRef = ref(storage, farm_photo.name);
            const uploadTask = uploadBytesResumable(storageRef, farm_photo);
            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                        case 'paused':
                            console.log('Upload is paused');
                            break;
                        case 'running':
                            console.log('Upload is running');
                            break;
                    }
                },
                (error) => {
                    console.log(error)
                    setLoading(false)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        console.log('File available at', downloadURL);

                        await addDoc(dbRef, {
                            farm_name: farm_name,
                            farm_location: farm_location,
                            farm_province: farm_province,
                            farm_durian_species: farm_durian_species,
                            farm_photo: downloadURL,
                            farm_status: farm_status,
                            farm_pollination_date: farm_pollination_date,
                            farm_tree: farm_tree,
                            farm_space: farm_space,
                            durian_amount: durian_amount,
                            Latitude: clickedLatLng.lat,
                            Longitude: clickedLatLng.lng
                        }).then(() => {
                            alert('Data Sent')
                            setFarm_name('')
                            setFarm_location('')
                            setFarm_province('')
                            setFarm_durian_species('')
                            setFarm_tree(null)
                            setFarm_space(null)
                            setDurian_amount(null)
                            setFarm_pollination_date(null)
                            setFarm_status(false)
                            setClickedLatLng({ lat: null, lng: null })
                            setModalOpen(false)
                        }).catch((err) => {
                            console.error(err);
                        })
                    });
                }
            )
        }
    }

    const handleMapClick = (e: any) => {
        console.log('Latitude:', e.latLng.lat());
        console.log('Longitude:', e.latLng.lng());
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        setClickedLatLng({ lat, lng });

        const modalCheckbox = document.getElementById("my_modal_2") as HTMLInputElement;
        if (modalCheckbox) {
            modalCheckbox.checked = false;
        }
    }

    const mapStyles = {
        height: "50vh",
        width: "100%"
    }

    const defaultCenter = {
        lat: 13.7563,
        lng: 100.5018
    }

    useEffect(() => {
        const getData = async () => {

            const querySnapshot = await getDocs(dbRef);
            const data = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
            setFireData(data);
        }
        getData();
    }, [dbRef])

    const getID = (id: any, farm_name: string, farm_location: string, farm_province: string, farm_durian_species: string,
        farm_tree: number, farm_space: number, durian_amount: number, farm_status: boolean) => {
        setID(id)
        setFarm_name(farm_name)
        setFarm_location(farm_location)
        setFarm_province(farm_province)
        setFarm_durian_species(farm_durian_species)
        setFarm_tree(farm_tree)
        setFarm_space(farm_space)
        setDurian_amount(durian_amount)
        setFarm_status(farm_status)

        setIsUpdate(true)
        setModalOpen(true)
    }

    const updateFields = () => {
        let fieldToEdit = doc(db, 'Farm', ID);

        if (farm_photo) {
            const name = new Date().getTime() + farm_photo.name;
            const storageRef = ref(storage, name);
            const uploadTask = uploadBytesResumable(storageRef, farm_photo);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                        case 'paused':
                            console.log('Upload is paused');
                            break;
                        case 'running':
                            console.log('Upload is running');
                            break;
                    }
                },
                (error) => {
                    console.log(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        await updateDoc(fieldToEdit, {
                            farm_name: farm_name,
                            farm_location: farm_location,
                            farm_province: farm_province,
                            farm_durian_species: farm_durian_species,
                            farm_photo: downloadURL, // Update farm_photo with new downloadURL
                            farm_status: farm_status,
                            farm_pollination_date: farm_pollination_date,
                            farm_tree: farm_tree,
                            farm_space: farm_space,
                            durian_amount: durian_amount,
                            Latitude: clickedLatLng.lat,
                            Longitude: clickedLatLng.lng
                        });
                        alert('Data Updated');
                        setFarm_name('');
                        setFarm_location('');
                        setFarm_province('');
                        setFarm_durian_species('');
                        setFarm_photo(null);
                        setFarm_status(false);
                        setFarm_pollination_date(null);
                        setFarm_tree(null);
                        setFarm_space(null);
                        setDurian_amount(null);
                        setClickedLatLng({ lat: null, lng: null });
                        setIsUpdate(false);
                        setModalOpen(false)
                    });
                }
            );
        } else {
            updateDoc(fieldToEdit, {
                farm_name: farm_name,
                farm_location: farm_location,
                farm_province: farm_province,
                farm_durian_species: farm_durian_species,
                farm_status: farm_status,
                farm_pollination_date: farm_pollination_date,
                farm_tree: farm_tree,
                farm_space: farm_space,
                durian_amount: durian_amount,
                Latitude: clickedLatLng.lat,
                Longitude: clickedLatLng.lng
            }).then(() => {
                alert('Data Updated');
                setFarm_name('');
                setFarm_location('');
                setFarm_province('');
                setFarm_durian_species('');
                setFarm_status(false);
                setFarm_pollination_date(null);
                setFarm_tree(null);
                setFarm_space(null);
                setDurian_amount(null);
                setClickedLatLng({ lat: null, lng: null });
                setIsUpdate(false);
                setModalOpen(false)
            }).catch((err) => {
                console.log(err);
            });
        }
    }

    const deleteDocument = (id: any) => {
        let fieldToEdit = doc(db, 'Farm', id)
        deleteDoc(fieldToEdit)
            .then(() => {
                alert('Data Delete')
            })
            .catch((err) => {
                alert('Cannot Delete that field..')
            }
            )
    }

    return (
        <div className='space-y-2'>
            <div className='flex justify-center'>
                <div className="join">
                    <div>
                        <div>
                            <input className="input input-bordered join-item w-[20rem]" placeholder="Search" />
                        </div>
                    </div>
                    <div className="indicator">
                        <button className="btn join-item">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </button>
                    </div>
                </div>
            </div>
            <div className='flex justify-end'>
                <div>
                    <select className="select select-bordered join-item" defaultValue='Filter'>
                        <option disabled>Filter</option>
                        <option>Sci-fi</option>
                        <option>Drama</option>
                        <option>Action</option>
                    </select>
                </div>
            </div>
            <div className='flex flex-row gap-2'>
                <div className='grid grid-cols-2 gap-2'>
                    {fireData.map((data) => {
                        return (
                            <div key={data.id}>
                                <div className="card bg-base-100 shadow-xl">
                                    <figure>
                                        {data.farm_photo && (
                                            <img src={data.farm_photo} alt="Uploaded Farm Photo" />
                                        )}
                                    </figure>
                                    <div className="card-body -m-6">
                                        <div className='text-center'>
                                            <div className='text-md font-semibold'>ฟาร์มทุเรียน{data.farm_name}</div>
                                            <p>{data.farm_location}, จังหวัด{data.farm_province}, ทุเรียนพันธุ์{data.farm_durian_species} จำนวนทุเรียนวันนี้ {data.durian_amount} ลูก</p>
                                        </div>
                                        <div className="card-actions justify-end border-t-2 border-gray-100 pt-1">
                                            <button onClick={() => deleteDocument(data.id)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" strokeWidth="2" className="w-6 h-6 stroke-error">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                </svg>
                                            </button>
                                            <button onClick={() => {
                                                getID(data.id, data.farm_name, data.farm_location, data.farm_province, data.farm_durian_species,
                                                    data.farm_tree, data.farm_space, data.durian_amount, data.farm_status)
                                            }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" strokeWidth="2" className="w-6 h-6 stroke-success">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                </svg>
                                            </button>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className='flex justify-center pt-4'>
                <label htmlFor="my_modal_7" className="btn btn-primary text-white rounded-3xl" onClick={() => setModalOpen(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add Farm
                </label>

                <input type="checkbox" id="my_modal_7" className="modal-toggle" />
                {modalOpen && (
                    <div className="modal">
                        <div className="modal-box space-y-4">
                            <h3 className="text-lg font-bold">Add Farm Informations!</h3>
                            <div className='grid grid-cols-2 gap-2'>
                                <input type="text" placeholder="Farm name"
                                    className="input input-bordered input-primary w-full max-w-xs col-span-2"
                                    value={farm_name}
                                    onChange={even => setFarm_name(even.target.value)}
                                />
                                <input type="text" placeholder="Farm location"
                                    className="input input-bordered input-primary w-full max-w-xs col-span-2"
                                    value={farm_location}
                                    onChange={even => setFarm_location(even.target.value)}
                                />
                                <input type="text" placeholder="Farm province"
                                    className="input input-bordered input-primary w-full max-w-xs col-span-2"
                                    value={farm_province}
                                    onChange={even => setFarm_province(even.target.value)}
                                />
                                <input type="text" placeholder="Farm durian species"
                                    className="input input-bordered input-primary w-full max-w-xs col-span-2"
                                    value={farm_durian_species}
                                    onChange={even => setFarm_durian_species(even.target.value)}
                                />
                                <input type="number" placeholder="Total Trees"
                                    className="input input-bordered input-primary w-full max-w-xs"
                                    value={farm_tree?.toString() || ''}
                                    onChange={even => setFarm_tree(Number(even.target.value))}
                                />
                                <input type="number" placeholder="Farm Space (Rai)"
                                    className="input input-bordered input-primary w-full max-w-xs"
                                    value={farm_space?.toString() || ''}
                                    onChange={even => setFarm_space(Number(even.target.value))}
                                />
                                <input type="number" placeholder="Durian amount"
                                    className="input input-bordered input-primary w-full max-w-xs"
                                    value={durian_amount?.toString() || ''}
                                    onChange={even => setDurian_amount(Number(even.target.value))}
                                />
                                <input type="date" placeholder="Date of pollination"
                                    className="input input-bordered input-primary w-full max-w-xs"
                                    value={farm_pollination_date ? farm_pollination_date.toISOString().split('T')[0] : ''}
                                    onChange={even => setFarm_pollination_date(new Date(even.target.value))}
                                />
                                <div className='flex items-center justify-center border border-primary rounded-md w-full max-w-xs h-12 col-span-2'>
                                    {clickedLatLng.lat !== null && clickedLatLng.lng !== null ? (

                                        <p>{clickedLatLng.lat}</p>
                                    ) : (
                                        <p>Latitude</p>
                                    )}
                                </div>
                                <div className='flex items-center justify-center border border-primary rounded-md w-full max-w-xs h-12 col-span-2'>
                                    {clickedLatLng.lat !== null && clickedLatLng.lng !== null ? (

                                        <p>{clickedLatLng.lng}</p>
                                    ) : (
                                        <p>Longitude</p>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="my_modal_2" className="btn btn-primary btn-xs text-white rounded-md w-full">Open map</label>
                                    <input type="checkbox" id="my_modal_2" className="modal-toggle" />
                                    <div className='modal'>
                                        <div className='modal-box'>
                                            <LoadScript googleMapsApiKey="AIzaSyDsYL6YaNoNwl1F7Gna6rZ_qRc1tuJJ7xA">
                                                <GoogleMap
                                                    mapContainerStyle={mapStyles}
                                                    zoom={5}
                                                    center={defaultCenter}
                                                    onClick={handleMapClick}
                                                >
                                                    <Marker position={defaultCenter} />
                                                </GoogleMap>
                                            </LoadScript>
                                        </div>
                                        <label className="modal-backdrop" htmlFor="my_modal_2">Close</label>
                                    </div>
                                </div>
                                <div className='col-span-2'>
                                    <div className="form-control">
                                        <label className="label cursor-pointer">
                                            <span className="label-text text-lg">Farm Status</span>
                                            <input
                                                type="checkbox"
                                                checked={farm_status}
                                                className="checkbox checkbox-primary"
                                                onChange={() => setFarm_status(!farm_status)}
                                            />
                                        </label>
                                    </div>
                                </div>
                                <input
                                    type="file"
                                    id='farm_photo'
                                    className="file-input file-input-bordered file-input-primary w-full max-w-xs col-span-2"
                                    onChange={event => event.target.files && setFarm_photo(event.target.files[0])}
                                />
                            </div>
                            <div className='text-center'>
                                {isUpdate ? (
                                    <button className="btn btn-active btn-success" onClick={updateFields}>Update</button>
                                ) : (
                                    <button className='btn btn-accent text-white' onClick={addFarmData}>
                                        {loading && <span className="loading loading-spinner"></span>}
                                        add
                                    </button>
                                )}
                            </div>
                        </div>
                        <label className="modal-backdrop" htmlFor="my_modal_7" onClick={() => setModalOpen(false)}>Close</label>
                    </div>
                )}
            </div>
        </div >
    )
}

export default FarmDetails


