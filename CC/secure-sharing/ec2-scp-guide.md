# AWS EC2 SCP Guide
## Complete Step-by-Step: File Transfer Between EC2 Instances

---

## 1. Setup Overview

| Step | What You Do | From Where |
|------|-------------|------------|
| 1 | Create key pair & security group | AWS Console |
| 2 | Launch Instance A & B | AWS Console |
| 3 | SCP `.pem` key from laptop → Instance A | Local Machine |
| 4 | SSH into Instance A | Local Machine |
| 5 | SCP file from Instance A → Instance B | Instance A (private IP) |

---

## 2. Create Key Pair

1. Go to **AWS Console → EC2 → Key Pairs → Create key pair**
2. Name: `static`
3. Type: `RSA`, Format: `.pem`
4. Download `static.pem` to your laptop
5. Fix permissions:

**Linux/Mac:**
```bash
chmod 400 static.pem
```

**Windows (PowerShell):**
```powershell
icacls .\static.pem /inheritance:r /grant:r "$($env:USERNAME):(R)"
```

---

## 3. Create Security Group

1. Go to **EC2 → Security Groups → Create security group**
2. Name: `ec2-scp-sg`
3. VPC: Select your default VPC
4. Add inbound rules:

| Type | Port | Source | Purpose |
|------|------|--------|---------|
| SSH  | 22   | My IP  | Access from your laptop |
| SSH  | 22   | ec2-scp-sg (self) | Allow A → B SSH/SCP internally |

5. Outbound: Allow all (default)

---

## 4. Launch Instances A & B

Use these same settings for **both**:

| Setting | Value |
|---------|-------|
| Name | `instance-a` / `instance-b` |
| AMI | Ubuntu Server 22.04 LTS |
| Instance type | t2.micro or t3.micro |
| Key pair | `static` |
| VPC | Same VPC |
| Subnet | Same subnet (for simplicity) |
| Auto-assign public IP | **Enable** |
| Security group | `ec2-scp-sg` |

After launching, note both instances' **public IP** and **private IP** from EC2 console.

---

## 5. SCP `.pem` File from Laptop → Instance A

This is necessary so Instance A can later authenticate into Instance B.

**From your Windows PowerShell / Mac/Linux terminal:**

```bash
scp -i .\static.pem .\static.pem ubuntu@<INSTANCE_A_PUBLIC_IP>:/home/ubuntu/
```

**Example:**
```bash
scp -i .\static.pem .\static.pem ubuntu@3.110.45.22:/home/ubuntu/
```

> ⚠️ Always use the **public IP** from your laptop. Private IPs (172.31.x.x) are only reachable inside AWS.

Verify it arrived on Instance A:
```bash
ssh -i .\static.pem ubuntu@<INSTANCE_A_PUBLIC_IP>
ls ~/
# You should see static.pem listed
```

---

## 6. Prepare Instance A

SSH into Instance A from your laptop:
```bash
ssh -i .\static.pem ubuntu@<INSTANCE_A_PUBLIC_IP>
```

Fix key permissions on the instance:
```bash
chmod 400 ~/static.pem
```

Create a test file to transfer:
```bash
echo "Hello from Instance A" > ~/file.txt
```

---

## 7. Prepare Instance B

SSH into Instance B from your laptop (separate terminal):
```bash
ssh -i .\static.pem ubuntu@<INSTANCE_B_PUBLIC_IP>
```

Create the destination directory:
```bash
mkdir -p ~/output
```

Exit back to laptop or keep it open to verify later.

---

## 8. SCP: Instance A → Instance B (Private IP)

Back on **Instance A terminal**, run:

### 8.1 Copy a Single File
```bash
scp -i ~/static.pem ~/file.txt ubuntu@<INSTANCE_B_PRIVATE_IP>:~/output/
```

### 8.2 Copy a Folder Recursively
```bash
scp -i ~/static.pem -r ~/myfolder ubuntu@<INSTANCE_B_PRIVATE_IP>:~/output/
```

### 8.3 Copy Multiple Files
```bash
scp -i ~/static.pem ~/file1.txt ~/file2.txt ubuntu@<INSTANCE_B_PRIVATE_IP>:~/output/
```

### 8.4 Copy with Different Filename at Destination
```bash
scp -i ~/static.pem ~/file.txt ubuntu@<INSTANCE_B_PRIVATE_IP>:~/output/renamed.txt
```

