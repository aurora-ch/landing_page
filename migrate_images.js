
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Cloudinary Configuration
cloudinary.config({ 
  cloud_name: 'dkd9rdbao', 
  api_key: '596241228118846', 
  api_secret: 'zf3KmAL5n1L_q3FGG_w9AFDCSs4' 
});

const MIGRATION_FILE = path.join(__dirname, 'migration_data.json');
const OUTPUT_SQL_FILE = path.join(__dirname, 'update_profiles.sql');

async function migrateImages() {
    try {
        const rawData = fs.readFileSync(MIGRATION_FILE, 'utf-8');
        const accounts = JSON.parse(rawData);
        
        console.log(`Found ${accounts.length} accounts to migrate.`);
        
        let sqlStatements = '';
        let successCount = 0;
        let failCount = 0;

        for (const account of accounts) {
            const { id, profile_picture } = account;
            
            if (!profile_picture) {
                console.log(`Skipping account ${id}: No profile picture.`);
                continue;
            }

            console.log(`Processing Account ${id}...`);

            try {
                // Upload to Cloudinary
                const result = await cloudinary.uploader.upload(profile_picture, {
                    folder: 'aurora_profiles',
                    public_id: `profile_${id}`,
                    overwrite: true,
                    resource_type: 'image'
                });

                const newUrl = result.secure_url;
                console.log(`  -> Uploaded: ${newUrl}`);

                // Generate SQL
                // Escape single quotes in URL just in case, heavily unlikely for Cloudinary URLs but good practice
                const safeUrl = newUrl.replace(/'/g, "''");
                sqlStatements += `UPDATE accounts SET profile_picture = '${safeUrl}' WHERE id = ${id};\n`;
                
                successCount++;

            } catch (uploadError) {
                console.error(`  -> Failed to upload account ${id}:`, uploadError.message);
                failCount++;
            }
        }

        // Write SQL to file
        fs.writeFileSync(OUTPUT_SQL_FILE, sqlStatements);
        
        console.log(`\nMigration Script Complete.`);
        console.log(`Successful: ${successCount}`);
        console.log(`Failed: ${failCount}`);
        console.log(`SQL generated at: ${OUTPUT_SQL_FILE}`);

    } catch (error) {
        console.error('Migration failed:', error);
    }
}

migrateImages();
