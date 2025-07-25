import useUploadComponent from "../hooks/useUploadComponent";

interface UploadPdfComponentProps {
  onUploadSuccess?: (file: File, fileName: string, fileSize: string) => void;
}

/**
 * UploadPdfComponent - A React component for uploading PDF files with drag-and-drop support
 *
 * This component provides a modern, interactive interface for PDF file uploads with:
 * - Drag and drop functionality
 * - File validation (PDF only, 10MB limit)
 * - Progress tracking during upload
 * - Error handling and retry mechanisms
 * - Real-time upload status monitoring
 *
 * @param {UploadPdfComponentProps} props - Component props
 * @param {Function} [props.onUploadSuccess] - Callback function called when upload completes successfully
 * @returns {JSX.Element} The rendered upload component
 */
function UploadPdfComponent({ onUploadSuccess }: UploadPdfComponentProps) {
  const {
    uploadState,
    isDragOver,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileInputChange,
    handleBrowseClick,
    simulateUpload,
    resetUpload,
    fileInputRef,
  } = useUploadComponent(
    onUploadSuccess as (file: File, fileName: string, fileSize: string) => void
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-xl opacity-30 animate-pulse"></div>
            <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-4">
            PDF Document Upload
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Transform your PDF documents with our advanced processing system.
            Upload one file at a time - you can replace it anytime.
          </p>
        </div>

        {/* Main Upload Card */}
        <div className="relative">
          {/* Background Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-indigo-400/20 rounded-3xl blur-3xl"></div>

          <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
            {/* Upload Area */}
            <div
              className={`relative border-3 border-dashed rounded-2xl p-12 text-center transition-all duration-500 ease-out transform ${
                isDragOver
                  ? "border-blue-400 bg-gradient-to-br from-blue-50 to-purple-50 scale-105 shadow-xl"
                  : uploadState.error
                  ? "border-red-300 bg-gradient-to-br from-red-50 to-pink-50"
                  : "border-gray-200 hover:border-blue-300 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 hover:scale-[1.02]"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {/* Animated Upload Icon */}
              <div className="mb-8 relative">
                <div
                  className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center transition-all duration-500 ${
                    uploadState.error
                      ? "bg-gradient-to-br from-red-400 to-red-600 shadow-lg shadow-red-200"
                      : isDragOver
                      ? "bg-gradient-to-br from-blue-400 to-purple-600 shadow-lg shadow-blue-200 scale-110"
                      : "bg-gradient-to-br from-gray-300 to-gray-400 shadow-lg"
                  }`}
                >
                  <svg
                    className={`w-12 h-12 transition-all duration-300 ${
                      uploadState.error
                        ? "text-white animate-pulse"
                        : "text-white"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>

                {/* Floating particles effect */}
                {!uploadState.isUploading &&
                  !uploadState.error &&
                  !uploadState.hasFile && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-4 left-8 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
                      <div className="absolute top-8 right-6 w-1 h-1 bg-purple-400 rounded-full animate-ping animation-delay-1000"></div>
                      <div className="absolute bottom-6 left-12 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping animation-delay-2000"></div>
                    </div>
                  )}
              </div>

              {/* Upload Text */}
              <div className="mb-8">
                <h3
                  className={`text-2xl font-bold mb-3 transition-all duration-300 ${
                    uploadState.error
                      ? "text-red-600"
                      : uploadState.hasFile
                      ? "text-blue-600"
                      : "text-gray-800"
                  }`}
                >
                  {uploadState.error
                    ? "Upload Failed"
                    : uploadState.hasFile
                    ? "File Selected - Ready to Upload"
                    : "Choose a PDF file or drag it here"}
                </h3>
                <p
                  className={`text-base transition-all duration-300 ${
                    uploadState.error
                      ? "text-red-500"
                      : uploadState.hasFile
                      ? "text-blue-600"
                      : "text-gray-600"
                  }`}
                >
                  {uploadState.error
                    ? uploadState.error
                    : uploadState.hasFile
                    ? 'Click "Upload File" to proceed or drag a new file to replace'
                    : "Maximum file size: 10MB • Supported format: PDF only • Single file upload"}
                </p>
              </div>

              {/* File Info Card */}
              {uploadState.fileName && (
                <div className="mb-8 p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="text-left">
                        <p className="text-lg font-semibold text-gray-900 truncate max-w-xs">
                          {uploadState.fileName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {uploadState.fileSize}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Enhanced Progress Bar */}
              {uploadState.isUploading && (
                <div className="mb-8">
                  <div className="flex justify-between text-sm font-medium text-gray-700 mb-3">
                    <span className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                      Uploading...
                    </span>
                    <span className="font-bold">
                      {Math.round(uploadState.progress)}%
                    </span>
                  </div>
                  <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${uploadState.progress}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {!uploadState.isUploading && !uploadState.hasFile && (
                  <button
                    onClick={handleBrowseClick}
                    className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Browse Files
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-indigo-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                )}

                {!uploadState.isUploading && uploadState.hasFile && (
                  <>
                    <button
                      onClick={handleBrowseClick}
                      className="group relative px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white rounded-xl font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
                    >
                      <span className="relative z-10 flex items-center justify-center">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                        Replace File
                      </span>
                    </button>
                    <button
                      onClick={simulateUpload}
                      className="group relative px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300"
                    >
                      <span className="relative z-10 flex items-center justify-center">
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        Upload File
                      </span>
                    </button>
                  </>
                )}

                {uploadState.error && (
                  <button
                    onClick={resetUpload}
                    className="group relative px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300"
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      Try Again
                    </span>
                  </button>
                )}
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadPdfComponent;
