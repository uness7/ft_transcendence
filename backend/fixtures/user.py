import pytest;
from user.models import User;

data_user = {
	"username": "messi10",
	"email": "messi@gmail.com",
	"first_name": "test_user1_name",
	"last_name": "test_user1_last_name",
	"password": "testpass123!",
};

@pytest.fixture
def user(db) -> User:
	return User.objects.create_user(**data_user);
