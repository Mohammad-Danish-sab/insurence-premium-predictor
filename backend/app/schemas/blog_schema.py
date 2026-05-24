from datetime import datetime


def blog_structure(data):
    return {
        "title": data.title,
        "content": data.content,
        "image": data.image,
        "author": data.author,
        "created_at": datetime.utcnow(),
    }