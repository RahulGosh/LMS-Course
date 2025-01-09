// import React, { useRef, useEffect } from "react";
// import Quill from "quill";
// import "quill/dist/quill.snow.css"; // Import Quill styles

// interface RichTextEditorProps {
//   input: CourseInputState;
//   setInput: React.Dispatch<React.SetStateAction<CourseInputState>>;
// }

// export interface CourseInputState {
//   courseTitle: string;
//   subTitle: string;
//   description: string;
//   category: string;
//   courseLevel: string;
//   coursePrice: string;
//   courseThumbnail: string | File;
// }

// const RichTextEditor: React.FC<RichTextEditorProps> = ({ input, setInput }) => {
//   const quillRef = useRef<HTMLDivElement>(null);
//   const quillInstanceRef = useRef<Quill | null>(null);

//   useEffect(() => {
//     if (quillRef.current && !quillInstanceRef.current) {
//       const quill = new Quill(quillRef.current, {
//         theme: "snow",
//         modules: {
//           toolbar: [
//             [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
//             [{ 'list': 'ordered' }, { 'list': 'bullet' }],
//             ['bold', 'italic', 'underline'],
//             ['link'],
//             [{ 'align': [] }],
//             ['clean'],
//           ],
//         },
//       });

//       quillInstanceRef.current = quill;

//       // Set initial content only if description is not empty
//       if (input.description) {
//         const delta = quill.clipboard.convert(input.description);
//         quill.setContents(delta);
//       }

//       // Handle content change and update input
//       quill.on("text-change", () => {
//         setInput({ ...input, description: quill.root.innerHTML });
//       });
//     }
//   }, [input.description, setInput]);

//   return <div ref={quillRef}></div>;
// };

// export default RichTextEditor;


import React from 'react'

interface RichTextEditorProps {
  input: CourseInputState;
  setInput: React.Dispatch<React.SetStateAction<CourseInputState>>;
}

export interface CourseInputState {
  courseTitle: string;
  subTitle: string;
  description: string;
  category: string;
  courseLevel: string;
  coursePrice: string;
  courseThumbnail: string | File;
}


const RichTextEditor = () => {
  return (
    <div>RichTextEditor</div>
  )
}

export default RichTextEditor