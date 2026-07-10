import json
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import ContactMessage, GuestbookEntry

# Admin passcode for custom dashboard (simplifies auth for local demo)
ADMIN_PASSCODE = "12345"

def home_view(request):
    return render(request, 'core/index.html')

@csrf_exempt
def submit_contact_api(request):
    if request.method == 'POST':
        try:
            # Check if JSON or form data
            if request.content_type == 'application/json':
                data = json.loads(request.body)
            else:
                data = request.POST

            name = data.get('name', '').strip()
            email = data.get('email', '').strip()
            subject = data.get('subject', '').strip()
            message = data.get('message', '').strip()

            if not name or not email or not message:
                return JsonResponse({'status': 'error', 'message': 'Missing required fields.'}, status=400)

            msg = ContactMessage.objects.create(
                name=name,
                email=email,
                subject=subject or 'No Subject',
                message=message
            )
            return JsonResponse({'status': 'success', 'message': 'Thank you! Your message has been sent successfully.', 'id': msg.id})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    return JsonResponse({'status': 'error', 'message': 'Invalid HTTP method.'}, status=405)

@csrf_exempt
def guestbook_api(request):
    if request.method == 'GET':
        # Return only approved comments
        entries = GuestbookEntry.objects.filter(is_approved=True).order_by('-created_at')
        data = [{
            'id': e.id,
            'name': e.name,
            'message': e.message,
            'category': e.category,
            'created_at': e.created_at.strftime('%Y-%m-%d %H:%M')
        } for e in entries]
        return JsonResponse({'status': 'success', 'entries': data})

    elif request.method == 'POST':
        try:
            if request.content_type == 'application/json':
                data = json.loads(request.body)
            else:
                data = request.POST

            name = data.get('name', '').strip()
            message = data.get('message', '').strip()
            category = data.get('category', 'Visitor').strip()

            if not name or not message:
                return JsonResponse({'status': 'error', 'message': 'Name and message are required.'}, status=400)

            entry = GuestbookEntry.objects.create(
                name=name,
                message=message,
                category=category,
                is_approved=False # Requires approval by admin
            )
            return JsonResponse({
                'status': 'success', 
                'message': 'Your comment is submitted and is pending moderation approval by Nandhakumar!'
            })
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    
    return JsonResponse({'status': 'error', 'message': 'Invalid HTTP method.'}, status=405)

def dashboard_view(request):
    # Renders the custom admin dashboard to view messages & moderate comments
    is_admin = request.session.get('is_portfolio_admin', False)
    if not is_admin:
        return render(request, 'core/dashboard.html', {'authenticated': False})
    
    messages = ContactMessage.objects.all().order_by('-created_at')
    guestbook_entries = GuestbookEntry.objects.all().order_by('-created_at')
    
    context = {
        'authenticated': True,
        'messages': messages,
        'guestbook_entries': guestbook_entries,
    }
    return render(request, 'core/dashboard.html', context)

@csrf_exempt
def dashboard_api(request):
    if request.method == 'POST':
        try:
            if request.content_type == 'application/json':
                data = json.loads(request.body)
            else:
                data = request.POST

            action = data.get('action')
            
            # Authentication Action
            if action == 'login':
                passcode = data.get('passcode')
                if passcode == ADMIN_PASSCODE:
                    request.session['is_portfolio_admin'] = True
                    return JsonResponse({'status': 'success', 'message': 'Authenticated.'})
                return JsonResponse({'status': 'error', 'message': 'Invalid passcode.'}, status=401)
            
            if action == 'logout':
                request.session['is_portfolio_admin'] = False
                return JsonResponse({'status': 'success', 'message': 'Logged out.'})

            # Check admin session for modifying operations
            if not request.session.get('is_portfolio_admin', False):
                return JsonResponse({'status': 'error', 'message': 'Unauthorized.'}, status=403)

            # Modifying Actions
            entry_id = data.get('id')
            if action == 'approve_guestbook':
                entry = GuestbookEntry.objects.get(id=entry_id)
                entry.is_approved = True
                entry.save()
                return JsonResponse({'status': 'success', 'message': 'Entry approved.'})

            elif action == 'delete_guestbook':
                entry = GuestbookEntry.objects.get(id=entry_id)
                entry.delete()
                return JsonResponse({'status': 'success', 'message': 'Entry deleted.'})

            elif action == 'delete_message':
                msg = ContactMessage.objects.get(id=entry_id)
                msg.delete()
                return JsonResponse({'status': 'success', 'message': 'Message deleted.'})

            return JsonResponse({'status': 'error', 'message': 'Unknown action.'}, status=400)
            
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

    return JsonResponse({'status': 'error', 'message': 'Invalid HTTP method.'}, status=405)
