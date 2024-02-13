import React, { useState } from "react";
import Input from "../../componats/input";
import Button from "../../componats/button";
import { useNavigate } from "react-router-dom";

const Form = ({ isSignInPage = false }) => {
  const [data, setData] = useState({
    ...(!isSignInPage && {
      fullName: "",
    }),
    email: "",
    password: "",
  });

  const handleSubmit = async(e) => {
    console.log('data :>> ', data);
    e.preventDefault()
    const res = await fetch(`http://localhost:8000/api/auth/${isSignInPage ? 'login' : 'register'}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    if(res.status === 400) {
        alert('Invalid credentials')
    }else{
        const resData = await res.json()
        console.log(resData)
        if(resData.success) {
            // localStorage.setItem('user:token', resData.token)
            // localStorage.setItem('user:detail', JSON.stringify(resData.user))
           alert('User created !')
           navigate('/users/sign_in')
        }
        if(resData.token) {
          localStorage.setItem('user:token', resData.token)
          localStorage.setItem('user:detail', JSON.stringify(resData.user))
          navigate('/')
      }
    }
}


  const navigate = useNavigate();
  return (
    <div className="bg-[#edf3fc] h-screen flex justify-center items-center">
      <div className="  bg-white w-[600px] h-[800px] shadow-lg rounded-lg flex flex-col justify-center items-center ">
        <div className="text-4xl font-extrabold mb-8">
          welcome {isSignInPage && "Back"}
        </div>
        <div className="text-2xl font-light mb-3">
          {isSignInPage ? "Sign in to get explored" : "Sign up to get started"}
        </div>
        <form
          className="flex flex-col items-center w-full"
          onSubmit={(e) => handleSubmit(e)}
        >
          {!isSignInPage && (
            <Input
              label="Full name"
              name="name"
              placeholder="Enter your full name"
              className="mb-6 w-[75%]"
              value={data.fullName}
              onChange={(e) => setData({ ...data, fullName: e.target.value })}
            />
          )}
          <Input
            label="Email address"
            type="email"
            name="email"
            placeholder="Enter your email"
            className="mb-6 w-[75%]"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="Enter your Password"
            className="mb-14 w-[75%]"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />
          <Button
            label={isSignInPage ? "Sign in" : "Sign up"}
            type="submit"
            className="w-[75%] mb-2"
          />
        </form>
        <div>
          {isSignInPage ? "Didn't have an account?" : "Alredy have an account?"}
          <span
            className=" text-primary cursor-pointer underline ml-2"
            onClick={() =>
              navigate(`/users/${isSignInPage ? "sign_up" : "sign_in"}`)
            }
          >
            {isSignInPage ? "Sign up" : "Sign in"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Form;
