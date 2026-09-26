from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Task
from ..schemas.task import TaskCreate, TaskResponse


router = APIRouter(
    prefix="/api/tasks",
    tags=["Tasks"],
)


@router.post("/", response_model=TaskResponse)
def create_task(
    task_data: TaskCreate,
    db: Session = Depends(get_db),
):
    task = Task(
        title=task_data.title,
        description=task_data.description,
    )

    db.add(task)
    db.commit()
    db.refresh(task)

    return task


@router.get("/", response_model=list[TaskResponse])
def get_tasks(
    db: Session = Depends(get_db),
):
    return db.query(Task).all()