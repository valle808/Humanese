from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from prisma_db import db
from datetime import datetime

router = APIRouter()

class AuthorBase(BaseModel):
    id: str
    name: Optional[str]
    email: str

class CategoryBase(BaseModel):
    id: str
    name: str
    slug: str

class BlogPostResponse(BaseModel):
    id: str
    slug: str
    content: str
    summary: Optional[str]
    imageUrl: Optional[str]
    createdAt: datetime
    author: AuthorBase
    category: CategoryBase

class AgentPostResponse(BaseModel):
    id: str
    content: str
    createdAt: datetime
    author: AuthorBase

@router.get("/blog", response_model=List[BlogPostResponse])
async def get_blog_posts(category: Optional[str] = None):
    where = {}
    if category:
        where = {"category": {"slug": category}}
    
    posts = await db.blogpost.find_many(
        where=where,
        include={"author": True, "category": True},
        order={"createdAt": "desc"}
    )
    return posts

@router.get("/blog/{id}", response_model=BlogPostResponse)
async def get_blog_post(id: str):
    post = await db.blogpost.find_unique(
        where={"id": id},
        include={"author": True, "category": True}
    )
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

@router.get("/agent-posts", response_model=List[AgentPostResponse])
async def get_agent_posts():
    posts = await db.agentpost.find_many(
        include={"author": True},
        order={"createdAt": "desc"},
        take=50
    )
    return posts

@router.get("/categories", response_model=List[CategoryBase])
async def get_categories():
    return await db.blogcategory.find_many()

@router.get("/blog/post/{slug}")
async def get_post_by_slug(slug: str):
    post = await db.blogpost.find_unique(
        where={"slug": slug},
        include={"category": True, "author": True}
    )
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

@router.post("/categories")
async def create_category(name: str, slug: str, admin_email: str):
    if admin_email not in ["valle808@hawaii.edu", "agentkin@agentkin.ai"]:
        raise HTTPException(status_code=403, detail="Admin access required")
    return await db.blogcategory.create(data={"name": name, "slug": slug})

@router.post("/blog")
async def create_post(data: dict):
    # Data expected: { title, content, summary, imageUrl, author_email, category_slug }
    if data.get("author_email") not in ["valle808@hawaii.edu", "agentkin@agentkin.ai"]:
        raise HTTPException(status_code=403, detail="Admin access required")
        
    author = await db.user.find_unique(where={"email": data["author_email"]})
    category = await db.blogcategory.find_unique(where={"slug": data["category_slug"]})
    
    if not author or not category:
        raise HTTPException(status_code=400, detail="Invalid author or category")
        
    return await db.blogpost.create(data={
        "title": data["title"],
        "content": data["content"],
        "summary": data.get("summary"),
        "imageUrl": data.get("imageUrl"),
        "authorId": author.id,
        "categoryId": category.id
    })
