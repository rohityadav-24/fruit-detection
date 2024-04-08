import React, { useState } from 'react';
import Head from 'next/head';
import RichTextEditor from '../Components/RichTextEditor';

const Contact = ({ name, tst }) => {
  const [content, setContent] = useState('');

  const handleEditorChange = (value) => {
    setContent(value);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name: e.target.name.value,
      email: e.target.email.value,
      subject: e.target.subject.value,
      message: content,
      type: "SEND_MESSGAE"
    };
    const sub = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    let response = await sub.json();
    tst(response.message, response.type);

    e.target.name.value = "";
    e.target.email.value = "";
    e.target.subject.value = "";
    setContent("");
  }
  return (
    <>
      <Head>
        <title>Contact | {name}</title>
      </Head>
      <section className="text-gray-600 body-font relative">
        <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-center pt-10">Contact Us</h1>
        <div className="container px-5 pt-4 pb-10 mx-auto flex sm:flex-nowrap flex-wrap">
          <div className="lg:w-2/3 md:w-1/2 bg-gray-300 overflow-hidden sm:mr-10 p-10 flex items-end justify-start relative">
            <iframe width="100%" height="100%" className="absolute inset-0" title="map" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7504.476032031694!2d80.14749072690785!3d12.84047572532763!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5259af8e491f67%3A0x944b42131b757d2d!2sVellore%20Institute%20of%20Technology%20-%20Chennai!5e0!3m2!1sen!2sin!4v1712562851832!5m2!1sen!2sin" style={{ filter: "grayscale(1) contrast(1.2) opacity(0.4)" }}></iframe>
            <div className="bg-white relative flex flex-wrap py-6 w-full mx-auto shadow-md">
              <div className="lg:w-1/2 px-6">
                <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs">ADDRESS</h2>
                <p className="mt-1">VIT Chennai, <br /> Tamil Nadu,<br /> 600127, India</p>
              </div>
              <div className="lg:w-1/2 px-6 mt-4 lg:mt-0">
                <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs">EMAIL</h2>
                <a className="text-indigo-700 leading-relaxed">dummy@gmail.com</a>
                <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs mt-4">PHONE</h2>
                <p className="leading-relaxed">123-456-7890</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="lg:w-1/3 md:w-1/2 flex flex-col md:ml-auto w-full md:py-8 mt-8 md:mt-0">
            <h2 className="text-gray-900 text-lg mb-1 font-medium title-font uppercase">Send Message</h2>
            <p className="leading-relaxed mb-5 text-gray-600">If you are facing any problem, reach us out without any hesitation.</p>
            <div className="relative mb-4">
              <label htmlFor="name" className="leading-7 text-sm text-gray-600">Name</label>
              <input type="text" id="name" name="name" className="w-full bg-white border border-gray-300 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
            </div>
            <div className="relative mb-4">
              <label htmlFor="email" className="leading-7 text-sm text-gray-600">Email</label>
              <input type="email" id="email" name="email" className="w-full bg-white border border-gray-300 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
            </div>
            <div className="relative mb-4">
              <label htmlFor="subejct" className="leading-7 text-sm text-gray-600">Subject</label>
              <input type="text" id="subject" name="subject" className="w-full bg-white border border-gray-300 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
            </div>
            <div className="relative mb-4">
              <RichTextEditor value={content} changeFunction={handleEditorChange} />
              {/* <label htmlFor="message" className="leading-7 text-sm text-gray-600">Message</label>
              <textarea id="message" name="message" className="w-full bg-white border border-gray-300 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"></textarea> */}
            </div>
            <button className="text-white bg-black border-0 py-2 px-6 focus:outline-none hover:bg-gray-800 text-lg">Send Now</button>
          </form>
        </div>
      </section>
    </>
  )
}

export default Contact