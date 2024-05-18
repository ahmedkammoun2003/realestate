import React from 'react'
import {Link} from 'react-router-dom'

export const SignUp = () => {
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form className='flex flex-col gap-4'>
        <input type="text" className='border p-3 rounded-lg ' id="username"  placeholder='username'/>
        <input type="email" className='border p-3 rounded-lg ' id="email"  placeholder='email'/>
        <input type="password" className='border p-3 rounded-lg ' id="password" placeholder="password"/>
        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>Sign up</button>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Already have an account?</p>
        <Link to={"/sign-in"}>
          <span className='text-blue-700'>Sign in</span>
        </Link>
      </div>
    </div>
  )
}
