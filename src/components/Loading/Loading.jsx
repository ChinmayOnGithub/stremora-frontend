// import React from 'react'

function Loading(props) {

  const { message = "Loading..." } = props

  return (
    <div className="flex justify-center items-center h-full text-white text-lg">
      <div>
        <h1 className="text-bold text-xl ">{message}</h1>
        <img src="/loader.svg" alt="loader animation" className="" />
      </div>
    </div>
  );
}

export default Loading