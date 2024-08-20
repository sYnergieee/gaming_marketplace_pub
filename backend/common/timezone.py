from datetime import datetime, timedelta, timezone


def get_datetime():
    tz = timezone(timedelta(hours=3))
    return datetime.now(tz=tz)
