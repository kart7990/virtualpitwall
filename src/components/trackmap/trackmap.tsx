"use client";
import {
  LiveTiming,
  selectLiveTiming,
  selectCurrentTrack,
  useSelector,
  selectedCarNumber,
} from "@/lib/redux";
import Script from "next/script";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { useDebounce } from "use-debounce";
import { setIntervalAsync } from "set-interval-async/dynamic";
import { clearIntervalAsync } from "set-interval-async";

export const TrackMap = () => {
  const [rivalTrackerJsLoaded, setRivalTrackerJsLoaded] = useState(false);
  const [rivalTrackerPathsJsLoaded, setRivalTrackerPathsJsLoaded] =
    useState(false);
  const [allJsLoaded, setAllJsLoaded] = useState(false);
  const standings: LiveTiming[] = useSelector(selectLiveTiming);
  const track = useSelector(selectCurrentTrack);
  const [carClasses, setCarClasses] = useState<any[]>([]);
  const isMulticlass = false;
  const selectedCar = useSelector(selectedCarNumber);

  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const driverPositionData = useRef<any>({});
  const [debouncedHeight] = useDebounce(height, 400);
  const [debouncedWidth] = useDebounce(width, 400);

  const trackMap = useRef<any>();
  const trackDiv = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setIntervalAsync(async () => {
      if (trackMap.current) {
        trackMap.current.updatePositions();
      }
    }, 500);
    async () => await clearIntervalAsync(timer);
  }, []);

  useEffect(() => {
    if (!trackDiv.current) return;
    const resizeObserver = new ResizeObserver(() => {
      if (trackDiv.current != null) {
        setHeight(trackDiv.current.getBoundingClientRect().height);
        setWidth(trackDiv.current.getBoundingClientRect().width);
      }
    });
    resizeObserver.observe(trackDiv.current);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (rivalTrackerJsLoaded && rivalTrackerPathsJsLoaded) {
      setAllJsLoaded(true);
    }
  }, [rivalTrackerJsLoaded, rivalTrackerPathsJsLoaded]);

  useEffect(() => {
    if (allJsLoaded && track) {
      const options = {
        transform: "translate(0, 0) scale(1) rotate(0)",
        height: 70,
        scaling: 100,
        pathColor: "#FFFFFF",
        maxPrediction: 2000,
        nodeSize: 15,
        labelFont: "Arial",
        labelFontSize: ".5em",
        labelColor: "#000000",
      };
      var track1Options = JSON.parse(JSON.stringify(options));
      track1Options.nodeSize = 8;

      trackMap.current = new window.RivalTracker(
        "track1",
        track.id,
        driverPositionData.current,
        track1Options,
      );
    }
  }, [track, allJsLoaded]);

  useEffect(() => {
    var carClasses: any[] = [];
    delete driverPositionData.current["PIT"];

    const colors = [
      "#ecf0f1",
      "#e74c3c",
      "#3498db",
      "#2ecc71",
      "#f1c40f",
      "#9b59b6",
      "#34495e",
      "#1abc9c",
    ];

    if (standings) {
      standings.forEach((s) => {
        if (s.lapDistancePercent !== -1) {
          let lapPercent = s.lapDistancePercent * 100;
          driverPositionData.current[s.carNumber] = lapPercent;
          var classColor = s.classColor.slice(0, -2) + "B3";

          if (isMulticlass) {
            if (!carClasses.some((e) => e.classId === s.classId)) {
              carClasses.push({
                classId: s.classId,
                className: s.className.length > 0 ? s.className : s.carName,
                classColor: classColor,
              });
            }
          } else {
            //use car names
            var existingClass = carClasses.find((c) => c.classId == s.carName);
            if (!existingClass) {
              classColor =
                colors[
                  carClasses.filter((c) => c.classId !== -1 && c.classId !== -2)
                    .length
                ] + "B3";
              carClasses.unshift({
                classId: s.carName,
                className: s.carName,
                classColor: classColor,
              });
            } else {
              classColor = existingClass.classColor;
            }
          }
          if (trackMap.current != null) {
            trackMap.current.setNodeColor(
              s.carNumber,
              classColor,
            ); /*'#f64747B3'*/
            if (s.carNumber === selectedCar) {
              trackMap.current.setNodeStrokeColor(s.carNumber, "#FFFF00");

              //     carClasses.push({
              //         classId: -2,
              //         className: s.driverName,
              //         classColor: classColor,
              //         strokeColor: '#66ff00B3'
              //     })

              // if (pitstopTime > 0 && s.bestLaptime > 0) {
              //     let secondsPerPercent = (s.bestLaptime / 1000) / 100
              //     let pitstopPercentLost = pitstopTime / secondsPerPercent
              //     let distanceAfterStopRaw = lapPercent - pitstopPercentLost
              //     let distanceAfterStop = 0

              //     if (distanceAfterStopRaw < 100) {
              //         distanceAfterStop = distanceAfterStopRaw
              //     } else {
              //         distanceAfterStop = Math.abs(100 - lapPercent - pitstopPercentLost)
              //     }

              //     driverPositionData.current['PIT'] = distanceAfterStop;

              //     carClasses.push({
              //         classId: -1,
              //         className: s.driverName + ' after pitstop',
              //         classColor: classColor, /*'#33CC66B3'*/
              //         strokeColor: '#f64747B3'
              //     })
              //     track.current.setNodeColor('PIT', classColor);
              //     track.current.setNodeStrokeColor('PIT', '#f64747B3');
              // }
            } else {
              trackMap.current.setNodeStrokeColor(s.carNumber, "#555555B3");
            }
          }
        } else {
          delete driverPositionData.current[s.carNumber];
        }
      });
      setCarClasses(carClasses.sort((a, b) => a.classId - b.classId));
    }
  }, [standings, isMulticlass, selectedCar]);

  return (
    <>
      <Script
        src="/js/RivalTracker.1.0.js"
        strategy="lazyOnload"
        onLoad={() => {
          setRivalTrackerJsLoaded(true);
        }}
      />
      {rivalTrackerJsLoaded && (
        <Script
          src="/js/RivalTrackerPaths.1.0.js"
          strategy="lazyOnload"
          onLoad={() => {
            setRivalTrackerPathsJsLoaded(true);
          }}
        />
      )}

      <div>
        <span className="font-weight-bold flex p-3 uppercase">
          {track?.name ?? "n/a"}
        </span>
      </div>

      <div id="track1Wrapper" className="track">
        <div id="track1" ref={trackDiv}></div>
      </div>
      <div>{!allJsLoaded && <p>loading...</p>}</div>
    </>
  );
};

declare global {
  interface Window {
    RivalTracker: any;
  }
}
