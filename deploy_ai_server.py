# deploy_ai_server.py
# This script deploys Ollama with the Mistral model as a public, serverless API on Modal.
# FINAL VERSION: Correctly starts the ollama server in the background before pulling the model.

from modal import Image, App, asgi_app

# --- START OF CORRECTION ---
# Start from a standard Python image.
# Install Ollama, then in a single RUN command, start the server in the background
# and then pull the model. The `&` runs the server as a background process.
# `sleep 2` gives the server a moment to initialize before we pull.
ollama_image = (
    Image.debian_slim(python_version="3.11")
    .run_commands(
        "apt-get update",
        "apt-get install -y curl",
        "curl -fsSL https://ollama.com/install.sh | sh",
        # Start server in background, wait, then pull model.
        "ollama serve & sleep 2 && ollama pull mistral",
    )
)
# --- END OF CORRECTION ---

app = App("amara-ollama-server")

@app.function(
    image=ollama_image,
    gpu="any",
    min_containers=1,
    timeout=600,
    concurrency_limit=10,
)
@asgi_app()
def ollama_server():
    import subprocess
    import time
    
    ollama_path = "/usr/local/bin/ollama"
    
    # Start the Ollama server in the background
    ollama_process = subprocess.Popen([ollama_path, "serve"])
    
    time.sleep(3)
    
    from litestar import Litestar, get
    from litestar.proxies import HTTPProxy

    ollama_proxy = HTTPProxy(path="/", base_url="http://127.0.0.1:11434")

    @get("/health")
    def health() -> dict:
        return {"status": "ok"}

    return Litestar(route_handlers=[health, ollama_proxy])