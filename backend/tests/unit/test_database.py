def test_db_session(db_session):
    """
    Test that the db_session fixture is working.
    """
    assert db_session is not None
