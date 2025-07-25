
import React, { useState, useRef, useCallback } from 'react';
import { apiService } from '../utils/apiService';
import { apiUrls } from '../constants/apiUrls';

interface UploadState {
  isUploading: boolean;
  progress: number;
  fileName: string;
  fileSize: string;
  error: string | null;
  hasFile: boolean; // Track if a file is currently selected
}

function useUploadComponent(onUploadSuccess: (file: File, fileName: string, fileSize: string) => void) {
    const [uploadState, setUploadState] = useState<UploadState>({
        isUploading: false,
        progress: 0,
        fileName: '',
        fileSize: '',
        error: null,
        hasFile: false
      });
      
      const [isDragOver, setIsDragOver] = useState(false);
      const fileInputRef = useRef<HTMLInputElement>(null);
      const currentFileRef = useRef<File | null>(null);
    
      /**
       * Formats file size in bytes to human-readable format
       * 
       * Converts bytes to appropriate units (Bytes, KB, MB, GB) with 2 decimal places
       * 
       * @param {number} bytes - File size in bytes
       * @returns {string} Formatted file size string (e.g., "2.5 MB")
       * 
       * @example
       * formatFileSize(1024) // returns "1 KB"
       * formatFileSize(1048576) // returns "1 MB"
       */
      const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
      };
    
      /**
       * Validates a file for upload requirements
       * 
       * Checks if the file is a PDF and under the 10MB size limit
       * 
       * @param {File} file - The file to validate
       * @returns {string | null} Error message if validation fails, null if valid
       * 
       * @example
       * validateFile(pdfFile) // returns null if valid
       * validateFile(largeFile) // returns "File size must be less than 10MB."
       */
      const validateFile = (file: File): string | null => {
        if (!file.type.includes('pdf')) {
          return 'Please upload a PDF file only.';
        }
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
          return 'File size must be less than 10MB.';
        }
        return null;
      };
    
      /**
       * Handles file selection and validation
       * 
       * Validates the selected file and updates the upload state accordingly.
       * If validation fails, sets an error message. If successful, stores the file
       * and updates the UI with file information.
       * 
       * @param {File} file - The selected file to process
       * 
       * @example
       * handleFileSelect(selectedFile) // Validates and updates state
       */
      const handleFileSelect = useCallback((file: File) => {
        const error = validateFile(file);
        if (error) {
          setUploadState(prev => ({ ...prev, error }));
          return;
        }
    
        currentFileRef.current = file;
        setUploadState(prev => ({
          ...prev,
          fileName: file.name,
          fileSize: formatFileSize(file.size),
          error: null,
          hasFile: true
        }));
      }, []);
    
      /**
       * Initiates the file upload process
       * 
       * Starts the upload progress simulation, sends the file to the backend,
       * and begins monitoring the upload status. Handles both successful uploads
       * and error cases.
       * 
       * @returns {Promise<void>} Promise that resolves when upload process completes
       * 
       * @example
       * await simulateUpload() // Starts upload process
       */
      const simulateUpload = async () => {
        setUploadState((uploadState)=> ({...uploadState, isUploading: true, progress: 0}));
        // start the upload bar
        const interval =  startUpload();
        // upload the file to the backend
        const response = await apiService.uploadPdf(currentFileRef.current as File);
        clearInterval(interval);
    
        if(response.documentId){
          checkTheFileStatus(response.documentId);
        }else{
        clearInterval(interval);
    
          setUploadState((uploadState)=> ({...uploadState, isUploading: false, progress: 0, error: "Upload failed"}));
        }
      };
    
      /**
       * Starts the upload progress simulation
       * 
       * Creates an interval that increments the progress bar by 10% every 400ms
       * until it reaches 90%. This provides visual feedback during the upload process.
       * 
       * @returns {NodeJS.Timeout} The interval ID for cleanup purposes
       * 
       * @example
       * const interval = startUpload() // Starts progress simulation
       * clearInterval(interval) // Stops simulation
       */
      const startUpload =  () => {
        const interval = setInterval(() => {
            setUploadState((prev) => {
              const nextProgress = prev.progress + 10;
              if (nextProgress >= 90) { 
                clearInterval(interval);
              }
              return { ...prev, progress: nextProgress };
            });
          }, 400); 
          return interval;
      }
    
      /**
       * Monitors the upload status by polling the backend
       * 
       * Checks the upload status every 5 seconds using the document ID.
       * If the status is "SUCCESS", calls the onUploadSuccess callback.
       * If it fails after 6 retries, shows an error message.
       * 
       * @param {string} documentId - The document ID returned from the upload API
       * @returns {NodeJS.Timeout} The interval ID for cleanup purposes
       * 
       * @example
       * const interval = checkTheFileStatus("doc123") // Starts status monitoring
       * clearInterval(interval) // Stops monitoring
       */
      const checkTheFileStatus = async (documentId: string) => {
        let retryCount = 0;
        const interval = setInterval(async () => {
          const response = await apiService.getData(`${apiUrls.getJobStatus.replace(":id", documentId)}`);
          if(response.status?.status === "SUCCESS"){
            onUploadSuccess?.(currentFileRef.current as File, uploadState.fileName, uploadState.fileSize);
            clearInterval(interval);
          }else{
            retryCount++;
            if(retryCount > 6){
              clearInterval(interval);
              setUploadState((uploadState)=> ({...uploadState, isUploading: false, progress: 0, error: "Upload failed"}));
            }
            setUploadState((prev) => {
              const nextProgress = prev.progress + 10;
              if (nextProgress >= 90) { 
                clearInterval(interval);
                return {...prev, isUploading: false, progress: 100 };
              }
              return { ...prev, progress: nextProgress };
            });
    
          }
        }, 5000);
        return interval;
      }
    
      /**
       * Handles drag over events for the drop zone
       * 
       * Prevents default browser behavior and sets the drag over state
       * to provide visual feedback when dragging files over the upload area.
       * 
       * @param {React.DragEvent} e - The drag over event
       * 
       * @example
       * <div onDragOver={handleDragOver}>Drop zone</div>
       */
      const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
      }, []);
    
      /**
       * Handles drag leave events for the drop zone
       * 
       * Prevents default browser behavior and resets the drag over state
       * when files are dragged out of the upload area.
       * 
       * @param {React.DragEvent} e - The drag leave event
       * 
       * @example
       * <div onDragLeave={handleDragLeave}>Drop zone</div>
       */
      const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
      }, []);
    
      /**
       * Handles file drop events
       * 
       * Processes dropped files, validates them, and triggers file selection.
       * Only processes the first file if multiple files are dropped.
       * 
       * @param {React.DragEvent} e - The drop event containing the dropped files
       * 
       * @example
       * <div onDrop={handleDrop}>Drop zone</div>
       */
      const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
          // Only take the first file, ignore others
          handleFileSelect(files[0]);
        }
      }, [handleFileSelect]);
    
      /**
       * Handles file input change events
       * 
       * Processes files selected through the file input dialog.
       * Only processes the first file if multiple files are selected.
       * 
       * @param {React.ChangeEvent<HTMLInputElement>} e - The change event from the file input
       * 
       * @example
       * <input type="file" onChange={handleFileInputChange} />
       */
      const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
          // Only take the first file, ignore others
          handleFileSelect(files[0]);
        }
      };
    
      /**
       * Triggers the file input dialog
       * 
       * Programmatically clicks the hidden file input element to open
       * the file selection dialog.
       * 
       * @example
       * <button onClick={handleBrowseClick}>Browse Files</button>
       */
      const handleBrowseClick = () => {
        fileInputRef.current?.click();
      };
    
      /**
       * Resets the upload component to its initial state
       * 
       * Clears all upload state, resets the current file reference,
       * and clears the file input value. Used when starting over
       * after an error or when replacing files.
       * 
       * @example
       * resetUpload() // Resets component to initial state
       */
      const resetUpload = () => {
        setUploadState({
          isUploading: false,
          progress: 0,
          fileName: '',
          fileSize: '',
          error: null,
          hasFile: false
        });
        currentFileRef.current = null;
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      };
    
  return {
    uploadState,
    isDragOver,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileInputChange,
    handleBrowseClick,
    simulateUpload,
    resetUpload,
    fileInputRef
  }
}

export default useUploadComponent