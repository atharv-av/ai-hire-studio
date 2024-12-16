import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { saveVideoRecAPI } from "@/services/responses";
import { useFaceDetection } from "@/hooks/use-face-detection";
import { TestNavbar } from "@/components/test-navbar";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { removeUser } from "@/utils/storage";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface QuizProps {
  question: {
    id: number;
    question: string;
    info?: string;
    options?: { id: number; text: string }[];
  };
  activeQuesNo: number;
  totalQues: number;
  nextQuestion: () => void;
  timeIsSec: number;
  moduleName: string;
  startTimer: () => void;
}

const CAMERA_CONSTRAINTS: MediaStreamConstraints = {
  audio: true,
  video: {
    width: { ideal: 640 }, // Reduced from 1280 to reduce file size
    height: { ideal: 360 }, // Reduced from 720 to reduce file size
    facingMode: "user",
    frameRate: { max: 15 }, // Reduced frame rate to minimize file size
  },
};

export const Test: React.FC<QuizProps> = ({
  question,
  activeQuesNo,
  totalQues,
  nextQuestion,
  timeIsSec,
  moduleName,
  startTimer,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  // const [initialFaceDetected, setInitialFaceDetected] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const qIdRef = useRef<number>(question.id);
  const { isDetected } = useFaceDetection();
  const isSubmittingRef = useRef(false);
  const recordingStartedRef = useRef(false);
  const webcamRef = useRef<Webcam>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerStartedRef = useRef(false);

  // Start recording when face is detected
  useEffect(() => {
    const setupRecording = async () => {
      console.log('Setup Recording Called', {
        isDetected,
        recordingStarted: recordingStartedRef.current,
        questionId: question.id
      });
  
      // Only start recording if not already recording and face is detected
      if (isDetected && !recordingStartedRef.current) {
        try {
          // Detailed logging of camera constraints
          console.log('Camera Constraints:', JSON.stringify(CAMERA_CONSTRAINTS));
  
          // Check for media devices support
          if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error('Media devices not supported');
          }
  
          // Stop any existing stream
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => {
              console.log('Stopping existing track:', track);
              track.stop();
            });
          }
  
          // Get new media stream with error handling
          let stream: MediaStream;
          try {
            stream = await navigator.mediaDevices.getUserMedia(CAMERA_CONSTRAINTS);
          } catch (streamError) {
            console.error('Error accessing media devices:', streamError);
            toast({
              title: "Camera Access Error",
              description: "Unable to access camera. Please check permissions.",
              variant: "destructive",
            });
            return;
          }
  
          // Validate stream
          if (!stream) {
            console.error('No media stream obtained');
            toast({
              title: "Stream Error",
              description: "Failed to obtain media stream.",
              variant: "destructive",
            });
            return;
          }
  
          streamRef.current = stream;
  
          // Log stream track information
          stream.getTracks().forEach(track => {
            console.log('Stream Track:', {
              kind: track.kind,
              enabled: track.enabled,
              muted: track.muted,
              readyState: track.readyState
            });
          });
  
          // Create media recorder with more robust configuration
          const mediaRecorder = new MediaRecorder(stream, {
            mimeType: 'video/webm',
            videoBitsPerSecond: 800000
          });
  
          // Enhanced event listeners with detailed logging
          mediaRecorder.ondataavailable = (event) => {
            console.log('Data Available Event', {
              dataSize: event.data.size,
              type: event.data.type
            });
  
            if (event.data.size > 0) {
              recordedChunksRef.current.push(event.data);
              console.log('Recorded Chunks Count:', recordedChunksRef.current.length);
            }
          };
  
          mediaRecorder.onerror = (event) => {
            console.error('MediaRecorder Error:', event);
            toast({
              title: "Recording Error",
              description: "An error occurred during recording.",
              variant: "destructive",
            });
          };
  
          // Start recording with timeout mechanism
          const startRecordingTimeout = setTimeout(() => {
            if (mediaRecorder.state === 'inactive') {
              console.error('Recording did not start within expected time');
              toast({
                title: "Recording Timeout",
                description: "Failed to start recording.",
                variant: "destructive",
              });
            }
          }, 3000);
  
          // Start recording
          mediaRecorderRef.current = mediaRecorder;
          recordedChunksRef.current = [];
          
          // Add a small delay before starting recording to ensure stream is stable
          setTimeout(() => {
            try {
              mediaRecorder.start();
              clearTimeout(startRecordingTimeout);
              // setInitialFaceDetected(true);
              recordingStartedRef.current = true;
              
              // Start timer if not already started
              if (!timerStartedRef.current) {
                startTimer();
                timerStartedRef.current = true;
              }
              
              console.log('Recording Started Successfully');
            } catch (startError) {
              console.error('Error starting recording:', startError);
              toast({
                title: "Recording Start Error",
                description: "Failed to start recording. Please try again.",
                variant: "destructive",
              });
            }
          }, 500);
  
        } catch (error) {
          console.error("Comprehensive Setup Error:", error);
          toast({
            title: "Setup Error",
            description: "Failed to set up recording. Please refresh the page.",
            variant: "destructive",
          });
        }
      }
    };
  
    setupRecording();
  
    // Cleanup function
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => {
          console.log('Cleanup: Stopping track', track);
          track.stop();
        });
      }
    };
  }, [isDetected, startTimer, question.id]);

  const saveResponse = async () => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setIsSaving(true);
  
    try {
      // Stop recording with a timeout to ensure all data is captured
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        return new Promise<void>((resolve) => {
          // Set a timeout to forcibly stop the recording
          const stopTimeout = setTimeout(() => {
            if (mediaRecorderRef.current) {
              mediaRecorderRef.current.stop();
            }
            resolve();
          }, 1000);
          
          // @ts-expect-error 'mediaRecorderRef.current' is possibly 'null'.
          mediaRecorderRef.current.onstop = () => {
            clearTimeout(stopTimeout);
            resolve();
          };
          
          // @ts-expect-error 'mediaRecorderRef.current' is possibly 'null'.
          mediaRecorderRef.current.stop();
        });
      }
  
      // Wait a bit to ensure recording stops
      await new Promise(resolve => setTimeout(resolve, 500));
  
      // Create blob from recorded chunks
      const recordedBlob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
  
      // Stop all tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
  
      // Log recording details for debugging
      console.log('Recorded Chunks:', recordedChunksRef.current);
      console.log('Recorded Blob Size:', recordedBlob.size);
  
      // Handle 0-size video
      if (!recordedBlob || recordedBlob.size === 0) {
        toast({
          title: "Invalid Video",
          description: "No valid video recorded. Skipping this question.",
          variant: "warning",
        });
  
        // Reset states and prepare for next question
        // setInitialFaceDetected(false);
        recordingStartedRef.current = false;
        timerStartedRef.current = false;
        recordedChunksRef.current = [];
        mediaRecorderRef.current = null;
  
        // Move to next question
        nextQuestion();
        
        // Exit the function early
        return;
      }
  
      // Check file size (limit to 10MB)
      if (recordedBlob.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Video recording exceeds 10MB limit.",
          variant: "destructive",
        });
        throw new Error("File too large");
      }
  
      const formData = new FormData();
      formData.append(
        "video",
        recordedBlob,
        `recording-${qIdRef.current}.webm`
      );
      formData.append("question_id", String(qIdRef.current));
      formData.append("module_name", moduleName);
  
      // Save video response
      await saveVideoRecAPI(formData);
  
      toast({
        title: "Response Saved",
        variant: "success",
      });
  
      // Reset states and prepare for next question
      // setInitialFaceDetected(false);
      recordingStartedRef.current = false;
      timerStartedRef.current = false;
      recordedChunksRef.current = [];
      mediaRecorderRef.current = null;
  
      // Move to next question
      nextQuestion();
    } catch (error) {
      // @ts-expect-error Property 'response' does not exist on type '{}'.
      if (error?.response?.status === 401) {
        toast({
          title: "Session Expired",
          description: "You have been logged out. Please login again.",
          variant: "destructive",
        });
        removeUser();
        router.push("/login");
        return;
      }
  
      toast({
        title: "Error",
        description: "Unable to save the response. Please try again.",
        variant: "destructive",
      });
      console.error("Error saving response:", error);
    } finally {
      setIsSaving(false);
      isSubmittingRef.current = false;
    }
  };

