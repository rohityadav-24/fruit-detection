import 'react-quill/dist/quill.snow.css';

import dynamic from "next/dynamic";
const ReactQuill = dynamic(import('react-quill'), { ssr: false })

const RichTextEditor = ({ value, changeFunction }) => {
  return (
    <ReactQuill
      value={value}
      onChange={changeFunction}
      modules={{
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'], // Text styling options
          [{ list: 'ordered' }, { list: 'bullet' }], // Lists
          [{ align: [] }], // Text alignment
          ['link'], // Links and images
          ['clean'], // Remove formatting
        ],
      }}
      formats={[
        'bold',
        'italic',
        'underline',
        'strike',
        'list',
        'bullet',
        'align',
        'link',
        'image',
      ]}
      placeholder="Write your message here..."
      theme="snow"
    />
  )
};

export default RichTextEditor;
