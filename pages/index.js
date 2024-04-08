import React from "react";
import Link from "next/link";

import { FaTruck, FaUsers } from 'react-icons/fa';
import { MdPlace } from 'react-icons/md';
import { AiOutlineShop } from 'react-icons/ai';

export default function Home({ router }) {

  return (
    <>
      <section className="text-gray-400 bg-black body-font py-16">
        <div className="container mx-auto flex px-5 py-7 md:py-32 md:flex-row flex-col items-center">
          <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
            <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-white">Buy them
              <br /> Before they sold out
            </h1>
            {/* <p className="mb-5 text-justify leading-relaxed">Here you can find the products of your niche. Have a look on the product. Product for men, women, kids and some other accessories are available here in the store.</p> */}
          </div>
          <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
            <img className="object-cover object-center" alt="hero" src={"https://images.pexels.com/photos/347926/pexels-photo-347926.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"} width={720} height={600} />
          </div>
        </div>
      </section>

      <section className="text-gray-600 body-font">
        <div className="container px-5 py-16 mx-auto">
          <div className="flex flex-wrap -m-4 text-center">
            <div className="p-4 md:w-1/4 sm:w-1/2 w-full">
              <div className="border-2 border-gray-800 px-4 py-6 rounded-lg">
                <div className="flex justify-center py-2">
                  <FaTruck className="text-indigo-700 text-5xl" />
                </div>
                <h2 className="title-font font-medium text-3xl">99+</h2>
                <p className="leading-relaxed">Orders Completed</p>
              </div>
            </div>
            <div className="p-4 md:w-1/4 sm:w-1/2 w-full">
              <div className="border-2 border-gray-800 px-4 py-6 rounded-lg">
                <div className="flex justify-center py-2">
                  <FaUsers className="text-indigo-700 text-5xl" />
                </div>
                <h2 className="title-font font-medium text-3xl">1.3k+</h2>
                <p className="leading-relaxed">Happy Customers</p>
              </div>
            </div>
            <div className="p-4 md:w-1/4 sm:w-1/2 w-full">
              <div className="border-2 border-gray-800 px-4 py-6 rounded-lg">
                <div className="flex justify-center py-2">
                  <AiOutlineShop className="text-indigo-700 text-5xl" />
                </div>
                <h2 className="title-font font-medium text-3xl">2.7k+</h2>
                <p className="leading-relaxed">Products</p>
              </div>
            </div>
            <div className="p-4 md:w-1/4 sm:w-1/2 w-full">
              <div className="border-2 border-gray-800 px-4 py-6 rounded-lg">
                <div className="flex justify-center py-2">
                  <MdPlace className="text-indigo-700 text-5xl" />
                </div>
                <h2 className="title-font font-medium text-3xl">50+</h2>
                <p className="leading-relaxed">Places</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
