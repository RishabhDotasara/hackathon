"use client";

import React from "react";

export default function DocumentEditor({ params }: { params: { id: string } }) {
  const fileName = params.id;
  const fileType = fileName.split(".").pop();

  if (fileType === "pdf") {
    return (
      <iframe
        src={`/documents/${fileName}`}
        className="w-full h-screen"
        title={fileName}
      ></iframe>
    );
  } else if (fileType === "jpg" || fileType === "jpeg" || fileType === "png") {
    return (
      <img
        src={`/images/${fileName}`}
        alt={fileName}
        className="w-full h-screen object-contain"
      />
    );
  }

  return <div></div>;
}
