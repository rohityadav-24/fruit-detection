"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';

import { Button } from '@/components/admin/ui/button';
import Image from 'next/image';
import { Trash } from 'lucide-react';

interface ImageUploadProps {
  detect?: boolean;
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [errMessage, setErrMessage] = useState("");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onUpload = (result: any) => {
    onChange(result.secure_url);
  };

  if (!isMounted) {
    return null;
  }

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setErrMessage("");

    // @ts-ignore
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
      setErrMessage("Apple is not fresh");
      return;
    }

    if (response.data.result === "na") {
      setErrMessage("Please upload an apple image");
      return;
    }

    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_PRESET as string);

    const res = await axios.post(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, formData);

    onUpload(res.data);
    setUploaded(true);
  };


  return (
    <div>
      {uploaded && <div className="mb-4 flex items-center gap-4">
        {value.map((url) => (
          <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
            <div className="z-10 absolute top-2 right-2">
              <Button type="button" onClick={() => { onRemove(url); setUploaded(false); }} variant="destructive" size="sm">
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image
              fill
              className="object-cover"
              alt="Image"
              src={url}
            />
          </div>
        ))}
      </div>}

      {!uploaded && <>
        <Button
          type="button"
          disabled={disabled}
          variant="secondary"
        >
          <input type="file" name="image" onChange={handleChange} />
        </Button>
        {errMessage && <p className="text-sm text-destructive mt-2">{errMessage}</p>}
      </>}
    </div>
  );
}

export default ImageUpload;
