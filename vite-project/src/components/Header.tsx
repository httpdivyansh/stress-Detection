import React from 'react'
import { Link, } from 'react-router-dom'
function Header() {
  return (
    <header className="  sticky z-50 p-8 ">
            <nav className=" bg-[#2a999f] border-gray-200 rounded-md lg:px-6 py-2.5">
                <div className=" pl-4 flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                    <div className=' text-white text-[18px]  font-semibold font border-b-2'>
                        <Link
                        to=""
      
                        >
                            Stress Detection Analyzer

                        </Link>
                    </div>
                    <div className="flex items-center lg:order-2">
                        <Link
                            to="/login"
                            className="text-white   font-medium  text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
                        >
                            Log in
                        </Link>
                        <Link
                            to="/Signin"
                            className="text-white bg-orange-700 hover:bg-orange-800 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
                        >
                            Get started
                        </Link>
                    </div>
                   
                            
                        
                    
                </div>
            </nav>
        </header>
  )
}

export default Header