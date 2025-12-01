import React, { useContext } from 'react'
import { Context } from '../context/context';

const Navbar = () => {
    const { setToken, userData } = useContext(Context);
    
    const logOut = () => {
        localStorage.removeItem("token");
        setToken("");
    }

    return (
        <div className='flex items-center justify-between px-10 py-5 bg-white border-none shadow-sm'>
            <div className='w-[95vw] 2xl:w-[70vw] lg:w-[70vw] md:w-[80vw] m-auto flex items-center justify-between'>
                <div className='flex items-center justify-center gap-2'>
                    <div className='p-3 bg-blue-600 rounded-xl flex items-center justify-center text-3xl text-white'>
                        <i className='bx bx-check-circle'></i>
                    </div>
                    <div>
                        <h1 className='text-2xl font-semibold'>My Todos</h1>
                        <div className='flex items-center gap-2'>
                            <i className='bx bx-user'></i>
                            <p className='text-sm'>
                                {userData?.email || userData?.name || 'Loading...'}
                            </p>
                        </div>
                        {userData?.name && (
                            <p className='text-xs text-gray-500'>
                                {userData.name}
                            </p>
                        )}
                    </div>
                </div>

                <div className='flex items-center gap-2 cursor-pointer bg-blue-500 text-white hover:text-black transition-colors w-fit lg:px-4 px-2 lg:py-2 py-2 rounded-md hover:bg-white hover:border-2 hover:border-blue-400'>
                    <i className='bx  bx-arrow-out-right-square-half text-2xl'></i> 
                    <p onClick={logOut} className='text-md font-light cursor-pointer'>
                        Sign Out
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Navbar