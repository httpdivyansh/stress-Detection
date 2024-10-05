import { Link } from "react-router-dom";
import App from "../App";

export default function Home() {
    return (
        <div className="mx-auto sm:h-[550px]">
            <aside className="relative overflow-hidden text-black rounded-lg pr-80 mx-2 sm:py-16">
                <div className="relative z-10 max-w-screen-xl pl-0  mx-auto sm:px-6 lg:px-8">
                    <div className="sm:mt-1 mt-80 space-y-8 text-center sm:text-left sm:ml-auto pr-20">
                        <h2 className="text-4xl font-bold sm:text-5xl text-white uppercase">
                            <div className="sm:pt-20"><span className="text-white text-6xl font-bold  uppercase ">Stress Detection
                            using text </span><span className="text-teal-500 text-6xl font-bold uppercase">with a click of a button.</span></div>
                        </h2>
                    </div>
                </div>
                <div className="absolute inset-0 w-full sm:my-20 sm:pl-[700px]  sm:pt-20 pt-12 h-full">
                    <img className="sm:w-96 w-48" src="https://i.ibb.co/2M7rtLk/Remote1.png" alt="image2" />
                </div> 

            </aside>
            <Link to="/App">
            <div className="  flex center  items-center justify-center ">
                <button className=" bg-teal-500 w-48 h-12 rounded-md hover:border-2 hover:shadow-lg">
                    
                 Click to Analyze !</button>
            </div>
            </Link>
        </div>
        
    );
}