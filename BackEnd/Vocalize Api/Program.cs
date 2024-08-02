using DotNetEnv;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.OpenApi.Models;
using Vocalize_Api.Interfaces;
using Vocalize_Api.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Carrega as variáveis de ambiente do arquivo .env
Env.Load();

builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();

//Adicione o gerador do Swagger � cole��o de servi�os
builder.Services.AddSwaggerGen(options =>
{
    //Adiciona informa��es sobre a API no Swagger
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Version = "v1",
        Title = "API Vocalize",
        Description = "Backend API",
        Contact = new OpenApiContact
        {
            Name = "Vocalize"
        }
    });
});

// Registrando o servi�o de e-mail como uma inst�ncia transit�ria, que � criada cada vez que � solicitada
builder.Services.AddTransient<ISpeakServiceRepository, SpeakServiceRepository>();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy",
        builder =>
        {
            builder.AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
        });
});

var app = builder.Build();

//Habilite o middleware para atender ao documento JSON gerado e � interface do usu�rio do Swagger
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//Para atender � interface do usu�rio do Swagger na raiz do aplicativo
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
    options.RoutePrefix = string.Empty;
});

app.UseCors("CorsPolicy");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();