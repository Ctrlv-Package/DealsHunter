const { MongoClient } = require('mongodb');

async function checkMongoConnection() {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
    const client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000
    });

    try {
        console.log('Attempting to connect to MongoDB...');
        await client.connect();
        
        console.log('Successfully connected to MongoDB!');
        
        // Get server status
        const admin = client.db().admin();
        const serverStatus = await admin.serverStatus();
        console.log('\nServer Status:');
        console.log('Version:', serverStatus.version);
        console.log('Uptime:', Math.floor(serverStatus.uptime / 3600), 'hours');
        console.log('Connections:', serverStatus.connections);
        
        // List databases
        const dbs = await admin.listDatabases();
        console.log('\nAvailable Databases:');
        dbs.databases.forEach(db => {
            console.log(`- ${db.name} (${Math.round(db.sizeOnDisk / 1024 / 1024)}MB)`);
        });
        
    } catch (err) {
        console.error('\nFailed to connect to MongoDB:');
        console.error('Error:', err.message);
        console.error('\nPossible solutions:');
        console.error('1. Make sure MongoDB service is running');
        console.error('2. Check if MongoDB is installed correctly');
        console.error('3. Verify MongoDB is running on port 27017');
        console.error('4. Check firewall settings');
        process.exit(1);
    } finally {
        await client.close();
    }
}

checkMongoConnection().catch(console.error);
