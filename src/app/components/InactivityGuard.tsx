import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { useInspectionContext } from "../state/InspectionContext";

const INACTIVITY_TIMEOUT_MS = 120_000;
const AUTO_RETURN_TIMEOUT_MS = 90_000;

const ACTIVITY_EVENTS: Array<keyof WindowEventMap> = [
  "pointerdown",
  "keydown",
  "touchstart",
  "wheel",
  "scroll",
];

function formatRemainingTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}:${remainder.toString().padStart(2, "0")}`;
}

export function InactivityGuard() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { resetAll } = useInspectionContext();
  const isRootPage = pathname === "/";
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(AUTO_RETURN_TIMEOUT_MS / 1000);
  const inactivityTimerRef = useRef<number | null>(null);
  const autoReturnTimerRef = useRef<number | null>(null);
  const countdownTimerRef = useRef<number | null>(null);
  const promptOpenRef = useRef(false);

  const clearInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current !== null) {
      window.clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
  }, []);

  const scheduleInactivityPrompt = useCallback(() => {
    clearInactivityTimer();
    if (promptOpenRef.current) return;

    inactivityTimerRef.current = window.setTimeout(() => {
      promptOpenRef.current = true;
      setSecondsRemaining(AUTO_RETURN_TIMEOUT_MS / 1000);
      setIsPromptOpen(true);
    }, INACTIVITY_TIMEOUT_MS);
  }, [clearInactivityTimer]);

  const returnToStart = useCallback(() => {
    promptOpenRef.current = false;
    setIsPromptOpen(false);
    resetAll();
    navigate("/", { replace: true });
  }, [navigate, resetAll]);

  const continueSession = useCallback(() => {
    promptOpenRef.current = false;
    setIsPromptOpen(false);
    scheduleInactivityPrompt();
  }, [scheduleInactivityPrompt]);

  useEffect(() => {
    if (isRootPage) {
      promptOpenRef.current = false;
      setIsPromptOpen(false);
      clearInactivityTimer();
      return;
    }

    const handleActivity = () => {
      if (!promptOpenRef.current) {
        scheduleInactivityPrompt();
      }
    };

    ACTIVITY_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, handleActivity, { passive: true });
    });
    scheduleInactivityPrompt();

    return () => {
      ACTIVITY_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, handleActivity);
      });
      clearInactivityTimer();
    };
  }, [clearInactivityTimer, isRootPage, pathname, scheduleInactivityPrompt]);

  useEffect(() => {
    if (!isPromptOpen) return;

    autoReturnTimerRef.current = window.setTimeout(returnToStart, AUTO_RETURN_TIMEOUT_MS);
    countdownTimerRef.current = window.setInterval(() => {
      setSecondsRemaining((current) => Math.max(0, current - 1));
    }, 1_000);

    return () => {
      if (autoReturnTimerRef.current !== null) {
        window.clearTimeout(autoReturnTimerRef.current);
        autoReturnTimerRef.current = null;
      }
      if (countdownTimerRef.current !== null) {
        window.clearInterval(countdownTimerRef.current);
        countdownTimerRef.current = null;
      }
    };
  }, [isPromptOpen, returnToStart]);

  return (
    <AlertDialog open={isPromptOpen}>
      <AlertDialogContent className="max-w-md border-zinc-200 bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle>You&apos;ve been inactive for 2 minutes</AlertDialogTitle>
          <AlertDialogDescription>
            Do you want to continue? Your session will return to the start page automatically in{" "}
            <span className="font-semibold text-zinc-900">{formatRemainingTime(secondsRemaining)}</span>{" "}
            if you do not choose an option.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={returnToStart}
            className="w-full rounded-lg border border-zinc-300 px-4 py-3 font-semibold text-zinc-800 transition-colors hover:bg-zinc-100 sm:w-auto"
          >
            No, return to start
          </button>
          <button
            type="button"
            onClick={continueSession}
            className="w-full rounded-lg bg-[#E3B740] px-4 py-3 font-semibold text-zinc-900 transition-colors hover:bg-[#d6a935] sm:w-auto"
          >
            Yes, continue
          </button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
