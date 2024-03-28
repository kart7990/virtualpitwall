using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Pitwall.Server.Core.Authorization.Models;
using Pitwall.Server.Core.Database;
using Pitwall.Server.Core.Database.Entities;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;

namespace Pitwall.Server.Core.Authorization
{
    public class AuthorizationService : IAuthorizationService
    {
        private static readonly DateTime EPOCH = new(1970, 1, 1);

        private readonly IAuthorizationConfiguration configuration;
        private readonly PitwallDbContext pitwallDbContext;

        public AuthorizationService(IAuthorizationConfiguration configuration, PitwallDbContext pitwallDbContext)
        {
            this.configuration = configuration;
            this.pitwallDbContext = pitwallDbContext;
        }

        public async Task<AuthorizationResult> AuthorizeOAuthUser(AuthorizeRequest loginExternal)
        {
            var validationResult = await ValidateGoogleOAuth2(loginExternal.Token);

            if (validationResult.Email == null)
            {
                return null;
            }

            return await AuthorizeUser(validationResult.Email, validationResult.Name);
        }

        public async Task<AuthorizationResult> AuthorizeTestUser()
        {
            if (!configuration.IsTestUserEnabled)
            {
                throw new InvalidOperationException("Test users not enabled in this environment");
            }

            var guid = Guid.NewGuid().ToString();
            var shortenedGuid = guid.Substring(guid.LastIndexOf("-") + 1);
            return await AuthorizeUser($"test-{shortenedGuid}@virtualpitbox.com", $"John Doe-{shortenedGuid}");
        }

        private async Task<AuthorizationResult> AuthorizeUser(string email, string name)
        {
            var pitwallUser = await pitwallDbContext.PitwallUsers.SingleOrDefaultAsync(r => r.Email.Equals(email.ToLower()));

            if (pitwallUser == null)
            {
                var newUser = await pitwallDbContext.PitwallUsers.AddAsync(new PitwallUser() { Email = email, Name = name });
                await pitwallDbContext.SaveChangesAsync();
                pitwallUser = newUser.Entity;
            }

            ;

            return new AuthorizationResult(CreateJwtToken(pitwallUser), pitwallUser);
        }

        private static async Task<ValidationResult> ValidateGoogleOAuth2(string token)
        {
            var url = "https://www.googleapis.com/oauth2/v3/userinfo";
            using (var client = new HttpClient())
            {
                using (var requestMessage = new HttpRequestMessage(HttpMethod.Get, url))
                {
                    requestMessage.Headers.Authorization =
                        new AuthenticationHeaderValue("Bearer", token);

                    var response = await client.SendAsync(requestMessage);

                    var jsonString = await response.Content.ReadAsStringAsync();
                    return JsonConvert.DeserializeObject<ValidationResult>(jsonString);
                }
            }
        }

        private JsonWebToken CreateJwtToken(IPitwallUser user)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim("name", user.Name),
                new Claim("email", user.Email),
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
