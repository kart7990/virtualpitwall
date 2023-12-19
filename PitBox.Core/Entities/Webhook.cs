using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace PitBox.Core.Entities
{
    public class Webhook
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }
        public string Url { get; set; }
        public string Message { get; set; }
        public Guid UserId { get; set; }
        [JsonIgnore]
        public virtual PitBoxUser User { get; set; }
    }
}
