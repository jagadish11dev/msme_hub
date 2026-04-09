require('dotenv').config();
const twilio = require('twilio');
const cloudinary = require('cloudinary').v2;

async function testTwilio() {
    console.log('--- Testing Twilio ---');
    try {
        const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);
        const account = await client.api.v2010.accounts(process.env.TWILIO_SID).fetch();
        console.log(`✅ Twilio Success: Account Name is "${account.friendlyName}"`);
        console.log(`- Status: ${account.status}`);
        return true;
    } catch (error) {
        console.error(`❌ Twilio Error: ${error.message}`);
        return false;
    }
}

async function testCloudinary() {
    console.log('\n--- Testing Cloudinary ---');
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });
        
        const result = await cloudinary.api.ping();
        console.log(`✅ Cloudinary Success: Connection Established`);
        console.log(`- Result: ${JSON.stringify(result)}`);
        return true;
    } catch (error) {
        console.error(`❌ Cloudinary Error: ${error.message}`);
        return false;
    }
}

async function runTests() {
    const twilioResult = await testTwilio();
    const cloudinaryResult = await testCloudinary();
    
    console.log('\n--- Final Result ---');
    if (twilioResult && cloudinaryResult) {
        console.log('🚀 All credentials are VALID and WORKING!');
    } else {
        console.log('⚠️ Some credentials failed. Please check the logs above.');
    }
}

runTests();
