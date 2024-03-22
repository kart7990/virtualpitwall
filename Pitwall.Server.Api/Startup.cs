using Asp.Versioning;
using Asp.Versioning.ApiExplorer;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json;
using Pitwall.Server.Api.Authorization;
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
        public IConfiguration Configuration { get; } = configuration;

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
                        ValidIssuer = Configuration["JwtIssuer"],
                        ValidAudience = Configuration["JwtIssuer"],
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["JwtKey"])),
                        ClockSkew = TimeSpan.Zero, // remove delay of token when expire
                        ValidateLifetime = true
                    };
                    cfg.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = context =>
                        {
                            // If the request is for our hub...
                            var path = context.HttpContext.Request.Path;
                            //if (HubEndpoints.Endpoints.Values.Any(url => path.StartsWithSegments(url)))
                            //{
                            //    var accessToken = context.Request.Query["access_token"];

                            //    if (string.IsNullOrEmpty(accessToken))
                            //    {
                            //        accessToken = context.Request.Headers.SingleOrDefault(h => h.Key == "Authorization").Value.ToString().Replace("Bearer ", "");
                            //    }

                            //    // Read the token out of the query string
                            //    context.Token = accessToken;
                            //}
                            return Task.CompletedTask;
                        }
                    };
                });

            services.AddScoped<IHttpContextUser, HttpContextUserProvider>();
            services.AddServices<AuthorizedPitwallUser>(dbOptions =>
                dbOptions.UseSqlServer(Configuration.GetConnectionString("PitwallDatabase"), c => c.MigrationsAssembly("Pitwall.Server.Api")),
                Configuration.GetConnectionString("RedisCache"));

            // Add cors support
            var corsOrigins = Configuration.GetSection("CorsOrigins").GetChildren().Select(c => c.Value).ToArray();
            services.AddCors(options => options.AddPolicy("CorsPolicy", builder => builder
               .WithOrigins(corsOrigins)
               .AllowAnyHeader()
               .AllowAnyMethod()
               .AllowCredentials()
           ));

            services.AddCors(options =>
            {
                options.AddPolicy(
                    "AllowAny",
                    x =>
                    {
                        x.AllowAnyHeader()
                        .AllowAnyMethod()
                        .SetIsOriginAllowed(isOriginAllowed: _ => true)
                        .AllowCredentials();
                    });
            });

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
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IApiVersionDescriptionProvider provider)
        {
            app.UseRouting();

            // Use Cors with configuration
            app.UseCors("AllowAny");

            // Configure the HTTP request pipeline.
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(options =>
                {
                    foreach (var description in provider.ApiVersionDescriptions)
                    {
                        options.SwaggerEndpoint(
                            $"{Configuration["SwaggerJsonRootPath"]}/swagger/{description.GroupName}/swagger.json",
                            description.GroupName.ToUpperInvariant());
                    }
                });

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
                endpoints.MapDefaultControllerRoute();
            });
        }
    }
}
