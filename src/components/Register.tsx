'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import userAvatar from '../../public/ytt.png'
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth, db, storage } from '../../firebase'
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const Register = () => {
    const googleProvider = new GoogleAuthProvider();
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [file, setFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false);

    const signUp = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            if (file) {
                setLoading(true);
                const name = new Date().getTime() + file.name;
                console.log(name);
                const storageRef = ref(storage, file.name);
                const uploadTask = uploadBytesResumable(storageRef, file);
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
                            const userRef = doc(db, 'user', user.uid);

                            await setDoc(userRef, {
                                email,
                                username,
                                user_img: downloadURL,
                                timestamp: serverTimestamp()
                            })
                            const idToken = await user.getIdToken();
                            sessionStorage.setItem('Token', idToken)
                            router.push('/farm');
                        });
                    }
                )
            } else {
                const idToken = await user.getIdToken();
                sessionStorage.setItem('Token', idToken)
                router.push('/farm');
            }
        } catch (error: any) {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert('Email Already Exists')
            console.error(errorCode, errorMessage);
        }
    }

    const signUpGoogle = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
    
        try {
            const userCredential = await signInWithPopup(auth, googleProvider);
            const user = userCredential.user;
    
            // Additional information from Google sign-in
            const displayName = user.displayName;
            const photoURL = user.photoURL;
            const email = user.email;
    
            const userRef = doc(db, 'user', user.uid);
    
            await setDoc(userRef, {
                username: displayName,
                email: email,
                user_img: photoURL,
                timestamp: serverTimestamp()
            });
    
            const idToken = await user.getIdToken();
            sessionStorage.setItem('Token', idToken);
            router.push('/farm');
        } catch (error: any) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error(errorCode, errorMessage);
        }
    }

    return (

        <div className='flex flex-col space-y-4 w-full'>
            <label htmlFor="my_modal_7" className="btn btn-primary text-white rounded-3xl">
                Open modal
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
            </label>
            <label htmlFor="" className='btn btn-outline btn-primary text-white rounded-3xl'>
                Aboute
            </label>

            <input type="checkbox" id="my_modal_7" className="modal-toggle" />
            <div className="modal top-[-1rem]">
                <div className="modal-box">
                    <div className='flex flex-col space-y-3'>
                        <h3 className="text-lg text-center font-bold">Register</h3>
                        <div className="flex justify-center py-4">
                            <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                {file ? (
                                    <Image
                                        src={URL.createObjectURL(file)}
                                        alt="Picture of the Actor"
                                        priority
                                        width={96}
                                        height={96}
                                        className="w-24 h-24 object-cover rounded-full ring ring-primary ring-offset-base-100 ring-offset-2"
                                    />
                                ) : (
                                    <Image
                                        src={userAvatar}
                                        alt={'Default Picture of the Actor'}
                                        priority
                                    />
                                )}
                            </div>
                        </div>
                        <input type="file"
                            id='file'
                            className="file-input file-input-bordered file-input-sm file-input-primary"
                            onChange={(e) => e.target.files && setFile(e.target.files[0])}
                        />
                        <input type="text" placeholder='username'
                            className='input input-bordered input-primary'
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                        />
                        <input type="email" placeholder="example@mail.com"
                            className="input input-bordered input-primary"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />
                        <input type="password" placeholder="********"
                            className="input input-bordered input-primary"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                        />
                        <button className="btn btn-primary text-white" onClick={signUp}>
                            {loading && <span className="loading loading-spinner"></span>}
                            Sign Up
                        </button>
                        <button className="btn btn-outline btn-primary" onClick={signUpGoogle}>Sign Google</button>
                    </div>
                </div>
                <label className="modal-backdrop" htmlFor="my_modal_7">Close</label>
            </div>
        </div>
    )
}

export default Register