import './App.scss';
import React, { useEffect, useState } from "react";
import { apiPostCall } from "../../utilities/siteApi"
import { useNavigate } from "react-router";

const LoginPage = () => {
    const navigate = useNavigate();
    const [attributes, setAttributes] = useState({
        email: "",
        password: ""
    });
    
    useEffect(() => {
        const userDetails = localStorage.getItem("userDetails");
        // If user already logged in then don't showing him login page ..
        if(userDetails) {
            navigate("/transaction");
            return;
        }
    }, [])

    const handleLogin = () => {
        if(!attributes.email) {
            alert("Email field is mandatory!");
            return;
        }
        if(!attributes.password) {
            alert("Password field is mandatory!");
            return;
        }

        let obj = {
            email: attributes.email,
            password: attributes.password
        };

        apiPostCall('/user/login', obj).then((res) => {
            console.log(res);
            if(res.data.data) {
                console.log("response is ", res.data.data);
                localStorage.setItem('userDetails', JSON.stringify(res.data.data));
                alert("logged in succesfully!");
                navigate("/transaction")
            }
        })
        console.log(obj);
    };
    
    return (
        <>
            <section className='main-section'>
                <div className='main-div'>
                    <div className='title'>
                        <h2> Flagright</h2>
                    </div>
                    <div className='welcome'>
                        <h3>Welcome</h3>
                    </div>
                    <div className='console-message'>
                        <h4>Log in to continue to Flagright Console.</h4>
                    </div>
                    <div className='email'>
                        <input type='text'
                         placeholder='email'
                         onChange={(e) => setAttributes((prev) => ({ ...prev, email: e.target.value }))}
                         />
                    </div>
                    <div className='password'>
                        <input type='password'
                         placeholder='password'
                         onChange={(e) => setAttributes((prev) => ({ ...prev, password: e.target.value }))}
                         />
                    </div>
                    <button type='submit'
                     className='submit-btn'
                     onClick={handleLogin}
                    >continue</button>
                </div>
            </section>
        </>
    )
}

export default LoginPage