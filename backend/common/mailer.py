import os
from fastapi import BackgroundTasks
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from models.user import UserDB, UserRegister

from dotenv import load_dotenv
load_dotenv()

FRONTEND_URL = os.getenv('FRONTEND_URL')
RECOVERY_URL = os.getenv('RECOVERY_URL')
class Envs:
    MAIL_USERNAME = os.getenv('MAIL_USERNAME')
    MAIL_PASSWORD = os.getenv('MAIL_PASSWORD')
    MAIL_FROM = os.getenv('MAIL_FROM')
    MAIL_PORT = int(os.getenv('MAIL_PORT'))
    MAIL_SERVER = os.getenv('MAIL_SERVER')
    MAIL_FROM_NAME = os.getenv('MAIL_FROM_NAME')


conf = ConnectionConfig(
    MAIL_USERNAME=Envs.MAIL_USERNAME,
    MAIL_PASSWORD=Envs.MAIL_PASSWORD,
    MAIL_FROM=Envs.MAIL_FROM,
    MAIL_PORT=Envs.MAIL_PORT,
    MAIL_SERVER=Envs.MAIL_SERVER,
    MAIL_FROM_NAME=Envs.MAIL_FROM_NAME,
    MAIL_STARTTLS=False,
    MAIL_SSL_TLS=True,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)


def send_email_background(background_tasks: BackgroundTasks, subject: str, user: UserRegister):
    message = MessageSchema(
        subject=subject,
        recipients=[user.email],
        body=f'''<html>
<body style="margin: 0; padding: 0; box-sizing: border-box; font-family: Arial, Helvetica, sans-serif;">
<div style="width: 100%; background: #efefef; border-radius: 10px; padding: 10px;">
  <div style="margin: 0 auto; width: 90%; text-align: center;">
    <h1 style="background-color: rgba(0, 53, 102, 1); padding: 5px 10px; border-radius: 5px; color: white;">Добро пожаловать!</h1>
    <div style="margin: 30px auto; background: white; width: 40%; border-radius: 10px; padding: 50px; text-align: center;">
      <h3 style="margin-bottom: 100px; font-size: 24px;">{user.nickname}</h3>
      <p style="margin-bottom: 30px;">Рады видеть вас на сайте, располагайтесь.</p>
      <a style="display: block; margin: 0 auto; border: none; background-color: rgba(255, 214, 10, 1); color: white; width: 200px; line-height: 24px; padding: 10px; font-size: 24px; border-radius: 10px; cursor: pointer; text-decoration: none;"
        href="{FRONTEND_URL}"
        target="_blank"
      >
        Поехали!
      </a>
    </div>
  </div>
</div>
</body>
</html>
        ''',
        subtype=MessageType.html,
    )

    fm = FastMail(conf)

    background_tasks.add_task(
        fm.send_message, message)

def send_key_email_background(background_tasks: BackgroundTasks, subject: str, user: UserDB, key_code: str):
    message = MessageSchema(
        subject=subject,
        recipients=[user.email],
        body=f'''<html>
<body style="margin: 0; padding: 0; box-sizing: border-box; font-family: Arial, Helvetica, sans-serif;">
<div style="width: 100%; background: #efefef; border-radius: 10px; padding: 10px;">
  <div style="margin: 0 auto; width: 90%; text-align: center;">
    <h1 style="background-color: rgba(0, 53, 102, 1); padding: 5px 10px; border-radius: 5px; color: white;">Уведомление!</h1>
    <div style="margin: 30px auto; background: white; width: 40%; border-radius: 10px; padding: 50px; text-align: center;">
      <h3 style="margin-bottom: 100px; font-size: 24px;">{user.nickname}</h3>
      <p style="margin-bottom: 30px;">Только что вы приобрели продукт на нашем сайте, приятного использования! Ниже вы представлено содержимое товара. Пожалуйста, не показывайте его никому, даже продавцу.</p>
      <p style="margin-bottom: 30px;"><strong>{key_code}</strong></p>
    </div>
  </div>
</div>
</body>
</html>
        ''',
        subtype=MessageType.html,
    )

    fm = FastMail(conf)

    background_tasks.add_task(
        fm.send_message, message)
    
def send_recovery_background(background_tasks: BackgroundTasks, subject: str, email: str, code: str):
    message = MessageSchema(
        subject=subject,
        recipients=[email],
        body=f'''<html>
<body style="margin: 0; padding: 0; box-sizing: border-box; font-family: Arial, Helvetica, sans-serif;">
<div style="width: 100%; background: #efefef; border-radius: 10px; padding: 10px;">
  <div style="margin: 0 auto; width: 90%; text-align: center;">
    <h1 style="background-color: rgba(0, 53, 102, 1); padding: 5px 10px; border-radius: 5px; color: white;">Уведомление!</h1>
    <div style="margin: 30px auto; background: white; width: 40%; border-radius: 10px; padding: 50px; text-align: center;">
      <h3 style="margin-bottom: 100px; font-size: 24px;">Уважаемый пользователь</h3>
      <p style="margin-bottom: 30px;">Только что вы запросили запрос на восстановление пароля, если это не вы, не переходите по ссылке!</p>
      <p style="margin-bottom: 30px;"><strong>Ссылка станет недействительной через 10 минут!</strong></p>
      <a style="display: block; margin: 0 auto; border: none; background-color: rgba(255, 214, 10, 1); color: white; width: 200px; line-height: 24px; padding: 10px; font-size: 24px; border-radius: 10px; cursor: pointer; text-decoration: none;"
        href="{f'{RECOVERY_URL}?code={code}'}"
        target="_blank"
      >
        Перейти
      </a>
    </div>
  </div>
</div>
</body>
</html>
        ''',
        subtype=MessageType.html,
    )

    fm = FastMail(conf)

    background_tasks.add_task(
        fm.send_message, message)