using System;
using System.Collections.Generic;
using System.Text;

namespace PitBox.Core.Models
{
    public class JsonWebToken
    {
        public string AccessToken { get; set; }
        /// <summary>
        /// Epoch Seconds
        /// </summary>
        public long Expires { get; set; }
        public string RefreshToken { get; set; }
    }
}