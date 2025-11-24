// Maintenance mode configuration
// 
// TO RE-ENABLE UPLOADS:
// 1. Fix the Cloudinary configuration issue in the backend
// 2. Change UPLOAD_MAINTENANCE to false below
// 3. The upload functionality will be restored automatically
//
// CURRENT STATUS: Upload functionality is DISABLED due to Cloudinary issues

export const UPLOAD_MAINTENANCE = false;

export const MAINTENANCE_MESSAGE = {
  title: "Upload Service Temporarily Unavailable",
  description: "We're currently experiencing technical difficulties with our video upload service. Our team is working to resolve this issue as quickly as possible. Please check back later.",
  buttonText: "🔧 Upload Temporarily Unavailable"
};