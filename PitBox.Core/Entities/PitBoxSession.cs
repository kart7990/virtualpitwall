using Newtonsoft.Json;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PitBox.Core.Entities
{
    public class PitBoxSession
    {
        public string Id { get; set; }
        [JsonIgnore]
        public string AccessCode { get; set; }
        [JsonIgnore]
        public bool RequiresAccessCode
        {
            get
            {
                return !string.IsNullOrWhiteSpace(AccessCode);
            }
        }
        public Guid CreatorUserId { get; set; }
        [JsonIgnore]
        public virtual PitBoxUser CreatorUser { get; set; }
        public Guid TeamId { get; set; }
        [JsonIgnore]
        public virtual Team Team { get; set; }
    }
}
