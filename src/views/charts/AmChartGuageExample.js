import React, { useRef, useState, useEffect } from 'react'
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);


const AmChartGuageExample = (props) => {
    const [maxVal, setMaxVal] = useState(0);
    const chart = useRef(null);

    useEffect(() => {
        let x = am4core.create(props.chartName, am4charts.GaugeChart);
        x.innerRadius = am4core.percent(90);
        x.logo.disabled = true;
        let axis = x.xAxes.push(new am4charts.ValueAxis());
        axis.min = props.min;
        axis.max = props.max;
        axis.strictMinMax = true;
        axis.renderer.radius = am4core.percent(90);
        axis.renderer.inside = false;
        axis.renderer.line.strokeOpacity = 1;
        axis.renderer.line.stroke = am4core.color("#ffffff");
        axis.renderer.ticks.template.disabled = false
        axis.renderer.ticks.template.strokeOpacity = 1;
        axis.renderer.ticks.template.stroke = am4core.color("#ffffff");
        axis.renderer.ticks.template.length = 10;
        axis.renderer.grid.template.disabled = true;
        axis.renderer.labels.template.radius = 10;
        axis.renderer.labels.template.fontSize = 12;
        axis.renderer.labels.template.stroke = am4core.color("#ffffff");
        axis.renderer.labels.template.adapter.add("text", function (text) {
            return text;
        })

        /**
         * Axis for ranges
         */
        let axis2 = x.xAxes.push(new am4charts.ValueAxis());
        axis2.min = props.min;
        axis2.max = props.max;
        axis2.strictMinMax = true;
        axis2.renderer.labels.template.disabled = true;
        axis2.renderer.ticks.template.disabled = true;
        axis2.renderer.grid.template.disabled = true;

        let range0 = axis2.axisRanges.create();
        range0.axisFill.fillOpacity = .5;
        range0.axisFill.fill = am4core.color("#2eb85c");

        /**
         * Label
         */

        let label = x.radarContainer.createChild(am4core.Label);
        label.isMeasured = false;
        label.fontSize = 12;
        label.horizontalCenter = "middle";
        label.verticalCenter = "bottom";
        label.stroke = am4core.color("#ffffff");

        /**
         * Hand
         */

        let hand = x.hands.push(new am4charts.ClockHand());
        hand.axis = axis2;
        hand.innerRadius = am4core.percent(55);
        hand.startWidth = 4;
        hand.endWidth = 0.1;
        hand.stroke = am4core.color("#ffffff");
        hand.pin.disabled = true;

        hand.events.on("propertychanged", function (ev) {
            range0.endValue = ev.target.value;
            label.text = `${axis2.positionToValue(hand.currentPosition).toFixed(props.accuracy)} ${props.unit}`;
            axis2.invalidate();
        });

        chart.current = x;

        return () => {
            x.dispose();
        };
    }, [props.min, props.max, props.unit]);

    useEffect(() => {
        let value = props.value
        if (value > maxVal) {
            setMaxVal(value)
        }
        new am4core.Animation(chart.current.hands.values[0], {
            property: "value",
            to: value
        }, 100, am4core.ease.cubicOut).start();

    }, [props.value]);



    return (
        <>
            <div id={props.chartName}></div>
            {props.trackMax &&
                <div className="d-flex justify-content-center">MAX: {parseFloat(maxVal).toFixed(props.accuracy) + " " + props.unit}</div>
            }

        </>
    )
}

export default AmChartGuageExample