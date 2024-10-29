import { Link } from "react-router-dom";
import Ani from "./ani";


export default function Home() {
    return (
        
        <div className="mx-auto sm:h-[550px]">
            
            
            <aside className=" center text-center relative overflow-hidden text-black rounded-lg  mx-2 h-[70%] sm:py-16">
            <h2 className="text-4xl font-bold sm:text-5xl text-white uppercase">
                            <div className="sm:pt-20"><span className="text-white text-6xl font-bold  uppercase ">Stress Detection
                             </span><span className="text-black/40 text-6xl font-bold uppercase"> using Text.</span></div>
                        </h2>
            </aside>
            <Link to="/App">
            <div className="  flex center  items-center justify-center ">
                <button className=" bg-white/0 focus:outline-none w-48 h-12 rounded-md  hover:shadow-lg">
                    
                 Click to Analyze !</button>
            </div>
            </Link>
        </div>
        
    );
}