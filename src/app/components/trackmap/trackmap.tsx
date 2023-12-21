"use client"
import Script from 'next/script';
import React, { useRef, useState, useEffect, useCallback } from 'react'
import { useDebounce } from 'use-debounce';


export const TrackMap = () => {
    const [rivalTrackerJsLoaded, setRivalTrackerJsLoaded] = useState(false);
    const [rivalTrackerPathsJsLoaded, setRivalTrackerPathsJsLoaded] = useState(false);
    const [allJsLoaded, setAllJsLoaded] = useState(false);

    const trackId = '126'

    const track = useRef()
    const trackDiv = useRef<HTMLDivElement>(null)

    const options = {
        transform: "translate(0, 0) scale(1) rotate(0)",
        height: 70,
        scaling: 100,
        pathColor: '#FFFFFF',
        maxPrediction: 2000,
        nodeSize: 15,
        labelFont: "Arial",
        labelFontSize: ".5em",
        labelColor: '#000000',
    };
    var track1Options = JSON.parse(JSON.stringify(options));
    track1Options.nodeSize = 8;
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);
    const [debouncedHeight] = useDebounce(height, 400);
    const [debouncedWidth] = useDebounce(width, 400);

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
        if (allJsLoaded) {
            track.current = new window.RivalTracker("track1", trackId, null, track1Options);
        }

        // function incrementTelemData() {
        //     track.current.updatePositions();
        // }

        // const interval = setInterval(() => {
        //     incrementTelemData()
        // }, 500);

        // return () => clearInterval(interval);
    }, [trackId, allJsLoaded]);

    return (
        <>
            <div>TrackMap</div>
            <Script
                src="/js/RivalTracker.1.0.js"
                strategy="lazyOnload"
                onLoad={() => {
                    setRivalTrackerJsLoaded(true)
                }}
            />
            {rivalTrackerJsLoaded &&
                <Script
                    src="/js/RivalTrackerPaths.1.0.js"
                    strategy="lazyOnload"
                    onLoad={() => {
                        setRivalTrackerPathsJsLoaded(true)
                    }}
                />
            }

            <div id="track1Wrapper" className="track">
                <div id="track1" ref={trackDiv}></div>
            </div>
            <div>
                {(!allJsLoaded) && <p>loading...</p>}
            </div>
        </>
    )
}


declare global {
    interface Window {
        RivalTracker: any;
    }
}