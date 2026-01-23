# Firebase Configuration Steps

The error `auth/configuration-not-found` happens because **Authentication** has not been turned on in your Firebase Project yet. Please follow these steps in the Firebase Console:

### 1. Enable Authentication
1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Select your project: **viniyaga-plywoods**.
3.  In the left sidebar, click on **Authentication**.
4.  Click the **Get Started** button.

### 2. Enable Email/Password Sign-In
1.  After clicking "Get Started", you will be in the **Sign-in method** tab.
2.  Click on **Email/Password**.
3.  Toggle the first switch to **Enabled**. (You can leave "Email link" disabled).
4.  Click **Save**.

### 3. (Optional) Initialize Firestore
Since we are also storing user data in Firestore:
1.  In the left sidebar, click on **Firestore Database**.
2.  If it's not created, click **Create database**.
3.  Choose **Start in test mode** for now (you can change rules later).
4.  Click **Next** and then **Enable**.

---

### Why this happened?
Firebase services (like Auth or Firestore) are disabled by default when you create a new project. You must manually "Get Started" with each service in the console before the code can talk to it.

Once you have enabled **Email/Password** sign-in, try clicking **Sign Up** again in your app!
