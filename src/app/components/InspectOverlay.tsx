import React, { useLayoutEffect, useRef } from "react";
import { Link, useLocation } from "react-router";
import { ads } from "../data";
import { useAdInspection } from "../state/InspectionContext";
import { ChevronRight, X, Search, ExternalLink } from "lucide-react";

interface InspectOverlayProps {
  adId: string;
  onClose: () => void;
}

export function InspectOverlay({ adId, onClose }: InspectOverlayProps) {
  const ad = ads.find((a) => a.id === adId);
  const { state, clearSelectedInspectable } = useAdInspection(adId);
  const { pathname } = useLocation();
  const topOverlayRef = useRef<HTMLDivElement>(null);
  const selectedPosition = state.selectedInspectable?.position ?? null;
  const isFormPage = pathname.endsWith("/form");

  useLayoutEffect(() => {
    if (!selectedPosition) return;

    const margin = 12;
    let isCorrectingScroll = false;
    const touchStart = { x: 0, y: 0 };

    const clamp = (value: number, min: number, max: number) =>
      Math.min(Math.max(value, min), max);

    const getScrollRange = (
      documentStart: number,
      documentEnd: number,
      selectedSize: number,
      viewportStart: number,
      viewportEnd: number,
      maxScroll: number
    ) => {
      if (viewportEnd <= viewportStart) {
        const current = documentStart - viewportStart;
        return { min: clamp(current, 0, maxScroll), max: clamp(current, 0, maxScroll) };
      }

      const minScroll = documentEnd - viewportEnd;
      const maxScrollForSelection = documentStart - viewportStart;

      if (minScroll <= maxScrollForSelection) {
        return {
          min: clamp(minScroll, 0, maxScroll),
          max: clamp(maxScrollForSelection, 0, maxScroll),
        };
      }

      const availableSize = viewportEnd - viewportStart;
      const targetStart = viewportStart + Math.max(0, availableSize - selectedSize) / 2;
      const target = clamp(documentStart - targetStart, 0, maxScroll);
      return { min: target, max: target };
    };

    const getScrollRanges = () => {
      const topHeight = topOverlayRef.current?.getBoundingClientRect().height ?? 0;
      const maxScrollY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const maxScrollX = Math.max(0, document.documentElement.scrollWidth - window.innerWidth);

      return {
        x: getScrollRange(
          selectedPosition.documentLeft,
          selectedPosition.documentRight,
          selectedPosition.width,
          margin,
          window.innerWidth - margin,
          maxScrollX
        ),
        y: getScrollRange(
          selectedPosition.documentTop,
          selectedPosition.documentBottom,
          selectedPosition.height,
          topHeight + margin,
          window.innerHeight - margin,
          maxScrollY
        ),
      };
    };

    const getBoundedScroll = (nextX: number, nextY: number) => {
      const ranges = getScrollRanges();
      return {
        x: clamp(nextX, ranges.x.min, ranges.x.max),
        y: clamp(nextY, ranges.y.min, ranges.y.max),
      };
    };

    const setBoundedScroll = (nextX: number, nextY: number) => {
      const bounded = getBoundedScroll(nextX, nextY);
      const changed =
        Math.abs(bounded.x - window.scrollX) >= 0.5 ||
        Math.abs(bounded.y - window.scrollY) >= 0.5;

      if (!changed) return false;

      isCorrectingScroll = true;
      window.scrollTo({ left: bounded.x, top: bounded.y, behavior: "auto" });
      isCorrectingScroll = false;
      return true;
    };

    const keepSelectionVisible = () => {
      if (isCorrectingScroll) return;
      setBoundedScroll(window.scrollX, window.scrollY);
    };

    const normalizeWheelDelta = (value: number, mode: number, axis: "x" | "y") => {
      if (mode === 1) return value * 16;
      if (mode === 2) return value * (axis === "y" ? window.innerHeight : window.innerWidth);
      return value;
    };

    const handleWheel = (event: WheelEvent) => {
      if (!event.cancelable) return;

      const deltaX = normalizeWheelDelta(event.deltaX, event.deltaMode, "x");
      const deltaY = normalizeWheelDelta(event.deltaY, event.deltaMode, "y");
      const bounded = getBoundedScroll(window.scrollX + deltaX, window.scrollY + deltaY);
      const wouldCrossBound =
        Math.abs(bounded.x - (window.scrollX + deltaX)) >= 0.5 ||
        Math.abs(bounded.y - (window.scrollY + deltaY)) >= 0.5;

      if (!wouldCrossBound) return;

      event.preventDefault();
      setBoundedScroll(window.scrollX + deltaX, window.scrollY + deltaY);
    };

    const handleTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      touchStart.x = touch.clientX;
      touchStart.y = touch.clientY;
    };

    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch || !event.cancelable) return;

      const deltaX = touchStart.x - touch.clientX;
      const deltaY = touchStart.y - touch.clientY;
      touchStart.x = touch.clientX;
      touchStart.y = touch.clientY;

      const bounded = getBoundedScroll(window.scrollX + deltaX, window.scrollY + deltaY);
      const wouldCrossBound =
        Math.abs(bounded.x - (window.scrollX + deltaX)) >= 0.5 ||
        Math.abs(bounded.y - (window.scrollY + deltaY)) >= 0.5;

      if (!wouldCrossBound) return;

      event.preventDefault();
      setBoundedScroll(window.scrollX + deltaX, window.scrollY + deltaY);
    };

    const isInteractiveTarget = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return false;
      return Boolean(
        target.closest("input, textarea, select, button, a, [contenteditable='true']")
      );
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || isInteractiveTarget(event.target)) return;

      let deltaY = 0;
      let targetY: number | null = null;

      if (event.key === "ArrowDown") deltaY = 40;
      else if (event.key === "ArrowUp") deltaY = -40;
      else if (event.key === "PageDown") deltaY = window.innerHeight * 0.85;
      else if (event.key === "PageUp") deltaY = window.innerHeight * -0.85;
      else if (event.key === " ") deltaY = event.shiftKey ? window.innerHeight * -0.85 : window.innerHeight * 0.85;
      else if (event.key === "Home") targetY = 0;
      else if (event.key === "End") {
        targetY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      } else {
        return;
      }

      const requestedY = targetY ?? window.scrollY + deltaY;
      const bounded = getBoundedScroll(window.scrollX, requestedY);
      const wouldCrossBound = Math.abs(bounded.y - requestedY) >= 0.5;

      if (!wouldCrossBound) return;

      event.preventDefault();
      setBoundedScroll(window.scrollX, requestedY);
    };

    keepSelectionVisible();
    window.addEventListener("wheel", handleWheel, { capture: true, passive: false });
    window.addEventListener("touchstart", handleTouchStart, { capture: true, passive: true });
    window.addEventListener("touchmove", handleTouchMove, { capture: true, passive: false });
    window.addEventListener("keydown", handleKeyDown, { capture: true });
    window.addEventListener("scroll", keepSelectionVisible, { passive: true });
    window.addEventListener("resize", keepSelectionVisible);

    return () => {
      window.removeEventListener("wheel", handleWheel, { capture: true });
      window.removeEventListener("touchstart", handleTouchStart, { capture: true });
      window.removeEventListener("touchmove", handleTouchMove, { capture: true });
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
      window.removeEventListener("scroll", keepSelectionVisible);
      window.removeEventListener("resize", keepSelectionVisible);
    };
  }, [selectedPosition]);

  if (!ad) return null;

  const answeredCount = ad.hotspots.filter((h) => state.classifications[h.id] !== undefined).length;
  const total = ad.hotspots.length;

  const handleClose = () => {
    clearSelectedInspectable();
    onClose();
  };

  return (
    <>
      {/* Top instruction banner — does not block the page, leaves room for popovers */}
      <div
        ref={topOverlayRef}
        className="fixed top-0 left-0 right-0 z-[90] bg-white/95 backdrop-blur-md border-b border-[#E3B740] shadow-md"
      >
        <div className="w-full px-4 py-3 flex items-start gap-3">
          <div className="mt-1 w-8 h-8 rounded-full bg-[#E3B740]/20 flex items-center justify-center shrink-0">
            <Search className="w-4 h-4 text-[#b8912e]" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold text-zinc-900">Inspection mode</div>
            <div className="text-xs text-zinc-600 leading-snug">{ad.inspectInstruction}</div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 bg-zinc-100 hover:bg-zinc-200 rounded-full transition-colors border border-zinc-200 shrink-0"
            aria-label="Exit inspection mode"
          >
            <X className="w-4 h-4 text-zinc-600" />
          </button>
        </div>
      </div>

      {/* Progress and actions sit in page flow after the inspected content. */}
      <div
        className="w-full bg-white/95 backdrop-blur-md border-t border-zinc-200 px-3 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-10px_40px_rgba(0,0,0,0.10)]"
      >
        <div className="w-full flex flex-col gap-3">
          <div>
            <div className="text-xs font-medium text-zinc-500 mb-1">
              {answeredCount} of {total} elements inspected
            </div>
            <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#E3B740] transition-all"
                style={{ width: `${(answeredCount / total) * 100}%` }}
              />
            </div>
          </div>
          <div className={`grid gap-2 ${isFormPage ? "grid-cols-1" : "grid-cols-2"}`}>
            {!isFormPage && (
              <Link
                to={`/ad/${ad.id}/form`}
                onClick={handleClose}
                className="min-h-11 px-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-200 transition-colors"
              >
                <ExternalLink className="w-4 h-4 shrink-0" /> <span className="truncate">Open link</span>
              </Link>
            )}
            <Link
              to={`/ad/${ad.id}/evidence`}
              onClick={handleClose}
              className={`min-h-11 px-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
                answeredCount > 0
                  ? "bg-[#E3B740] hover:bg-[#d6a935] text-zinc-900"
                  : "bg-zinc-100 text-zinc-400 pointer-events-none"
              }`}
            >
              <span className="truncate">Review evidence</span> <ChevronRight className="w-4 h-4 shrink-0" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
