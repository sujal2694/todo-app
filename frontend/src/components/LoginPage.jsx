import React, { useContext, useState } from 'react'
import { Context } from '../context/context';
import toast from 'react-hot-toast';
import axios from 'axios'

const LoginPage = () => {

  const { url, currState, setCurrState, token, setToken } = useContext(Context);
  const [data, setData] = useState({
    email: "",
    password: ""
  })

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }))
  }

  const onLogin = async (event) => {
    event.preventDefault();
    let newUrl = url;
    if (currState === "Login") {
      newUrl += "/api/user/login"
    } else {
      newUrl += "/api/user/register"
    }
    const response = await axios.post(newUrl, data)
    if (response.data.success) {
      setToken(response.data.token)
      localStorage.setItem("token", response.data.token)
      toast.success("Login successfull")
    } else {
      toast.error(response.data.message)
    }
  }

  return (
    <div className='h-screen flex items-center justify-center'>
      <form onSubmit={onLogin} className='bg-white w-[450px] p-10 rounded-2xl shadow-2xl '>
        <div className='w-full flex items-center justify-center'>
          <div className='w-14 h-14 bg-blue-600 text-3xl text-white flex items-center justify-center rounded-full'><i className='bx bx-check-circle'></i></div>
        </div>

        <div className='w-full flex items-center justify-center flex-col gap-1.5 my-3'>
          <h1 className='text-3xl font-semibold'>Welcome Back</h1>
          <p className='text-sm text-gray-500'>Sign in to access your todos</p>
        </div>

        <div className='w-full my-2 flex items-start flex-col gap-10'>
          <div className='w-full h-12 '>
            <p className='flex items-center gap-1.5 mb-1'><i className='bx bx-envelope text-xl'></i> <span className='text-[14px]'>Email</span></p>
            <input name='email' value={data.email} onChange={onChangeHandler} type="email" placeholder='you@example.com' className='border border-gray-600/30 pl-5 text-md placeholder:text-sm w-full h-full rounded-md flex items-center cursor-pointer ' required />
          </div>

          <div className='w-full h-12 mb-2.5 '>
            <p className='flex items-center gap-1.5 mb-1'><i className='bx bx-lock text-xl'></i> <span className='text-[14px]'>Password</span></p>
            <input name='password' value={data.password} onChange={onChangeHandler} type="passw" placeholder='example@123' className='border border-gray-600/30 pl-5 text-md placeholder:text-sm w-full h-full rounded-md flex items-center cursor-pointer ' required />
            {currState === "Sign Up" ? <><span className='text-[12px] text-gray-400 '>Minimum 6 characters</span></> : <></>}

          </div>

        </div>

        {currState === "Sign Up" ? <><div className='w-full flex items-center justify-center mt-12'>
          <button type='submit' className='w-full bg-blue-600 text-white p-3 text-md font-semibold rounded-md cursor-pointer'>Create an account</button>
        </div></> : <><div className='w-full flex items-center justify-center mt-12'>
          <button type='submit' className='w-full bg-blue-600 text-white p-3 text-md font-semibold rounded-md cursor-pointer'>Sign In</button>
        </div></>}


        {currState === "Sign Up" ? <><p onClick={() => setCurrState("Login")} className='w-full text-center mt-5 text-sm text-blue-500 font-semibold tracking-wide cursor-pointer hover:underline'>Do you have an account? Sign In</p></> : <><p onClick={() => setCurrState("Sign Up")} className='w-full text-center mt-5 text-sm text-blue-500 font-semibold tracking-wide cursor-pointer hover:underline'>Don't have an account? Sign Up</p></>}


      </form>
    </div>
  )
}
export default LoginPage

