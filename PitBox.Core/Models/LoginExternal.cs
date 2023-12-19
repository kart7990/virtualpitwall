using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace PitBox.Core.Models
{
    public class LoginExternal
    {
        [Required]
        public string Provider { get; set; }

        [Required]
        public string Token { get; set; }
    }
}
