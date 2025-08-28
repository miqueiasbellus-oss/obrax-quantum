from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import os
from datetime import datetime

# Importações locais (serão criadas)
# from app.core.config import settings
# from app.core.database import engine
# from app.api import auth, atividades, materiais, dashboard

app = FastAPI(
    title="OBRAX QUANTUM API",
    description="Sistema de gestão de obras: ERP nativo, controle total e obra viva",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configuração CORS - permite acesso de qualquer origem
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especificar domínios
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Endpoint raiz - status da API"""
    return {
        "message": "OBRAX QUANTUM API",
        "version": "1.0.0",
        "status": "online",
        "timestamp": datetime.now().isoformat(),
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    """Health check para monitoramento"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    }

# Endpoints temporários para teste
@app.get("/api/test")
async def test_endpoint():
    """Endpoint de teste"""
    return {
        "message": "API funcionando!",
        "features": [
            "Autenticação Google",
            "RBAC",
            "Atividades",
            "Materiais",
            "Dashboard",
            "IA Integrada"
        ]
    }

# Rotas da API (serão adicionadas)
# app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
# app.include_router(atividades.router, prefix="/api/atividades", tags=["atividades"])
# app.include_router(materiais.router, prefix="/api/materiais", tags=["materiais"])
# app.include_router(dashboard.router, prefix="/api/dashboard", tags=["dashboard"])

if __name__ == "__main__":
    # Configuração para desenvolvimento
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )

