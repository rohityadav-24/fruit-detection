import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Error from 'next/error';

const Slug = ({ name, router, tst, response, buyNow, addToCart }) => {
  const { slug } = router.query;
  const [pin, setPin] = useState();
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');

  useEffect(() => {
    if (!response.error) {
      setColor(response.product.color);
      setSize(response.product.size);
    }
  }, [response]);

  const checkPincode = async (e) => {
    e.preventDefault();
    let pins = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/pincode`);
    let pinData = await pins.json();
    if (pin) {
      if (Object.keys(pinData).includes(pin)) {
        tst('Congo! This area is deliverable!', 'success');
      } else {
        tst('Sorry! Area is not deliverable!', 'error');
      }
      setPin('');
    }
  }

  const onChangePin = (e) => {
    setPin(e.target.value);
  }

  const refreshVariant = (newSize, newColor) => {
    let url = `/product/${response.variants[newColor][newSize]['slug']}`;
    router.push(url);
  }

  const added = () => {
    tst('Product added to cart!', 'success');
    setTimeout(() => {
      router.push('/cart');
    }, 1500);
  }

  const getColor = (color) => {
    return (color === "black" || color === "white") && `bg-${color}` || `bg-${color}-500`;
  }

  if (response.error)
    return <Error statusCode={response.error} />

  return (
    <>
      <Head>
        <title>{response.product.title} | {name}</title>
      </Head>
      <section className="text-gray-600 body-font overflow-hidden min-h-screen">
        <div className="container px-5 py-10 mx-auto">
          <div className="lg:w-4/5 mx-auto flex flex-wrap">
            <div className='w-full md:w-1/2 p-10 flex justify-center items-center'>
              <img alt="ecommerce" className="lg:h-auto md:h-64  object-cover object-center" src={response.product.image} />
            </div>
            <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
              <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">{response.product.title}</h1>
              <hr className='my-2' />

              {response.product.availableQuantity > 0 ? <>
                <div className="flex justify-between mt-5">
                  <span className="title-font font-medium text-2xl text-gray-900">₹{response.product.price}</span>
                  <div className="flex justify-between">
                    <button onClick={() => { buyNow(slug, 1, response.product.price, response.product.title, size, color, response.product.image, response.product.seller_id) }} className="flex text-black border bg-white border-black py-2 px-6 focus:outline-none hover:text-white hover:bg-black">Buy Now</button>
                    <button onClick={() => { addToCart(slug, 1, response.product.price, response.product.title, size, color, response.product.image, response.product.seller_id); added(); }} className="flex ml-3 text-white bg-black border-0 py-2 px-6 focus:outline-none hover:bg-gray-800">Add to Cart</button>
                  </div>
                </div>
              </> : <div className='mt-2 mx-auto'>
                <p className='text-red-500 title-font font-medium text-xl md:text-xl'>Out of Stock</p>
              </div>}
              <form onSubmit={checkPincode} className="flex my-5 justify-between">
                <input type="text" onChange={onChangePin} value={pin} placeholder="Enter Your Pincode" className='border border-gray-300 bg-gray-100 mr-3 focus:outline-none px-3 py-2 w-full' />
                <button type="submit" className="text-white bg-black border-0 py-2 px-6 focus:outline-none hover:bg-gray-800">Check</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Slug;

export async function getServerSideProps(context) {
  let error = null;
  const req = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/products/get`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: { slug: context.query.slug } })
  });
  const res = await req.json();

  if (res.data == null) {
    return {
      props: {
        response: {
          error: 404
        }
      }
    }
  }

  const req2 = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/products/get`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: { title: res.data[0].title, type: res.data[0].type } })
  });
  const res2 = await req2.json();

  let colorSizeSlug = {}
  for (let item of res2.data) {
    if (Object.keys(colorSizeSlug).includes(item.color)) {
      colorSizeSlug[item.color][item.size] = { slug: item.slug };
    } else {
      colorSizeSlug[item.color] = {};
      colorSizeSlug[item.color][item.size] = { slug: item.slug };
    }
  }

  return {
    props: {
      response: {
        error,
        product: JSON.parse(JSON.stringify(res.data[0])),
        variants: JSON.parse(JSON.stringify(colorSizeSlug))
      }
    }
  }
}