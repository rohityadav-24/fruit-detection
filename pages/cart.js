import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

import { BiPlusCircle, BiMinusCircle } from 'react-icons/bi';

const Cart = ({ name, cart, subTotal, addToCart, removeFromCart, items, clearCart }) => {
  return (
    <>
      <Head>
        <title>Cart | {name}</title>
      </Head>
      <div className='flex lg:flex-row flex-col-reverse'>
        <section className="text-gray-600 body-font overflow-hidden md:w-full min-h-screen">
          <div className="container px-5 pb-20 pt-0 md:pt-20 mx-auto">
            <div className="-my-8 divide-y-2 divide-gray-100">

              {Object.keys(cart).length === 0 ? (
                <div className="py-24 md:py-10 flex items-center justify-center">
                  <h1 className="text-2xl font-medium text-gray-700 mb-2">Your cart is empty</h1>
                </div>
              ) : (
                Object.keys(cart).map((k) => {
                  return <div key={k} className="py-8 flex flex-wrap md:flex-nowrap">
                    <div className="md:w-64 w-full md:mb-0 mb-6 md:mr-5 flex-shrink-0 flex flex-col">
                      <img src={cart[k].image} width={400} height={260} alt={"Image"} />
                    </div>
                    <div className="md:flex-grow">
                      <h2 className="text-2xl font-medium text-gray-700 mb-2">{cart[k].name}</h2>
                      <h2 className="font-normal text-gray-500">Size : {cart[k].size}</h2>
                      <h2>Color : <span className={`capitalize ${(cart[k].variant === "black" || cart[k].variant === "white") ? `text-black` : `text-${cart[k].variant}-500`}`}></span>{cart[k].variant}</h2>
                      <p className="text-xl font-bold text-gray-900 title-font my-3">₹{cart[k].price}</p>
                      <p className="flex font-semibold justify-start align-baseline text-justify text-xl mt-2">
                        <BiMinusCircle onClick={() => { removeFromCart(k, 1, cart[k].price, cart[k].name, cart[k].size, cart[k].variant) }} className='mr-2 text-2xl cursor-pointer' />
                        {cart[k].qty}
                        <BiPlusCircle onClick={() => { addToCart(k, 1, cart[k].price, cart[k].name, cart[k].size, cart[k].variant) }} className='ml-2 text-2xl cursor-pointer' /></p>
                    </div>
                  </div>
                })
              )}

            </div>
          </div>
        </section>
        {items > 0 ? <section className="text-gray-600 body-font">
          <div className="container px-5 pt-20 pb-10 m-auto w-full">
            <div className="flex flex-wrap -m-4">
              <div className="p-4 m-auto w-full">
                <div className="bg-gray-100 lg:w-80 m-auto bg-opacity-75 p-8 overflow-hidden text-center">
                  <button onClick={clearCart} className="text-white bg-black border-0 py-2 px-6 focus:outline-none hover:bg-gray-800 text-lg w-full mb-5">Clear Cart</button>
                  <p className="leading-relaxed mb-3">SubTotal ({items} Items)</p>
                  <h1 className="title-font sm:text-2xl text-xl font-medium text-gray-900 mb-5">₹{subTotal}</h1>
                  <Link href={"/checkout"}>
                    <button className={`text-white bg-black border-0 py-2 px-6 focus:outline-none hover:bg-gray-800 text-lg w-full`}>Proceed to Buy</button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section> : null}
      </div >
    </>
  )
}

export default Cart