### 8.5 Copy File FROM Instance B TO Instance A (Reverse Pull)
```bash
scp -i ~/static.pem ubuntu@<INSTANCE_B_PRIVATE_IP>:~/output/file.txt ~/downloaded/
```

### 8.6 Preserve File Timestamps & Permissions
```bash
scp -i ~/static.pem -p ~/file.txt ubuntu@<INSTANCE_B_PRIVATE_IP>:~/output/
```

### 8.7 Verbose Mode (Debugging)
```bash
scp -i ~/static.pem -v ~/file.txt ubuntu@<INSTANCE_B_PRIVATE_IP>:~/output/
```

> Use `-v` when you get errors — it shows exactly which step is failing (auth, key, path, etc.)

---

## 9. Verify on Instance B

SSH into Instance B and confirm:
```bash
ls -l ~/output/
cat ~/output/file.txt
# Expected: Hello from Instance A
```

---

## 10. What Else You Can Do With SCP

| Use Case | Command |
|----------|---------|
| Laptop → EC2 | `scp -i key.pem localfile.txt ubuntu@PUBLIC_IP:~/` |
| EC2 → Laptop | `scp -i key.pem ubuntu@PUBLIC_IP:~/remotefile.txt ./` |
| EC2 A → EC2 B (single file) | `scp -i ~/key.pem file.txt ubuntu@PRIVATE_IP:~/output/` |
| EC2 A → EC2 B (folder) | `scp -i ~/key.pem -r folder/ ubuntu@PRIVATE_IP:~/output/` |
| EC2 A ← EC2 B (pull) | `scp -i ~/key.pem ubuntu@PRIVATE_IP:~/file.txt ~/` |
| Multiple files | `scp -i ~/key.pem f1.txt f2.txt ubuntu@PRIVATE_IP:~/` |
| Rename at destination | `scp -i ~/key.pem file.txt ubuntu@PRIVATE_IP:~/new_name.txt` |
| Custom SSH port | `scp -i ~/key.pem -P 2222 file.txt ubuntu@IP:~/` |
| Preserve permissions | `scp -i ~/key.pem -p file.txt ubuntu@IP:~/` |
| Compress during transfer | `scp -i ~/key.pem -C largefile.zip ubuntu@IP:~/` |

---

## 11. Common Errors & Fixes

### `Connection timed out`
- You are using a **private IP** (`172.31.x.x`) from your laptop → Switch to **public IP**
- Security group missing SSH inbound rule for your IP → Add `My IP` rule on port 22
- Instance is in a **private subnet** with no internet gateway → Move to public subnet or add IGW route

### `Permission denied (publickey)`
- Wrong username → use `ubuntu` for Ubuntu AMI, `ec2-user` for Amazon Linux
- `.pem` key is wrong → verify you're using the same key the instance was launched with
- Key permissions too open → run `chmod 400 key.pem`
- Trying to SCP from A to B without the `.pem` on A → copy the key to instance A first (Step 5)

### `No such file or directory`
- Destination path does not exist → create it first with `mkdir -p ~/output`
- Source file path is wrong → verify with `ls` before running SCP

---

## 12. Quick Reference: IP Rules

| Transfer Direction | IP to Use |
|-------------------|-----------|
| Laptop → EC2 | **Public IP** of the instance |
| EC2 A → EC2 B (same VPC) | **Private IP** of instance B |
| EC2 → Laptop | Public IP (in your `scp` command from laptop) |

---

## 13. Full Working Example (Recap)

```bash
# Step 1: From laptop — copy .pem to Instance A
scp -i .\static.pem .\static.pem ubuntu@3.110.45.22:/home/ubuntu/

# Step 2: SSH into Instance A
ssh -i .\static.pem ubuntu@3.110.45.22

# Step 3: On Instance A — fix key permissions
chmod 400 ~/static.pem

# Step 4: Create a test file
echo "Hello from A" > ~/testfile.txt

# Step 5: SCP to Instance B using private IP
scp -i ~/static.pem ~/testfile.txt ubuntu@172.31.35.100:~/output/

# Step 6: Verify on Instance B
ssh -i .\static.pem ubuntu@<INSTANCE_B_PUBLIC_IP>
cat ~/output/testfile.txt
```

---

*Guide by Niraj | EC2 SCP Lab | Ubuntu 22.04 | Same Key Pair Setup*
