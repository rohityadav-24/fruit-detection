import React, { useState } from 'react';
import axios from 'axios';

import { Button, TextField } from "@mui/material";

export default function ImageUpload({ value }) {
  const [uploaded, setUploaded] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = async (event) => {
    setMessage("");

    const data = event.target.files[0];

    const formData = new FormData();
    formData.append('file', data);

    if (data === undefined) {
      return;
    }

    const response = await axios.post(`${process.env.NEXT_PUBLIC_FDAPI_URL}/detect`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data.result === false) {
      setMessage("Apple is not fresh");
      return;
    }

    if (response.data.result === "na") {
      setMessage("Please upload an apple image");
      return;
    }

    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_PRESET as string);

    const res = await axios.post(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, formData);

    setUploaded(true);
    setMessage("Apple is fresh.");

    return res.data.secure_url;
  };

  return (
    <>
      <TextField type="file" />
      {/* <Button
          // type="button"
          variant="contained"
        >
          <input type="file" name="image" onChange={handleChange} />
        </Button> */}
      {message && <p className="text-sm text-destructive mt-2">{message}</p>}
    </>
  );
}
