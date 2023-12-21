"use client"
import React, { useRef, useState, useEffect } from 'react'
import Head from "next/head"
import Script from 'next/script';


export const TrackMap = () => {
    const trackId = 127

    const track = useRef()

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

    useEffect(() => {

        track.current = new window.RivalTracker("track1", trackId, null, track1Options);

        // function incrementTelemData() {
        //     track.current.updatePositions();
        // }

        // const interval = setInterval(() => {
        //     incrementTelemData()
        // }, 500);

        // return () => clearInterval(interval);
    }, [trackId]);

    return (
        <> {console.log('track', track.current)}
            <div>TrackMap</div>
            <Script
                src="/js/RivalTracker.min.js"
                strategy="beforeInteractive"
            />
            <Script
                src="/js/TrackPaths.min.js"
                strategy="beforeInteractive"
            />
            <div id="track1Wrapper" className="track">
                <div id="track1"></div>
            </div>


        </>
    )
}


declare global {
    interface Window {
        RivalTracker: any;
    }
}