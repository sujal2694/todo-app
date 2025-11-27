import React, { useContext } from 'react'
import { Context } from '../context/context';

const Navbar = () => {
    const {setToken} = useContext(Context);
    const logOut = () => {
        localStorage.removeItem("token");
        setToken("");
    }
    return (
        <div className='flex items-center justify-between px-10 py-5 bg-white border-none shadow-sm'>
            <div className='w-[95vw] 2xl:w-[70vw] lg:2-[70vw] md:2-[80vw] m-auto flex items-center justify-between '>
                <div className='flex items-center justify-center gap-2'>
                    <div className='p-3 bg-blue-600 rounded-xl flex items-center justify-center text-3xl text-white'><i className='bx bx-check-circle'></i></div>
                    <div>
                        <h1 className='text-xl font-semibold'>My Todos</h1>
                        <p className='text-sm text-gray-400'><i className='bx bx-user'></i>  email</p>
                    </div>
                </div>

                <div className='flex items-center gap-2 cursor-pointer'>
                    <i className='bx bx-arrow-out-right-circle-half text-2xl font-light'></i>
                    <p onClick={logOut} className='text-md font-light cursor-pointer'>Sign Out</p>
                </div>
            </div>
        </div>
    )
}

export default Navbar
