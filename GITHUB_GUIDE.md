# Git & GitHub Push Guide for BolEnglish

This guide outlines how to configure Git and push updates from this project to your **personal GitHub account** (`mzaid007`) without interfering with your global work Git configurations.

---

## 1. Local Author Configuration
By default, Git uses your global system-wide name and email (which might be set to your work account). 

To ensure commits in this folder are credited to your personal account, we have configured these settings **locally** inside this repository:
```bash
git config user.name "mzaid007"
git config user.email "mzaid007@gmail.com"
```
*Any new commits you make inside this folder will automatically use these personal credentials.*

---

## 2. Personal SSH Authentication Setup
If your global Git Bash environment uses a work SSH key by default, you can force this project to use your personal SSH key (`id_ed25519_personal`) using a custom host alias.

### The SSH Config File
A configuration file is located at `C:\Users\Zaid\.ssh\config` containing:
```text
# Personal GitHub Account
Host github.com-personal
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_personal
    IdentitiesOnly yes
```

### Linking the Remote Repository
The remote repository is configured using the custom host alias `github.com-personal`:
```bash
git remote set-url origin git@github.com-personal:mzaid007/bol-english.git
```

---

## 3. Pushing Changes to GitHub

Whenever you or the AI code assistant make changes locally, you can push them from your **Git Bash terminal** inside this folder:

### Regular Push:
```bash
# Stage all changes
git add .

# Create a commit
git commit -m "Your descriptive commit message"

# Push to your personal GitHub account
git push origin main
```

### Force Push (History Rewrite):
If you need to rewrite the history to clean up authorship or squash commits:
```bash
# Deletes old remote history and overwrites it with your current local history
git push -f origin main
```

---

## 4. SSH Agent Cache (Bypassing Passphrase Prompt)
If your SSH key requires a passphrase, you can tell the Git Bash terminal to cache it for your current session so it doesn't prompt you every time:

Run these commands in your Git Bash terminal:
```bash
# Start the SSH agent in the background
eval "$(ssh-agent -s)"

# Add your personal key to the agent
ssh-add ~/.ssh/id_ed25519_personal
```
Once added, the agent holds the decrypted key in memory, allowing Git commands (and the AI assistant) to push automatically without asking for your passphrase again.
