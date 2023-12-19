using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;

namespace PitBox.Core.Entities
{
    public class PitBoxUser
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string IRacingCustomerId { get; set; }
        public string Email { get; set; }
        [JsonIgnore]
        public string IdentityId { get; set; }
        [JsonIgnore]
        public Guid DefaultSessionId { get; set; }
        [JsonIgnore]
        public string DefaultSessionAccessCode { get; set; }
        public DateTime? ActiveDate { get; set; }
        public string FormattedActiveDate
        {
            get
            {
                return ActiveDate.HasValue ? ActiveDate.Value.ToString("s") + "Z" : null;
            }
        }
        public DateTime? InactiveDate { get; set; }
        public string FormattedInactiveDate
        {
            get
            {
                return InactiveDate.HasValue ? InactiveDate.Value.ToString("s") + "Z" : null;
            }
        }
        [JsonIgnore]
        public bool IsAdmin { get; set; }
        [JsonIgnore]
        public virtual ICollection<Webhook> WebHooks { get; set; }
        [JsonIgnore]
        public virtual ICollection<TeamMember> Teams { get; set; }
    }
}
