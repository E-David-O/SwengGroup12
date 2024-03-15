import axios from 'axios';
import { useState, useContext} from 'react';
import {Link } from 'react-router-dom';
import { VideoContext } from './VideoUtil';
import Navbar from './Navbar';

export default function Signup() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const {setToken} = useContext(VideoContext);
    const handleSubmit = (e) => {
        e.preventDefault();
        if(username && password) {
            const formData = new FormData();
            formData.append("username", username);
            formData.append("password", password);
            axios({
                method: 'post',
                url: "http://localhost:8000/auth/register",
                data: formData,
                headers: {'Content-Type': 'multipart/form-data' }
            })
            .then((response) => {
                console.log("Video uploaded");
                setToken(response.data.username);
                })
            .catch(function (error) {
                // handle error
                console.log(error);
            }); 
        }
    }
    return (
        <>
        <Navbar/>
       
        <div className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Sign Up to create your account
                    </h1>
                    <form>
                        <div>
                            <label htmlFor="inputUsername" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" >Username</label>
                            <input 
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"  
                            id="inputUsername" 
                            name="username" 
                            placeholder="Enter Username"
                            onChange={(e) => setUsername(e.target.value)}
                            ></input>
                        </div>
                        <div >
                            <label htmlFor="inputPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                            <input 
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            id="inputPassword" 
                             name="password" 
                             placeholder="••••••••"
                             onChange={(e) => setPassword(e.target.value)}
                            ></input>
                        </div>
                        <button onClick={(e) => handleSubmit(e)}id="submit-button" type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign Up</button>
                       </form>
                    
                        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                            Already have an account?  <Link to="/login" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign In</Link>
                        </p>
                    
                </div>
            </div>
        </div>
        </div>
        </>
    )
}