"use client";

import { db } from "@/lib/firebase";
import { collection, doc, getDoc } from "firebase/firestore";
import React, { use, useEffect } from "react";
import { Document } from "../page";
import { useSession } from "next-auth/react";
import TextEditor from "@/components/TextEditor";
import CustomFileViewer from "@/components/CustomFileViewer";

export default function DocumentEditor({ params }: { params: { id: string } }) {
  const session = useSession();
  const [document, setDocument] = React.useState<Document | null>(null);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const document = await getDocument(params.id, session.data?.userId);
        setDocument(document);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDocument();
  }, [params.id, session]);

  if (!document) {
    return <div>Loading...</div>;
  }

  switch (document.mimetype) {
    case "application/pdf":
      return (
        <iframe
          src={document.url}
          className="w-full h-screen"
          title={document.name}
        ></iframe>
      );

    case "image/jpeg":
    case "image/png":
    case "image/jpg":
    case "image/gif":
    case "image/webp":
      return (
        <img src={document.url} className="h-[50vh]" alt={document.name} />
      );

    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    case "application/msword":
      return (
        <TextEditor
          fileId={document.id}
          fileName={document.name}
          mimetype={document.mimetype}
          preUrl={document.url}
        />
      );
  }

  return <CustomFileViewer preUrl={document.url} />;
}

const getDocument = async (fileId: string, userId: string) => {
  try {
    const collectionRef = collection(db, "files");
    const docRef = doc(collectionRef, fileId);
    const firebaseDoc = await getDoc(docRef);

    // Check if the document exists
    if (!firebaseDoc.exists()) {
      throw new Error("Document not found");
    }

    // Build the fileInfo object
    const fileInfo: Document = {
      id: firebaseDoc.id, // Explicitly assign the document ID
      ...firebaseDoc.data(),
    } as Document;

    // Authorization check
    if (
      fileInfo.ownerId !== userId &&
      fileInfo.sharedWith?.indexOf(userId) === -1
    ) {
      throw new Error("You are not authorized to view this document");
    }

    return fileInfo;
  } catch (error) {
    console.error("Error fetching document:", error);
    throw error; // Re-throw the error to handle it in the caller function
  }
};
