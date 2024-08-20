from cryptography.fernet import Fernet
from dotenv import load_dotenv
import os


class HasherKey:
    load_dotenv()
    key = os.getenv("FERNET_KEY").encode()
    cipher = Fernet(key)

    def encrypt_key(self, key: str):
        return self.cipher.encrypt(key.encode()).decode()

    def decrypt_key(self, crypt_key: str):
        return self.cipher.decrypt(crypt_key.encode()).decode()

