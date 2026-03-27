import os


def _set_test_environment() -> None:
    os.environ.setdefault("ENVIRONMENT", "test")
    os.environ.setdefault("PROJECT_NAME", "Full Stack Template Test")
    os.environ.setdefault("PG_HOST", "localhost")
    os.environ.setdefault("PG_PORT", "5432")
    os.environ.setdefault("PG_USER", "postgres")
    os.environ.setdefault("PG_PASSWORD", "postgres")
    os.environ.setdefault("PG_DB", "full_stack_template_test")
    os.environ.setdefault("FIRST_SUPERUSER_USERNAME", "admin")
    os.environ.setdefault("FIRST_SUPERUSER_PASSWORD", "testsuperpassword")
    os.environ.setdefault("SECRET_KEY", "test-secret-key")


_set_test_environment()
