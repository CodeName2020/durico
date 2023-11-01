'use client'
import React, { useEffect, useState } from 'react'
import { auth, db } from '../../firebase'
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, User } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { LogoSvg } from './Svg'
import { collection, getDocs } from 'firebase/firestore'
import firebase from 'firebase/compat/app'

const Navbar = () => {
  const googleProvider = new GoogleAuthProvider();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpen2, setModalOpen2] = useState(false);
  const [checked, setChecked] = useState(false);
  const [userOr, setUserOr] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [fireData, setFireData] = useState<any[]>([]);
  const dbRef = collection(db, 'User');

  // const [error, setError] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem('Token');
    if (token) {
      setUserOr(token !== null)
    }
  }, [userOr])

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const signUp = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user
        console.log(user)
        user.getIdToken().then((idToken) => {
          sessionStorage.setItem('Token', idToken)
          setUserOr(true);
          router.push('/farm')
          setModalOpen(false);
        })
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert('Email Does Not Exists or Wrong Password');
        console.error(errorCode, errorMessage);
        // setError(true);
      });
  }

  const signUpGoogle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    signInWithPopup(auth, googleProvider)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user)
        user.getIdToken().then((idToken) => {
          sessionStorage.setItem('Token', idToken)
          setUserOr(true);
          router.push('/farm')
          setModalOpen(false);
        })
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorCode, errorMessage);
      });
  }

  const logout = () => {
    sessionStorage.removeItem('Token')
    setUserOr(false)
    setEmail('')
    setPassword('')
    setChecked(false)
    auth.signOut().then(() => {
      setUser(null as User | null); // Set user to null when logged out
    }).catch(error => {
      console.error('Error signing out:', error);
    });
    router.push('/')
  }

  useEffect(() => {
    const getData = async () => {

      const querySnapshot = await getDocs(dbRef);
      const data = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
      setFireData(data);
    }
    getData();
  }, [dbRef])

  const currentUser = auth.currentUser;
  const loggedInUserId = currentUser ? currentUser.uid : null;
  const loggedInUser = fireData.find(user => user.id === loggedInUserId);

  return (
    <div className='flex justify-between p-2 items-center border-yellow-500 border-b-2'>
      <LogoSvg />
      <div className='flex flex-col space-y-4'>
        {loggedInUser ? (
          <div key={loggedInUser.id} className='btn btn-primary text-white rounded-3xl px-1'>
            <label htmlFor="my_modal_1">
              <div className='mx-2'>
                {loggedInUser.username}
              </div>
            </label>
            <div className='dropdown dropdown-end'>
              <div>
                <label tabIndex={0}>
                  {loggedInUser.user_img && (
                    <img src={loggedInUser.user_img} alt="Uploaded Farm Photo" className='w-[38px] h-[38px] rounded-full ring ring-primary ring-offset-base-100 ring-offset-2' />
                  )}
                </label>
              </div>
              <ul tabIndex={0} className="menu menu-sm dropdown-content mt-4 z-[1] p-2 shadow bg-base-100 rounded-box w-52 text-black font-light normal-case">
                <li>
                  <a className="justify-between">
                    Profile
                    <span className="badge">New</span>
                  </a>
                </li>
                <li><a>
                  <label htmlFor="my_modal_3" onClick={() => setModalOpen2(true)}>Settings</label>
                </a></li>
                <li onClick={(logout)}><a>Log Out</a></li>
              </ul>
            </div>
          </div>
        ) : (
          <div className='btn btn-primary text-white rounded-3xl px-1'>
            <label htmlFor="my_modal_1">
              <div className='mx-2'>
                Log In
              </div>
            </label>
          </div>
        )}

        <input type="checkbox" id="my_modal_1" className="modal-toggle" checked={modalOpen} onChange={() => setModalOpen(!modalOpen)} />
        <div className={`modal ${modalOpen ? 'open' : ''} top-[-1rem]`}>
          <div className="modal-box">
            <div className='flex flex-col space-y-3'>
              <h3 className="text-lg text-center font-bold">Log In</h3>
              <input type="email" placeholder="example@mail.com"
                className="input input-bordered input-primary w-full"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
              <input type="password" placeholder="********"
                className="input input-bordered input-primary w-full"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Remember me</span>
                  <input type="checkbox" checked={checked} onChange={() => setChecked(!checked)} className="checkbox checkbox-primary" />
                </label>
              </div>
              <button className="btn btn-primary" onClick={signUp}>Sign In</button>
              <button className="btn btn-outline btn-primary" onClick={signUpGoogle}>Sign Google</button>
            </div>
          </div>
          <label className="modal-backdrop" htmlFor="my_modal_1">Close</label>
        </div>

        <input type="checkbox" id='my_modal_3' className='modal-toggle' />
        {modalOpen2 && (
          <div className='modal top-[-1rem]'>
            <div className='modal-box'>
              <div className='flex flex-col space-y-3'>
                test modal
              </div>
            </div>
            <label className='modal-backdrop' htmlFor="my_modal_3" onClick={() => setModalOpen2(false)}>Close</label>
          </div>
        )}
      </div>
    </div>
  )
}

export default Navbar


