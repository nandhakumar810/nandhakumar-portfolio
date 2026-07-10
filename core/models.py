from django.db import models

class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message from {self.name} - {self.subject}"

class GuestbookEntry(models.Model):
    CATEGORY_CHOICES = [
        ('Recruiter', 'Recruiter'),
        ('Peer', 'Developer/Peer'),
        ('Visitor', 'General Visitor'),
    ]
    name = models.CharField(max_length=100)
    message = models.TextField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='Visitor')
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        status = "Approved" if self.is_approved else "Pending"
        return f"[{status}] {self.name} ({self.category})"
