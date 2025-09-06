from fastapi import FastAPI
import uvicorn

app = FastAPI(title="Test API")

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/test")
async def test():
    return {"status": "working"}

if __name__ == "__main__":
    print("Starting minimal test server...")
    uvicorn.run(app, host="0.0.0.0", port=8002)
