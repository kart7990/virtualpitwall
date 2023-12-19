﻿using System;
using System.Windows.Media;

namespace iRacingSimulator.Drivers
{
    [Serializable]
    public class DriverCarInfo
    {
        public string CarNumber { get; set; }
        public int CarNumberRaw { get; set; }
        public int CarId { get; set; }
        public string CarName { get; set; }
        public int CarClassId { get; set; }
        public int CarClassRelSpeed { get; set; }
        public Color CarClassColor { get; set; }
        public string CarClassColorString { get => CarClassColor.ToString(); }

        /// <summary>
        /// Gets the short class name for this car.
        /// </summary>
        public string CarClassShortName { get; set; }

        /// <summary>
        /// Gets the short screen name for this car (e.g. "MX-5 Cup")
        /// </summary>
        public string CarShortName { get; set; }

        /// <summary>
        /// Directory name of this car (e.g. "mx5 mx52016")
        /// </summary>
        public string CarPath { get; set; }
    }
}
