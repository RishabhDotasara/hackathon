import React from "react";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

const CustomFileViewer = ({ preUrl }: { preUrl: string }) => {
  let docs = [
    {
      uri: preUrl,
    },
  ];

  return (
    <div
      style={{ overflow: "hidden", position: "relative" }}
      className="h-screen"
    >
      {/* Render DocViewer */}
      <DocViewer
        prefetchMethod="GET"
        documents={docs}
        pluginRenderers={DocViewerRenderers}
      />
    </div>
  );
};

export default CustomFileViewer;
