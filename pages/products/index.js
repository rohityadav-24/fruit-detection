import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

const Index = ({ name, response }) => {

  const getColor = (color) => {
    return (color === "black" || color === "white") && `bg-${color}` || `bg-${color}-500`;
  }

  return (
    <>
      <Head>
        <title>All Products | {name}</title>
      </Head>
      <section className="text-gray-600 body-font min-h-screen">
        <div className="container px-5 py-10 mx-auto">
          <div className="flex flex-wrap -m-4 justify-center">
            {Object.keys(response.data).length ? Object.keys(response.data).map((item) => {
              return <Link href={`/product/${response.data[item].slug}`} key={response.data[item]._id}>
                <div className="lg:w-1/5 md:w-1/2 w-full m-5 shadow-lg p-4 cursor-pointer">
                  <a className="block relative overflow-hidden">
                    <img alt="ecommerce" className="m-auto h-[30vh] md:h-[30vh] block" src={response.data[item].image} />
                  </a>
                  <div className="mt-4">

                    <h2 className="text-gray-900 title-font text-lg font-medium">{response.data[item].title}</h2>

                    {response.data[item].availableQuantity > 0 ? <>
                      <p className="mt-1">₹{response.data[item].price}</p>
                      <div className='mt-2'>
                        {response.data[item].color.map((color, indc) => {
                          return <>
                            {color && <button key={indc} className={`border-2 border-gray-300 ml-1 rounded-full w-6 h-6 focus:outline-none ${getColor(color)}`}></button>}
                          </>
                        })}
                      </div>

                      <div className='mt-2'>
                        {response.data[item].size.map((size) => {
                          return size && <span key={size} className='border border-gray-400 p-1 mr-1'>{size}</span>
                        })}
                      </div></> : <div className='mt-2 mx-auto'>
                      <p className=' text-red-500 mt-2 font-bold text-center md:text-left'>Out of Stock</p>
                    </div>}
                  </div>
                </div>
              </Link>
            }) : <h1 className='font-bold mx-10 my-20 text-center'>Sorry all the items are currently out of stock. New stock is coming soon. Stay Tuned!</h1>}
          </div>
        </div>
      </section>
    </>
  )
}

export default Index;

export async function getServerSideProps() {
  const req = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/products/get`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    }
  });
  const res = await req.json();

  let prods = {};
  for (let item of res.data) {
    if (item.title in prods) {
      if (item.availableQuantity > 0) {
        !prods[item.title].color.includes(item.color) ? prods[item.title].color.push(item.color) : null;
        !prods[item.title].size.includes(item.size) ? prods[item.title].size.push(item.size) : null;
      }
    } else {
      prods[item.title] = JSON.parse(JSON.stringify(item));
      if (item.availableQuantity > 0) {
        prods[item.title].color = [item.color];
        prods[item.title].size = [item.size];
      } else {
        prods[item.title].color = [];
        prods[item.title].size = [];
      }
    }
  }

  return {
    props: {
      response: { data: JSON.parse(JSON.stringify(prods)) }
    },
  };
}