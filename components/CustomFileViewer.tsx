import React from "react";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

const CustomFileViewer = ({
  preUrl,
  fileName,
}: {
  preUrl: string;
  fileName: string;
}) => {
  let docs = [
    {
      uri: preUrl,
      fileName,
    },
  ];

  return (
    <div
<<<<<<< HEAD
      style={{ overflow: "hidden", position: "relative" }}
      className="h-full"
=======
      style={{
        display: "flex",
        flexDirection: "column",
        height: "60vh",
        width: "60vw",
        overflow: "hidden",
      }}
>>>>>>> 2246a3467292f117292f6c1486c583ea001efad3
    >
      {/* Render DocViewer */}
      <DocViewer
        prefetchMethod="GET"
        documents={docs}
        pluginRenderers={DocViewerRenderers}
        style={{
          flex: 1,
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
};

export default CustomFileViewer;
