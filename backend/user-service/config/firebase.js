import admin from 'firebase-admin';

try {
    if (admin.apps.length === 0) {
        admin.initializeApp({
            projectId: process.env.GOOGLE_CLOUD_PROJECT || 'viniyaga-plywoods'
        });
        console.log(`[FIREBASE] Admin SDK initialized for project: ${process.env.GOOGLE_CLOUD_PROJECT || 'viniyaga-plywoods'}`);
    }
} catch (error) {
    console.error('[FIREBASE] Error initializing Admin SDK:', error);
}

const db = admin.firestore();

// Attempt to check if Firestore is accessible
db.listCollections()
    .then(() => console.log('[FIREBASE] Firestore connection verified'))
    .catch(err => console.error('[FIREBASE] Firestore connection failed:', err.message));

export { db, admin };
