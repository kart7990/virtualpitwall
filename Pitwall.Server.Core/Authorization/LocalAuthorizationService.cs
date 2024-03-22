using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Pitwall.Server.Core.Authorization.Models;
using Pitwall.Server.Core.Database;
using Pitwall.Server.Core.Database.Entities;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Pitwall.Server.Core.Authorization
{
    public class LocalAuthorizationService : IAuthorizationService
    {
        private static readonly DateTime EPOCH = new(1970, 1, 1);

        private readonly IAuthorizationConfiguration configuration;
        private readonly PitwallDbContext pitwallDbContext;

        public LocalAuthorizationService(IAuthorizationConfiguration configuration, PitwallDbContext pitwallDbContext)
        {
            this.configuration = configuration;
            this.pitwallDbContext = pitwallDbContext;
        }
        public async Task<JsonWebToken> AuthorizeLocalUser(IAuthorizedPitwallUser authorizedPitwallUser)
        {
            if (await pitwallDbContext.PitwallUsers.SingleOrDefaultAsync() == null)
            {
                await pitwallDbContext.PitwallUsers.AddAsync(new PitwallUser()
                {
                    Id = authorizedPitwallUser.Id,
                    Email = authorizedPitwallUser.Email,
                    Name = authorizedPitwallUser.Name
                });
                await pitwallDbContext.SaveChangesAsync();
            }

            return CreateJwtToken(authorizedPitwallUser);
        }

        private JsonWebToken CreateJwtToken(IAuthorizedPitwallUser user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration.JwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var jwt = new JsonWebToken();

            var expires = DateTime.UtcNow.AddSeconds(Convert.ToDouble(configuration.JwtWebExpireSeconds));

            var token = new JwtSecurityToken(
                configuration.JwtIssuer,
                configuration.JwtAudience,
                claims,
                expires: expires,
                signingCredentials: creds
            );
            jwt.AccessToken = new JwtSecurityTokenHandler().WriteToken(token);

            var exp = (long)(new TimeSpan(expires.Ticks - EPOCH.Ticks).TotalSeconds);

            jwt.Expires = exp;

            return jwt;
        }
    }
}
