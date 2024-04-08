import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head'
import Script from 'next/script';
import LoadingBar from 'react-top-loading-bar';
import Header from '../Components/Header'
import Footer from '../Components/Footer'
import '../styles/globals.css'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MyApp({ Component, pageProps }) {
  const name = "FDS";

  const router = useRouter();

  const [progress, setProgress] = useState(0)

  const [user, setUser] = useState({ token: null, user: null });
  const [key, setKey] = useState(Math.random());

  const [cart, setCart] = useState({});
  const [items, setItems] = useState(0);
  const [subTotal, setSubTotal] = useState(0);

  useEffect(() => {
    router.events.on('routeChangeStart', () => {
      setProgress(40)
    })
    router.events.on('routeChangeComplete', () => {
      setProgress(100)
    })
    try {
      if (localStorage.getItem('cart')) {
        setCart(JSON.parse(localStorage.getItem('cart')));
        saveCart(JSON.parse(localStorage.getItem('cart')));
      }
    } catch (error) {
      localStorage.clear();
    }

    // Check if the cookie is enabled
    if (!navigator.cookieEnabled)
      tst("Please enable cookies to use this website.", "error");

    // Check if the user is logged in
    if (document.cookie.includes("user") && document.cookie.split("user=")[1].split(";")[0].length > 0) {
      const data = document.cookie.split("user=")[1].split(";")[0];
      // get the user details
      const getUser = async () => {
        if (navigator.onLine) {
          const req = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/auth/get`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              token: data
            })
          });
          const res = await req.json();
          if (res.type === "success") {
            setUser({ user: res.data, token: data });
            setKey(Math.random());
          } else {
            setUser({ user: null, token: null });
            setKey(Math.random());
          }
        }
      }
      getUser();
    } else {
      setUser({ user: null, token: null });
      setKey(Math.random());
    }
  }, [router]);

  const logout = () => {
    document.cookie = "user=; path=/;";
    setUser({ token: null, email: null });
    setKey(Math.random());
    router.push("/");
  }

  const saveCart = (myCart) => {
    localStorage.setItem('cart', JSON.stringify(myCart));
    let total = 0;
    let item = 0;
    for (let key in myCart) {
      total += myCart[key].price * myCart[key].qty;
      item += myCart[key].qty;
    }
    setSubTotal(total);
    setItems(item);
  }

  const clearCart = () => {
    setCart({});
    saveCart({});
  }

  const buyNow = (itemCode, qty, price, name, size, variant, image) => {
    let newCart = {};
    newCart[itemCode] = { qty: 1, price, name, size, variant, image };
    setCart(newCart);
    saveCart(newCart);
    router.push('/checkout');
  }

  const addToCart = (itemCode, qty, price, name, size, variant, image) => {
    let newCart = cart;
    if (itemCode in cart) {
      newCart[itemCode].qty = cart[itemCode].qty + qty;
    } else {
      newCart[itemCode] = { qty: 1, price, name, size, variant, image };
    }
    setCart(newCart);
    saveCart(newCart);
  }

  const removeFromCart = (itemCode, qty, price, name, size, variant, image) => {
    let newCart = cart;
    if (itemCode in cart) {
      newCart[itemCode].qty = cart[itemCode].qty - qty;
    }
    if (newCart[itemCode].qty <= 0) {
      delete newCart[itemCode];
    }
    setCart(newCart);
    saveCart(newCart);
  }

  // Function for notifications
  const tst = (msg, type) => {
    const data = {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark"
    }
    if (type == "success")
      toast.success(`${msg}`, data);
    else
      toast.error(`${msg}`, data);
  }

  return <>
    <Head>
      <title>Home | {name}</title>
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/favicon.ico" />
      <link rel="shortcut icon" href="/favicon.ico" />
      <meta name="description" content="Homepage of ECOM" />
    </Head>
    <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script>

    <LoadingBar
      color='rgba(67, 56, 202, 1)'
      height={3}
      progress={progress}
      waitingTime={800}
      onLoaderFinished={() => setProgress(0)}
    />

    <ToastContainer
      position="bottom-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
    />

    {pageProps.statusCode !== 404 && pageProps.statusCode !== 500 && !router.asPath.includes("/auth") && !router.asPath.includes("/admin") && key && <Header name={name} user={user} logout={logout} />}
    <Component {...pageProps} tst={tst} router={router} name={name} user={user} logout={logout} cart={cart} subTotal={subTotal} items={items} addToCart={addToCart} removeFromCart={removeFromCart} clearCart={clearCart} buyNow={buyNow} />
    {pageProps.statusCode !== 404 && pageProps.statusCode !== 500 && !router.asPath.includes("/auth") && !router.asPath.includes("/admin") && <Footer name={name} tst={tst} />}
  </>
}

export default MyApp
