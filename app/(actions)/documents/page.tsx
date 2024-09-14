'use client';

import { File, FileText, Image, Music, Video } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

type Document = {
  id: string;
  name: string;
  type: "file" | "document" | "image" | "audio" | "video";
  url: string;
};

// const documents: Document[] = [
//   {
//     id: "1",
//     name: "Project Proposal",
//     type: "document",
//     url: "/documents/proposal.pdf",
//   },
//   { id: "2", name: "Team Photo", type: "image", url: "/images/team.jpg" },
//   {
//     id: "3",
//     name: "Presentation Slides",
//     type: "file",
//     url: "/files/presentation.pptx",
//   },
//   {
//     id: "4",
//     name: "Meeting Recording",
//     type: "audio",
//     url: "/audio/meeting.mp3",
//   },
//   { id: "5", name: "Product Demo", type: "video", url: "/videos/demo.mp4" },
//   {
//     id: "6",
//     name: "Financial Report",
//     type: "document",
//     url: "/documents/finance.xlsx",
//   },
// ];

const getIcon = (type: Document["type"]) => {
  switch (type) {
    case "document":
      return <FileText className="w-6 h-6" />;
    case "image":
      return <Image className="w-6 h-6" />;
    case "audio":
      return <Music className="w-6 h-6" />;
    case "video":
      return <Video className="w-6 h-6" />;
    default:
      return <File className="w-6 h-6" />;
  }
};

export default function DocumentList() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const session = useSession();

  console.log(session);
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Documents</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {documents.map((doc) => (
          <Link
            key={doc.id}
            href={doc.url}
            className="flex items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 ease-in-out"
          >
            <div className="mr-4 text-gray-500">{getIcon(doc.type)}</div>
            <div>
              <h2 className="text-lg font-semibold">{doc.name}</h2>
              <p className="text-sm text-gray-500 capitalize">{doc.type}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
