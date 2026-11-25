from fastapi import APIRouter, UploadFile, Form
from deps import CurrentUserDep
from photos import save_photo
from schemas import UploadOut

router = APIRouter(prefix='/api/uploads', tags=['uploads'])

@router.post('', response_model=UploadOut, status_code=201)
def upload(
  photo: UploadFile, 
  user: CurrentUserDep,
  x: float = Form(0),
  y: float = Form(0),
  width: float = Form(100),
  height: float = Form(100)
):
  return {'image_url': save_photo(photo, x, y, width, height)}