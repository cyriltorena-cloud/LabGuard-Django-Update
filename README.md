# LabGuard — React + Django starter

This is a starter implementation for the agreed LabGuard workflow:
- Students register through the React app.
- Teachers/admins are created by an authorized administrator in Django Admin (not by public registration).
- Student login attempts to read a configured PC ID from the local PC agent at `http://127.0.0.1:8765/pc-id`.
- The Django API records active sessions and shows them to Admin/Teacher accounts.

## Important limitations
- This is a development starter, not production-ready security.
- The PC ID returned by the local agent helps identify a workstation but, by itself, is not cryptographic proof that the request came from that PC.
- **It does not lock or unlock Windows.** React + Django cannot stop someone from using Windows before website login. A properly managed Windows kiosk/Assigned Access or Group Policy configuration and a secured, authenticated PC agent are separate deployment tasks.
- Do not expose Django's development server to the internet. Use HTTPS, secure secrets, database backups, and proper device authentication before real deployment.

## Requirements
- Python 3.11+ recommended
- Node.js 20+ recommended
- Windows 10/11 for each lab PC

## 1. Start Django backend
Open PowerShell:
```powershell
cd path\to\LabGuard-Django-Update\backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
python manage.py makemigrations core
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver 127.0.0.1:8000
```
Keep this terminal open. API base URL is `http://127.0.0.1:8000/api/`.

Keep the backend terminal running. In your browser, go to `http://127.0.0.1:8000/admin/` and sign in with the superuser. Under **Lab computers**, add a computer with a unique Computer ID such as `PC-01`. Under **Profiles**, assign a user the role Teacher or Admin. Create the corresponding Django user first under Users; then create its Profile. (The admin user itself can also be assigned a profile.)

## 2. Start React frontend
Open another PowerShell window:
```powershell
cd path\to\LabGuard-Django-Update\frontend
npm install
Copy-Item .env.example .env
npm run dev -- --host 127.0.0.1
```
Open the URL Vite prints, normally `http://127.0.0.1:5173/`.

## 3A. One-computer test versus multiple lab PCs
The steps above are for testing the React app and Django backend on the **same computer**. For a real multi-PC lab, host Django and the frontend on a designated lab server, then set `VITE_API_BASE_URL` in the frontend `.env` to the server's LAN address, for example `http://192.168.1.10:8000/api`. Set `LABGUARD_ALLOWED_HOSTS` to include that server IP and `LABGUARD_CORS_ORIGINS` to include the exact frontend origin, for example `http://192.168.1.10:5173`. Start Django listening on the LAN with `python manage.py runserver 0.0.0.0:8000` only on a trusted lab network for testing, and configure the firewall appropriately. Django's development server is not for production deployment.

## 3B. Configure the local PC ID agent on each lab PC
On each Windows lab PC, copy the `pc-agent` folder to that computer. Edit `config.json` so the `computer_id` matches a record created in Django Admin, e.g. `PC-01`.

In PowerShell on that PC:
```powershell
cd path\to\pc-agent
py pc_agent.py
```
Keep it running while testing. The React app reads the ID from `http://127.0.0.1:8765/pc-id`. Each computer must have its own config, e.g. PC-01, PC-02. This simple agent is for development/testing only; it is not a Windows lock service.

## 4. Test the flow
1. Register a student from the React app.
2. Confirm the student can sign in.
3. With the local agent running and a matching computer record in Django Admin, the student login starts a session for that PC.
4. Sign in as a Teacher/Admin to see registered computers and active sessions.
5. End the student session using the student's **End Session** button, or have an authorized staff member close the session from the dashboard.

## Account policy
- Public registration creates Student accounts only.
- Create/approve Teacher and Admin accounts through Django Admin, using an authorized administrator.
- The seeded demo accounts from the old frontend-only version are not carried over. Create real test accounts in Django Admin or register a student in the app.
