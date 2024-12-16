"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getQuestions, getAnswerTime } from "@/services/test";
import { processResponseAPI } from "@/services/responses";
import { Test } from "@/components/test";
import * as storageUtils from "@/utils/storage";
import { toast } from "@/hooks/use-toast";

export const AttemptingTest: React.FC = () => {
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [answerTime, setAnswerTime] = useState(30);
  const [timeLeft, setTimeLeft] = useState(answerTime);
  const [timerStarted, setTimerStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [timerKey, setTimerKey] = useState(0); // Add this to force timer reset
  const [testCompleted, setTestCompleted] = useState(false);

  const testData = storageUtils.getTestData();
  const moduleName = testData.module_name;

  const startTimer = useCallback(() => {
    setTimerStarted(true);
  }, []);

  const handleTestCompletion = async () => {
    setTestCompleted(true);
    try {
      // First process the response
      await processResponseAPI();
      // Then navigate to processing page
      router.push(`/test/${moduleName}/completed`);
    } catch (error) {
      console.error('Error during test completion:', error);
      toast({
        title: "Error",
        description: "Unable to process test results. Please contact support.",
        variant: "destructive",
      });
    }
  };

  const nextQuestion = useCallback(() => {
    if (isTransitioning || testCompleted) return;
    setIsTransitioning(true);
  
    setCurrentQuestionIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      if (nextIndex >= questions.length) {
        handleTestCompletion();
        return prevIndex;
      }
      
      toast({
        title: "Success",
        description: `Question ${nextIndex} saved successfully!`,
        variant: "success",
      });
      return nextIndex;
    });
  
    setTimeLeft(answerTime);
    setTimerKey((prev) => prev + 1);
    setIsTransitioning(false);
  }, [questions.length, moduleName, router, answerTime, testCompleted]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedQuestions, timeData] = await Promise.all([
          getQuestions(moduleName),
          getAnswerTime(),
        ]);

        // @ts-expect-error Argument of type 'Question[]' is not assignable to parameter of type 'SetStateAction<never[]>'.
        setQuestions(fetchedQuestions || []);
        const fetchedTime = timeData?.time || 30;
        setAnswerTime(fetchedTime); 
        setTimeLeft(fetchedTime);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [moduleName]);

  // Reset timer when changing questions
  useEffect(() => {
    setTimeLeft(answerTime);
    // setTimerStarted(false);
  }, [currentQuestionIndex, answerTime]);

  // console.log(currentQuestionIndex);
  

  // Timer effect
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (timerStarted && timeLeft > 0) {
      intervalId = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalId);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [timerStarted, timerKey]);

  if (questions.length === 0) return <h1>No Data Found!</h1>;

  const question = questions[currentQuestionIndex] ?? {};
  const actualQuestionNumber = currentQuestionIndex + 1;

  return (
    <div>
      {testCompleted ? (
        <div className="bg-zinc-900 rounded-2xl text-white text-2xl font-semibold p-8 m-auto">
          Test has ended. You will be redirected soon.
        </div>
      ) : (
        <Test
          // key={currentQuestionIndex} // Add key to force component remount
          activeQuesNo={actualQuestionNumber}
          totalQues={questions.length}
          question={question}
          nextQuestion={nextQuestion}
          timeIsSec={timeLeft}
          moduleName={String(moduleName)}
          startTimer={startTimer}
        />
      )}
    </div>
  );
};
