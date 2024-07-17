const cron = require('node-cron');
const Tokens = require('./Models/Tokens')

const task = cron.schedule('*/5 * * * *', async() => {
    console.log('Running a task every 5 minutes');

    try {
        const tokens = await Tokens.find({});
        
        await Promise.all(tokens.map(async (token) => {
            token.currentValue += 5;
            await token.save();
        }));
        
        console.log('Token values updated successfully');
    } catch (error) {
        console.error('Error updating token values:', error);
    }
   
});


task.start();
