import pytest;

from user.models import User;

# User model tests
data_user = {
        "username": "test_user1",
        "email": "test_user1@gmail.com",
        "first_name": "test_user1_name",
        "last_name": "test_user1_last_name",
        "password": "testpass123!",
};

@pytest.mark.django_db
def test_create_user():
    user = User.objects.create_user(**data_user);
    assert user.username == data_user["username"];
    assert user.email == data_user["email"];
    assert user.first_name == data_user["first_name"];
    assert user.last_name == data_user["last_name"];

# Superuser model tests
data_super_user = {
        "username": "test_super_user1",
        "email": "test_super_user1@gmail.com",
        "first_name": "test_super_user1_name",
        "last_name": "test_super_user1_last_name",
        "password": "testpass123!",
};

@pytest.mark.django_db
def test_create_super_user():
    superuser = User.objects.create_superuser(**data_super_user);
    assert superuser.username == data_super_user["username"];
    assert superuser.email == data_super_user["email"];
    assert superuser.first_name == data_super_user["first_name"];
    assert superuser.last_name == data_super_user["last_name"];
    assert superuser.is_superuser == True;
    assert superuser.is_staff == True;



