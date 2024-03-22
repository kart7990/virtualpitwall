#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Debug
WORKDIR /src
COPY ["Pitwall.Server.Api/Pitwall.Server.Api.csproj", "Pitwall.Server.Api/"]
COPY ["Pitwall.Core/Pitwall.Core.csproj", "Pitwall.Core/"]
COPY ["Pitwall.Server.Core/Pitwall.Server.Core.csproj", "Pitwall.Server.Core/"]
RUN dotnet restore "./Pitwall.Server.Api/./Pitwall.Server.Api.csproj"
COPY . .
WORKDIR "/src/Pitwall.Server.Api"
RUN dotnet build "./Pitwall.Server.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build