using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Pitwall.Server.Core.Database.Entities
{
    public class PitwallUser
    {
        [Key]
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        [JsonIgnore]
        public virtual ICollection<Webhook> WebHooks { get; set; }
        [JsonIgnore]
        public virtual ICollection<TeamMember> Teams { get; set; }
    }
}
