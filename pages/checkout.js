import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { BiPlusCircle, BiMinusCircle } from 'react-icons/bi';

const Checkout = ({ name, user, response, router, tst, cart, items, subTotal, addToCart, removeFromCart, clearCart }) => {
  const [form, setForm] = useState(response.data.data);
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    response && getPincode(response.data.data.pincode);
  }, [response]);

  useEffect(() => {
    if ((form.name && form.name.length > 2) &&
      (form.mobile && form.mobile.toString().length >= 10) &&
      (form.address && form.address.length > 2) &&
      (form.pincode && form.pincode.toString().length > 2) &&
      (form.city && form.city.length > 2))
      setDisabled(false);
    else
      setDisabled(true);
  }, [form]);

  const getPincode = async (pin) => {
    let pins = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/pincode`);
    let pinData = await pins.json();
    if (pin) {
      if (pinData[pin]) {
        setForm({
          ...form,
          pincode: pin,
          city: pinData[pin][0],
          state: pinData[pin][1]
        });
      } else {
        setForm({ ...form, pincode: pin, city: '', state: '' });
      }
    }
  }

  const handleChange = async (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
    if (e.target.name == "pincode" && e.target.value.length == 6) {
      getPincode(e.target.value);
    }
  }

  const initiatePayment = async () => {
    let ordID = Math.floor(Math.random() * Date.now()).toString().substring(0, 12);
    const data = {
      cart, subTotal, ordID,
      name: form.name,
      email: form.email,
      mobile: form.mobile,
      address: form.address,
      pincode: form.pincode.toString(),
      city: form.city,
      state: form.state,
      token: response.token
    };

    let req = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/payment/pre`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    let res = await req.json();

    if (res.type === "success") {
      var options = {
        key: res.key, // Enter the Key ID generated from the Dashboard
        amount: res.data.amount * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: "INR",
        name: name, //your business name
        description: "E-Commerce",
        order_id: res.data.paymentId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        handler: async (resp) => {
          const req = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/payment/post`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              razorpay_payment_id: resp.razorpay_payment_id,
              razorpay_order_id: resp.razorpay_order_id,
              razorpay_signature: resp.razorpay_signature,
            }),
          });
          const newRes = await req.json();
          tst(newRes.message, newRes.type);
          newRes.clearCart && clearCart();
          router.push(`/user/orders/${newRes.data}`);
        },
        prefill: {
          name: user.user.name || "User",
          email: user.user.email || "",
          contact: user.user.mobile || "",
        },
        theme: {
          color: "#4338CA",
        }
      };
      const razor = new window.Razorpay(options);
      razor.open();
      razor.on('payment.failed', function (response) {
        console.log(response.error.code);
        console.log(response.error.description);
        console.log(response.error.source);
        console.log(response.error.step);
        console.log(response.error.reason);
        console.log(response.error.metadata.order_id);
        console.log(response.error.metadata.payment_id);
      });
    } else {
      tst(res.message, res.type);
      if (res.type === "success")
        router.push(`/user/orders/${res.data._id}`)
    }
    res.cartClear && clearCart();
  }

  return (
    <>
      <Head>
        <title>Checkout | {name}</title>
        <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0" />
      </Head>

      <section className="text-gray-600 body-font relative min-h-screen">
        <div className="px-5 py-16 mx-auto">
          <div className="flex flex-col text-center w-full mb-12">
            <h1 className="sm:text-3xl text-2xl font-medium title-font text-gray-900">Delivery Address</h1>
          </div>
          <div className="lg:w-1/2 md:w-2/3 mx-auto">
            <div className="flex flex-wrap -m-2">
              <div className="p-2 md:w-1/2 w-full">
                <div className="relative">
                  <label htmlFor="name" className="leading-7 text-sm text-gray-600">Full Name</label>
                  <input onChange={handleChange} value={form.name || ""} type="text" id="name" name="name" className="w-full bg-gray-100 bg-opacity-50 border border-gray-300 focus:bg-white text-base outline-none text-gray-700 py-1 px-3 leading-8" />
                </div>
              </div>
              <div className="p-2 md:w-1/2 w-full">
                <div className="relative">
                  <label htmlFor="email" className="leading-7 text-sm text-gray-600">Email Address</label>
                  <input value={form.email || ""} type="email" id="email" name="email" className="w-full bg-gray-100 bg-opacity-50 border border-gray-300 text-base outline-none text-gray-700 py-1 px-3 leading-8" readOnly />
                </div>
              </div>
              <div className="p-2 md:w-1/2 w-full">
                <div className="relative">
                  <label htmlFor="mobile" className="leading-7 text-sm text-gray-600">Mobile Number</label>
                  <input onChange={handleChange} value={form.mobile || ""} type="text" id="mobile" name="mobile" className="w-full bg-gray-100 bg-opacity-50 border border-gray-300 focus:bg-white text-base outline-none text-gray-700 py-1 px-3 leading-8" />
                </div>
              </div>
              <div className="p-2 md:w-1/2 w-full">
                <div className="relative">
                  <label htmlFor="pincode" className="leading-7 text-sm text-gray-600">Pincode</label>
                  <input onChange={handleChange} value={form.pincode || ""} type="text" id="pincode" name="pincode" className="w-full bg-gray-100 bg-opacity-50 border border-gray-300 focus:bg-white text-base outline-none text-gray-700 py-1 px-3 leading-8" />
                </div>
              </div>
              <div className="p-2 w-full">
                <div className="relative">
                  <label htmlFor="address" className="leading-7 text-sm text-gray-600">Full Address</label>
                  <textarea onChange={handleChange} value={form.address || ""} type="text" id="address" name="address" className="w-full bg-gray-100 bg-opacity-50 border border-gray-300 focus:bg-white text-base outline-none text-gray-700 py-1 px-3 leading-8"></textarea>
                </div>
              </div>
              <div className="p-2 md:w-1/2 w-full">
                <div className="relative">
                  <label htmlFor="city" className="leading-7 text-sm text-gray-600">Town/City</label>
                  <input onChange={handleChange} value={form.city || ""} type="text" id="city" name="city" className="w-full bg-gray-100 bg-opacity-50 border border-gray-300 focus:bg-white text-base outline-none text-gray-700 py-1 px-3 leading-8" />
                </div>
              </div>
              <div className="p-2 md:w-1/2 w-full">
                <div className="relative">
                  <label htmlFor="state" className="leading-7 text-sm text-gray-600">State</label>
                  <input value={form.state || ""} type="text" id="state" name="state" readOnly className="w-full bg-gray-100 bg-opacity-50 border border-gray-300 text-base outline-none text-gray-700 py-1 px-3 leading-8" />
                </div>
              </div>

              <div className="p-2 w-full">
                <div className="relative">
                  <section className="text-gray-600 body-font overflow-hidden md:w-full">
                    <div className="container px-5 pb-20 pt-5 mx-auto">
                      <div className="-my-8 divide-y-2 divide-gray-100">
                        {Object.keys(cart).map((k) => {
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
                        }
                      </div>
                    </div>
                  </section>
                  <h1 className="sm:text-xl text-xl text-center font-medium text-gray-900 mb-5">SubTotal ({items} Items) : ₹{subTotal}</h1>
                </div>
              </div>

              <div className="p-2 w-full flex justify-between flex-col md:flex-row">
                <button onClick={initiatePayment} className="w-full mb-3 md:mb-0 md:me-3 flex justify-center mx-auto text-white bg-black border-0 py-2 px-8 focus:outline-none hover:bg-gray-800 text-lg">Pay Now</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Checkout

export async function getServerSideProps(context) {
  const cookies = context.req.headers.cookie;
  const cookie = cookies && cookies.split(';').map(cookie => cookie.split('=')).reduce((acc, [key, value]) => ({ ...acc, [key.trim()]: decodeURIComponent(value) }), {});
  const token = cookie && cookie['user'];

  if (!token)
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      },
    }

  const req = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/auth/get`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
  });
  const res = await req.json();

  return {
    props: {
      response: { data: res, token: token }
    },
  };
}