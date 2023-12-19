import './TrackMap.css'
import React, { useRef, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useDebounce } from 'use-debounce';
import { setIntervalAsync } from 'set-interval-async/dynamic'
import { clearIntervalAsync } from 'set-interval-async'
import {
    CCol,
    CRow,
    CCard,
    CCardBody,
    CFormGroup,
    CInput,
    CInputGroup,
    CInputGroupAppend,
    CInputGroupText,
    CBadge,
    CTooltip,
} from '@coreui/react'
import InputSlider from 'react-input-slider'
import { currentSessionSelector } from '../../selectors'

function debounce(fn, ms) {
    let timer
    return _ => {
        clearTimeout(timer)
        timer = setTimeout(_ => {
            timer = null
            fn.apply(this, arguments)
        }, ms)
    };
}

const TrackMap = () => {
    const standings = useSelector(state => state.pitboxSession.eventDetails.standings)
    const isMulticlass = useSelector(currentSessionSelector)?.isMulticlass
    const trackId = useSelector(currentSessionSelector)?.track.id
    const standingsSelectedCarNumber = useSelector(state => state.pitboxSession.standingsSelectedCarNumber)

    const [carClasses, setCarClasses] = useState([]);
    const [xTranslation, setXTranslation] = useState(0);
    const [yTranslation, setYTranslation] = useState(0);
    const [scale, setScale] = useState(1.0);
    const [rotation, setRotation] = useState(0);
    const [height, setHeight] = useState(70);
    const [debouncedHeight] = useDebounce(height, 400);
    const [debouncedXTranslation] = useDebounce(xTranslation, 400);
    const [debouncedYTranslation] = useDebounce(yTranslation, 400);
    const [debouncedScale] = useDebounce(scale, 400);
    const [debouncedRotation] = useDebounce(rotation, 400);
    const [transform, setTransform] = useState("translate(0, 0) scale(1) rotate(0)");
    const trackDiv = useRef(null);
    const [customTrackId, setCustomTrackId] = useState('1');
    const [pitstopTime, setPitstopTime] = useState(0);
    const driverPositionData = useRef({})
    const track = useRef(null)

    const [dimensions, setDimensions] = useState({
        height: window.innerHeight,
        width: window.innerWidth
    })

    useEffect(() => {
        const timer = setIntervalAsync(
            async () => {
                track.current.updatePositions();
            },
            700)
        return async () => await clearIntervalAsync(timer);
    }, [trackId])

    useEffect(() => {
        const debouncedHandleResize = debounce(function handleResize() {
            setDimensions({
                height: window.innerHeight,
                width: window.innerWidth
            })
        }, 500)

        window.addEventListener('resize', debouncedHandleResize)

        return _ => {
            window.removeEventListener('resize', debouncedHandleResize)
        }
    })

    useEffect(() => {
        let transform = `translate(${debouncedXTranslation}, ${debouncedYTranslation}) scale(${debouncedScale}) rotate(${debouncedRotation}, 300, 300)`
        setTransform(transform)
    }, [debouncedXTranslation, debouncedYTranslation, debouncedScale, debouncedRotation])

    useEffect(() => {
        function clickCallback(evt) {
            //window.alert("clicked : " + evt.currentTarget.id);
        }

        var options = {
            transform: transform,
            height: height,
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
        track1Options.callback = clickCallback;

        track.current = new window.RivalTracker("track1", trackId, driverPositionData.current, track1Options);

        // function incrementTelemData() {
        //     track.current.updatePositions();
        // }

        // const interval = setInterval(() => {
        //     incrementTelemData()
        // }, 500);

        // return () => clearInterval(interval);
    }, [dimensions, transform, customTrackId, debouncedHeight, trackId]);

    useEffect(() => {
        var carClasses = []
        delete driverPositionData.current['PIT']

        if (standings) {
            standings.forEach(s => {
                if (s.lapDistancePercent !== -1) {
                    let lapPercent = s.lapDistancePercent * 100
                    driverPositionData.current[s.carNumber] = lapPercent
                    var classColor = s.classColor.slice(0, -2) + 'B3'

                    if (isMulticlass) {
                        if (!carClasses.some(e => e.classId === s.classId)) {
                            carClasses.push({
                                classId: s.classId,
                                className: s.className.length > 0 ? s.className : s.carName,
                                classColor: classColor
                            })
                        }
                    } else {
                        //use car names
                        var existingClass = carClasses.find(c => c.classId == s.carName);
                        if (!existingClass) {
                            classColor = colors[carClasses.filter(c=>c.classId !== -1 && c.classId !== -2).length] + 'B3'
                            carClasses.unshift({
                                classId: s.carName,
                                className: s.carName,
                                classColor: classColor
                            })
                        } else {
                            classColor = existingClass.classColor
                        }
                    }

                    track.current.setNodeColor(s.carNumber, classColor); /*'#f64747B3'*/
                    if (s.carNumber === standingsSelectedCarNumber) {
                        track.current.setNodeStrokeColor(s.carNumber, '#66ff00B3');

                        carClasses.push({
                            classId: -2,
                            className: s.driverName,
                            classColor: classColor,
                            strokeColor: '#66ff00B3'
                        })

                        if (pitstopTime > 0 && s.bestLaptime > 0) {
                            let secondsPerPercent = (s.bestLaptime / 1000) / 100
                            let pitstopPercentLost = pitstopTime / secondsPerPercent
                            let distanceAfterStopRaw = lapPercent - pitstopPercentLost
                            let distanceAfterStop = 0

                            if (distanceAfterStopRaw < 100) {
                                distanceAfterStop = distanceAfterStopRaw
                            } else {
                                distanceAfterStop = Math.abs(100 - lapPercent - pitstopPercentLost)
                            }

                            driverPositionData.current['PIT'] = distanceAfterStop;

                            carClasses.push({
                                classId: -1,
                                className: s.driverName + ' after pitstop',
                                classColor: classColor, /*'#33CC66B3'*/
                                strokeColor: '#f64747B3'
                            })
                            track.current.setNodeColor('PIT', classColor);
                            track.current.setNodeStrokeColor('PIT', '#f64747B3');
                        }
                    } else {
                        track.current.setNodeStrokeColor(s.carNumber, '#555555B3');
                    }
                } else {
                    delete driverPositionData.current[s.carNumber]
                }
            });
            setCarClasses(carClasses.sort((a, b) => a.classId - b.classId))
        }
    }, [standings, isMulticlass]);

    const colors = [
        "#ecf0f1",
        "#e74c3c",
        "#3498db",
        "#2ecc71",
        "#f1c40f",
        "#9b59b6",
        "#34495e",
        "#1abc9c"
    ]

    return (
        <>
            <CRow>
                <CCol>
                    <CCard>
                        <CCardBody>
                            <CRow className="ml-1">
                                {carClasses.map(c => {
                                    return <div key={c.classId} className="mr-3" style={{ display: 'flex' }} >
                                        <div className="color-box" style={{ backgroundColor: c.classColor, border: '3px solid ' + c.strokeColor }}></div><span className="ml-1" style={{ alignSelf: 'stretch' }}>{c.className}</span>
                                    </div>
                                })}
                            </CRow>
                            <CRow className="mt-1">
                                <CCol>
                                    <div>
                                        <div>
                                            <span className="text-muted small text-uppercase">pitstop time loss</span>
                                            <CTooltip content="Estimated time lost to a pitstop. This value is only used to get a rough estimate of the selected driver's position on track after a pitstop. This requires the driver to have completed a full green flag lap beyond lap one. This value should be calculated before the race. Perform a pitstop similar to what will be required during race. Add the total time lost (across two laps if pitlane crosses start/finish) from avgerage lap time. Alternatively, measure the time at race speed to cover the cone-to-cone distance, subtract that value from the cone-to-cone pitstop time, adding a small buffer for slowing to pit speed and getting up to speed on pit exit.">
                                                <CBadge className="ml-1" color="info">i</CBadge>
                                            </CTooltip>
                                        </div>
                                        <CFormGroup className="mb-0">
                                            <CInputGroup>
                                                <CInput style={{ maxWidth: 100 + 'px' }} type="number" id="pitstopSeconds" name="pitstopSeconds" value={pitstopTime} onChange={e => setPitstopTime(e.target.value)} />
                                                <CInputGroupAppend>
                                                    <CInputGroupText style={{ color: '#ffffff' }}>seconds</CInputGroupText>
                                                </CInputGroupAppend>
                                            </CInputGroup>
                                        </CFormGroup>
                                    </div>

                                </CCol>
                            </CRow>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
            <CRow >
                <CCol sm="auto" className="mr-auto">
                    <div>
                        <span className="text-muted small text-uppercase font-weight-bold">scale</span>
                    </div>
                    <div>
                        <InputSlider axis="x" xstep={.1} xmin={0.1} xmax={2.0} x={scale} onChange={({ x }) => setScale(parseFloat(x.toFixed(1)))}></InputSlider>
                    </div>
                </CCol>
                <CCol sm="auto">
                    <div>
                        <span className="text-muted small text-uppercase font-weight-bold">rotation</span>
                    </div>
                    <div>
                        <InputSlider axis="x" xstep={1} xmin={0} xmax={360} x={rotation} onChange={({ x }) => setRotation(parseInt(x))}></InputSlider>
                    </div>
                </CCol>
            </CRow>
            <CRow>
                <CCol sm="auto" style={{ marginTop: 'auto', marginBottom: 'auto' }} >
                    <div>
                        <span className="text-muted small text-uppercase font-weight-bold">y</span>
                    </div>
                    <div>
                        <InputSlider axis="y" ystep={1} ymin={-300} ymax={300} y={yTranslation} onChange={({ y }) => setYTranslation(parseInt(y))}></InputSlider>
                    </div>
                </CCol>
                <CCol>
                    <div id="track1Wrapper" className="track">
                        <div ref={trackDiv} id="track1"></div>
                    </div>
                </CCol>
                <CCol sm="auto" style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                    <div>
                        <span className="text-muted small text-uppercase font-weight-bold">h</span>
                    </div>
                    <div>
                        <InputSlider axis="y" ystep={1} ymin={1} ymax={100} y={height} onChange={({ y }) => setHeight(parseInt(y))}></InputSlider>
                    </div>
                </CCol>
            </CRow>
            <CRow className="justify-content-md-center mb-3">
                <div className="mr-2">
                    <span className="text-muted small text-uppercase font-weight-bold">x</span>
                </div>
                <div>
                    <InputSlider axis="x" xstep={1} xmin={-300} xmax={300} x={xTranslation} onChange={({ x }) => setXTranslation(parseInt(x))}></InputSlider>
                </div>
            </CRow>
        </>
    )
}

export default TrackMap