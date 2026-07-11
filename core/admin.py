from django.contrib import admin
from .models import ContactMessage, GuestbookEntry

admin.site.register(ContactMessage)
admin.site.register(GuestbookEntry)