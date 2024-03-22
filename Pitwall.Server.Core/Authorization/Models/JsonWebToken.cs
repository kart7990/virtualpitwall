namespace Pitwall.Server.Core.Authorization.Models
{
    public class JsonWebToken
    {
        public string AccessToken { get; set; }
        /// <summary>
        /// Epoch Seconds
        /// </summary>
        public long Expires { get; set; }
    }
}