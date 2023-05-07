import React, { useRef, useState } from "react";
import logo from "./logo.svg";
import { upload } from "@spheron/browser-upload";
import "./Upload.css";

function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadLink, setUploadLink] = useState("");
  const [dynamicLink, setDynamicLink] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    setFile(selectedFile);
    setUploadLink("");
    setDynamicLink("");
  };

  const handleSelectFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("No file selected");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:8111/initiate-upload");
      const responseJson = await response.json();
      const uploadResult = await upload([file], {
        token: responseJson.uploadToken,
      });

      setUploadLink(uploadResult.protocolLink);
      setDynamicLink(uploadResult.dynamicLinks[0]);
    } catch (err) {
      alert(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        

        {isLoading ? (
          <>Uploading...</>
        ) : (
          <>
            <p>Upload Research Paper to IPFS</p>
            <div className="flex gap-32">
              <div className="">
                <div
                  className="btn btn-info m-4"
                  onClick={handleSelectFile}
                >
                  Select your research pdf
                  <input
                    id="file"
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="w-full h-full"
                    style={{ display: "none" }}
                  />
                </div>
                <div className="flex-1 flex items-center pl-4 text-sm m-4">
                  {file ? file?.name : "No file selected"}
                </div>
              </div>
              <div className="flex flex-col">
                <div
                  className="button-con btn btn-warning"
                  onClick={handleUpload}
                >
                  Upload
                </div>
                {uploadLink && (
                  <a
                    className="text-sm mt-4 "
                    href={uploadLink}
                    target="__blank"
                  >
                    {uploadLink}
                  </a>
                )}
                {dynamicLink && (
                  <a
                    className="text-sm mt-4 "
                    href={`https://${dynamicLink}`}
                    target="__blank"
                  >
                    {"now paste this link in the publish form"}
                  </a>
                )}
              </div>
            </div>
          </>
        )}
      </header>
    </div>
  );
}

export default Upload;
