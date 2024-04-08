import React from 'react';
import Head from 'next/head';

const About = ({ name }) => {
  return (
    <>
      <Head>
        <title>About | {name}</title>
      </Head>
      <section className="text-gray-600 body-font">
        <div className="container mx-auto flex px-5 pt-20 pb-10 items-center justify-center flex-col">
          <img className="lg:w-2/6 md:w-3/6 w-5/6 object-cover object-center" alt="hero" src={"https://images.pexels.com/photos/34577/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"} width={720} height={400} />
          <div className="lg:w-2/3 w-full mt-10">
            <h1 className="title-font text-center sm:text-4xl text-3xl mb-4 font-medium text-gray-900">{name} : E-Commerce</h1>
            <p className="mb-4 leading-relaxed text-justify md:text-center">Welcome to our fruit detection app, where you can easily identify various fruits with utmost security and seamless functionality. Our developers have meticulously crafted this app with user convenience in mind, ensuring a smooth and hassle-free experience for all users. Whether you&apos;re purchasing fruits, checking their nutritional information, or simply exploring different varieties, our app is designed to cater to your needs effortlessly.</p>
            <p className="mb-4 leading-relaxed text-justify md:text-center">If you encounter any issues or have feedback to share, please don&apos;t hesitate to reach out to us via the contact form or through your preferred communication channel. Your satisfaction is our top priority, and we&apos;re here to ensure that your experience with our fruit detection app is nothing short of excellent.</p>
            <p className="mb-8 text-red-600 text-justify md:text-center"><b >CAUTION : </b>This is for testing purpose, the price of the product is not real. You cannot claim any of the product with the given price.</p>
          </div>
        </div>
      </section>

      <section className="text-gray-600 body-font">
        <div className="container px-5 pt-10 pb-20 mx-auto flex flex-wrap">
          <div className="flex w-full mb-10 flex-wrap">
            <h1 className="sm:text-3xl text-2xl font-medium title-font text-gray-900 lg:w-1/3 lg:mb-0 mb-4">Glimpses of {name}</h1>
            <p className="lg:pl-6 lg:w-2/3 mx-auto leading-relaxed text-base">Whatever you see here is just a glance of our products. If you like them check for more, we are waiting for you eagerly. See you soon.</p>
          </div>
          <div className="flex flex-wrap md:-m-2 -m-1">
            <div className="flex flex-wrap md:w-1/2">
              <div className="md:p-2 p-1 w-1/2">
                <img alt="gallery" className="w-full object-cover h-full object-center block" src={"https://images.pexels.com/photos/1425350/pexels-photo-1425350.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"} width={500} height={300} />
              </div>
              <div className="md:p-2 p-1 w-1/2">
                <img alt="gallery" className="w-full object-cover h-full object-center block" src={"https://images.pexels.com/photos/8771165/pexels-photo-8771165.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"} width={500} height={300} />
              </div>
              <div className="md:p-2 p-1 w-full">
                <img alt="gallery" className="w-full h-full object-cover object-center block" src={"https://images.pexels.com/photos/5945615/pexels-photo-5945615.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"} width={600} height={360} />
              </div>
            </div>
            <div className="flex flex-wrap md:w-1/2">
              <div className="md:p-2 p-1 w-full">
                <img alt="gallery" className="w-full h-full object-cover object-center block" src={"https://images.pexels.com/photos/8573839/pexels-photo-8573839.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"} width={600} height={360} />
              </div>
              <div className="md:p-2 p-1 w-1/2">
                <img alt="gallery" className="w-full object-cover h-full object-center block" src={"https://images.pexels.com/photos/13536246/pexels-photo-13536246.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"} width={500} height={300} />
              </div>
              <div className="md:p-2 p-1 w-1/2">
                <img alt="gallery" className="w-full object-cover h-full object-center block" src={"https://images.pexels.com/photos/5945786/pexels-photo-5945786.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"} width={500} height={300} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default About