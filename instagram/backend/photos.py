import uuid
from pathlib import Path
from fastapi import UploadFile, HTTPException
from PIL import Image, ImageOps, UnidentifiedImageError

Path('media').mkdir(exist_ok=True)

def save_photo(photo: UploadFile, x, y, width, height):
  try:
    image = Image.open(photo.file)
  except UnidentifiedImageError:
    raise HTTPException(status_code=400, detail='이미지 파일만 올릴 수 있습니다.')

  image = ImageOps.exif_transpose(image)

  # crop
  w, h = image.size
  left = round(w * x / 100)
  top = round(h * y / 100)
  right = round(w * (x + width) / 100)
  bottom = round(h * (y + height) / 100)
  image = image.crop((left, top, right, bottom))

  image = ImageOps.fit(image, (1080, 1080))
  image = image.convert('RGB')

  name = f'{uuid.uuid4().hex}.jpg'
  image.save(f'media/{name}')

  return f'/media/{name}'