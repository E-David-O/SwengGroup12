import { useContext } from "react";
import { VideoContext } from "./VideoUtil";
import {Link, useLocation} from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
function SelectorComparison() {
    const test = useLocation();
    const title = decodeURI(test.pathname.split("/").slice(-1).toString() + test.search);
    const { resultList } = useContext(VideoContext);
    const totalResults = resultList.find((r) => r.name === title) || {}; // Ensure results is an array
    const results = totalResults.results || [];
    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="flex flex-col justify-center gap-4 m-4">
                <div>
                    {results.length !== 0 ? (
                        <>
                            {results.map((result, index) => (
                                <div key={index} className="w-full md:max-w-lg mx-auto bg-slate-200 p-6 mb-2 rounded-xl shadow-lg flex items-center space-x-4">
                                    <img 
                                        src={`data:image/jpeg;base64,${result.frames[0].image}`} 
                                        alt={result.selector}
                                        className="object-cover w-48 h-48 rounded-lg shadow-sm"
                                    />
                                    <div className="flex flex-col justify-between space-y-2">
                                        <p className="text-2xl font-semibold text-blue-500">
                                            {result.selector} 
                                        </p>
                                        <p className="text-2xl font-semibold text-gray-800">
                                            {result.frames.length} frames analysed
                                        </p>
                                        <p className="text-2xl font-semibold text-gray-800">
                                            Frame Selection: <br></br>{result.run_time.toFixed(2)} seconds
                                        </p>
                                        <p className="text-2xl font-semibold text-gray-800">
                                            Frame Analysis: <br></br>{result.analysis_time.toFixed(2)} seconds
                                        </p>
                                        <p className="text-2xl font-bold text-gray-800">
                                            Total: <br></br>{(result.run_time + result.analysis_time).toFixed(2)} seconds
                                        </p>

                                        <div className="flex space-x-2">
                                            <Link 
                                                to={`/analysis/${result.selector}/${totalResults.name}`}
                                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                                            >
                                                Analytics
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : (
                        <p>No results</p>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}



export default SelectorComparison;