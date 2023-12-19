using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace PitBox.Core.Entities
{
    public class TeamMember
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }
        public bool IsOwner { get; set; }
        public bool IsAdmin { get; set; }
        public Guid TeamId { get; set; }
        [JsonIgnore]
        public virtual Team Team { get; set; }
        public Guid UserId { get; set; }
        [JsonIgnore]
        public virtual PitBoxUser User { get; set; }
    }
}
