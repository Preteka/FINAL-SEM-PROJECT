# AI Chatbot Setup Guide

The chatbot uses Google's Gemini AI to assist customers with plywood and glass inquiries. If you are seeing connection errors, follow these steps to configure a valid API key.

## 1. Obtain a Gemini API Key

1.  Go to [Google AI Studio](https://aistudio.google.com/).
2.  Sign in with your Google Account.
3.  Click on **"Get API key"** in the sidebar.
4.  Click **"Create API key in new project"** (or use an existing project).
5.  **Copy** the generated API key.

## 2. Configure the Backend

1.  Navigate to the backend directory: `backend/user-service/`.
2.  Open the `.env` file.
3.  Update the `GEMINI_API_KEY` with your copied key:
    ```env
    GEMINI_API_KEY=your_actual_api_key_here
    PORT=5000
    ```
4.  Restart the backend server.

## 3. Verify the Connection

Once the key is updated, the chatbot should immediately start responding. If you still see errors:
- Check `backend/user-service/error.log` for specific error messages.
- Ensure your internet connection is stable.
- Verify that your API key has not exceeded its free tier limits.

---
**Note:** The system is currently configured to use `gemini-1.5-flash`, which is fast and cost-effective.
