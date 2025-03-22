import os
from dotenv import load_dotenv
from typing import Union
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from langchain_community.chat_models import ChatOpenAI
from langchain.schema import AIMessage, HumanMessage, SystemMessage

load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

llm = ChatOpenAI(
    model_name="gpt-4o-mini-2024-07-18",
    openai_api_key=OPENAI_API_KEY,
    streaming=True
)

async def generate_response(message: str):
    for chunk in llm.stream([HumanMessage(content=message)]):
        print(chunk.content)
        yield chunk.content


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

@app.post("/chat")
async def chat(request: dict):
    message = request.get("message","")
    return StreamingResponse(generate_response(message), media_type="text/plain")
