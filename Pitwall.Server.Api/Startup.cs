using Asp.Versioning;
using Asp.Versioning.ApiExplorer;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Pitwall.Server.Api.Authorization;
using Pitwall.Server.Api.Controllers.Session.v1.WebSockets;
using Pitwall.Server.Api.Controllers.Session.v1.WebSockets.GameData;
using Pitwall.Server.Api.Controllers.Session.v1.WebSockets.Telemetry;
using Pitwall.Server.Core;
using Pitwall.Server.Core.Authorization.Models;
using Pitwall.Server.Core.Database;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace Pitwall.Server.Api
{
    public class Startup(IConfiguration configuration)
    {
        private readonly static string CORS_POLICY_NAME = "ALLOW_WEB_APP_ONLY";

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddApiVersioning(options =>
            {
                options.DefaultApiVersion = new ApiVersion(1, 0);
                options.AssumeDefaultVersionWhenUnspecified = true;
                options.ReportApiVersions = true;
            }).AddApiExplorer(options =>
            {
                options.GroupNameFormat = "'v'VVV";
                options.SubstituteApiVersionInUrl = true;
            });

            services.AddHttpContextAccessor();
            services.TryAddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            // Add Jwt Authentication
            JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear(); // => remove default claims
            services
                .AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;

                })
                .AddJwtBearer(cfg =>
                {
                    cfg.RequireHttpsMetadata = false;
                    cfg.SaveToken = true;
                    cfg.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidIssuer = configuration["JwtIssuer"],
                        ValidAudience = configuration["JwtAudience"],
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JwtKey"])),
                        ClockSkew = TimeSpan.Zero, // remove delay of token when expire
                        ValidateLifetime = true
                    };
                    cfg.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = context =>
                        {
                            // If the request is for our web sockets hub, extract oauth token and set it in context
                            var path = context.HttpContext.Request.Path;
                            if (ConnectionDetails.Endpoints.Values.Any(url => path.StartsWithSegments(url)))
                            {
                                // Read the token out of the query string
                                var accessToken = context.Request.Query["access_token"];

                                if (string.IsNullOrEmpty(accessToken))
                                {
                                    // Read the token out of Authorization header
                                    accessToken = context.Request.Headers.SingleOrDefault(h => h.Key == "Authorization").Value.ToString().Replace("Bearer ", "");
                                }

                                context.Token = accessToken;
                            }
                            return Task.CompletedTask;
                        }
                    };
                });

            services.AddScoped<IHttpContextUser, HttpContextUserProvider>();
            services.AddServices<AuthorizedPitwallUser>(dbOptions =>
                dbOptions.UseSqlServer(configuration.GetConnectionString("PitwallDatabase"), c => c.MigrationsAssembly("Pitwall.Server.Api")),
                configuration.GetConnectionString("RedisCache"));

            // Add cors support
            var corsOrigins = configuration.GetSection("CorsOrigins").Value.Split(",");

            services.AddCors(options => options.AddPolicy(CORS_POLICY_NAME, builder => builder
               .WithOrigins(corsOrigins)
               .AllowAnyHeader()
               .AllowAnyMethod()
               .AllowCredentials()
           ));

            services.AddControllers();

            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen(options =>
            {
                options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.Http,
                    BearerFormat = "JWT",
                    Scheme = "Bearer"
                });
                options.CustomSchemaIds(type => type.FullName);
                // add a custom operation filter which sets default values
                options.OperationFilter<SwaggerConfiguration>();
            });
            services.AddTransient<IConfigureOptions<SwaggerGenOptions>, SwaggerConfiguration>();
            services.AddSwaggerGenNewtonsoftSupport();

            // Add MVC and Json response ref loop configuration.
            services
                .AddMvc(options =>
                {
                    //options.Filters.Add(new DelayFilter());
                })
                .AddNewtonsoftJson(options =>
                {
                    options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
                });
            services.AddSignalR()
                .AddNewtonsoftJsonProtocol(opt =>
                {
                    opt.PayloadSerializerSettings.ContractResolver = new DefaultContractResolver
                    {
                        NamingStrategy = new CamelCaseNamingStrategy()
                    };
                });
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IApiVersionDescriptionProvider provider)
        {
            app.UseRouting();

            // Use Cors with configuration
            app.UseCors(CORS_POLICY_NAME);

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            if (bool.Parse(configuration["UseSwagger"]))
            {
                app.UseSwagger();
                app.UseSwaggerUI(options =>
                {
                    foreach (var description in provider.ApiVersionDescriptions)
                    {
                        options.SwaggerEndpoint(
                            $"{configuration["SwaggerJsonRootPath"]}/swagger/{description.GroupName}/swagger.json",
                            description.GroupName.ToUpperInvariant());
                    }
                });
            }

            if (bool.Parse(configuration["AutoMigrationEnabled"]))
            {
                using var scope = app.ApplicationServices.CreateScope();
                var pitwallDbContext = scope.ServiceProvider.GetRequiredService<PitwallDbContext>();
                pitwallDbContext.Database.EnsureCreated();
                if (pitwallDbContext.Database.GetAppliedMigrations().Any())
                {
                    pitwallDbContext.Database.Migrate();
                }
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapHub<PitwallSessionHub>(PitwallSessionHub.PATH);
                endpoints.MapHub<GameDataPublisherHub>(GameDataPublisherHub.PATH);
                endpoints.MapHub<GameDataSubscriberHub>(GameDataSubscriberHub.PATH);
                endpoints.MapHub<TelemetryPublisherHub>(TelemetryPublisherHub.PATH);
                endpoints.MapHub<TelemetrySubscriberHub>(TelemetrySubscriberHub.PATH);
                endpoints.MapDefaultControllerRoute();
            });
        }
    }
}
