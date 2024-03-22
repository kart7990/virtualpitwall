using Microsoft.EntityFrameworkCore;
using Pitwall.Server.Core.Database.Entities;

namespace Pitwall.Server.Core.Database
{
    public class PitwallDbContext : DbContext
    {
        public PitwallDbContext(DbContextOptions<PitwallDbContext> options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
        }
        public DbSet<PitwallUser> PitwallUsers { get; set; }
        public DbSet<Team> Teams { get; set; }
        public DbSet<Webhook> Webhooks { get; set; }
        public DbSet<TeamMember> TeamMembers { get; set; }
    }
}