// Update question ID ref when question changes
useEffect(() => {
  qIdRef.current = question.id;
  // Reset timer started ref when question changes
  timerStartedRef.current = false;

  // Reset recording state when question changes
  recordingStartedRef.current = false;
  recordedChunksRef.current = [];
  
  // Stop any existing recording
  if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
    mediaRecorderRef.current.stop();
  }
  
  // Stop existing stream
  if (streamRef.current) {
    streamRef.current.getTracks().forEach(track => track.stop());
  }
}, [question.id]);

  // Effect to handle timer expiration
  useEffect(() => {
    if (timeIsSec <= 1 && !isSaving) {
      saveResponse();
    }
  }, [timeIsSec, isSaving]);

  // Webcam rendering logic
  const renderWebcamView = (fullScreen = false) => {
    return (
      <Webcam
        ref={webcamRef}
        // @ts-expect-error Type 'MediaStreamConstraints' is not assignable to type 'boolean | MediaTrackConstraints | undefined'.
        videoConstraints={CAMERA_CONSTRAINTS}
        className={cn("w-full", fullScreen ? "h-[35vh]" : "h-full")}
        mirrored={true}
      />
    );
  };

  return (
    <div className="flex flex-col w-screen min-h-screen overflow-hidden bg-zinc-900 relative">
      {/* Navbar */}
      <div className="absolute top-0 left-0 right-0 z-50 shadow-md">
        <TestNavbar stopRecording={saveResponse} />
      </div>

      {/* Face Validation Overlay */}
      {!isDetected && (
        <div className="fixed top-[4.5rem] left-0 right-0 h-[90%] mx-auto w-2/3 z-40 flex justify-center items-center border-t border-zinc-800">
          <div className="text-center p-3 lg:p-8 bg-black/90 rounded-xl lg:rounded-2xl w-full border border-zinc-800 flex flex-col items-center">
            <h1 className="text-red-500 text-lg lg:text-2xl font-extrabold mb-4">
              Face validation failed!
            </h1>
            <p className="text-white font-bold text-base lg:text-lg mb-2 lg:mb-4">
              Please position your face in the camera view
            </p>
            <div className="rounded-xl lg:rounded-2xl overflow-hidden border border-zinc-800 mb-2 lg:mb-4 w-full max-w-md">
              {renderWebcamView(true)}
            </div>
          </div>
        </div>
      )}

      <div className="text-center space-y-1 py-2 mt-16">
        <p className="text-gray-200 text-[11px] lg:text-lg">
          Your response will be recorded through video capture.
        </p>
        <p className="text-blue-300 text-[9.5px] lg:text-base italic">
          (Please make sure to stay in frame while answering)
        </p>
      </div>

      {/* Main Content */}
      <div className="lg:flex-1 lg:flex-row flex flex-col">
        {/* Quiz Section */}
        <div className="w-full h-fit lg:w-[55%] xl:w-1/2 flex flex-col justify-center items-center bg-zinc-900 p-6">
          <div
            className={cn(
              "rounded-xl lg:rounded-2xl p-3 lg:p-8 bg-zinc-950 border border-zinc-800 max-w-4xl w-full",
              question.options?.length === 0 ? "h-fit" : "lg:h-[70vh]"
            )}
          >
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-red-400 font-bold text-xs lg:text-lg">
                {`${timeIsSec}s left`}
              </h4>
              <h5 className="text-indigo-300 font-bold text-xs lg:text-lg">
                {activeQuesNo} / {totalQues}
              </h5>
            </div>

            <h5 className="text-gray-100 text-sm leading-tight lg:leading-normal lg:text-xl mb-1 lg:mb-3">
              {question.question}
            </h5>
            {question.info && (
              <p className="text-indigo-300 lg:text-base text-xs mb-3 lg:mb-6">
                ({question.info})
              </p>
            )}

            <div className="grid grid-cols-3 md:grid-cols-2 gap-2 lg:grid-cols-2 lg:gap-4">
              {question.options?.map((item, index) => (
                <button
                  key={index}
                  className="w-full text-left py-1 px-2 lg:p-4 lg:rounded-2xl rounded-xl text-gray-300 text-[10px] lg:text-base transition-colors duration-200 disabled:opacity-50 bg-zinc-900 border border-zinc-800 line-clamp-2 lg:line-clamp-none"
                  disabled
                >
                  {item.text}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Webcam Section */}
        <div className="w-full lg:w-[45%] xl:w-1/2 overflow-hidden h-1/2 lg:h-full flex flex-col justify-center items-center bg-zinc-900 p-6">
          {isDetected ? (
            <div className="text-center lg:h-[70vh] p-3 lg:p-8 bg-zinc-950/80 rounded-xl lg:rounded-2xl w-full border border-zinc-800">
              <h1 className="text-white text-lg lg:text-2xl font-bold mb-2 lg:mb-4">
                Face validated!
              </h1>
              <div className="rounded-xl lg:h-[90%] lg:rounded-2xl overflow-hidden border border-zinc-800">
                {renderWebcamView()}
              </div>
            </div>
          ) : null}
        </div>

        {/* Saving Indicator */}
        {isSaving && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-zinc-900 rounded-xl lg:rounded-2xl p-3 lg:p-6 z-50 border border-zinc-800">
            <Loader2 className="h-4 w-4 lg:h-5 lg:w-5 animate-spin text-blue-500" />
            <h1 className="text-gray-200 text-sm lg:text-xl">
              Saving response...
            </h1>
          </div>
        )}
      </div>
    </div>
  );
};