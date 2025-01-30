# whatsapp-calendar-bot
A simple bot that reads your calendar using Calendar API and messages you through Meta's Cloud API.

## Features
1. **Google Calendar Integration**  
   - Fetches events for the current week, grouped by day.  
   - Identifies free slots within a specified workday window (e.g., 9 AM to 5 PM).

2. **WhatsApp API Webhook**  
   - Verifies a webhook endpoint for WhatsApp.  
   - Receives incoming messages and sends responses dynamically (e.g., “Send me the schedule”).

## Installation

1. **Open a terminal/command prompt** on your machine.
2. **Navigate** to the directory where you want the project files to live.
3. **Run** the following command to clone the repository.

``` 
git clone https://github.com/amitrayblr/whatsapp-calendar-bot.git
cd whatsapp-calendar-bot
```

4. **Ensure** you have Node.js (v14+ recommended) and npm (v6+) installed on your system.
5. **Install** the projects dependencies by running.

```
npm install
```

## Credentials for This Project

This project requires **two main sets of credentials**:

1. **Google Calendar API Credentials** – to authorize the app to read/write events on your Google Calendar.  
2. **WhatsApp Cloud API Credentials** – to receive/send messages via WhatsApp Business Cloud API.

Below are step-by-step instructions on how to acquire each.

---

### 1. Google Calendar API Credentials

1. **Create or Select a Google Cloud Project**  
   - Go to [Google Cloud Console](https://console.cloud.google.com/) and sign in with your Google account.  
   - Create a new project or select an existing one.

2. **Enable the Google Calendar API**  
   - In the [API Library](https://console.cloud.google.com/apis/library), search for **"Google Calendar API"**.  
   - Click **Enable** to turn on the API in your project.

3. **Create OAuth Client ID**  
   - Navigate to **APIs & Services** > **Credentials**.  
   - Click **Create Credentials** → **OAuth Client ID**.  
   - You’ll be asked to configure the OAuth consent screen if you haven’t already. Provide basic app details as prompted.

4. **Configure OAuth Consent Screen** (if prompted)  
   - Provide an **Application name**, **User support email**, and any other required fields.  
   - You can use the default scope or add the `Calendar API` scope if needed.  
   - Save the changes.

5. **Generate the Client ID**  
   - Choose **Application Type** = **Desktop App** 
   - Give it a name (e.g., "Calendar Integration").  
   - Click **Create**.  

6. **Download the `credentials.json`**  
   - After creating the credentials, you’ll see a prompt to download the `.json` file.  
   - Rename or keep it as `credentials.json` and place it in your project’s `config/` folder (or wherever your code expects it).  
   - **Note:** Keep this file private—never commit it to version control.

7. **First-Time Run**  
   - When the project runs, it may ask you to **authorize** access by opening a Google consent screen.  
   - Upon approval, a `token.json` file is generated (stored in `config/` or another location in your app). This file grants ongoing access without re-prompting.

---

### 2. WhatsApp Cloud API Credentials

1. **Set Up a Meta (Facebook) Developer Account**  
   - Go to the [Meta for Developers](https://developers.facebook.com/) portal and log in with your Facebook account.

2. **Create a New App**  
   - Click **My Apps** → **Create App**.  
   - Select the **Business** type (recommended) or another type if it suits your use case.

3. **Add WhatsApp to the App**  
   - In your app’s dashboard, under **Add Products to Your App**, find **WhatsApp**.  
   - Click **Set Up**.

4. **Obtain a Phone Number & WhatsApp Business Account**  
   - In the **WhatsApp** section, Meta typically provides a test phone number.  
   - Follow the instructions to get your **Phone Number ID** and **WhatsApp Business Account ID**.

5. **Generate a Permanent Access Token** (or use a Temporary Token)  
   - In **Getting Started** (under WhatsApp), you’ll see a **temporary token**; you can use this for testing.  
   - For production, generate a **permanent token** via **System Users** > **Add System User** > **Generate token** with the needed permissions.

6. **Copy Your Credentials**  
   - **`ACCESS_TOKEN`**: The token used to authenticate calls to the WhatsApp Cloud API.  
   - **`PHONE_NUMBER_ID`**: The numeric ID associated with the phone number.  
   - **`WHATSAPP_BUSINESS_ACCOUNT_ID`** (optional depending on your code, but often needed).

7. **Set up Verify Token** (for Webhook Verification)  
   - In the WhatsApp developer settings, you can configure your callback URL (e.g., `https://<your-domain>/webhook`) and provide a custom **Verify Token**.  
   - Ensure it matches **`VERIFY_TOKEN`** in your `.env` for the `GET /webhook` verification flow.

### 3. Storing and Using Your Credentials

1. **`.env` File**  
   - Store your `ACCESS_TOKEN`, `PHONE_NUMBER_ID`, `VERIFY_TOKEN`, and any other sensitive data in a `.env` file:
     ```ini
     ACCESS_TOKEN=YOUR_ACCESS_TOKEN_HERE
     PHONE_NUMBER_ID=YOUR_PHONE_NUMBER_ID
     VERIFY_TOKEN=YOUR_VERIFY_TOKEN
     PORT=3000
     ```
   - Make sure you **add `.env` to `.gitignore`** so it’s not committed to your repo.

2. **`credentials.json`**  
   - Place this file (downloaded from Google Cloud) in a secure location in your project (e.g., `config/credentials.json`).  
   - **Do not** commit it to version control.

3. **`token.json`**  
   - Auto-generated when first authorizing the Google Calendar API.  
   - Also keep this private, typically in the `config/` folder.

## Running the Project
  - Run the project by
  ```
  npm run dev
  ```