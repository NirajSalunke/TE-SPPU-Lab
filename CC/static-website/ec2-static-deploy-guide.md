# Deploy Static HTML on AWS EC2 (Ubuntu) via Apache

## Prerequisites
- EC2 Ubuntu instance running
- SSH access working
- Security Group has port 22, 80, 443 open to `0.0.0.0/0`

---

## Step 1: Update & Install Apache

```bash
sudo apt update -y
sudo apt install -y apache2
```

## Step 2: Start & Enable Apache

```bash
sudo systemctl start apache2
sudo systemctl enable apache2
```

## Step 3: Place Your HTML File

### Option A — Create a quick test page
```bash
echo "<h1>Hello! It works!</h1>" | sudo tee /var/www/html/index.html
```

### Option B — Paste your own HTML using nano
```bash
sudo nano /var/www/html/index.html
```
- Paste your HTML content
- Press `Ctrl + O` → Enter to save
- Press `Ctrl + X` to exit

### Option C — Upload from your local machine (run in local PowerShell)
```powershell
scp -i D:\Downloads\your-key.pem index.html ubuntu@<your-ec2-public-ip>:/var/www/html/
```

---

## Step 4: Fix File Permissions

```bash
sudo chmod 644 /var/www/html/index.html
sudo chown www-data:www-data /var/www/html/index.html
```

## Step 5: Restart Apache

```bash
sudo systemctl restart apache2
```

## Step 6: Verify Locally on Server

```bash
curl http://localhost
```
You should see your HTML content in the terminal output.

---

## Step 7: Access Publicly in Browser

```
http://<your-ec2-public-ip>
```
or use the DNS name:
```
http://ec2-xx-xx-xx-xx.ap-south-1.compute.amazonaws.com
```

> ⚠️ Always use `http://` NOT `https://` — no SSL is configured.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `ERR_CONNECTION_REFUSED` in browser | Make sure port 80 is open in Security Group |
| Browser shows Apache default page | Your `index.html` may be overwritten — re-paste it using nano |
| `curl http://localhost` works but browser doesn't | Try DNS name instead of IP, or explicitly type `http://` in browser |
| SSH key bad permissions (Windows) | Run `icacls` to restrict `.pem` file access to your user only |
